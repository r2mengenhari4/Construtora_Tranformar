import { Project, ServiceItem, StepItem, DifferentialItem, TestimonialItem } from '../types';

/**
 * CONFIGURAÇÃO GERAL DA EMPRESA
 * Atualize o número de WhatsApp e contatos conforme necessário.
 */
export const COMPANY_CONFIG = {
  "WHATSAPP_NUMBER": "5521999999999",
  "WHATSAPP_DISPLAY": "(21) 99999-9999",
  "WHATSAPP_DEFAULT_MESSAGE": "Olá! Gostaria de falar sobre um projeto de arquitetura e construção em Maricá com a Construtora Transformar.",
  "INSTAGRAM_HANDLE": "@construtoratransformar",
  "INSTAGRAM_URL": "https://instagram.com/construtoratransformar",
  "EMAIL_CONTACT": "contato@construtoratransformar.com.br",
  "OFFICE_ADDRESS": "Centro, Maricá - RJ",
  "OFFICE_MAPS_URL": "https://maps.google.com/?q=Centro,Marica,RJ",
  "OPENING_HOURS": "Segunda a Sexta, das 08h às 18h"
};

export const ALL_IN_ONE_CARDS = [
  {
    id: 'arquitetura',
    title: 'Arquitetura',
    description: 'Projetos personalizados pensados para o estilo de vida, terreno e necessidades de cada cliente.',
    iconName: 'Compass',
    deliverable: 'Plantas 2D, Fachadas 3D, Maquete Volumétrica e Estudo Solar'
  },
  {
    id: 'engenharia-estrutural',
    title: 'Engenharia Estrutural',
    description: 'Dimensionamento e desenvolvimento das soluções estruturais necessárias para uma construção segura e eficiente.',
    iconName: 'Layers',
    deliverable: 'Cálculo estrutural, economia de concreto e aço sem superdimensionamento'
  },
  {
    id: 'instalacoes-eletricas',
    title: 'Instalações Elétricas',
    description: 'Projetos elétricos completos, planejados para segurança, funcionalidade e conforto.',
    iconName: 'Zap',
    deliverable: 'Quadros de distribuição, balanceamento de cargas e infraestrutura solar'
  },
  {
    id: 'instalacoes-hidrossanitarias',
    title: 'Instalações Hidrossanitárias',
    description: 'Projetos hidráulicos e sanitários desenvolvidos de acordo com as necessidades da residência.',
    iconName: 'Droplets',
    deliverable: 'Rede de água fria/quente, esgoto, reuso de águas pluviais e drenagem'
  },
  {
    id: 'construcao',
    title: 'Construção',
    description: 'Execução da obra com planejamento, acompanhamento técnico e controle rigoroso de cada etapa.',
    iconName: 'Hammer',
    deliverable: 'Gestão de materiais, mão de obra qualificada e cronograma físico-financeiro'
  }
];

