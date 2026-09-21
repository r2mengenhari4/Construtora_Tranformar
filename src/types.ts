export type ProjectCategory = 'Todos' | 'Arquitetura' | 'Construção' | 'Reformas' | 'Interiores';

export type ProjectStatus = 'Concluído' | 'Em Obras' | 'Em Projeto';

export interface ProjectAmenity {
  icon: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  location: string;
  category: 'Arquitetura' | 'Construção' | 'Reformas' | 'Interiores';
  status: ProjectStatus;
  area: string;
  bedrooms: string;
  suites: string;
  tagline: string;
  description: string;
  features: string[];
  mainImage: string;
  gallery: string[];
  amenities: ProjectAmenity[];
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  icon: string;
  tag: string;
}

export interface StepItem {
  number: string;
  title: string;
  description: string;
  deliverable: string;
  icon: string;
  image?: string;
}

export interface DifferentialItem {
  title: string;
  description: string;
  icon: string;
  detail: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  neighborhood: string;
  rating: number;
  projectType: string;
  quote: string;
  avatarUrl?: string;
  date: string;
  isPlaceholder?: boolean;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  neighborhood: string;
  hasLand: string;
  serviceNeeded: string;
  message: string;
}
