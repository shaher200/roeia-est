
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any;
  signUp: (name: string, password: string, phone: string) => Promise<{ error: any }>;
  signIn: (phone: string, password: string) => Promise<{ error: any }>; 
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch to avoid auth deadlocks per Supabase best practices
          setTimeout(async () => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user!.id)
              .maybeSingle();
            setProfile(profileData);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

const signUp = async (name: string, password: string, phone: string) => {
  try {
    // Call edge function to create a confirmed user and store profile
    const { data, error: fnError } = await supabase.functions.invoke('admin-signup', {
      body: { name, phone, password },
    });

    if (fnError || !(data as any)?.ok) {
      const message = (data as any)?.error || fnError?.message || "حدث خطأ أثناء التسجيل، تأكد من البيانات";
      toast({
        title: "خطأ في التسجيل",
        description: message,
        variant: "destructive",
      });
      return { error: fnError || new Error(message) };
    }

    // Auto sign-in after successful creation
    const tempEmail = `${phone}@temp.com`;
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: tempEmail,
      password,
    });

    if (signInError) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: signInError.message || "تعذر تسجيل الدخول بعد إنشاء الحساب",
        variant: "destructive",
      });
      return { error: signInError };
    }

    toast({
      title: "تم إنشاء الحساب بنجاح",
      description: "تم تسجيل الدخول تلقائياً، مرحباً بك",
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
    // Check for admin credentials
    if (phone === '01044444444' && password === '123456') {
      // Create a mock admin session
      const adminUser = {
        id: '00000000-0000-0000-0000-000000000000',
        phone: '01044444444',
        name: 'مدير النظام',
        role: 'admin'
      };
      
      setUser(adminUser as any);
      setProfile(adminUser);
      
      toast({
        title: "تم تسجيل الدخول كمدير",
        description: "مرحباً بك في لوحة التحكم",
      });
      
      return { error: null };
    }
    
    const tempEmail = `${phone}@temp.com`;
    const { error } = await supabase.auth.signInWithPassword({
      email: tempEmail,
      password,
    });

    if (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message || "رقم الهاتف أو كلمة المرور غير صحيحة",
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
      description: "حدث خطأ غير متوقع",
      variant: "destructive",
    });
    return { error };
  }
};

const signOut = async () => {
  // Check if admin
  if (profile?.role === 'admin') {
    setUser(null);
    setProfile(null);
    setSession(null);
  } else {
    await supabase.auth.signOut();
  }
  
  toast({
    title: "تم تسجيل الخروج بنجاح",
  });
};


return (
  <AuthContext.Provider value={{
    user,
    session,
    profile,
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
