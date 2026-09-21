-- ==============================================================================
-- SCHEMA SUPABASE POSTGRESQL & STORAGE COMPLETO - CONSTRUTORA TRANSFORMAR
-- Execute este script no SQL Editor do seu Dashboard Supabase (https://supabase.com/dashboard)
-- Este arquivo consolida todas as migrations em um único script executável e idempotente.
-- ==============================================================================

-- 1. TABELA PRINCIPAL DE CONFIGURAÇÕES E CONTEÚDO DO SITE
create table if not exists public.site_settings (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default now()
);

-- Comentários descritivos
comment on table public.site_settings is 'Armazena configurações do site, dados da empresa e portfólio da Construtora Transformar.';

-- 2. TRIGGER AUTOMÁTICO PARA UPDATED_AT
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
  before update on public.site_settings
  for each row
  execute function public.handle_updated_at();

-- 3. POLÍTICAS DE SEGURANÇA (Row Level Security - RLS)
alter table public.site_settings enable row level security;

-- Permitir que visitantes anônimos e qualquer usuário leiam o conteúdo do site
drop policy if exists "Permitir leitura pública do conteúdo do site" on public.site_settings;
create policy "Permitir leitura pública do conteúdo do site"
  on public.site_settings
  for select
  to anon, authenticated, service_role
  using (true);

-- Permitir gravação de dados
drop policy if exists "Permitir gravação de configurações do site" on public.site_settings;
create policy "Permitir gravação de configurações do site"
  on public.site_settings
  for all
  to anon, authenticated, service_role
  using (true)
  with check (true);

-- Concessão de permissões de acesso
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on table public.site_settings to anon, authenticated, service_role;

-- 4. BUCKET DE ARMAZENAMENTO PARA FOTOS E VÍDEOS CURTOS (Supabase Storage)
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

-- 5. POLÍTICAS DE ACESSO AO BUCKET DE MÍDIA
drop policy if exists "Visualização pública de mídias da Construtora" on storage.objects;
create policy "Visualização pública de mídias da Construtora"
  on storage.objects
  for select
  to public
  using (bucket_id = 'transformar-media');

drop policy if exists "Upload de imagens e vídeos para transformar-media" on storage.objects;
create policy "Upload de imagens e vídeos para transformar-media"
  on storage.objects
  for insert
  to public
  with check (bucket_id = 'transformar-media');

drop policy if exists "Atualização de arquivos de mídia" on storage.objects;
create policy "Atualização de arquivos de mídia"
  on storage.objects
  for update
  to public
  using (bucket_id = 'transformar-media');

drop policy if exists "Exclusão de arquivos de mídia" on storage.objects;
create policy "Exclusão de arquivos de mídia"
  on storage.objects
  for delete
  to public
  using (bucket_id = 'transformar-media');

-- 6. CARGA INICIAL DE DADOS (Executa apenas se a tabela estiver vazia)
insert into public.site_settings (id, data, updated_at)
values (
  'company_config',
  '{
    "WHATSAPP_NUMBER": "5521999999999",
    "WHATSAPP_DISPLAY": "(21) 99999-9999",
    "WHATSAPP_DEFAULT_MESSAGE": "Olá! Gostaria de falar sobre um projeto de arquitetura e construção em Maricá com a Construtora Transformar.",
    "INSTAGRAM_HANDLE": "@construtoratransformar",
    "INSTAGRAM_URL": "https://instagram.com/construtoratransformar",
    "EMAIL_CONTACT": "contato@construtoratransformar.com.br",
    "OFFICE_ADDRESS": "Centro, Maricá - RJ",
    "OFFICE_MAPS_URL": "https://maps.google.com/?q=Centro,Marica,RJ",
    "OPENING_HOURS": "Segunda a Sexta, das 08h às 18h"
  }'::jsonb,
  now()
)
on conflict (id) do nothing;
