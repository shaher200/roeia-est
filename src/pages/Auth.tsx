
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
const [isLogin, setIsLogin] = useState(true);
const [isOtpStep, setIsOtpStep] = useState(false);
const [otpCode, setOtpCode] = useState('');
const [signupPhone, setSignupPhone] = useState('');
const [formData, setFormData] = useState({
  name: '',
  phone: '',
  password: '',
  confirmPassword: ''
});
const [errors, setErrors] = useState<Record<string, string>>({});
const { signIn, signUp, verifyOtp, user } = useAuth();
const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

const validateForm = () => {
  const newErrors: Record<string, string> = {};

  if (isOtpStep) {
    if (!/^\d{6}$/.test(otpCode)) {
      newErrors.otp = 'رمز التحقق يجب أن يكون 6 أرقام';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  if (!isLogin) {
    if (!formData.name.trim()) {
      newErrors.name = 'الاسم الثلاثي مطلوب';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^01[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = 'رقم الهاتف يجب أن يبدأ بـ 01 ويحتوي على 11 رقم';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }
  } else {
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    }
  }

  if (!formData.password.trim()) {
    newErrors.password = 'كلمة المرور مطلوبة';
  } else if (!/^[0-9]{6}$/.test(formData.password)) {
    newErrors.password = 'كلمة المرور يجب أن تكون 6 أرقام فقط';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  if (isOtpStep) {
    const { error } = await verifyOtp(signupPhone || formData.phone, otpCode);
    if (!error) {
      navigate('/');
    }
    return;
  }

  if (isLogin) {
    await signIn(formData.phone, formData.password);
  } else {
    const result = await signUp(formData.name, formData.password, formData.phone);
    if (!result.error && result.needsVerification) {
      setSignupPhone(formData.phone);
      setIsOtpStep(true);
    }
  }
};

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h1>

<form onSubmit={handleSubmit} className="space-y-4">
  {isOtpStep ? (
    <>
      <div>
        <Label htmlFor="otp">رمز التحقق (6 أرقام) *</Label>
        <Input
          id="otp"
          type="text"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
          className="text-right"
          placeholder="******"
          maxLength={6}
        />
        {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
      </div>
      <Button type="submit" className="w-full">تأكيد الرمز</Button>
      <button
        type="button"
        onClick={() => {
          setIsOtpStep(false);
          setOtpCode('');
        }}
        className="text-blue-600 hover:text-blue-800 underline w-full text-center"
      >تعديل البيانات</button>
    </>
  ) : (
    <>
      {!isLogin && (
        <div>
          <Label htmlFor="name">الاسم الثلاثي *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="text-right"
            placeholder="أدخل اسمك الثلاثي"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
      )}

      <div>
        <Label htmlFor="phone">رقم الهاتف *</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            handleInputChange('phone', value);
          }}
          className="text-right"
          placeholder="01xxxxxxxxx"
          maxLength={11}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div>
        <Label htmlFor="password">كلمة المرور (6 أرقام) *</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            handleInputChange('password', value);
          }}
          className="text-right"
          placeholder="أدخل 6 أرقام"
          maxLength={6}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      {!isLogin && (
        <div>
          <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              handleInputChange('confirmPassword', value);
            }}
            className="text-right"
            placeholder="أعد إدخال كلمة المرور"
            maxLength={6}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
      )}

      <Button type="submit" className="w-full">
        {isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'}
      </Button>
    </>
  )}
</form>

<div className="text-center mt-4">
  {!isOtpStep && (
    <button
      type="button"
      onClick={() => {
        setIsLogin(!isLogin);
        setFormData({
          name: '',
          phone: '',
          password: '',
          confirmPassword: ''
        });
        setErrors({});
      }}
      className="text-blue-600 hover:text-blue-800 underline"
    >
      {isLogin ? 'ليس لديك حساب؟ أنشئ حساباً جديداً' : 'لديك حساب؟ سجل الدخول'}
    </button>
  )}
</div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
