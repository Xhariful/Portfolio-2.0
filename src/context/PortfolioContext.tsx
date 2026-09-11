import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PortfolioData,
  ProfileData,
  StatItem,
  SkillCategory,
  ServiceItem,
  ProjectItem,
  EducationItem,
  WorkExperienceItem,
  CertificationItem,
  TestimonialItem,
  AchievementItem,
  SecurityConfig,
  AuthenticatedUser,
} from '../types';
import { initialPortfolioData } from '../data/content';

const STORAGE_KEY = 'shariful_portfolio_dynamic_data_v3';
const SECURITY_STORAGE_KEY = 'shariful_portfolio_security_auth_v3';
const AUTH_SESSION_KEY = 'shariful_portfolio_session_token_v3';

const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  credentials: {
    adminUsername: 'admin',
    adminPasswordHash: 'shariful@2025',
    salt: 'portfolio-salt-2025',
    isCredentialsCustomized: false,
    updatedAt: new Date().toISOString(),
  },
  collaboratorKeys: [
    {
      id: 'key-1',
      key: 'ASSISTANT-2025',
      label: 'Assistant Editor',
      createdAt: '2025-01-01',
      active: true,
    },
  ],
};

interface PortfolioContextType {
  data: PortfolioData;
  isDashboardOpen: boolean;
  setIsDashboardOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  openAdminPortal: () => void;
  
  // Security & Auth
  securityConfig: SecurityConfig;
  currentUser: AuthenticatedUser | null;
  isAuthenticated: boolean;
  login: (usernameOrKey: string, password?: string, remember?: boolean) => { success: boolean; message?: string };
  logout: () => void;
  updateAdminCredentials: (oldPass: string, newUsername: string, newPass: string) => { success: boolean; message?: string };
  addCollaboratorKey: (label: string, customKey?: string) => string;
  toggleCollaboratorKey: (id: string) => void;
  deleteCollaboratorKey: (id: string) => void;

  // Update functions
  updateProfile: (profile: Partial<ProfileData>) => void;
  updateStats: (stats: StatItem[]) => void;
  updateSkillCategories: (categories: SkillCategory[]) => void;
  updateServices: (services: ServiceItem[]) => void;
  updateProjects: (projects: ProjectItem[]) => void;
  updateEducation: (education: EducationItem[]) => void;
  updateWorkTimeline: (workTimeline: WorkExperienceItem[]) => void;
  updateCertifications: (certifications: CertificationItem[]) => void;
  updateTestimonials: (testimonials: TestimonialItem[]) => void;
  updateAchievements: (achievements: AchievementItem[]) => void;
  
  // Education Helpers
  addEducation: (item: EducationItem) => void;
  editEducation: (id: string, updated: Partial<EducationItem>) => void;
  deleteEducation: (id: string) => void;

  // Project Helpers
  addProject: (item: ProjectItem) => void;
  editProject: (slug: string, updated: Partial<ProjectItem>) => void;
  deleteProject: (slug: string) => void;

