import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CustomUser {
  id: string;
  phone: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: CustomUser | null;
  token: string | null;
  signUp: (name: string, password: string, phone: string) => Promise<{ error: any }>;
  signIn: (phone: string, password: string) => Promise<{ error: any }>; 
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // التحقق من وجود مستخدم محفوظ في localStorage
    const savedUser = localStorage.getItem('custom_user');
    const savedToken = localStorage.getItem('custom_token');
    
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('custom_user');
        localStorage.removeItem('custom_token');
      }
    }
    
    setLoading(false);
  }, []);

  const signUp = async (name: string, password: string, phone: string) => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke('custom-auth', {
        body: { action: 'signup', name, phone, password },
      });

      if (fnError || !data?.success) {
        const errorMessage = data?.error || fnError?.message || "حدث خطأ أثناء التسجيل";
        toast({
          title: "خطأ في التسجيل",
          description: errorMessage,
          variant: "destructive",
        });
        return { error: new Error(errorMessage) };
      }

      // حفظ بيانات المستخدم
      const userData = data.user;
      const userToken = data.token;
      
      setUser(userData);
      setToken(userToken);
      
      localStorage.setItem('custom_user', JSON.stringify(userData));
      localStorage.setItem('custom_token', userToken);

      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "مرحباً بك، تم تسجيل الدخول تلقائياً",
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
      const { data, error: fnError } = await supabase.functions.invoke('custom-auth', {
        body: { action: 'signin', phone, password },
      });

      if (fnError || !data?.success) {
        const errorMessage = data?.error || fnError?.message || "رقم الهاتف أو كلمة المرور غير صحيحة";
        toast({
          title: "خطأ في تسجيل الدخول",
          description: errorMessage,
          variant: "destructive",
        });
        return { error: new Error(errorMessage) };
      }

      // حفظ بيانات المستخدم
      const userData = data.user;
      const userToken = data.token;
      
      setUser(userData);
      setToken(userToken);
      
      localStorage.setItem('custom_user', JSON.stringify(userData));
      localStorage.setItem('custom_token', userToken);

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً بك ${userData.name}`,
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
    setUser(null);
    setToken(null);
    localStorage.removeItem('custom_user');
    localStorage.removeItem('custom_token');
    
    toast({
      title: "تم تسجيل الخروج بنجاح",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
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