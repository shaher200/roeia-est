-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';

-- Add unique constraint on user_id if not exists
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);

-- Insert admin user data
INSERT INTO public.profiles (user_id, name, phone, role) 
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  'مدير النظام',
  '01044444444',
  'admin'
) ON CONFLICT (user_id) DO UPDATE SET
  name = 'مدير النظام',
  phone = '01044444444',
  role = 'admin';