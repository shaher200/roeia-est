-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';

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

-- Create admin account in auth.users table
-- This will be handled manually by inserting into profiles only for simplicity