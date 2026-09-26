import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  SeoConfig,
  WelcomePopupConfig,
  BackgroundEffectsConfig,
  AnimatedBeamConfig,
  BeamNodeItem,
  InitialLoaderConfig,
  SecurityConfig,
  AuthenticatedUser,
} from '../types';
import { initialPortfolioData } from '../data/content';
import { db, testFirestoreConnection } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { pauseLenis, resumeLenis } from '../hooks/useLenisScroll';

const STORAGE_KEY = 'shariful_portfolio_dynamic_data_v3';
const SECURITY_STORAGE_KEY = 'shariful_portfolio_security_auth_v3';
const AUTH_SESSION_KEY = 'shariful_portfolio_session_token_v3';

// Firestore collection & document identifiers
const FIRESTORE_PORTFOLIO_DOC = 'global_content';
const FIRESTORE_PORTFOLIO_COLLECTION = 'portfolio';
const FIRESTORE_AUTH_DOC = 'master_credentials';
const FIRESTORE_AUTH_COLLECTION = 'admin_auth';

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
  
  // Cloud Database Sync Status
  isCloudConnected: boolean;
  isSyncingCloud: boolean;
  lastCloudSyncTime: string | null;
  syncToCloudNow: () => Promise<void>;

  // Security & Auth
  securityConfig: SecurityConfig;
  currentUser: AuthenticatedUser | null;
  isAuthenticated: boolean;
  login: (usernameOrKey: string, password?: string, remember?: boolean) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateAdminCredentials: (oldPass: string, newUsername: string, newPass: string) => Promise<{ success: boolean; message?: string }>;
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
  updateSeo: (seo: Partial<SeoConfig>) => void;
  updateWelcomePopup: (config: Partial<WelcomePopupConfig>) => void;
  updateBackgroundEffects: (config: Partial<BackgroundEffectsConfig>) => void;
  updateAnimatedBeam: (config: Partial<AnimatedBeamConfig>) => void;
  updateInitialLoader: (config: Partial<InitialLoaderConfig>) => void;
  
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

  // Certification Helpers
  addCertification: (item: CertificationItem) => void;
  editCertification: (id: string, updated: Partial<CertificationItem>) => void;
  deleteCertification: (id: string) => void;

  // Testimonial Helpers
  addTestimonial: (item: TestimonialItem) => void;
  editTestimonial: (idOrIdx: string | number, updated: Partial<TestimonialItem>) => void;
  deleteTestimonial: (idOrIdx: string | number) => void;

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
  // 1. Portfolio Dynamic Content Data (Initialized from localStorage fallback or initial content)
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const mergedProfile = { ...initialPortfolioData.profile, ...(parsed.profile || {}) };
        if (mergedProfile.role && (mergedProfile.role.includes("Senior Full-Stack") || mergedProfile.role === "Senior Full-Stack Developer & Shopify Architect")) {
          mergedProfile.role = "Senior Shopify Liquid Developer & Full-Stack Developer";
        }
        return {
          ...initialPortfolioData,
          ...parsed,
          profile: mergedProfile,
          seo: { ...initialPortfolioData.seo, ...(parsed.seo || {}) },
          welcomePopup: { ...initialPortfolioData.welcomePopup, ...(parsed.welcomePopup || {}) },
          backgroundEffects: { ...initialPortfolioData.backgroundEffects, ...(parsed.backgroundEffects || {}) },
          animatedBeam: { ...initialPortfolioData.animatedBeam, ...(parsed.animatedBeam || {}) },
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

  // Cloud Database Sync Indicators
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string | null>(null);

  const isAuthenticated = Boolean(currentUser);
  const hasInitializedFromCloud = useRef(false);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  // Save to LocalStorage cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage quota limit reached for full portfolio, clearing old temporary cache items:', e);
      try {
        // Clear redundant keys and retry
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        // non-blocking
      }
    }
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem(SECURITY_STORAGE_KEY, JSON.stringify(securityConfig));
    } catch (e) {
      console.error('Error saving security config', e);
    }
  }, [securityConfig]);

  // Firestore Real-Time Listener & Initial Cloud Fetch
  useEffect(() => {
    let unsubscribePortfolio: (() => void) | null = null;
    let unsubscribeAuth: (() => void) | null = null;

    async function initCloudSync() {
      try {
        const isConnected = await testFirestoreConnection(2500);
        if (!isConnected) {
          console.log('[Cloud DB] Offline or slow connection detected. Seamlessly using local cached portfolio.');
          return;
        }
        setIsCloudConnected(true);

        const portfolioDocRef = doc(db, FIRESTORE_PORTFOLIO_COLLECTION, FIRESTORE_PORTFOLIO_DOC);
        const authDocRef = doc(db, FIRESTORE_AUTH_COLLECTION, FIRESTORE_AUTH_DOC);

        // Helper timeout for mobile networks
        const withTimeout = <T,>(promise: Promise<T>, ms = 3500): Promise<T> => {
          return Promise.race([
            promise,
            new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Firestore operation timeout')), ms))
          ]);
        };

        // 1. Fetch initial portfolio content from cloud
        const portfolioSnap = await withTimeout(getDoc(portfolioDocRef));
        if (portfolioSnap.exists()) {
          const cloudData = portfolioSnap.data() as Partial<PortfolioData>;
          console.log('[Cloud DB] Loaded remote portfolio data from Firestore');
          const mergedProfile = { ...initialPortfolioData.profile, ...(cloudData.profile || {}) };
          // If Firestore still contains the older title, update to Senior Shopify Liquid Developer
          if (mergedProfile.role && (mergedProfile.role.includes("Senior Full-Stack") || mergedProfile.role === "Senior Full-Stack Developer & Shopify Architect")) {
            mergedProfile.role = "Senior Shopify Liquid Developer & Full-Stack Developer";
          }
          setData((prev) => ({
            ...prev,
            ...cloudData,
            profile: mergedProfile,
            seo: { ...prev.seo, ...(cloudData.seo || {}) },
            welcomePopup: { ...prev.welcomePopup, ...(cloudData.welcomePopup || {}) },
            backgroundEffects: { ...initialPortfolioData.backgroundEffects, ...prev.backgroundEffects, ...(cloudData.backgroundEffects || {}) },
            animatedBeam: { ...initialPortfolioData.animatedBeam, ...prev.animatedBeam, ...(cloudData.animatedBeam || {}) },
            initialLoader: { ...initialPortfolioData.initialLoader, ...prev.initialLoader, ...(cloudData.initialLoader || {}) },
          }));
          setLastCloudSyncTime(new Date().toLocaleTimeString());
        } else {
          // If cloud document is not seeded yet, push current master portfolio to cloud so it's globally live
          console.log('[Cloud DB] Seeding initial portfolio content to Cloud Firestore...');
          await setDoc(portfolioDocRef, {
            ...initialPortfolioData,
            updatedAt: new Date().toISOString(),
          });
          setLastCloudSyncTime(new Date().toLocaleTimeString());
        }

        // 2. Fetch remote master credentials & access keys from cloud
        const authSnap = await withTimeout(getDoc(authDocRef));
        if (authSnap.exists()) {
          const cloudAuth = authSnap.data() as Partial<SecurityConfig>;
          console.log('[Cloud DB] Loaded master credentials from Firestore');
          setSecurityConfig((prev) => ({
            ...prev,
            ...cloudAuth,
            credentials: {
              ...prev.credentials,
              ...(cloudAuth.credentials || {}),
            },
            collaboratorKeys: cloudAuth.collaboratorKeys || prev.collaboratorKeys,
          }));
        } else {
          // Seed default master credentials to cloud
          console.log('[Cloud DB] Seeding default credentials to Cloud Firestore...');
          await setDoc(authDocRef, {
            ...DEFAULT_SECURITY_CONFIG,
            updatedAt: new Date().toISOString(),
          });
        }

        hasInitializedFromCloud.current = true;

        // 3. Setup real-time listener for multi-device sync
        unsubscribePortfolio = onSnapshot(portfolioDocRef, (snap) => {
          if (snap.exists()) {
            const remoteData = snap.data() as Partial<PortfolioData>;
            const mergedProfile = { ...initialPortfolioData.profile, ...(remoteData.profile || {}) };
            if (mergedProfile.role && (mergedProfile.role.includes("Senior Full-Stack") || mergedProfile.role === "Senior Full-Stack Developer & Shopify Architect")) {
              mergedProfile.role = "Senior Shopify Liquid Developer & Full-Stack Developer";
            }
            setData((prev) => ({
              ...prev,
              ...remoteData,
              profile: mergedProfile,
              seo: { ...prev.seo, ...(remoteData.seo || {}) },
              welcomePopup: { ...prev.welcomePopup, ...(remoteData.welcomePopup || {}) },
              backgroundEffects: { ...initialPortfolioData.backgroundEffects, ...prev.backgroundEffects, ...(remoteData.backgroundEffects || {}) },
              animatedBeam: { ...initialPortfolioData.animatedBeam, ...prev.animatedBeam, ...(remoteData.animatedBeam || {}) },
              initialLoader: { ...initialPortfolioData.initialLoader, ...prev.initialLoader, ...(remoteData.initialLoader || {}) },
            }));
            setLastCloudSyncTime(new Date().toLocaleTimeString());
          }
        });

        unsubscribeAuth = onSnapshot(authDocRef, (snap) => {
          if (snap.exists()) {
            const remoteAuth = snap.data() as Partial<SecurityConfig>;
            setSecurityConfig((prev) => ({
              ...prev,
              ...remoteAuth,
              credentials: {
                ...prev.credentials,
                ...(remoteAuth.credentials || {}),
              },
              collaboratorKeys: remoteAuth.collaboratorKeys || prev.collaboratorKeys,
            }));
          }
        });

      } catch (err) {
        console.warn('[Cloud DB] Could not sync with Firestore at startup, falling back to cached local storage:', err);
      }
    }

    initCloudSync();

    return () => {
      if (unsubscribePortfolio) unsubscribePortfolio();
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  // Sync state changes to Cloud Firestore
  const persistToCloud = useCallback(async (newData: PortfolioData) => {
    try {
      setIsSyncingCloud(true);
      const portfolioDocRef = doc(db, FIRESTORE_PORTFOLIO_COLLECTION, FIRESTORE_PORTFOLIO_DOC);
      await setDoc(portfolioDocRef, {
        ...newData,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      setLastCloudSyncTime(new Date().toLocaleTimeString());
      setIsCloudConnected(true);
    } catch (err: unknown) {
      console.error('[Cloud DB] Error saving to Firestore:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.includes('exceeds the maximum') || errMsg.includes('too large')) {
        showToast('Image/Data exceeds cloud limit! Please use optimized image file.');
      } else {
        showToast('Saved locally. Cloud sync: ' + (errMsg.length < 50 ? errMsg : 'retrying...'));
      }
    } finally {
      setIsSyncingCloud(false);
    }
  }, [showToast]);

  const persistSecurityToCloud = useCallback(async (newSec: SecurityConfig) => {
    try {
      setIsSyncingCloud(true);
      const authDocRef = doc(db, FIRESTORE_AUTH_COLLECTION, FIRESTORE_AUTH_DOC);
      await setDoc(authDocRef, {
        ...newSec,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      setLastCloudSyncTime(new Date().toLocaleTimeString());
      setIsCloudConnected(true);
    } catch (err) {
      console.error('[Cloud DB] Error saving security to Firestore:', err);
    } finally {
      setIsSyncingCloud(false);
    }
  }, []);

  // Manual explicit cloud sync trigger
  const syncToCloudNow = useCallback(async () => {
    setIsSyncingCloud(true);
    try {
      const portfolioDocRef = doc(db, FIRESTORE_PORTFOLIO_COLLECTION, FIRESTORE_PORTFOLIO_DOC);
      const authDocRef = doc(db, FIRESTORE_AUTH_COLLECTION, FIRESTORE_AUTH_DOC);
      await setDoc(portfolioDocRef, { ...data, updatedAt: new Date().toISOString() });
      await setDoc(authDocRef, { ...securityConfig, updatedAt: new Date().toISOString() });
      setLastCloudSyncTime(new Date().toLocaleTimeString());
      showToast('☁️ Cloud database synchronized successfully!');
    } catch (e) {
      console.error('Manual sync failed:', e);
      showToast('Sync failed. Please check internet connection.');
    } finally {
      setIsSyncingCloud(false);
    }
  }, [data, securityConfig, showToast]);

  // Open Admin Entry point with clean /onlyadmin URL
  const openAdminPortal = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && window.location.pathname !== '/onlyadmin') {
        window.history.replaceState(null, '', '/onlyadmin');
      }
    } catch (_) {}

    if (currentUser) {
      setIsDashboardOpen(true);
      setIsLoginModalOpen(false);
    } else {
      setIsLoginModalOpen(true);
      setIsDashboardOpen(false);
    }
  }, [currentUser]);

  // Global URL routing handler for /onlyadmin or #onlyadmin
  useEffect(() => {
    const checkAdminPath = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      if (
        path.includes('/onlyadmin') ||
        hash === '#onlyadmin' ||
        search.includes('onlyadmin=true') ||
        path.includes('/admin') ||
        hash === '#admin' ||
        search.includes('admin=true')
      ) {
        if (hash === '#onlyadmin' || hash === '#admin') {
          try {
            window.history.replaceState(null, '', '/onlyadmin');
          } catch (_) {}
        }
        openAdminPortal();
      }
    };

    checkAdminPath();
    window.addEventListener('hashchange', checkAdminPath);
    window.addEventListener('popstate', checkAdminPath);

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

  // Restore clean URL when admin dashboard and login modal are closed
  useEffect(() => {
    if (!isDashboardOpen && !isLoginModalOpen) {
      try {
        const path = window.location.pathname.toLowerCase();
        const hash = window.location.hash.toLowerCase();
        if (path === '/onlyadmin' || path === '/admin' || hash === '#onlyadmin' || hash === '#admin') {
          window.history.replaceState(null, '', '/');
        }
      } catch (_) {}
    }
  }, [isDashboardOpen, isLoginModalOpen]);

  // Lock full background website scroll and pause smooth-scroll engine when dashboard or login modal is open
  useEffect(() => {
    const isModalOpen = isDashboardOpen || isLoginModalOpen;
    const root = document.documentElement;
    const body = document.body;

    if (isModalOpen) {
      pauseLenis();
      const prevBodyOverflow = body.style.overflow;
      const prevRootOverflow = root.style.overflow;
      body.style.overflow = 'hidden';
      root.style.overflow = 'hidden';

      return () => {
        body.style.overflow = prevBodyOverflow;
        root.style.overflow = prevRootOverflow;
        resumeLenis();
      };
    } else {
      body.style.overflow = '';
      root.style.overflow = '';
      resumeLenis();
    }
  }, [isDashboardOpen, isLoginModalOpen]);

  // Cross-PC Real-Time Login Handler
  const login = useCallback(
    async (usernameOrKey: string, password?: string, remember: boolean = true): Promise<{ success: boolean; message?: string }> => {
      const cleanUsernameOrKey = usernameOrKey.trim();
      const cleanPassword = password ? password.trim() : '';

      // Check remote cloud credentials first if available
      let currentSecurity = securityConfig;
      try {
        const authDocRef = doc(db, FIRESTORE_AUTH_COLLECTION, FIRESTORE_AUTH_DOC);
        const authSnap = await getDoc(authDocRef);
        if (authSnap.exists()) {
          currentSecurity = authSnap.data() as SecurityConfig;
          setSecurityConfig(currentSecurity);
        }
      } catch (err) {
        console.warn('Could not fetch cloud credentials during login, using local config:', err);
      }

      // 1. Check Master Admin Credentials
      if (cleanPassword) {
        const expectedUser = currentSecurity.credentials.adminUsername.toLowerCase();
        const expectedPass = currentSecurity.credentials.adminPasswordHash;

        if (cleanUsernameOrKey.toLowerCase() === expectedUser && cleanPassword === expectedPass) {
          const userObj: AuthenticatedUser = {
            username: currentSecurity.credentials.adminUsername,
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
      const keyMatch = (currentSecurity.collaboratorKeys || []).find(
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

      return { success: false, message: 'Invalid username or password. Please check your credentials.' };
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

  // Update Master Credentials (Synced live to Cloud Firestore)
  const updateAdminCredentials = useCallback(
    async (oldPass: string, newUsername: string, newPass: string): Promise<{ success: boolean; message?: string }> => {
      // Re-verify against latest cloud config
      let currentSecurity = securityConfig;
      try {
        const authDocRef = doc(db, FIRESTORE_AUTH_COLLECTION, FIRESTORE_AUTH_DOC);
        const authSnap = await getDoc(authDocRef);
        if (authSnap.exists()) {
          currentSecurity = authSnap.data() as SecurityConfig;
        }
      } catch (err) {
        console.warn('Using local security config for validation:', err);
      }

      if (oldPass !== currentSecurity.credentials.adminPasswordHash) {
        return { success: false, message: 'Current master password does not match.' };
      }

      if (!newUsername.trim()) {
        return { success: false, message: 'Username cannot be empty.' };
      }

      if (newPass.length < 6) {
        return { success: false, message: 'New password must be at least 6 characters.' };
      }

      const updatedSecurity: SecurityConfig = {
        ...currentSecurity,
        credentials: {
          ...currentSecurity.credentials,
          adminUsername: newUsername.trim(),
          adminPasswordHash: newPass,
          isCredentialsCustomized: true,
          updatedAt: new Date().toISOString(),
        },
      };

      setSecurityConfig(updatedSecurity);
      await persistSecurityToCloud(updatedSecurity);

      setCurrentUser((prev) => (prev ? { ...prev, username: newUsername.trim() } : null));
      showToast('Master credentials updated & synced to Cloud across all PCs!');
      return { success: true };
    },
    [securityConfig, persistSecurityToCloud, showToast]
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

    setSecurityConfig((prev) => {
      const updated = {
        ...prev,
        collaboratorKeys: [newKey, ...prev.collaboratorKeys],
      };
      persistSecurityToCloud(updated);
      return updated;
    });

    showToast(`Access Key [${key}] created & saved to Cloud!`);
    return key;
  }, [persistSecurityToCloud, showToast]);

  const toggleCollaboratorKey = useCallback((id: string) => {
    setSecurityConfig((prev) => {
      const updated = {
        ...prev,
        collaboratorKeys: prev.collaboratorKeys.map((k) => (k.id === id ? { ...k, active: !k.active } : k)),
      };
      persistSecurityToCloud(updated);
      return updated;
    });
    showToast('Key status toggled & synced to Cloud.');
  }, [persistSecurityToCloud, showToast]);

  const deleteCollaboratorKey = useCallback((id: string) => {
    setSecurityConfig((prev) => {
      const updated = {
        ...prev,
        collaboratorKeys: prev.collaboratorKeys.filter((k) => k.id !== id),
      };
      persistSecurityToCloud(updated);
      return updated;
    });
    showToast('Key deleted permanently from Cloud.');
  }, [persistSecurityToCloud, showToast]);

  // Content Updaters (Each update automatically persists to Cloud Firestore)
  const updateProfile = (updatedProfile: Partial<ProfileData>) => {
    setData((prev) => {
      const updated = { ...prev, profile: { ...prev.profile, ...updatedProfile } };
      persistToCloud(updated);
      return updated;
    });
    showToast('Profile updated & synced to Cloud!');
  };

  const updateStats = (stats: StatItem[]) => {
    setData((prev) => {
      const updated = { ...prev, stats };
      persistToCloud(updated);
      return updated;
    });
    showToast('Key statistics updated & synced to Cloud!');
  };

  const updateSkillCategories = (skillCategories: SkillCategory[]) => {
    setData((prev) => {
      const updated = { ...prev, skillCategories };
      persistToCloud(updated);
      return updated;
    });
    showToast('Skills matrix updated & synced to Cloud!');
  };

  const updateServices = (services: ServiceItem[]) => {
    setData((prev) => {
      const updated = { ...prev, services };
      persistToCloud(updated);
      return updated;
    });
    showToast('Services updated & synced to Cloud!');
  };

  const updateProjects = (projects: ProjectItem[]) => {
    setData((prev) => {
      const updated = { ...prev, projects };
      persistToCloud(updated);
      return updated;
    });
    showToast('Projects updated & synced to Cloud!');
  };

  const updateEducation = (education: EducationItem[]) => {
    setData((prev) => {
      const updated = { ...prev, education };
      persistToCloud(updated);
      return updated;
    });
    showToast('Education background updated & synced to Cloud!');
  };

  const updateWorkTimeline = (workTimeline: WorkExperienceItem[]) => {
    setData((prev) => {
      const updated = { ...prev, workTimeline };
      persistToCloud(updated);
      return updated;
    });
    showToast('Work experience updated & synced to Cloud!');
  };

  const updateCertifications = (certifications: CertificationItem[]) => {
    setData((prev) => {
      const updated = { ...prev, certifications };
      persistToCloud(updated);
      return updated;
    });
    showToast('Certificates updated & synced to Cloud!');
  };

  const updateTestimonials = (testimonials: TestimonialItem[]) => {
    setData((prev) => {
      const updated = { ...prev, testimonials };
      persistToCloud(updated);
      return updated;
    });
    showToast('Reviews updated & synced to Cloud!');
  };

  const updateAchievements = (achievements: AchievementItem[]) => {
    setData((prev) => {
      const updated = { ...prev, achievements };
      persistToCloud(updated);
      return updated;
    });
    showToast('Achievements updated & synced to Cloud!');
  };

  const updateSeo = (seoUpdate: Partial<SeoConfig>) => {
    setData((prev) => {
      const updated = {
        ...prev,
        seo: { ...prev.seo, ...(prev.seo || initialPortfolioData.seo!), ...seoUpdate },
      };
      persistToCloud(updated);
      return updated;
    });
    showToast('SEO & Favicon updated & synced to Cloud!');
  };

  const updateWelcomePopup = (popupUpdate: Partial<WelcomePopupConfig>) => {
    setData((prev) => {
      const updated = {
        ...prev,
        welcomePopup: { ...prev.welcomePopup, ...(prev.welcomePopup || initialPortfolioData.welcomePopup!), ...popupUpdate },
      };
      persistToCloud(updated);
      return updated;
    });
    showToast('Greeting Popup settings updated & synced to Cloud!');
  };

  const updateBackgroundEffects = (configUpdate: Partial<BackgroundEffectsConfig>) => {
    setData((prev) => {
      const currentConfig = prev.backgroundEffects || initialPortfolioData.backgroundEffects || {
        floatingParticles: true,
        quantity: 220,
        color: '#8B5CF6',
        speed: 0.35,
        depth: 0.65,
        radius: 1.6,
        opacity: 0.55,
        connectParticles: true,
      };
      const updated = {
        ...prev,
        backgroundEffects: { ...currentConfig, ...configUpdate },
      };
      persistToCloud(updated);
      return updated;
    });
    showToast('Background 3D Particles settings updated & synced to Cloud!');
  };

  const updateAnimatedBeam = (configUpdate: Partial<AnimatedBeamConfig>) => {
    setData((prev) => {
      const currentConfig = prev.animatedBeam || initialPortfolioData.animatedBeam || {
        enabled: true,
        nodes: [],
      };
      const updated = {
        ...prev,
        animatedBeam: { ...currentConfig, ...configUpdate },
      };
      persistToCloud(updated);
      return updated;
    });
    showToast('Integration Architecture & Beams updated & synced to Cloud!');
  };

  const updateInitialLoader = (configUpdate: Partial<InitialLoaderConfig>) => {
    setData((prev) => {
      const currentConfig = prev.initialLoader || initialPortfolioData.initialLoader || {
        enabled: true,
        avatarType: 'photo',
        avatarUrl: '/myname.png',
        name: 'Shariful Islam',
        tagline: 'Senior Shopify & Full-Stack Developer',
        initialStatusText: 'INITIALIZING CORE ARCHITECTURE...',
        delayStatusText: 'ESTABLISHING SECURE REALTIME CONNECTION...',
        completionStatusText: 'LAUNCH SUCCESSFUL • WELCOME!',
        durationSeconds: 3.5,
        ringColor: '#8b5cf6',
        enableRealisticDelay: true,
        showProgressBar: true,
      };
      const updated = {
        ...prev,
        initialLoader: { ...currentConfig, ...configUpdate },
      };
      persistToCloud(updated);
      return updated;
    });
    showToast('Loading Screen & Animation settings updated & synced to Cloud!');
  };

  // Sync SEO metadata, title, and favicon dynamically with document head
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const seo = data.seo || initialPortfolioData.seo!;

    if (seo.metaTitle) document.title = seo.metaTitle;

    let descTag = document.querySelector('meta[name="description"]');
    if (descTag && seo.metaDescription) descTag.setAttribute('content', seo.metaDescription);

    let keywordsTag = document.querySelector('meta[name="keywords"]');
    if (keywordsTag && seo.keywords) keywordsTag.setAttribute('content', seo.keywords);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && seo.metaTitle) ogTitle.setAttribute('content', seo.metaTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && seo.metaDescription) ogDesc.setAttribute('content', seo.metaDescription);

    let ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && seo.ogImage) ogImage.setAttribute('content', seo.ogImage);

    if (seo.faviconUrl) {
      let faviconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (faviconLink) faviconLink.href = seo.faviconUrl;
      let appleLink = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
      if (appleLink) appleLink.href = seo.faviconUrl;
    }
  }, [data.seo]);

  // Education Helpers
  const addEducation = (item: EducationItem) => {
    const newItem = { ...item, id: item.id || `edu-${Date.now()}` };
    setData((prev) => {
      const updated = { ...prev, education: [newItem, ...(prev.education || [])] };
      persistToCloud(updated);
      return updated;
    });
    showToast('Education credential added!');
  };

  const editEducation = (id: string, updatedFields: Partial<EducationItem>) => {
    setData((prev) => {
      const updated = {
        ...prev,
        education: (prev.education || []).map((edu) =>
          edu.id === id || edu.institution === id ? { ...edu, ...updatedFields } : edu
        ),
      };
      persistToCloud(updated);
      return updated;
    });
    showToast('Education updated!');
  };

  const deleteEducation = (id: string) => {
    setData((prev) => {
      const updated = {
        ...prev,
        education: (prev.education || []).filter((edu) => edu.id !== id && edu.institution !== id),
      };
      persistToCloud(updated);
      return updated;
    });
    showToast('Education removed.');
  };

  // Project Helpers
  const addProject = (item: ProjectItem) => {
    const newItem = {
      ...item,
      slug: item.slug || `project-${Date.now()}`,
    };
    setData((prev) => {
      const updated = { ...prev, projects: [newItem, ...prev.projects] };
      persistToCloud(updated);
      return updated;
    });
    showToast('Project created!');
  };

  const editProject = (slug: string, updated: Partial<ProjectItem>) => {
    setData((prev) => {
      const updatedData = {
        ...prev,
        projects: prev.projects.map((p) => (p.slug === slug ? { ...p, ...updated } : p)),
      };
      persistToCloud(updatedData);
      return updatedData;
    });
    showToast('Project updated!');
  };

  const deleteProject = (slug: string) => {
    setData((prev) => {
      const updated = {
        ...prev,
        projects: prev.projects.filter((p) => p.slug !== slug),
      };
      persistToCloud(updated);
      return updated;
    });
    showToast('Project removed.');
  };

  // Service Helpers
  const addService = (item: ServiceItem) => {
    const newItem = { ...item, id: item.id || `svc-${Date.now()}` };
    setData((prev) => {
      const updated = { ...prev, services: [newItem, ...prev.services] };
      persistToCloud(updated);
      return updated;
    });
    showToast('Service added!');
  };

  const editService = (id: string, updated: Partial<ServiceItem>) => {
    setData((prev) => {
      const updatedData = {
        ...prev,
        services: prev.services.map((s) => (s.id === id || s.title === id ? { ...s, ...updated } : s)),
      };
      persistToCloud(updatedData);
      return updatedData;
    });
    showToast('Service updated!');
  };

  const deleteService = (id: string) => {
    setData((prev) => {
      const updated = {
        ...prev,
        services: prev.services.filter((s) => s.id !== id),
      };
      persistToCloud(updated);
      return updated;
    });
    showToast('Service removed.');
  };

  // Experience Helpers
  const addExperience = (item: WorkExperienceItem) => {
    const newItem = { ...item, id: item.id || `exp-${Date.now()}` };
    setData((prev) => {
      const updated = { ...prev, workTimeline: [newItem, ...prev.workTimeline] };
      persistToCloud(updated);
      return updated;
    });
    showToast('Experience added!');
  };

  const editExperience = (id: string, updated: Partial<WorkExperienceItem>) => {
    setData((prev) => {
      const updatedData = {
        ...prev,
        workTimeline: prev.workTimeline.map((exp) => (exp.id === id || exp.role === id ? { ...exp, ...updated } : exp)),
      };
      persistToCloud(updatedData);
      return updatedData;
    });
    showToast('Experience updated!');
  };

  const deleteExperience = (id: string) => {
    setData((prev) => {
      const updated = {
        ...prev,
        workTimeline: prev.workTimeline.filter((exp) => exp.id !== id && exp.role !== id),
      };
      persistToCloud(updated);
      return updated;
    });
    showToast('Experience removed.');
  };

  // Certification Helpers
  const addCertification = (item: CertificationItem) => {
    const newItem = { ...item, id: item.id || `cert-${Date.now()}` };
    setData((prev) => {
      const updated = { ...prev, certifications: [newItem, ...(prev.certifications || [])] };
      persistToCloud(updated);
      return updated;
    });
    showToast('Certificate added & synced to Cloud!');
  };

  const editCertification = (id: string, updated: Partial<CertificationItem>) => {
    setData((prev) => {
      const updatedData = {
        ...prev,
        certifications: (prev.certifications || []).map((c) => (c.id === id ? { ...c, ...updated } : c)),
      };
      persistToCloud(updatedData);
      return updatedData;
    });
    showToast('Certificate updated!');
  };

  const deleteCertification = (id: string) => {
    setData((prev) => {
      const updated = {
        ...prev,
        certifications: (prev.certifications || []).filter((c) => c.id !== id),
      };
      persistToCloud(updated);
      return updated;
    });
    showToast('Certificate removed.');
  };

  // Testimonial Helpers
  const addTestimonial = (item: TestimonialItem) => {
    const newItem = { ...item, id: item.id || `test-${Date.now()}` };
    setData((prev) => {
      const updated = { ...prev, testimonials: [newItem, ...(prev.testimonials || [])] };
      persistToCloud(updated);
      return updated;
    });
    showToast('Review added & synced to Cloud!');
  };

  const editTestimonial = (idOrIdx: string | number, updated: Partial<TestimonialItem>) => {
    setData((prev) => {
      const list = [...(prev.testimonials || [])];
      if (typeof idOrIdx === 'number') {
        if (list[idOrIdx]) {
          list[idOrIdx] = { ...list[idOrIdx], ...updated };
        }
      } else {
        const idx = list.findIndex((t) => t.id === idOrIdx);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...updated };
        }
      }
      const updatedData = { ...prev, testimonials: list };
      persistToCloud(updatedData);
      return updatedData;
    });
    showToast('Review updated!');
  };

  const deleteTestimonial = (idOrIdx: string | number) => {
    setData((prev) => {
      let list = [...(prev.testimonials || [])];
      if (typeof idOrIdx === 'number') {
        list = list.filter((_, i) => i !== idOrIdx);
      } else {
        list = list.filter((t) => t.id !== idOrIdx);
      }
      const updated = { ...prev, testimonials: list };
      persistToCloud(updated);
      return updated;
    });
    showToast('Review removed.');
  };

  const resetToDefault = () => {
    setData(initialPortfolioData);
    persistToCloud(initialPortfolioData);
    showToast('All data reset to defaults & synced to Cloud!');
  };

  const importData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed && typeof parsed === 'object' && parsed.profile) {
        const fullData = {
          ...initialPortfolioData,
          ...parsed,
        };
        setData(fullData);
        persistToCloud(fullData);
        showToast('Backup data imported & synced to Cloud!');
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
        isCloudConnected,
        isSyncingCloud,
        lastCloudSyncTime,
        syncToCloudNow,
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
        updateSeo,
        updateWelcomePopup,
        updateBackgroundEffects,
        updateAnimatedBeam,
        updateInitialLoader,
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
        addCertification,
        editCertification,
        deleteCertification,
        addTestimonial,
        editTestimonial,
        deleteTestimonial,
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
