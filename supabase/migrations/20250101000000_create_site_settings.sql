-- ==============================================================================
-- Migration: 20250101000000_create_site_settings.sql
-- Descrição: Cria a tabela principal de armazenamento de configurações e conteúdo do site
-- Aplicação: Construtora Transformar - Maricá/RJ
-- ==============================================================================

-- 1. Criação da tabela principal
create table if not exists public.site_settings (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default now()
);

-- Comentários descritivos
comment on table public.site_settings is 'Armazena as configurações institucionais, seções do site e obras do portfólio em formato JSONB.';
comment on column public.site_settings.id is 'Identificador do bloco (ex: site_content, company_config, projects).';
comment on column public.site_settings.data is 'Conteúdo estruturado em JSON.';
comment on column public.site_settings.updated_at is 'Data e hora da última modificação.';

-- 2. Função e Trigger para atualizar automaticamente o campo updated_at
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

-- 3. Habilitação de Segurança em Nível de Linha (Row Level Security - RLS)
alter table public.site_settings enable row level security;

-- Política de leitura: qualquer visitante (anônimo ou autenticado) pode ler o conteúdo do site
drop policy if exists "Permitir leitura pública do conteúdo do site" on public.site_settings;
create policy "Permitir leitura pública do conteúdo do site"
  on public.site_settings
  for select
  to anon, authenticated, service_role
  using (true);

-- Política de gravação: permite inserção/atualização para service_role, authenticated e anon
drop policy if exists "Permitir gravação de configurações do site" on public.site_settings;
create policy "Permitir gravação de configurações do site"
  on public.site_settings
  for all
  to anon, authenticated, service_role
  using (true)
  with check (true);

-- 4. Concessão de permissões de acesso
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on table public.site_settings to anon, authenticated, service_role;
