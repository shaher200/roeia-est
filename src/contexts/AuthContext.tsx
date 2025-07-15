
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (name: string, password: string, phone: string) => Promise<{ error: any }>;
  signIn: (phone: string, password: string) => Promise<{ error: any }>;
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

  const signUp = async (name: string, password: string, phone: string) => {
    try {
      // إنشاء بريد إلكتروني مؤقت باستخدام رقم الهاتف
      const tempEmail = `${phone}@temp.local`;
      
      const { data, error } = await supabase.auth.signUp({
        email: tempEmail,
        password,
        options: {
          data: {
            name,
            phone,
            display_name: name
          }
        }
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "خطأ في التسجيل",
            description: "رقم الهاتف مسجل مسبقاً",
            variant: "destructive",
          });
        } else {
          toast({
            title: "خطأ في التسجيل",
            description: "حدث خطأ أثناء التسجيل، تأكد من البيانات",
            variant: "destructive",
          });
        }
        return { error };
      }

      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "يمكنك الآن تسجيل الدخول",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "خطأ في التسجيل",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (phone: string, password: string) => {
    try {
      // إنشاء البريد الإلكتروني المتوقع باستخدام رقم الهاتف
      const tempEmail = `${phone}@temp.local`;
      
      const { error } = await supabase.auth.signInWithPassword({
        email: tempEmail,
        password,
      });

      if (error) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "رقم الهاتف أو كلمة المرور غير صحيحة",
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "رقم الهاتف أو كلمة المرور غير صحيحة",
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
