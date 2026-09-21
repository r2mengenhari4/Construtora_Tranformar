-- ==============================================================================
-- SCHEMA SUPABASE POSTGRESQL & STORAGE - CONSTRUTORA TRANSFORMAR
-- Execute este script no SQL Editor do seu Dashboard Supabase (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. TABELA PRINCIPAL DE CONFIGURAÇÕES E CONTEÚDO DO SITE
create table if not exists public.site_settings (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default now()
);

-- 2. POLÍTICAS DE SEGURANÇA (Row Level Security - RLS)
alter table public.site_settings enable row level security;

-- Permitir que visitantes anônimos e qualquer usuário leiam o conteúdo do site
create policy "Permitir leitura pública do conteúdo do site"
  on public.site_settings
  for select
  to anon, authenticated, service_role
  using (true);

-- Permitir gravação de dados
create policy "Permitir gravação de configurações do site"
  on public.site_settings
  for all
  to anon, authenticated, service_role
  using (true)
  with check (true);

-- 3. BUCKET DE ARMAZENAMENTO PARA FOTOS E VÍDEOS CURTOS (Supabase Storage)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'transformar-media',
  'transformar-media',
  true,
  62914560, -- 60 Megabytes (suficiente para fotos HD e vídeos curtos de até 30s)
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
  file_size_limit = 62914560;

-- 4. POLÍTICAS DE ACESSO AO BUCKET DE MÍDIA
create policy "Visualização pública de mídias da Construtora"
  on storage.objects
  for select
  to public
  using (bucket_id = 'transformar-media');

create policy "Upload de imagens e vídeos para transformar-media"
  on storage.objects
  for insert
  to public
  with check (bucket_id = 'transformar-media');

create policy "Atualização de arquivos de mídia"
  on storage.objects
  for update
  to public
  using (bucket_id = 'transformar-media');

create policy "Exclusão de arquivos de mídia"
  on storage.objects
  for delete
  to public
  using (bucket_id = 'transformar-media');
