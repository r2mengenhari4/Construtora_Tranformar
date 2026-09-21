-- ==============================================================================
-- Migration: 20250101000001_create_storage_buckets.sql
-- Descrição: Configuração do bucket público do Supabase Storage para fotos e vídeos curtos
-- Aplicação: Construtora Transformar - Maricá/RJ
-- ==============================================================================

-- 1. Criação / Atualização do Bucket de Mídia
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'transformar-media',
  'transformar-media',
  true,
  62914560, -- 60 Megabytes (suficiente para fotos em alta resolução e vídeos curtos de até 30s)
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/ogg'
  ]
)
on conflict (id) do update set
  public = true,
  file_size_limit = 62914560,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/ogg'
  ];

-- 2. Políticas de Acesso e Segurança para storage.objects
-- Leitura pública de qualquer objeto do bucket 'transformar-media'
drop policy if exists "Visualização pública de mídias da Construtora" on storage.objects;
create policy "Visualização pública de mídias da Construtora"
  on storage.objects
  for select
  to public
  using (bucket_id = 'transformar-media');

-- Upload / Inserção de fotos e vídeos no bucket
drop policy if exists "Upload de imagens e vídeos para transformar-media" on storage.objects;
create policy "Upload de imagens e vídeos para transformar-media"
  on storage.objects
  for insert
  to public
  with check (bucket_id = 'transformar-media');

-- Atualização de arquivos existentes
drop policy if exists "Atualização de arquivos de mídia" on storage.objects;
create policy "Atualização de arquivos de mídia"
  on storage.objects
  for update
  to public
  using (bucket_id = 'transformar-media');

-- Exclusão de arquivos de mídia
drop policy if exists "Exclusão de arquivos de mídia" on storage.objects;
create policy "Exclusão de arquivos de mídia"
  on storage.objects
  for delete
  to public
  using (bucket_id = 'transformar-media');
