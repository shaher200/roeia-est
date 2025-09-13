-- إنشاء نظام مصادقة مخصص بدون بريد إلكتروني
-- إنشاء جدول للمصادقة المخصصة
CREATE TABLE IF NOT EXISTS public.user_auth (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- تمكين RLS على الجدول الجديد
ALTER TABLE public.user_auth ENABLE ROW LEVEL SECURITY;

-- إضافة مستخدم الإدارة الافتراضي
INSERT INTO public.user_auth (phone, password_hash, name, role) 
VALUES ('01044444444', crypt('123456', gen_salt('bf')), 'مدير النظام', 'admin')
ON CONFLICT (phone) DO NOTHING;

-- إنشاء فهرس على رقم الهاتف للبحث السريع
CREATE INDEX IF NOT EXISTS idx_user_auth_phone ON public.user_auth(phone);

-- إنشاء trigger لتحديث updated_at
DROP TRIGGER IF EXISTS update_user_auth_updated_at ON public.user_auth;
CREATE TRIGGER update_user_auth_updated_at
  BEFORE UPDATE ON public.user_auth
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- حذف عمود user_id من profiles والاستعاضة عنه بـ user_auth_id
ALTER TABLE public.profiles DROP COLUMN IF EXISTS user_id CASCADE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_auth_id uuid REFERENCES public.user_auth(id) ON DELETE CASCADE;

-- حذف عمود user_id من orders والاستعاضة عنه بـ user_auth_id
ALTER TABLE public.orders DROP COLUMN IF EXISTS user_id CASCADE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_auth_id uuid REFERENCES public.user_auth(id) ON DELETE CASCADE;

-- حذف عمود user_id من knowledge_club_memberships والاستعاضة عنه بـ user_auth_id
ALTER TABLE public.knowledge_club_memberships DROP COLUMN IF EXISTS user_id CASCADE;
ALTER TABLE public.knowledge_club_memberships ADD COLUMN IF NOT EXISTS user_auth_id uuid REFERENCES public.user_auth(id) ON DELETE CASCADE;

-- إنشاء فهارس
CREATE INDEX IF NOT EXISTS idx_profiles_user_auth_id ON public.profiles(user_auth_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_auth_id ON public.orders(user_auth_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user_auth_id ON public.knowledge_club_memberships(user_auth_id);