export const TIMELINE_STEPS: StepItem[] = [
  {
    number: '01',
    title: 'Conhecemos seu terreno',
    description: 'Análise topográfica, insolação, ventos predominantes e regras urbanísticas do condomínio ou município de Maricá.',
    deliverable: 'Estudo de viabilidade e aproveitamento do lote',
    icon: 'MapPin'
  },
  {
    number: '02',
    title: 'Entendemos suas necessidades',
    description: 'Reunião de briefing detalhado para mapear o estilo arquitetônico desejado, rotina familiar, orçamento e expectativas.',
    deliverable: 'Programa de necessidades e alinhamento orçamentário',
    icon: 'MessageSquareText'
  },
  {
    number: '03',
    title: 'Desenvolvemos os projetos',
    description: 'Criação do projeto arquitetônico 3D e todos os projetos complementares de engenharia (estrutural, elétrico e hidrossanitário).',
    deliverable: 'Imagens fotorrealistas, plantas e documentação para aprovação',
    icon: 'PenTool'
  },
  {
    number: '04',
    title: 'Planejamos sua obra',
    description: 'Elaboração do cronograma físico-financeiro detalhado, lista de materiais e planejamento de suprimentos.',
    deliverable: 'Previsibilidade de prazos, custos transparentes e sem surpresas',
    icon: 'CalendarCheck'
  },
  {
    number: '05',
    title: 'Executamos a construção',
    description: 'Obras conduzidas com rigor técnico, equipe especializada e relatórios periódicos de acompanhamento para você.',
    deliverable: 'Gestão integral com acompanhamento do engenheiro responsável',
    icon: 'HardHat'
  },
  {
    number: '06',
    title: 'Entregamos sua casa',
    description: 'Vistoria final detalhada, entrega de todos os manuais técnicos, projeto as-built e a entrega oficial das chaves.',
    deliverable: 'Sua residência pronta para morar com garantia e tranquilidade',
    icon: 'KeyRound'
  }
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'projeto-arquitetonico',
    title: 'PROJETO ARQUITETÔNICO',
    subtitle: 'Identidade, conforto e funcionalidade',
    description: 'Projetos personalizados para transformar necessidades, estilo e terreno em uma residência funcional e contemporânea, com maquetes 3D imersivas e total integração aos ventos e iluminação natural de Maricá.',
    benefits: [
      'Estudo bioclimático para conforto térmico o ano todo',
      'Modelagem 3D e passeios virtuais realistas',
      'Aprovação na Prefeitura de Maricá e comissões de condomínio'
    ],
    icon: 'Compass',
    tag: 'Design & Espaço'
  },
  {
    id: 'projeto-estrutural',
    title: 'PROJETO ESTRUTURAL',
    subtitle: 'Segurança e economia inteligente',
    description: 'Soluções estruturais desenvolvidas para segurança, racionalização e desempenho da construção, evitando desperdício de insumos como concreto e aço.',
    benefits: [
      'Cálculo preciso com software de engenharia de ponta',
      'Evita trincas, fissuras e patologias construtivas futuras',
      'Otimização de custos reais em fundações e pilares'
    ],
    icon: 'Layers',
    tag: 'Engenharia Racional'
  },
  {
    id: 'projeto-eletrico',
    title: 'PROJETO ELÉTRICO',
    subtitle: 'Capacidade energética e segurança',
    description: 'Dimensionamento e distribuição dos sistemas elétricos da residência, prevendo automação residencial, climatização e pontos para carregamento veicular.',
    benefits: [
      'Circuitos dimensionados com margem de segurança',
      'Previsão para energia solar fotovoltaica e aquecimento',
      'Proteção contra sobrecargas e descargas atmosféricas'
    ],
    icon: 'Zap',
    tag: 'Tecnologia & Conforto'
  },
  {
    id: 'projeto-hidrossanitario',
    title: 'PROJETO HIDROSSANITÁRIO',
    subtitle: 'Pressurização ideal e sustentabilidade',
    description: 'Soluções para abastecimento de água fria e quente, esgoto e demais instalações hidrossanitárias com vazão adequada e sem risco de refluxos ou odores.',
    benefits: [
      'Pressão equilibrada em todos os chuveiros e torneiras',
      'Tratamento de efluentes em conformidade com as normas ambientais',
      'Sistemas de captação e reaproveitamento de água de chuva'
    ],
    icon: 'Droplets',
    tag: 'Sustentabilidade'
  },
  {
    id: 'construcao-residencial',
    title: 'CONSTRUÇÃO RESIDENCIAL',
    subtitle: 'Do terreno bruto ao acabamento fino',
    description: 'Execução completa da obra, desde a preparação do terreno e fundação até os acabamentos finos e a entrega final das chaves da sua casa pronta para morar.',
    benefits: [
      'Controle rigoroso de cronograma e custos',
      'Equipe técnica qualificada e canteiro de obras organizado',
      'Garantia de construção civil e suporte técnico'
    ],
    icon: 'Home',
    tag: 'Obra Completa'
  },
  {
    id: 'gerenciamento-e-acompanhamento',
    title: 'GERENCIAMENTO E ACOMPANHAMENTO DE OBRA',
    subtitle: 'Supervisão técnica contínua',
    description: 'Planejamento, acompanhamento das etapas, controle e orientação técnica durante a execução, com relatórios fotográficos periódicos para o proprietário.',
    benefits: [
      'Fiscalização constante da qualidade dos materiais aplicados',
      'Relatórios de evolução da obra enviados direto no seu WhatsApp',
      'Gestão ativa de fornecedores e cotações vantajosas'
    ],
    icon: 'ClipboardCheck',
    tag: 'Gestão Transparente'
  }
];

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: 'residencia-alphaville-marica',
    title: 'Residência Alphaville Maricá',
    location: 'Alphaville, Maricá – RJ',
    category: 'Construção',
    status: 'Concluído',
    area: '290 m²',
    bedrooms: '4 Quartos',
    suites: '3 Suítes Master',
    tagline: 'Arquitetura contemporânea integrada à natureza e piscina com borda infinita.',
    description: 'Residência unifamiliar de alto padrão com volumetria pura, grandes panos de vidro que valorizam a luz natural, living com pé-direito duplo e integração total com a área gourmet.',
    features: [
      'Pé-direito duplo no living',
      'Área gourmet completa com churrasqueira embutida',
      'Piscina em alvenaria com iluminação em LED',
      'Infraestrutura para energia fotovoltaica',
      'Esquadrias de alumínio preto linha premium'
    ],
    mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-house-exterior-tour-4866-large.mp4',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: [
      { icon: 'Waves', label: 'Piscina & Prainha' },
      { icon: 'Flame', label: 'Área Gourmet' },
      { icon: 'SunMedium', label: 'Solário & Deck' },
      { icon: 'Car', label: 'Garagem 2 Carros' }
    ]
  },
  {
    id: 'casa-pedra-de-inoa',
    title: 'Casa Pedra de Inoã',
    location: 'Condomínio Pedra de Inoã, Maricá – RJ',
    category: 'Arquitetura',
    status: 'Em Obras',
    area: '245 m²',
    bedrooms: '3 Quartos',
    suites: '2 Suítes',
    tagline: 'Linhas retas elegantes, ripados de madeira e aproveitamento inteligente da topografia.',
    description: 'Projeto que une modernidade e acolhimento. A implantação foi cuidadosamente estudada para garantir ventilação cruzada dos ventos litorâneos de Maricá, reduzindo o consumo de ar-condicionado.',
    features: [
      'Fachada moderna com brises ripados',
      'Cozinha com ilha central e despensa oculta',
      'Lavabo social de impacto',
      'Reservatório de aproveitamento de água de chuva',
      'Suíte master com closet ventilado'
    ],
    mainImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: [
      { icon: 'Waves', label: 'Piscina Integrada' },
      { icon: 'Flame', label: 'Varanda Gourmet' },
      { icon: 'Sparkles', label: 'Jardim de Inverno' },
      { icon: 'Car', label: 'Garagem Coberta' }
    ]
  },
  {
    id: 'residencia-itaipuacu-oceano',
    title: 'Residência Itaipuaçu Contemporânea',
    location: 'Itaipuaçu (Jardim Atlântico), Maricá – RJ',
    category: 'Construção',
    status: 'Em Obras',
    area: '185 m²',
    bedrooms: '3 Quartos',
    suites: '1 Suíte',
    tagline: 'Casa térrea contemporânea, pé-direito elevado e lazer privativo.',
    description: 'Concebida para uma família que buscava a tranquilidade de Itaipuaçu com a sofisticação da arquitetura moderna. A casa privilegia acessibilidade, ampla claridade e acabamentos de primeira linha.',
    features: [
      'Projeto térreo com circulação facilitada',
      'Piso em porcelanato acetinado grande formato',
      'Bancadas de granito e quartzo escovado',
      'Chuveiro duplo na suíte master',
      'Amplo quintal gramado com piscina e cascata'
    ],
    mainImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: [
      { icon: 'Waves', label: 'Piscina com Cascata' },
      { icon: 'UtensilsCrossed', label: 'Espaço Gourmet' },
      { icon: 'Trees', label: 'Quintal Privativo' },
      { icon: 'Car', label: '2 Vagas' }
    ]
  },
  {
    id: 'residencia-vivendas-marica',
    title: 'Residência Vivendas Maricá',
    location: 'Vivendas de Maricá, Maricá – RJ',
    category: 'Arquitetura',
    status: 'Em Projeto',
    area: '320 m²',
    bedrooms: '4 Quartos',
    suites: '4 Suítes',
    tagline: 'Projeto autoral imponente com balanços estruturais arrojados.',
    description: 'Desenvolvido pela equipe de arquitetura e engenharia da Transformar com balanços de concreto aparente e revestimentos em pedra natural, integrando o interior ao deck com pergolado metálico.',
    features: [
      'Fachada com balanço estrutural sem pilares visíveis',
      'Esquadrias piso-teto com abertura total',
      'Escritório / Home office com entrada independente',
      'Sauna integrada com a piscina',
      'Sistema central de aquecimento de água'
    ],
    mainImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: [
      { icon: 'Waves', label: 'Piscina e Prainha' },
      { icon: 'Flame', label: 'Sauna Integrada' },
      { icon: 'Briefcase', label: 'Home Office' },
      { icon: 'Car', label: '3 Vagas Cobertas' }
    ]
  },
  {
    id: 'reforma-transformacao-ponta-negra',
    title: 'Transformação Residencial Ponta Negra',
    location: 'Ponta Negra, Maricá – RJ',
    category: 'Reformas',
    status: 'Concluído',
    area: '210 m²',
    bedrooms: '3 Quartos',
    suites: '2 Suítes',
    tagline: 'Modernização estrutural completa com novo layout e área de convivência externa.',
    description: 'Reforma geral de uma casa tradicional, onde a Transformar realizou o reforço estrutural, substituição total das instalações elétricas e hidráulicas e reconstrução da fachada com visual contemporâneo.',
    features: [
      'Demolição de paredes para integração living-cozinha',
      'Reforço com vigas metálicas discretas',
      'Nova fachada com revestimento ripado e textura cimento queimado',
      'Área de piscina totalmente revitalizada com pedra hijau'
    ],
    mainImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: [
      { icon: 'Sparkles', label: 'Reforma Integral' },
      { icon: 'Waves', label: 'Piscina Revitalizada' },
      { icon: 'Flame', label: 'Gourmet Climatizado' },
      { icon: 'ShieldCheck', label: 'Garantia Estrutural' }
    ]
  },
  {
    id: 'interiores-sobrado-sao-jose',
    title: 'Design de Interiores & Integração',
    location: 'São José do Imbassaí, Maricá – RJ',
    category: 'Interiores',
    status: 'Concluído',
    area: '160 m²',
    bedrooms: '3 Quartos',
    suites: '1 Suíte',
    tagline: 'Ambientes integrados com marcenaria planejada e iluminação cenográfica.',
    description: 'Planejamento de interiores com paleta aconchegante de tons neutros, iluminação indireta em LED e marcenaria sob medida que maximiza cada metro quadrado da residência.',
    features: [
      'Iluminação cênica com perfis de LED de alta fidelidade',
      'Painéis em madeira freijó e ripados verticais',
      'Mobiliário selecionado de alto conforto',
      'Cozinha gourmet com acabamentos em quartzo calacatta'
    ],
    mainImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: [
      { icon: 'Sparkles', label: 'Marcenaria Fina' },
      { icon: 'Lightbulb', label: 'Iluminação Cênica' },
      { icon: 'Tv', label: 'Home Cinema' },
      { icon: 'Flame', label: 'Gourmet Integrado' }
    ]
  }
];

