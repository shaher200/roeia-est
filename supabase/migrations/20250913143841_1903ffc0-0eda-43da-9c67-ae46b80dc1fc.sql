-- إزالة جميع policies التي تعتمد على user_id من profiles
-- إزالة policies من profiles
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile or admins can view all" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

-- إزالة policies من orders
DROP POLICY IF EXISTS "Users can view their own orders or admins can view all" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;

-- إزالة policies من knowledge_club_memberships
DROP POLICY IF EXISTS "Users can view their own membership or admins can view all" ON public.knowledge_club_memberships;
DROP POLICY IF EXISTS "Admins can update memberships" ON public.knowledge_club_memberships;
DROP POLICY IF EXISTS "Admins can delete memberships" ON public.knowledge_club_memberships;

-- إزالة policies من categories
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;

-- إزالة policies من books
DROP POLICY IF EXISTS "Admins can insert books" ON public.books;
DROP POLICY IF EXISTS "Admins can update books" ON public.books;
DROP POLICY IF EXISTS "Admins can delete books" ON public.books;

-- إزالة policies من storage
DROP POLICY IF EXISTS "Users can view their own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all receipts" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete receipts" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload book images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update book images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete book images" ON storage.objects;