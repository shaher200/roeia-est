
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (name: string, password: string, phone: string) => Promise<{ error: any; needsVerification?: boolean }>;
  signIn: (phone: string, password: string) => Promise<{ error: any }>; 
  verifyOtp: (phone: string, token: string) => Promise<{ error: any }>;
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
    const { data, error } = await supabase.auth.signUp({
      phone,
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
      toast({
        title: "خطأ في التسجيل",
        description: error.message || "حدث خطأ أثناء التسجيل، تأكد من البيانات",
        variant: "destructive",
      });
      return { error };
    }

    if (!data.session) {
      toast({
        title: "تم إرسال رمز التحقق",
        description: "يرجى إدخال الرمز المرسل عبر رسالة نصية لإتمام التسجيل",
      });
      return { error: null, needsVerification: true };
    }

    toast({
      title: "تم إنشاء الحساب بنجاح",
      description: "مرحباً بك",
    });

    return { error: null, needsVerification: false };
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
    const { error } = await supabase.auth.signInWithPassword({
      phone,
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
  await supabase.auth.signOut();
  toast({
    title: "تم تسجيل الخروج بنجاح",
  });
};

const verifyOtp = async (phone: string, token: string) => {
  try {
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });

    if (error) {
      toast({
        title: "فشل التحقق",
        description: error.message || "رمز التحقق غير صحيح",
        variant: "destructive",
      });
      return { error };
    }

    toast({
      title: "تم تأكيد رقم الهاتف",
      description: "تم إنشاء الحساب بنجاح",
    });

    return { error: null };
  } catch (error: any) {
    toast({
      title: "فشل التحقق",
      description: "حدث خطأ غير متوقع",
      variant: "destructive",
    });
    return { error };
  }
};

return (
  <AuthContext.Provider value={{
    user,
    session,
    signUp,
    signIn,
    verifyOtp,
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
