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

-- إنشاء policies للجدول الجديد
CREATE POLICY "Users can view their own data" 
ON public.user_auth 
FOR SELECT 
USING (auth.uid()::text = id::text OR EXISTS (
  SELECT 1 FROM public.user_auth 
  WHERE id::text = auth.uid()::text AND role = 'admin'
));

CREATE POLICY "Admins can view all users" 
ON public.user_auth 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.user_auth 
  WHERE id::text = auth.uid()::text AND role = 'admin'
));

CREATE POLICY "Admins can update users" 
ON public.user_auth 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.user_auth 
  WHERE id::text = auth.uid()::text AND role = 'admin'
));

CREATE POLICY "Admins can delete users" 
ON public.user_auth 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.user_auth 
  WHERE id::text = auth.uid()::text AND role = 'admin'
));

-- إضافة مستخدم الإدارة الافتراضي
INSERT INTO public.user_auth (phone, password_hash, name, role) 
VALUES ('01044444444', crypt('123456', gen_salt('bf')), 'مدير النظام', 'admin')
ON CONFLICT (phone) DO NOTHING;

-- إنشاء فهرس على رقم الهاتف للبحث السريع
CREATE INDEX IF NOT EXISTS idx_user_auth_phone ON public.user_auth(phone);

-- إنشاء trigger لتحديث updated_at
CREATE TRIGGER update_user_auth_updated_at
  BEFORE UPDATE ON public.user_auth
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- تحديث جدول profiles ليعتمد على النظام الجديد
ALTER TABLE public.profiles DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_auth_id uuid REFERENCES public.user_auth(id) ON DELETE CASCADE;

-- إنشاء فهرس على user_auth_id
CREATE INDEX IF NOT EXISTS idx_profiles_user_auth_id ON public.profiles(user_auth_id);

-- إنشاء دالة لإنشاء JWT مخصص
CREATE OR REPLACE FUNCTION public.create_custom_jwt(user_data json)
RETURNS text AS $$
DECLARE
  jwt_secret text;
  jwt_payload json;
  jwt_header json;
BEGIN
  -- استخدام سر ثابت للتوقيع (في بيئة الإنتاج يجب أن يكون من المتغيرات البيئية)
  jwt_secret := 'your-super-secret-jwt-key-change-this-in-production';
  
  -- إنشاء header
  jwt_header := json_build_object(
    'alg', 'HS256',
    'typ', 'JWT'
  );
  
  -- إنشاء payload
  jwt_payload := json_build_object(
    'sub', user_data->>'id',
    'phone', user_data->>'phone',
    'name', user_data->>'name',
    'role', user_data->>'role',
    'iat', extract(epoch from now()),
    'exp', extract(epoch from now()) + 86400 -- 24 hours
  );
  
  -- إرجاع JWT مبسط (في الإنتاج يجب استخدام مكتبة JWT حقيقية)
  RETURN encode(jwt_header::text::bytea, 'base64') || '.' || 
         encode(jwt_payload::text::bytea, 'base64') || '.' ||
         encode(hmac(jwt_header::text || '.' || jwt_payload::text, jwt_secret, 'sha256'), 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- تحديث RLS policies للجداول الأخرى
-- تحديث knowledge_club_memberships
DROP POLICY IF EXISTS "Users can create their own membership" ON public.knowledge_club_memberships;
DROP POLICY IF EXISTS "Users can view their own membership or admins can view all" ON public.knowledge_club_memberships;

CREATE POLICY "Users can create their own membership" 
ON public.knowledge_club_memberships 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.user_auth 
  WHERE id::text = auth.uid()::text AND phone = knowledge_club_memberships.phone
));

CREATE POLICY "Users can view their own membership or admins can view all" 
ON public.knowledge_club_memberships 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_auth 
    WHERE id::text = auth.uid()::text AND (
      phone = knowledge_club_memberships.phone OR role = 'admin'
    )
  )
);

-- تحديث orders policies
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders or admins can view all" ON public.orders;

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.user_auth 
  WHERE id::text = auth.uid()::text AND phone = orders.customer_phone
));

CREATE POLICY "Users can view their own orders or admins can view all" 
ON public.orders 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_auth 
    WHERE id::text = auth.uid()::text AND (
      phone = orders.customer_phone OR role = 'admin'
    )
  )
);