export const DIFFERENTIALS: DifferentialItem[] = [
  {
    title: 'Planejamento',
    description: 'Cada etapa é pensada antes de ser executada.',
    icon: 'CalendarClock',
    detail: 'Cronogramas bem definidos evitam retrabalhos e custos desnecessários durante a obra.'
  },
  {
    title: 'Engenharia',
    description: 'Decisões técnicas baseadas em critérios de engenharia.',
    icon: 'ShieldCheck',
    detail: 'Responsabilidade técnica registrada (ART/RRT) e respeito absoluto às normas da ABNT.'
  },
  {
    title: 'Transparência',
    description: 'Comunicação clara durante o desenvolvimento do projeto e da obra.',
    icon: 'Eye',
    detail: 'Relatórios claros de custos, compras e status semanal para você acompanhar com serenidade.'
  },
  {
    title: 'Integração',
    description: 'Projetos e execução trabalhando de forma coordenada.',
    icon: 'GitMerge',
    detail: 'Quem projeta se comunica diretamente com quem constrói, eliminando incompatibilidades.'
  },
  {
    title: 'Personalização',
    description: 'Cada residência é desenvolvida de acordo com as necessidades do cliente.',
    icon: 'Palette',
    detail: 'Não usamos modelos genéricos; sua casa é desenhada para a sua vida e seu terreno.'
  },
  {
    title: 'Acompanhamento',
    description: 'O cliente acompanha a evolução da sua obra.',
    icon: 'Smartphone',
    detail: 'Fotos, vídeos e reuniões de alinhamento com a equipe de engenharia responsável.'
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'depoimento-1',
    clientName: 'Carlos e Fernanda S.',
    neighborhood: 'Itaipuaçu (Maricá – RJ)',
    rating: 5,
    projectType: 'Projeto + Construção Completa',
    quote: 'Compramos nosso terreno em Itaipuaçu e tínhamos muito receio de lidar com obras. A equipe da Transformar cuidou de tudo: desde a aprovação na prefeitura até o piso da área da piscina. Ter o engenheiro presente nos deu total paz de espírito.',
    date: 'Fevereiro 2026',
    isPlaceholder: true
  },
  {
    id: 'depoimento-2',
    clientName: 'Eduardo M.',
    neighborhood: 'Alphaville Maricá (Maricá – RJ)',
    rating: 5,
    projectType: 'Projeto Arquitetônico e Estrutural',
    quote: 'O detalhamento dos projetos nos surpreendeu. Na fase do estrutural economizamos muito concreto porque o cálculo foi feito com extrema precisão, sem improvisos. A casa ficou exatamente como a maquete 3D.',
    date: 'Janeiro 2026',
    isPlaceholder: true
  },
  {
    id: 'depoimento-3',
    clientName: 'Renata e Márcio L.',
    neighborhood: 'Pedra de Inoã (Maricá – RJ)',
    rating: 5,
    projectType: 'Construção Residencial Completa',
    quote: 'Comunicação transparente em cada etapa. Recebíamos relatórios das compras e fotos semanais da evolução das fundações e alvenaria. Recomendo de olhos fechados para quem quer construir em Maricá.',
    date: 'Dezembro 2025',
    isPlaceholder: true
  }
];

