/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MemberProvider } from './context/MemberContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AllInOneSection } from './components/AllInOneSection';
import { TimelineSection } from './components/TimelineSection';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { WhyUsSection } from './components/WhyUsSection';
import { AboutSection } from './components/AboutSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { ContactFormSection } from './components/ContactFormSection';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { BudgetModal } from './components/BudgetModal';
import { MemberLoginModal } from './components/MemberLoginModal';
import { ProjectEditorModal } from './components/ProjectEditorModal';
import { CompanyConfigEditorModal } from './components/CompanyConfigEditorModal';
import { MemberAdminToolbar } from './components/MemberAdminToolbar';
import { SiteEditorModal } from './components/SiteEditorModal';
import { SupabaseManagerModal } from './components/SupabaseManagerModal';
import { useMember } from './context/MemberContext';

function MainAppContent() {
  const { isSupabaseConfigModalOpen, closeSupabaseConfigModal } = useMember();
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [prefilledService, setPrefilledService] = useState<string>('Projeto + construção');
  const [prefilledProject, setPrefilledProject] = useState<string>('');

  const handleOpenBudgetModal = (projectName?: string) => {
    if (projectName) {
      setPrefilledProject(projectName);
    }
    setIsBudgetModalOpen(true);
  };

  const handleSelectServiceForBudget = (serviceName: string) => {
    setPrefilledService(serviceName);
    setIsBudgetModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-amber-500/20 selection:text-amber-900 font-sans">
      {/* Fixed Navbar with quick actions, brand emblem, and Membros link */}
      <Navbar onOpenBudgetModal={() => handleOpenBudgetModal()} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero / Primeira Dobra com vista panorâmica e azul oceânico com transparência */}
        <HeroSection
          onOpenBudgetModal={() => handleOpenBudgetModal()}
        />

        {/* 2. Seção de Portfólio: "Projetos que saíram do papel" (Diretamente abaixo da página inicial) */}
        <PortfolioSection onOpenBudgetModal={handleOpenBudgetModal} />

        {/* 3. Seção "Construa sem complicação: Tudo o que sua obra precisa em um só lugar" */}
        <AllInOneSection onOpenBudgetModal={() => handleOpenBudgetModal()} />

        {/* 4. Seção "Do Terreno à Entrega" (Timeline visual elegante das 6 etapas) */}
        <TimelineSection onOpenBudgetModal={() => handleOpenBudgetModal()} />

        {/* 5. Seção de Serviços: "Soluções para construir do seu jeito" */}
        <ServicesSection onSelectServiceForBudget={handleSelectServiceForBudget} />

        {/* 6. Seção "Por que Transformar?": "Construir pode ser uma experiência mais tranquila" */}
        <WhyUsSection />

        {/* 7. Seção Sobre a Empresa: "Transformar é construir mais do que casas" */}
        <AboutSection />

        {/* 8. Seção de Depoimentos: "Quem constrói com a Transformar, recomenda" */}
        <TestimonialsSection />

        {/* 9. Seção de Perguntas Frequentes & Diretrizes de Obra em Maricá */}
        <FaqSection />

        {/* 10. Chamada para Orçamento & Formulário de Contato Completo */}
        <ContactFormSection
          prefilledService={prefilledService}
          prefilledProjectName={prefilledProject}
        />
      </main>

      {/* Rodapé Completo */}
      <Footer />

      {/* Botão Flutuante de WhatsApp Permanente com "Fale com um especialista" */}
      <WhatsAppButton />

      {/* Barra de Ações Rápidas do Membro (aparece quando logado como Rafael) */}
      <MemberAdminToolbar />

      {/* Modal de Login / Perfil da Área de Membros */}
      <MemberLoginModal />

      {/* Modal Interativo de Criação e Edição de Obras do Portfólio */}
      <ProjectEditorModal />

      {/* Modal Interativo de Configurações da Empresa (WhatsApp, Redes, Telefones) */}
      <CompanyConfigEditorModal />

      {/* Modal Geral de Edição de Conteúdo de Todas as Abas (CRUD do Site) */}
      <SiteEditorModal />

      {/* Modal de Gestão, Verificação e Configuração do Supabase */}
      <SupabaseManagerModal
        isOpen={isSupabaseConfigModalOpen}
        onClose={closeSupabaseConfigModal}
      />

      {/* Modal Interativo de Solicitação de Orçamento Rápido */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => {
          setIsBudgetModalOpen(false);
          setPrefilledProject('');
        }}
        initialService={prefilledService}
        initialProject={prefilledProject}
      />
    </div>
  );
}

export default function App() {
  return (
    <MemberProvider>
      <MainAppContent />
    </MemberProvider>
  );
}

