import { StepItem, ServiceItem, DifferentialItem } from '../types';

export interface HeroContent {
  tagline: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  backgroundImage: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  badge1: string;
  badge2: string;
  badge3: string;
}

export interface PillarCard {
  id: string;
  title: string;
  description: string;
  deliverable: string;
  iconName: string;
}

export interface AllInOneContent {
  tagline: string;
  title: string;
  subtitle: string;
  marketTitle: string;
  marketDescription: string;
  marketConsequence: string;
  solutionTitle: string;
  solutionDescription: string;
  solutionConsequence: string;
  pillars: PillarCard[];
}

export interface TimelineContent {
  tagline: string;
  title: string;
  subtitle: string;
  steps: StepItem[];
}

export interface ServicesContent {
  tagline: string;
  title: string;
  subtitle: string;
  services: ServiceItem[];
}

export interface PortfolioContent {
  tagline: string;
  title: string;
  subtitle: string;
}

export interface DifferentialsContent {
  tagline: string;
  title: string;
  subtitle: string;
  items: DifferentialItem[];
}

export interface AboutContent {
  tagline: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  image: string;
  imageBadgeCategory: string;
  imageBadgeText: string;
  missionTitle: string;
  missionText: string;
  valuesTitle: string;
  valuesList: string[];
  teamTitle: string;
  teamText: string;
  teamLocation: string;
}

export interface ContactContent {
  tagline: string;
  title: string;
  subtitle: string;
  officeAddress: string;
  officeMapsUrl: string;
  openingHours: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  whatsappDefaultMessage: string;
  emailContact: string;
  instagramHandle: string;
  instagramUrl: string;
}

export interface SiteContent {
  hero: HeroContent;
  allInOne: AllInOneContent;
  timeline: TimelineContent;
  services: ServicesContent;
  portfolio: PortfolioContent;
  differentials: DifferentialsContent;
  about: AboutContent;
  contact: ContactContent;
}

export type SectionTabKey = 
  | 'inicio'
  | 'portfolio'
  | 'solucao-completa'
  | 'etapas-obra'
  | 'servicos'
  | 'diferenciais'
  | 'sobre'
  | 'contato';