export const FAQS = [
  {
    question: 'Vocês cuidam da aprovação do projeto na Prefeitura de Maricá?',
    answer: 'Sim! Desenvolvemos o projeto legal completo e cuidamos de todo o processo de tramitação e protocolo junto à Secretaria de Urbanismo da Prefeitura de Maricá, bem como das exigências específicas do seu condomínio.'
  },
  {
    question: 'Posso contratar apenas os projetos ou apenas a construção?',
    answer: 'Sim. Oferecemos soluções modulares: você pode contratar o pacote completo (Projeto + Construção Completa) para máxima tranquilidade, ou contratar separadamente os projetos de engenharia e arquitetura.'
  },
  {
    question: 'Vocês realizam construção com financiamento bancário (Caixa / SBPE)?',
    answer: 'Sim! Elaboramos todo o caderno técnico de engenharia (planilha PCI / PFUI, cronogramas e projetos executivos) necessário para financiamento de aquisição de terreno e construção ou apenas construção em terreno próprio.'
  },
  {
    question: 'Qual a região de atendimento da Construtora Transformar?',
    answer: 'Atuamos fortemente em Maricá (Itaipuaçu, Inoã, Centro, Ponta Negra, São José do Imbassaí, condomínios fechados) e em toda a Região Oceânica adjacente.'
  }
];
