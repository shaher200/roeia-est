-- حذف جميع policies التي تعتمد على user_id قبل إعادة البناء
-- حذف policies من جدول profiles
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles; 
DROP POLICY IF EXISTS "Users can view their own profile or admins can view all" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

-- حذف policies من جدول orders
DROP POLICY IF EXISTS "Users can view their own orders or admins can view all" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;

-- حذف policies من جدول knowledge_club_memberships
DROP POLICY IF EXISTS "Users can view their own membership or admins can view all" ON public.knowledge_club_memberships;
DROP POLICY IF EXISTS "Admins can update memberships" ON public.knowledge_club_memberships;
DROP POLICY IF EXISTS "Admins can delete memberships" ON public.knowledge_club_memberships;

-- حذف policies من جدول categories
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;

-- حذف policies من جدول books
DROP POLICY IF EXISTS "Admins can insert books" ON public.books;
DROP POLICY IF EXISTS "Admins can update books" ON public.books;
DROP POLICY IF EXISTS "Admins can delete books" ON public.books;

-- حذف policies من storage.objects
DROP POLICY IF EXISTS "Users can view their own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all receipts" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete receipts" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload book images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update book images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete book images" ON storage.objects;

-- الآن يمكن حذف العمود user_id من جدول profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS user_id;

-- إنشاء جدول المصادقة المخصص
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

-- تمكين RLS
ALTER TABLE public.custom_users ENABLE ROW LEVEL SECURITY;

-- إضافة المدير الافتراضي
INSERT INTO public.custom_users (phone, password_hash, name, role) 
VALUES ('01044444444', crypt('123456', gen_salt('bf')), 'مدير النظام', 'admin')
ON CONFLICT (phone) DO NOTHING;

-- إنشاء فهرس
CREATE INDEX IF NOT EXISTS idx_custom_users_phone ON public.custom_users(phone);

-- إنشاء trigger
CREATE TRIGGER update_custom_users_updated_at
  BEFORE UPDATE ON public.custom_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- إعادة إنشاء policies بدون الاعتماد على auth.users
-- policies للكتب (عامة للعرض، إدارية للتعديل)
CREATE POLICY "Books are viewable by everyone" 
ON public.books 
FOR SELECT 
USING (true);

CREATE POLICY "Only system can manage books" 
ON public.books 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- policies للفئات (عامة للعرض، إدارية للتعديل)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Only system can manage categories" 
ON public.categories 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- policies للطلبات (سيتم التحكم بها من كود التطبيق)
CREATE POLICY "Orders managed by system" 
ON public.orders 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- policies للعضويات (سيتم التحكم بها من كود التطبيق)
CREATE POLICY "Memberships managed by system" 
ON public.knowledge_club_memberships 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- policies للملفات الشخصية (سيتم التحكم بها من كود التطبيق)
CREATE POLICY "Profiles managed by system" 
ON public.profiles 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- policies للتخزين (سيتم التحكم بها من كود التطبيق)
CREATE POLICY "Storage managed by system" 
ON storage.objects 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- policies لجدول المستخدمين المخصص (سيتم التحكم بها من كود التطبيق)
CREATE POLICY "Users managed by system" 
ON public.custom_users 
FOR ALL 
USING (false) 
WITH CHECK (false);