-- إنشاء جدول المصادقة المخصص فقط
CREATE TABLE IF NOT EXISTS public.custom_users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- تمكين RLS (لكن سنتحكم بالأمان من التطبيق)
ALTER TABLE public.custom_users ENABLE ROW LEVEL SECURITY;

-- policy مؤقت للسماح بالعمليات (سيتم التحكم بها من التطبيق)
CREATE POLICY "Allow all operations" 
ON public.custom_users 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- إضافة المدير الافتراضي
INSERT INTO public.custom_users (phone, password_hash, name, role) 
VALUES ('01044444444', crypt('123456', gen_salt('bf')), 'مدير النظام', 'admin')
ON CONFLICT (phone) DO NOTHING;

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_custom_users_phone ON public.custom_users(phone);

-- إنشاء trigger لتحديث updated_at
CREATE TRIGGER update_custom_users_updated_at
  BEFORE UPDATE ON public.custom_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();