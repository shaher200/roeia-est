
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (name: string, password: string, phone: string, email?: string) => Promise<{ error: any }>;
  signIn: (name: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (name: string, password: string, phone: string, email?: string) => {
    try {
      // إنشاء بريد إلكتروني وهمي إذا لم يتم تقديم واحد
      const userEmail = email || `${name.replace(/\s+/g, '').toLowerCase()}@temp-domain.local`;
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: userEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            phone,
            display_name: name
          }
        }
      });

      if (error) {
        toast({
          title: "خطأ في التسجيل",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "يمكنك الآن تسجيل الدخول",
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        title: "خطأ في التسجيل",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (name: string, password: string) => {
    try {
      // البحث عن المستخدم بالاسم أولاً
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('name', name)
        .single();

      if (profileError || !profiles) {
        // إذا لم نجد المستخدم، جرب بريد إلكتروني وهمي
        const tempEmail = `${name.replace(/\s+/g, '').toLowerCase()}@temp-domain.local`;
        
        const { error } = await supabase.auth.signInWithPassword({
          email: tempEmail,
          password,
        });

        if (error) {
          toast({
            title: "خطأ في تسجيل الدخول",
            description: "الاسم أو كلمة المرور غير صحيحة",
            variant: "destructive",
          });
        }

        return { error };
      }

      // استخدم البريد الإلكتروني المحفوظ
      const { error } = await supabase.auth.signInWithPassword({
        email: profiles.email || `${name.replace(/\s+/g, '').toLowerCase()}@temp-domain.local`,
        password,
      });

      if (error) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "الاسم أو كلمة المرور غير صحيحة",
          variant: "destructive",
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "الاسم أو كلمة المرور غير صحيحة",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "تم تسجيل الخروج بنجاح",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      signUp,
      signIn,
      signOut,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