  // Service Helpers
  addService: (item: ServiceItem) => void;
  editService: (id: string, updated: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;

  // Experience Helpers
  addExperience: (item: WorkExperienceItem) => void;
  editExperience: (id: string, updated: Partial<WorkExperienceItem>) => void;
  deleteExperience: (id: string) => void;

  // Import / Export / Reset
  resetToDefault: () => void;
  importData: (jsonData: string) => boolean;
  exportData: () => string;

  // Toast feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Portfolio Dynamic Content Data
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialPortfolioData,
          ...parsed,
          profile: { ...initialPortfolioData.profile, ...(parsed.profile || {}) },
          education: parsed.education && parsed.education.length > 0 ? parsed.education : initialPortfolioData.education,
        };
      }
    } catch (e) {
      console.error('Error loading portfolio data from localStorage', e);
    }
    return initialPortfolioData;
  });

  // 2. Security Configuration State
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>(() => {
    try {
      const saved = localStorage.getItem(SECURITY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SECURITY_CONFIG,
          ...parsed,
          credentials: {
            ...DEFAULT_SECURITY_CONFIG.credentials,
            ...(parsed.credentials || {}),
          },
          collaboratorKeys: parsed.collaboratorKeys || DEFAULT_SECURITY_CONFIG.collaboratorKeys,
        };
      }
    } catch (e) {
      console.error('Error reading security config', e);
    }
    return DEFAULT_SECURITY_CONFIG;
  });

  // 3. Authenticated Session User State
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(() => {
    try {
      const session = sessionStorage.getItem(AUTH_SESSION_KEY) || localStorage.getItem(AUTH_SESSION_KEY);
      if (session) {
        return JSON.parse(session);
      }
    } catch (e) {
      console.error('Error reading session auth', e);
    }
    return null;
  });

  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isAuthenticated = Boolean(currentUser);

  // Sync data with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving portfolio data to localStorage', e);
    }
  }, [data]);

  // Sync security configuration
  useEffect(() => {
    try {
      localStorage.setItem(SECURITY_STORAGE_KEY, JSON.stringify(securityConfig));
    } catch (e) {
      console.error('Error saving security config', e);
    }
  }, [securityConfig]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  // Open Admin Entry point (Routes either to dashboard if logged in, or login popup if not)
  const openAdminPortal = useCallback(() => {
    if (currentUser) {
      setIsDashboardOpen(true);
      setIsLoginModalOpen(false);
    } else {
      setIsLoginModalOpen(true);
      setIsDashboardOpen(false);
    }
  }, [currentUser]);

  // Global URL routing handler for /admin or #admin
  useEffect(() => {
    const checkAdminPath = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      if (path.includes('/admin') || hash === '#admin' || search.includes('admin=true')) {
        // Clean URL to keep standard presentation if desired
        if (hash === '#admin') {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        openAdminPortal();
      }
    };

    // Run on mount
    checkAdminPath();

    // Listen for hash changes or popstate
    window.addEventListener('hashchange', checkAdminPath);
    window.addEventListener('popstate', checkAdminPath);

    // Keyboard shortcut fallback (Ctrl + Shift + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        openAdminPortal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkAdminPath);
      window.removeEventListener('popstate', checkAdminPath);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openAdminPortal]);

  // Login handler
  const login = useCallback(
    (usernameOrKey: string, password?: string, remember: boolean = true): { success: boolean; message?: string } => {
      const cleanUsernameOrKey = usernameOrKey.trim();
      const cleanPassword = password ? password.trim() : '';

      // 1. Check Master Admin Credentials
      if (cleanPassword) {
        const expectedUser = securityConfig.credentials.adminUsername.toLowerCase();
        const expectedPass = securityConfig.credentials.adminPasswordHash;

        if (cleanUsernameOrKey.toLowerCase() === expectedUser && cleanPassword === expectedPass) {
          const userObj: AuthenticatedUser = {
            username: securityConfig.credentials.adminUsername,
            role: 'admin',
            keyLabel: 'Master Administrator',
            authenticatedAt: new Date().toISOString(),
          };

          setCurrentUser(userObj);
          if (remember) {
            localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(userObj));
          } else {
            sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(userObj));
          }

          setIsLoginModalOpen(false);
          setIsDashboardOpen(true);
          return { success: true };
        }
      }

      // 2. Check Collaborator / Access Key
      const keyMatch = securityConfig.collaboratorKeys.find(
        (k) => k.key.toUpperCase() === cleanUsernameOrKey.toUpperCase() || k.key.toUpperCase() === cleanPassword.toUpperCase()
      );

      if (keyMatch) {
        if (!keyMatch.active) {
          return { success: false, message: 'This access key has been suspended by the administrator.' };
        }

        const userObj: AuthenticatedUser = {
          username: keyMatch.label,
          role: 'collaborator',
          keyLabel: `Key: ${keyMatch.label}`,
          authenticatedAt: new Date().toISOString(),
        };

        setCurrentUser(userObj);
        if (remember) {
          localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(userObj));
        } else {
          sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(userObj));
        }

        setIsLoginModalOpen(false);
        setIsDashboardOpen(true);
        return { success: true };
      }

      return { success: false, message: 'Invalid username or password. Please try again.' };
    },
    [securityConfig]
  );

  // Logout handler
  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    setIsDashboardOpen(false);
    showToast('You have been logged out securely.');
  }, [showToast]);

  // Update Master Credentials (Username & Password)
  const updateAdminCredentials = useCallback(
    (oldPass: string, newUsername: string, newPass: string): { success: boolean; message?: string } => {
      if (oldPass !== securityConfig.credentials.adminPasswordHash) {
        return { success: false, message: 'Current master password does not match.' };
      }

      if (!newUsername.trim()) {
        return { success: false, message: 'Username cannot be empty.' };
      }

      if (newPass.length < 6) {
        return { success: false, message: 'New password must be at least 6 characters.' };
      }

      setSecurityConfig((prev) => ({
        ...prev,
        credentials: {
          ...prev.credentials,
          adminUsername: newUsername.trim(),
          adminPasswordHash: newPass,
          isCredentialsCustomized: true,
          updatedAt: new Date().toISOString(),
        },
      }));

      // Update current user session if currently logged in
      setCurrentUser((prev) => (prev ? { ...prev, username: newUsername.trim() } : null));

      showToast('Admin credentials updated successfully!');
      return { success: true };
    },
    [securityConfig, showToast]
  );

  // Add Collaborator Key
  const addCollaboratorKey = useCallback((label: string, customKey?: string): string => {
    const key = customKey?.trim().toUpperCase() || `KEY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newKey = {
      id: `collab-${Date.now()}`,
      key,
      label: label.trim() || 'Guest Collaborator',
      createdAt: new Date().toISOString().split('T')[0],
      active: true,
    };

    setSecurityConfig((prev) => ({
      ...prev,
      collaboratorKeys: [newKey, ...prev.collaboratorKeys],
    }));

    showToast(`Access Key [${key}] created!`);
    return key;
  }, [showToast]);

  const toggleCollaboratorKey = useCallback((id: string) => {
    setSecurityConfig((prev) => ({
      ...prev,
      collaboratorKeys: prev.collaboratorKeys.map((k) => (k.id === id ? { ...k, active: !k.active } : k)),
    }));
    showToast('Key status toggled.');
  }, [showToast]);

  const deleteCollaboratorKey = useCallback((id: string) => {
    setSecurityConfig((prev) => ({
      ...prev,
      collaboratorKeys: prev.collaboratorKeys.filter((k) => k.id !== id),
    }));
    showToast('Key deleted permanently.');
  }, [showToast]);

  // Content Updaters
  const updateProfile = (updatedProfile: Partial<ProfileData>) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updatedProfile },
    }));
    showToast('Profile updated successfully!');
  };

  const updateStats = (stats: StatItem[]) => {
    setData((prev) => ({ ...prev, stats }));
    showToast('Key statistics updated!');
  };

  const updateSkillCategories = (skillCategories: SkillCategory[]) => {
    setData((prev) => ({ ...prev, skillCategories }));
    showToast('Skills matrix updated!');
  };

  const updateServices = (services: ServiceItem[]) => {
    setData((prev) => ({ ...prev, services }));
    showToast('Services updated!');
  };

  const updateProjects = (projects: ProjectItem[]) => {
    setData((prev) => ({ ...prev, projects }));
    showToast('Projects updated!');
  };

  const updateEducation = (education: EducationItem[]) => {
    setData((prev) => ({ ...prev, education }));
    showToast('Education background updated!');
  };

  const updateWorkTimeline = (workTimeline: WorkExperienceItem[]) => {
    setData((prev) => ({ ...prev, workTimeline }));
    showToast('Work experience updated!');
  };

  const updateCertifications = (certifications: CertificationItem[]) => {
    setData((prev) => ({ ...prev, certifications }));
    showToast('Certifications updated!');
  };

  const updateTestimonials = (testimonials: TestimonialItem[]) => {
    setData((prev) => ({ ...prev, testimonials }));
    showToast('Testimonials updated!');
  };

  const updateAchievements = (achievements: AchievementItem[]) => {
    setData((prev) => ({ ...prev, achievements }));
    showToast('Achievements updated!');
  };

  // Education Helpers
  const addEducation = (item: EducationItem) => {
    setData((prev) => ({
      ...prev,
      education: [item, ...prev.education],
    }));
    showToast('New degree added!');
  };

  const editEducation = (id: string, updated: Partial<EducationItem>) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, ...updated } : edu)),
    }));
    showToast('Degree details saved!');
  };

  const deleteEducation = (id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
    showToast('Degree removed.');
  };

  // Project Helpers
  const addProject = (item: ProjectItem) => {
    setData((prev) => ({
      ...prev,
      projects: [item, ...prev.projects],
    }));
    showToast('Project added to portfolio!');
  };

  const editProject = (slug: string, updated: Partial<ProjectItem>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.slug === slug ? { ...p, ...updated } : p)),
    }));
    showToast('Project updated!');
  };

  const deleteProject = (slug: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.slug !== slug),
    }));
    showToast('Project deleted.');
  };

  // Service Helpers
  const addService = (item: ServiceItem) => {
    setData((prev) => ({
      ...prev,
      services: [...prev.services, item],
    }));
    showToast('New service created!');
  };

  const editService = (id: string, updated: Partial<ServiceItem>) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, ...updated } : s)),
    }));
    showToast('Service saved!');
  };

  const deleteService = (id: string) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }));
    showToast('Service removed.');
  };

  // Experience Helpers
  const addExperience = (item: WorkExperienceItem) => {
    const newItem = { ...item, id: item.id || `exp-${Date.now()}` };
    setData((prev) => ({
      ...prev,
      workTimeline: [newItem, ...prev.workTimeline],
    }));
    showToast('Experience added!');
  };

  const editExperience = (id: string, updated: Partial<WorkExperienceItem>) => {
    setData((prev) => ({
      ...prev,
      workTimeline: prev.workTimeline.map((exp) => (exp.id === id || exp.role === id ? { ...exp, ...updated } : exp)),
    }));
    showToast('Experience updated!');
  };

  const deleteExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      workTimeline: prev.workTimeline.filter((exp) => exp.id !== id && exp.role !== id),
    }));
    showToast('Experience removed.');
  };

  const resetToDefault = () => {
    setData(initialPortfolioData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    showToast('All data reset to defaults!');
  };

  const importData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed && typeof parsed === 'object' && parsed.profile) {
        setData({
          ...initialPortfolioData,
          ...parsed,
        });
        showToast('Backup data imported successfully!');
        return true;
      }
    } catch (e) {
      console.error('Import failed', e);
      showToast('Invalid JSON file format.');
    }
    return false;
  };

  const exportData = (): string => {
    return JSON.stringify(data, null, 2);
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isDashboardOpen,
        setIsDashboardOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        openAdminPortal,
        securityConfig,
        currentUser,
        isAuthenticated,
        login,
        logout,
        updateAdminCredentials,
        addCollaboratorKey,
        toggleCollaboratorKey,
        deleteCollaboratorKey,
        updateProfile,
        updateStats,
        updateSkillCategories,
        updateServices,
        updateProjects,
        updateEducation,
        updateWorkTimeline,
        updateCertifications,
        updateTestimonials,
        updateAchievements,
        addEducation,
        editEducation,
        deleteEducation,
        addProject,
        editProject,
        deleteProject,
        addService,
        editService,
        deleteService,
        addExperience,
        editExperience,
        deleteExperience,
        resetToDefault,
        importData,
        exportData,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
