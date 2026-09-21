import { SiteContent } from '../types/siteContent';
import { 
  COMPANY_CONFIG, 
  ALL_IN_ONE_CARDS, 
  TIMELINE_STEPS, 
  SERVICES_LIST, 
  DIFFERENTIALS 
} from './companyData';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    tagline: 'Construtora — Obras, Projetos & Financiamento',
    title: 'Sua casa começa com um projeto.',
    titleHighlight: 'A Transformar cuida do resto.',
    subtitle: 'Projetos de arquitetura e engenharia, planejamento, construção e assessoria de financiamento habitacional em Maricá e região. Da planta às chaves na mão.',
    backgroundImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=2400&q=85',
    ctaPrimaryText: 'Quero Construir',
    ctaSecondaryText: 'Conhecer Nossos Projetos',
    badge1: 'Construção Completa e Integrada',
    badge2: 'Engenharia & ART Registrada',
    badge3: 'Obras no Prazo em Maricá'
  },
  portfolio: {
    tagline: 'Portfólio & Obras Reais',
    title: 'Projetos que saíram do papel.',
    subtitle: 'Cada obra é o resultado da integração entre arquitetura autoral contemporânea e engenharia de precisão em Maricá e região.'
  },
  allInOne: {
    tagline: 'Solução Completa e Integrada',
    title: 'Tudo o que sua obra precisa em um só lugar.',
    subtitle: 'Da concepção do projeto arquitetônico à entrega das chaves, integramos arquitetura, cálculo estrutural e execução sob uma única liderança técnica.',
    marketTitle: 'Múltiplos profissionais e você no meio de discussões de culpa.',
    marketDescription: 'Contratar o arquiteto que não conversa com o calculista estrutural; orçamentos que dobram ao longo da execução; e um mestre de obras improvisando no canteiro sem compatibilização.',
    marketConsequence: 'Consequência: Atrasos sucessivos, desperdício de materiais e desgaste emocional.',
    solutionTitle: 'Responsabilidade técnica única e previsibilidade total.',
    solutionDescription: 'Os projetos nascem compatibilizados desde o primeiro dia. Orçamento transparente e detalhado antes do primeiro tijolo, cronograma físico-financeiro rigoroso e entrega com ART/RRT registrada.',
    solutionConsequence: 'Consequência: Tranquilidade com custo controlado e prazos respeitados do início ao fim.',
    pillars: ALL_IN_ONE_CARDS
  },
  timeline: {
    tagline: 'Roteiro de Execução',
    title: 'Do Terreno à Entrega',
    subtitle: 'Uma jornada estruturada e transparente para transformar sua ideia em uma casa pronta, com rigor técnico e sem surpresas.',
    steps: TIMELINE_STEPS
  },
  services: {
    tagline: 'Nossas Especialidades',
    title: 'Soluções para construir do seu jeito.',
    subtitle: 'Contrate o ciclo completo da sua obra ou selecione os projetos de engenharia e arquitetura específicos para sua necessidade em Maricá.',
    services: SERVICES_LIST
  },
  differentials: {
    tagline: 'Diferenciais Exclusivos',
    title: 'Construir pode ser uma experiência mais tranquila.',
    subtitle: 'Eliminamos a incerteza com processos definidos, critérios técnicos rigorosos de engenharia e uma relação transparente do início ao fim.',
    items: DIFFERENTIALS
  },
  about: {
    tagline: 'Sobre a Construtora',
    title: 'Transformar é construir mais do que casas.',
    paragraph1: 'A Transformar nasceu com o propósito de tornar o processo de construir mais organizado, transparente e seguro.',
    paragraph2: 'Unimos arquitetura, engenharia e construção para transformar projetos em espaços reais, funcionais e preparados para acompanhar a vida de cada família.',
    paragraph3: 'Atuamos em Maricá e região, oferecendo soluções completas para quem deseja construir, reformar ou desenvolver projetos para sua residência.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=1000&q=80',
    imageBadgeCategory: 'Canteiro & Engenharia',
    imageBadgeText: 'Rigor técnico nos projetos e presença constante no canteiro de obras.',
    missionTitle: 'Nossa Missão',
    missionText: 'Proporcionar uma experiência de construção previsível e tranquila, unindo projetos inteligentes e engenharia de alto padrão para materializar o patrimônio de nossos clientes.',
    valuesTitle: 'Nossos Valores',
    valuesList: [
      'Transparência e clareza de custos',
      'Rigor e segurança estrutural',
      'Respeito ao prazo e ao investimento'
    ],
    teamTitle: 'Equipe & Responsável Técnico',
    teamText: 'Engenheiros e arquitetos dedicados a cada detalhe da sua obra em Maricá.',
    teamLocation: 'Atendimento local em Maricá'
  },
  contact: {
    tagline: 'Atendimento & Orçamento',
    title: 'Vamos conversar sobre o seu projeto?',
    subtitle: 'Entre em contato diretamente pelo WhatsApp, envie seu formulário ou venha tomar um café em nosso escritório em Itaipuaçu.',
    officeAddress: COMPANY_CONFIG.OFFICE_ADDRESS,
    officeMapsUrl: COMPANY_CONFIG.OFFICE_MAPS_URL,
    openingHours: COMPANY_CONFIG.OPENING_HOURS,
    whatsappNumber: COMPANY_CONFIG.WHATSAPP_NUMBER,
    whatsappDisplay: COMPANY_CONFIG.WHATSAPP_DISPLAY,
    whatsappDefaultMessage: COMPANY_CONFIG.WHATSAPP_DEFAULT_MESSAGE,
    emailContact: COMPANY_CONFIG.EMAIL_CONTACT,
    instagramHandle: COMPANY_CONFIG.INSTAGRAM_HANDLE,
    instagramUrl: COMPANY_CONFIG.INSTAGRAM_URL
  }
};
