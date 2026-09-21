-- ==============================================================================
-- Migration: 20250101000002_seed_initial_data.sql
-- Descrição: Carga inicial de dados institucionais (site_content, company_config, projects)
-- Aplicação: Construtora Transformar - Maricá/RJ
-- Nota: Executado com 'ON CONFLICT (id) DO NOTHING' para preservar dados existentes
-- ==============================================================================

-- 1. Configurações gerais da empresa (WhatsApp, Instagram, Endereço)
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

-- 2. Conteúdo institucional e textos das abas do site
insert into public.site_settings (id, data, updated_at)
values (
  'site_content',
  '{
    "hero": {
      "tagline": "Construtora — Obras, Projetos & Financiamento",
      "title": "Sua casa começa com um projeto.",
      "titleHighlight": "A Transformar cuida do resto.",
      "subtitle": "Projetos de arquitetura e engenharia, planejamento, construção e assessoria de financiamento habitacional em Maricá e região. Da planta às chaves na mão.",
      "backgroundImage": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=2400&q=85",
      "ctaPrimaryText": "Quero Construir",
      "ctaSecondaryText": "Conhecer Nossos Projetos",
      "badge1": "Construção Completa e Integrada",
      "badge2": "Engenharia & ART Registrada",
      "badge3": "Obras no Prazo em Maricá"
    },
    "portfolio": {
      "tagline": "Portfólio & Obras Reais",
      "title": "Projetos que saíram do papel.",
      "subtitle": "Cada obra é o resultado da integração entre arquitetura autoral contemporânea e engenharia de precisão em Maricá e região."
    },
    "allInOne": {
      "tagline": "Solução Completa e Integrada",
      "title": "Tudo o que sua obra precisa em um só lugar.",
      "subtitle": "Da concepção do projeto arquitetônico à entrega das chaves, integramos arquitetura, cálculo estrutural e execução sob uma única liderança técnica.",
      "marketTitle": "Múltiplos profissionais e você no meio de discussões de culpa.",
      "marketDescription": "Contratar o arquiteto que não conversa com o calculista estrutural; orçamentos que dobram ao longo da execução; e um mestre de obras improvisando no canteiro sem compatibilização.",
      "marketConsequence": "Consequência: Atrasos sucessivos, desperdício de materiais e desgaste emocional.",
      "solutionTitle": "Responsabilidade técnica única e previsibilidade total.",
      "solutionDescription": "Os projetos nascem compatibilizados desde o primeiro dia. Orçamento transparente e detalhado antes do primeiro tijolo, cronograma físico-financeiro rigoroso e entrega com ART/RRT registrada.",
      "solutionConsequence": "Consequência: Tranquilidade com custo controlado e prazos respeitados do início ao fim."
    },
    "timeline": {
      "tagline": "Roteiro de Execução",
      "title": "Do Terreno à Entrega",
      "subtitle": "Uma jornada estruturada e transparente para transformar sua ideia em uma casa pronta, com rigor técnico e sem surpresas."
    },
    "services": {
      "tagline": "Nossas Especialidades",
      "title": "Soluções para construir do seu jeito.",
      "subtitle": "Contrate o ciclo completo da sua obra ou selecione os projetos de engenharia e arquitetura específicos para sua necessidade em Maricá."
    },
    "differentials": {
      "tagline": "Diferenciais Exclusivos",
      "title": "Construir pode ser uma experiência mais tranquila.",
      "subtitle": "Eliminamos a incerteza com processos definidos, critérios técnicos rigorosos de engenharia e uma relação transparente do início ao fim."
    },
    "about": {
      "tagline": "Sobre a Construtora",
      "title": "Transformar é construir mais do que casas.",
      "subtitle": "Uma construtora e escritório de projetos sediada em Maricá, comprometida com a precisão da engenharia, inovação arquitetônica e respeito aos prazos e sonhos das famílias fluminenses."
    },
    "contact": {
      "tagline": "Atendimento Direto com Especialistas",
      "title": "Vamos planejar o projeto da sua nova casa em Maricá?",
      "subtitle": "Conte-nos sobre seu terreno, suas ideias ou o projeto que deseja construir. Respondemos prontamente pelo WhatsApp ou ligação."
    }
  }'::jsonb,
  now()
)
on conflict (id) do nothing;
