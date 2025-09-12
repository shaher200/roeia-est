-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Users can upload their own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all receipts" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete receipts" ON storage.objects;
DROP POLICY IF EXISTS "Book images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload book images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update book images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete book images" ON storage.objects;

-- Create storage buckets for receipts and book images
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('receipts', 'receipts', false),
  ('book-images', 'book-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for receipts bucket (private - only admins and owners can access)
CREATE POLICY "Users can upload their own receipts" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'receipts' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own receipts" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'receipts' AND 
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
);

CREATE POLICY "Admins can view all receipts" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'receipts' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete receipts" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'receipts' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create policies for book-images bucket (public)
CREATE POLICY "Book images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'book-images');

CREATE POLICY "Admins can upload book images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'book-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update book images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'book-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete book images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'book-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);