import React, { createContext, useContext, useState, useEffect } from 'react';
import { MemberUser, validateMemberCredentials, AUTHORIZED_MEMBERS } from '../data/authorizedMembers';
import { Project } from '../types';
import { PORTFOLIO_PROJECTS, COMPANY_CONFIG } from '../data/companyData';
import { SiteContent, SectionTabKey } from '../types/siteContent';
import { DEFAULT_SITE_CONTENT } from '../data/defaultSiteContent';

interface MemberContextType {
  currentMember: MemberUser | null;
  isLoggedIn: boolean;
  login: (identifier: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  
  // Login modal
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;

  // Project Editor state & actions
  projects: Project[];
  isProjectModalOpen: boolean;
  editingProject: Project | null;
  openNewProjectModal: () => void;
  openEditProjectModal: (project: Project) => void;
  closeProjectModal: () => void;
  saveProject: (projectData: Project) => void;
  deleteProject: (projectId: string) => void;
  resetProjectsToDefault: () => void;

  // Company Info Editor
  companyConfig: typeof COMPANY_CONFIG;
  isCompanyModalOpen: boolean;
  openCompanyModal: () => void;
  closeCompanyModal: () => void;
  saveCompanyConfig: (newConfig: typeof COMPANY_CONFIG) => void;
  resetCompanyConfig: () => void;

  // Universal Site Content Manager (All Tabs/Sections)
  siteContent: SiteContent;
  isSiteEditorOpen: boolean;
  activeEditorTab: SectionTabKey;
  openSiteEditor: (tab?: SectionTabKey) => void;
  closeSiteEditor: () => void;
  setActiveEditorTab: (tab: SectionTabKey) => void;
  updateSiteSection: <K extends keyof SiteContent>(section: K, data: Partial<SiteContent[K]>) => void;
  resetSiteSection: (section: keyof SiteContent) => void;
  resetAllSiteContent: () => void;

  // Source code & Supabase sync status
  isSyncingSourceCode: boolean;
  sourceCodeSyncNotice: { message: string; type: 'success' | 'error' } | null;
  clearSyncNotice: () => void;
  supabaseStatus: {
    configured: boolean;
    database?: boolean;
    storage?: boolean;
    url?: string;
    details?: string;
    bucketName?: string;
  } | null;
  refreshSupabaseStatus: () => Promise<void>;
}

const STORAGE_AUTH_KEY = 'transformar_member_auth_session';
const STORAGE_PROJECTS_KEY = 'transformar_saved_portfolio_projects';
const STORAGE_CONFIG_KEY = 'transformar_saved_company_config';
const STORAGE_SITE_CONTENT_KEY = 'transformar_saved_site_content_v2';

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Member authentication state - ALWAYS starts logged out on page load / refresh
  // When reloading the page, the user is always outside the member area and must log in again.
  const [currentMember, setCurrentMember] = useState<MemberUser | null>(() => {
    try {
      localStorage.removeItem(STORAGE_AUTH_KEY);
    } catch {
      // fallback
    }
    return null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure first project demonstrates short video capability seamlessly
          return parsed.map((p: Project, idx: number) => {
            if (idx === 0 && !p.gallery.some((url: string) => url.includes('.mp4') || url.startsWith('data:video/'))) {
              return {
                ...p,
                gallery: [
                  'https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-house-exterior-tour-4866-large.mp4',
                  ...p.gallery
                ]
              };
            }
            return p;
          });
        }
      }
    } catch (e) {
      console.error('Erro ao carregar projetos do cache local:', e);
    }
    return PORTFOLIO_PROJECTS;
  });

  // Project modal state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Company info state
  const [companyConfig, setCompanyConfig] = useState<typeof COMPANY_CONFIG>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
      if (saved) {
        return { ...COMPANY_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Erro ao carregar configurações da empresa:', e);
    }
    return COMPANY_CONFIG;
  });
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // Universal Site Content state (all sections and tabs)
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SITE_CONTENT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SITE_CONTENT,
          ...parsed,
          hero: { ...DEFAULT_SITE_CONTENT.hero, ...(parsed.hero || {}) },
          allInOne: { ...DEFAULT_SITE_CONTENT.allInOne, ...(parsed.allInOne || {}) },
          timeline: { ...DEFAULT_SITE_CONTENT.timeline, ...(parsed.timeline || {}) },
          services: { ...DEFAULT_SITE_CONTENT.services, ...(parsed.services || {}) },
          portfolio: { ...DEFAULT_SITE_CONTENT.portfolio, ...(parsed.portfolio || {}) },
          differentials: { ...DEFAULT_SITE_CONTENT.differentials, ...(parsed.differentials || {}) },
          about: { ...DEFAULT_SITE_CONTENT.about, ...(parsed.about || {}) },
          contact: { ...DEFAULT_SITE_CONTENT.contact, ...(parsed.contact || {}) }
        };
      }
    } catch (e) {
      console.error('Erro ao carregar conteúdo do site:', e);
    }
    return DEFAULT_SITE_CONTENT;
  });

  const [isSiteEditorOpen, setIsSiteEditorOpen] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState<SectionTabKey>('inicio');

  // Source code & Supabase synchronization indicator
  const [isSyncingSourceCode, setIsSyncingSourceCode] = useState(false);
  const [sourceCodeSyncNotice, setSourceCodeSyncNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<MemberContextType['supabaseStatus']>(null);

  const clearSyncNotice = () => setSourceCodeSyncNotice(null);

  const showSyncNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setSourceCodeSyncNotice({ message, type });
    setTimeout(() => {
      setSourceCodeSyncNotice(null);
    }, 5000);
  };

  const refreshSupabaseStatus = async () => {
    try {
      const res = await fetch('/api/supabase-status');
      const data = await res.json();
      setSupabaseStatus(data);
    } catch {
      // ignore
    }
  };

  // Asynchronously synchronize site content with Supabase PostgreSQL & source code file
  const syncSiteContentToSourceCode = async (newContent: SiteContent) => {
    setIsSyncingSourceCode(true);
    try {
      const res = await fetch('/api/save-site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteContent: newContent })
      });
      const data = await res.json();
      if (data.success) {
        showSyncNotification(data.message || 'Conteúdo salvo no Supabase PostgreSQL e gravado no código-fonte!');
      } else {
        console.warn('Servidor retornou erro ao gravar conteúdo:', data.error);
        showSyncNotification(data.error || 'Erro ao gravar conteúdo', 'error');
      }
    } catch (e) {
      console.error('Falha ao comunicar com o servidor:', e);
      showSyncNotification('Erro de conexão com o servidor', 'error');
    } finally {
      setIsSyncingSourceCode(false);
    }
  };

  // Asynchronously synchronize company config with Supabase PostgreSQL & source code file
  const syncCompanyConfigToSourceCode = async (newConfig: typeof COMPANY_CONFIG) => {
    setIsSyncingSourceCode(true);
    try {
      const res = await fetch('/api/save-company-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyConfig: newConfig })
      });
      const data = await res.json();
      if (data.success) {
        showSyncNotification(data.message || 'Configuração salva no Supabase PostgreSQL e no código-fonte!');
      } else {
        showSyncNotification(data.error || 'Erro ao gravar configurações', 'error');
      }
    } catch (e) {
      console.error('Falha ao gravar companyConfig:', e);
      showSyncNotification('Erro ao conectar com o servidor', 'error');
    } finally {
      setIsSyncingSourceCode(false);
    }
  };

  // Asynchronously synchronize projects with Supabase PostgreSQL & source code file
  const syncProjectsToSourceCode = async (newProjects: Project[]) => {
    setIsSyncingSourceCode(true);
    try {
      const res = await fetch('/api/save-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: newProjects })
      });
      const data = await res.json();
      if (data.success) {
        showSyncNotification(data.message || 'Projetos salvos no Supabase PostgreSQL e no código-fonte!');
      } else {
        showSyncNotification(data.error || 'Erro ao gravar projetos', 'error');
      }
    } catch (e) {
      console.error('Falha ao gravar projetos:', e);
      showSyncNotification('Erro ao conectar com o servidor', 'error');
    } finally {
      setIsSyncingSourceCode(false);
    }
  };

  // Synchronize projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Falha ao salvar projetos localmente:', e);
    }
  }, [projects]);

  // Synchronize company config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(companyConfig));
    } catch (e) {
      console.error('Falha ao salvar configuração da empresa:', e);
    }
  }, [companyConfig]);

  // Synchronize universal site content to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SITE_CONTENT_KEY, JSON.stringify(siteContent));
    } catch (e) {
      console.error('Falha ao salvar conteúdo do site:', e);
    }
  }, [siteContent]);

  // Clear any leftover session keys on initial mount to guarantee public view on refresh
  // AND fetch the latest remote data from Supabase PostgreSQL so all visitors immediately see the latest updates
  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_AUTH_KEY);
      if (window.location.hash === '#membros' || window.location.hash.includes('membro')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } catch {
      // ignore
    }

    const loadRemoteSiteData = async () => {
      try {
        const res = await fetch('/api/site-data');
        const json = await res.json();
        if (json.success) {
          if (json.supabase) {
            setSupabaseStatus(json.supabase);
          }
          if (json.data) {
            if (json.data.siteContent) {
              setSiteContent((prev) => ({
                ...prev,
                ...json.data.siteContent,
                hero: { ...prev.hero, ...(json.data.siteContent.hero || {}) },
                allInOne: { ...prev.allInOne, ...(json.data.siteContent.allInOne || {}) },
                timeline: { ...prev.timeline, ...(json.data.siteContent.timeline || {}) },
                services: { ...prev.services, ...(json.data.siteContent.services || {}) },
                portfolio: { ...prev.portfolio, ...(json.data.siteContent.portfolio || {}) },
                differentials: { ...prev.differentials, ...(json.data.siteContent.differentials || {}) },
                about: { ...prev.about, ...(json.data.siteContent.about || {}) },
                contact: { ...prev.contact, ...(json.data.siteContent.contact || {}) },
              }));
            }
            if (json.data.companyConfig) {
              setCompanyConfig((prev) => ({
                ...prev,
                ...json.data.companyConfig,
              }));
            }
            if (Array.isArray(json.data.projects) && json.data.projects.length > 0) {
              setProjects(json.data.projects);
            }
            console.log(
              `[CONSTRUTORA] Dados carregados via ${json.source === 'supabase' ? 'Supabase PostgreSQL' : 'código-fonte'}.`
            );
          }
        }
      } catch (err) {
        console.warn('Não foi possível carregar dados do servidor:', err);
      }
    };

    loadRemoteSiteData();
    refreshSupabaseStatus();
  }, []);

  // Authentication methods
  // Note: Session is strictly in-memory. If user reloads/refreshes the page,
  // they are automatically redirected outside the member area and must login again.
  const login = (identifier: string, passwordAttempt: string) => {
    const user = validateMemberCredentials(identifier, passwordAttempt);
    if (user) {
      setCurrentMember(user);
      setIsLoginModalOpen(false);
      return { success: true };
    }
    return {
      success: false,
      message: 'Nome de usuário, e-mail ou senha incorretos. Acesso restrito a membros autorizados.'
    };
  };

  const logout = () => {
    setCurrentMember(null);
    setIsLoginModalOpen(false);
    setIsSiteEditorOpen(false);
    setIsProjectModalOpen(false);
    setIsCompanyModalOpen(false);
    try {
      localStorage.removeItem(STORAGE_AUTH_KEY);
    } catch {
      // ignore
    }
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  // Project editor methods
  const openNewProjectModal = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (project: Project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const saveProject = (projectData: Project) => {
    setProjects((prev) => {
      const existsIndex = prev.findIndex((p) => p.id === projectData.id);
      let updated: Project[];
      if (existsIndex >= 0) {
        // Update existing
        updated = [...prev];
        updated[existsIndex] = projectData;
      } else {
        // Prepend new project so it immediately shows up first
        updated = [projectData, ...prev];
      }
      syncProjectsToSourceCode(updated);
      return updated;
    });
    closeProjectModal();
  };

  const deleteProject = (projectId: string) => {
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== projectId);
      syncProjectsToSourceCode(updated);
      return updated;
    });
    closeProjectModal();
    showSyncNotification('Obra excluída com sucesso do portfólio!');
  };

  const resetProjectsToDefault = () => {
    setProjects(PORTFOLIO_PROJECTS);
    syncProjectsToSourceCode(PORTFOLIO_PROJECTS);
    try {
      localStorage.removeItem(STORAGE_PROJECTS_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // Company info methods
  const openCompanyModal = () => setIsCompanyModalOpen(true);
  const closeCompanyModal = () => setIsCompanyModalOpen(false);

  const saveCompanyConfig = (newConfig: typeof COMPANY_CONFIG) => {
    setCompanyConfig(newConfig);
    syncCompanyConfigToSourceCode(newConfig);
    // Keep siteContent.contact in sync
    setSiteContent(prev => {
      const updated = {
        ...prev,
        contact: {
          ...prev.contact,
          officeAddress: newConfig.OFFICE_ADDRESS,
          officeMapsUrl: newConfig.OFFICE_MAPS_URL,
          openingHours: newConfig.OPENING_HOURS,
          whatsappNumber: newConfig.WHATSAPP_NUMBER,
          whatsappDisplay: newConfig.WHATSAPP_DISPLAY,
          whatsappDefaultMessage: newConfig.WHATSAPP_DEFAULT_MESSAGE,
          emailContact: newConfig.EMAIL_CONTACT,
          instagramHandle: newConfig.INSTAGRAM_HANDLE,
          instagramUrl: newConfig.INSTAGRAM_URL
        }
      };
      syncSiteContentToSourceCode(updated);
      return updated;
    });
    setIsCompanyModalOpen(false);
  };

  const resetCompanyConfig = () => {
    setCompanyConfig(COMPANY_CONFIG);
    syncCompanyConfigToSourceCode(COMPANY_CONFIG);
    try {
      localStorage.removeItem(STORAGE_CONFIG_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // Universal Site Editor actions
  const openSiteEditor = (tab?: SectionTabKey) => {
    if (tab) {
      setActiveEditorTab(tab);
    }
    setIsSiteEditorOpen(true);
  };

  const closeSiteEditor = () => {
    setIsSiteEditorOpen(false);
  };

  const updateSiteSection = <K extends keyof SiteContent>(
    section: K, 
    data: Partial<SiteContent[K]>
  ) => {
    setSiteContent((prev) => {
      const updated = {
        ...prev,
        [section]: {
          ...prev[section],
          ...data
        }
      };
      // If contact was updated, also update companyConfig for backwards compatibility
      if (section === 'contact') {
        const contactData = updated.contact;
        const newCompanyConfig = {
          ...companyConfig,
          OFFICE_ADDRESS: contactData.officeAddress || companyConfig.OFFICE_ADDRESS,
          OFFICE_MAPS_URL: contactData.officeMapsUrl || companyConfig.OFFICE_MAPS_URL,
          OPENING_HOURS: contactData.openingHours || companyConfig.OPENING_HOURS,
          WHATSAPP_NUMBER: contactData.whatsappNumber || companyConfig.WHATSAPP_NUMBER,
          WHATSAPP_DISPLAY: contactData.whatsappDisplay || companyConfig.WHATSAPP_DISPLAY,
          WHATSAPP_DEFAULT_MESSAGE: contactData.whatsappDefaultMessage || companyConfig.WHATSAPP_DEFAULT_MESSAGE,
          EMAIL_CONTACT: contactData.emailContact || companyConfig.EMAIL_CONTACT,
          INSTAGRAM_HANDLE: contactData.instagramHandle || companyConfig.INSTAGRAM_HANDLE,
          INSTAGRAM_URL: contactData.instagramUrl || companyConfig.INSTAGRAM_URL
        };
        setCompanyConfig(newCompanyConfig);
        syncCompanyConfigToSourceCode(newCompanyConfig);
      }
      syncSiteContentToSourceCode(updated);
      return updated;
    });
  };

  const resetSiteSection = (section: keyof SiteContent) => {
    setSiteContent((prev) => {
      const updated = {
        ...prev,
        [section]: DEFAULT_SITE_CONTENT[section]
      };
      syncSiteContentToSourceCode(updated);
      return updated;
    });
  };

  const resetAllSiteContent = () => {
    setSiteContent(DEFAULT_SITE_CONTENT);
    syncSiteContentToSourceCode(DEFAULT_SITE_CONTENT);
    try {
      localStorage.removeItem(STORAGE_SITE_CONTENT_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <MemberContext.Provider
      value={{
        currentMember,
        isLoggedIn: !!currentMember,
        login,
        logout,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        projects,
        isProjectModalOpen,
        editingProject,
        openNewProjectModal,
        openEditProjectModal,
        closeProjectModal,
        saveProject,
        deleteProject,
        resetProjectsToDefault,
        companyConfig,
        isCompanyModalOpen,
        openCompanyModal,
        closeCompanyModal,
        saveCompanyConfig,
        resetCompanyConfig,
        siteContent,
        isSiteEditorOpen,
        activeEditorTab,
        openSiteEditor,
        closeSiteEditor,
        setActiveEditorTab,
        updateSiteSection,
        resetSiteSection,
        resetAllSiteContent,
        isSyncingSourceCode,
        sourceCodeSyncNotice,
        clearSyncNotice,
        supabaseStatus,
        refreshSupabaseStatus
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};

export const useMember = (): MemberContextType => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMember deve ser utilizado dentro de um MemberProvider');
  }
  return context;
};

