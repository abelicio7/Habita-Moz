-- Criar bucket para imagens de imóveis
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true);

-- Política para visualizar imagens publicamente
CREATE POLICY "Imagens de imóveis são públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Política para anunciantes fazerem upload
CREATE POLICY "Anunciantes podem fazer upload de imagens"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.uid() IS NOT NULL
  AND public.has_role(auth.uid(), 'advertiser')
);

-- Política para anunciantes deletarem próprias imagens
CREATE POLICY "Anunciantes podem deletar próprias imagens"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para anunciantes atualizarem próprias imagens
CREATE POLICY "Anunciantes podem atualizar próprias imagens"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'property-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);