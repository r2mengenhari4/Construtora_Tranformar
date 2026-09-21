# Guia de Integração: Supabase + GitHub + Vercel
### Construtora Transformar — Maricá/RJ

Este guia fornece o passo a passo completo para interligar o **Supabase** (Banco de Dados PostgreSQL e Storage), o **GitHub** (Controle de Versão e CI/CD) e a **Vercel** (Hospedagem e Execução Serverless).

---

## 📁 Estrutura de Migrations Criada no Projeto

O projeto conta agora com o padrão oficial do **Supabase CLI**:

```
supabase/
├── config.toml                              <- Configuração do projeto Supabase CLI
└── migrations/
    ├── 20250101000000_create_site_settings.sql   <- Tabela site_settings, RLS e trigger de updated_at
    ├── 20250101000001_create_storage_buckets.sql <- Bucket transformar-media (60MB, fotos e vídeos)
    └── 20250101000002_seed_initial_data.sql     <- Carga inicial padrão institucional

.github/
└── workflows/
    └── supabase-migrations.yml              <- CI/CD automático: executa supabase db push no GitHub

vercel.json                                  <- Roteamento das Serverless Functions (/api/*) e SPA
supabase-schema.sql                          <- Script consolidado para execução manual (1 clique)
```

---

## 1. 🔗 Interligando GitHub com o Supabase (Migrations Automáticas)

Existem duas formas de aplicar as migrations: **Automática via GitHub Actions** ou **Manual no Dashboard do Supabase**.

### Opção A: Automática com GitHub Actions (Recomendado)

Sempre que você fizer `git push` na branch `main` com alterações em `supabase/migrations/`, o GitHub Actions aplicará automaticamente as mudanças no seu Supabase.

1. No seu repositório do **GitHub**, acesse: **Settings** > **Secrets and variables** > **Actions**.
2. Clique em **New repository secret** e adicione:
   - `SUPABASE_ACCESS_TOKEN`: Seu token de acesso pessoal gerado em [Supabase Account Tokens](https://supabase.com/dashboard/account/tokens).
   - `SUPABASE_PROJECT_ID`: O ID de referência do seu projeto no Supabase (ex: `abcdefghijklmnop`).
   - `SUPABASE_DB_PASSWORD`: A senha do banco de dados PostgreSQL definida na criação do projeto Supabase.
3. Pronto! O workflow `.github/workflows/supabase-migrations.yml` executará `supabase db push` automaticamente.

### Opção B: Manual via SQL Editor do Supabase (1 Clique)

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard).
2. Selecione seu projeto e vá em **SQL Editor** no menu lateral esquerdo.
3. Abra o arquivo `supabase-schema.sql` deste repositório, copie todo o conteúdo e cole no SQL Editor.
4. Clique em **Run** (Executar). A tabela `site_settings`, as permissões RLS, o bucket de mídias `transformar-media` e as políticas de upload serão criadas instantaneamente.

---

## 2. ⚡ Interligando Vercel com o GitHub (Deploy Automático)

1. Acesse sua conta na [Vercel](https://vercel.com) e clique em **Add New...** > **Project**.
2. Selecione a sua conta do GitHub e importe o repositório da Construtora Transformar.
3. No painel de configuração do projeto:
   - **Framework Preset**: `Vite` (detectado automaticamente).
   - **Build Command**: `vite build` ou deixe o padrão.
   - **Output Directory**: `dist` (configurado automaticamente pelo `vercel.json`).
4. Clique em **Deploy**. A Vercel construirá o site e publicará na URL de produção. A cada novo commit na branch `main`, um novo deploy será gerado automaticamente.

---

## 3. 🛡️ Interligando Supabase com a Vercel (Variáveis de Ambiente)

Para que a API da Vercel (`/api/*`) e o frontend conversem com seu Supabase, você precisa configurar as variáveis no painel da Vercel.

### Método 1: Integração Nativa (1 Clique)
1. No [Supabase Dashboard](https://supabase.com/dashboard), acesse **Project Settings** > **Integrations**.
2. Selecione **Vercel** e clique em **Connect**.
3. Autorize a Vercel e selecione o projeto correspondente.
4. O Supabase irá injetar automaticamente todas as variáveis de ambiente necessárias (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, etc.) em seu projeto Vercel!

### Método 2: Configuração Manual na Vercel
Se preferir cadastrar manualmente:
1. No painel da Vercel, acesse seu projeto > **Settings** > **Environment Variables**.
2. Adicione as seguintes variáveis (para Production, Preview e Development):

| Variável | Onde obter no Supabase | Finalidade |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Settings > API > Project URL | Acesso do backend serverless |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings > API > Project API Keys (`service_role` secret) | Gravação e uploads administrativos |
| `SUPABASE_ANON_KEY` | Settings > API > Project API Keys (`anon` public) | Chave pública do cliente |
| `VITE_SUPABASE_URL` | Igual a `SUPABASE_URL` | Acesso direto e veloz pelo navegador |
| `VITE_SUPABASE_ANON_KEY` | Igual a `SUPABASE_ANON_KEY` | Chave pública do navegador |

---

## 4. 🚀 Como Usar o Supabase CLI Localmente (Opcional)

Se você preferir gerenciar migrations diretamente pelo terminal da sua máquina:

```bash
# 1. Instale o Supabase CLI (se ainda não tiver)
npm install -g supabase

# 2. Faça login na sua conta Supabase
supabase login

# 3. Vincule o projeto local ao projeto de nuvem
supabase link --project-ref SEU_PROJECT_ID

# 4. Envie as migrations pendentes para a nuvem
supabase db push

# 5. Para criar uma nova migration no futuro:
supabase migration new nome_da_sua_migration
```

---

## 5. ✅ Checklist de Validação Final

- [x] Arquivo `supabase/config.toml` criado e configurado.
- [x] Migrations criadas em `supabase/migrations/` com versionamento por timestamp.
- [x] Workflow `.github/workflows/supabase-migrations.yml` pronto para deploy contínuo.
- [x] `vercel.json` configurado para Vite + rotas serverless `/api/*` + fallback SPA.
- [x] `api/index.ts` exportado como Serverless Function para a Vercel.
- [x] `src/utils/supabaseClient.ts` com suporte a fallback client-side caso necessário.
- [x] `supabase-schema.sql` atualizado e idempotente para execução em 1 clique.
