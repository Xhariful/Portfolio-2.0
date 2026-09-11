import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Save,
  RotateCcw,
  Download,
  Upload,
  User,
  GraduationCap,
  Briefcase,
  Cpu,
  Layers,
  ShoppingBag,
  BarChart3,
  MessageSquare,
  Award,
  Plus,
  Trash2,
  Edit2,
  Check,
  ExternalLink,
  Sliders,
  Sparkles,
  RefreshCw,
  Eye,
  Lock,
  Shield,
  Key,
  LogOut,
  ShieldCheck,
  Image as ImageIcon,
  Camera,
  Terminal,
  Zap,
  Code2,
  Link as LinkIcon,
  CheckCircle2,
  FileImage,
  Globe,
  Search,
  Bell,
  Cloud,
  CloudCheck
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  ProfileData,
  EducationItem,
  WorkExperienceItem,
  SkillCategory,
  ServiceItem,
  ProjectItem,
  StatItem,
  TestimonialItem,
  CertificationItem,
  AchievementItem,
  SeoConfig,
  WelcomePopupConfig
} from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    data,
    isDashboardOpen,
    setIsDashboardOpen,
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
    currentUser,
    logout,
    securityConfig,
    updateAdminCredentials,
    addCollaboratorKey,
    toggleCollaboratorKey,
    deleteCollaboratorKey,
    isCloudConnected,
    isSyncingCloud,
    lastCloudSyncTime,
    syncToCloudNow,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<
    | 'profile'
    | 'media'
    | 'seo'
    | 'popup'
    | 'education'
    | 'experience'
    | 'skills'
    | 'services'
    | 'projects'
    | 'stats'
    | 'testimonials'
    | 'security'
    | 'backup'
  >('profile');

  // Security Form States
  const [oldPassword, setOldPassword] = useState('');
  const [newUsername, setNewUsername] = useState(securityConfig.credentials.adminUsername);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [customKeyInput, setCustomKeyInput] = useState('');

  // Helper for uploading image files to DataURL
  const handleImageFilePick = (file: File | null, onLoaded: (url: string) => void) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (.png, .jpg, .svg, .webp)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      if (res) {
        onLoaded(res);
        showToast('Image loaded successfully! Make sure to save.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Local form states for editing items
  const [profileForm, setProfileForm] = useState<ProfileData>(data.profile);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [eduForm, setEduForm] = useState<EducationItem>({
    id: '',
    degree: '',
    institution: '',
    fieldOfStudy: '',
    period: '',
    grade: '',
    location: '',
    description: '',
    highlights: [],
  });
  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [highlightInput, setHighlightInput] = useState('');

  // Experience modal/inline state
  const [isAddingExp, setIsAddingExp] = useState(false);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expForm, setExpForm] = useState<WorkExperienceItem>({
    period: '',
    role: '',
    company: '',
    description: '',
    skills: [],
  });
  const [expSkillInput, setExpSkillInput] = useState('');

  // Project state
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProjectSlug, setEditingProjectSlug] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectItem>({
    slug: '',
    title: '',
    category: 'Shopify',
    description: '',
    image: '',
    tech: [],
    liveUrl: '',
    githubUrl: '',
    year: '2024',
    featured: true,
    highlight: '',
  });
  const [projectTechInput, setProjectTechInput] = useState('');

  // Service state
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceItem>({
    id: '',
    icon: 'shopping-bag',
    title: '',
    description: '',
    tags: [],
  });
  const [serviceTagInput, setServiceTagInput] = useState('');

  // Skill Category & Skill Item State
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState<{ id: string; title: string; highlight: string }>({
    id: '',
    title: '',
    highlight: '',
  });

  // Adding skill item modal/inline state
  const [addingSkillToCatId, setAddingSkillToCatId] = useState<string | null>(null);
  const [editingSkillInfo, setEditingSkillInfo] = useState<{ catId: string; sIdx: number } | null>(null);
  const [skillItemForm, setSkillItemForm] = useState<{ name: string; level: number; years: number }>({
    name: '',
    level: 85,
    years: 3,
  });

  // JSON Import state
  const [jsonInput, setJsonInput] = useState('');

  // SEO & Favicon Form State
  const [seoForm, setSeoForm] = useState<SeoConfig>(data.seo || {
    metaTitle: "Shariful Islam - Senior Full-Stack Developer & Shopify Architect",
    metaDescription: "Senior Full-Stack Developer and Shopify Architect specializing in custom Liquid builds, Python/Django APIs, and interactive web applications.",
    keywords: "Shariful Islam, Shopify Developer, React Developer, Full-Stack",
    author: "Shariful Islam",
    canonicalUrl: "https://sharif-ul-islam.vercel.app/",
    ogImage: "/myname.png",
    faviconUrl: "/favicon.svg",
    faviconType: "preset",
    faviconPreset: "code",
    googleSiteVerification: "",
    structuredDataEnabled: true,
  });

  // Welcome Popup Form State
  const [popupForm, setPopupForm] = useState<WelcomePopupConfig>(data.welcomePopup || {
    enabled: true,
    delayMs: 2400,
    headline: "Need a modern website or Shopify store?",
    subText: "If you're planning to build or redesign your website, let's talk about your project goals.",
    ctaText: "Let's Talk",
    dismissText: "Maybe Later",
    showTimeGreeting: true,
  });

  // Synchronize forms if data changes externally
  React.useEffect(() => {
    setProfileForm(data.profile);
    if (data.seo) setSeoForm(data.seo);
    if (data.welcomePopup) setPopupForm(data.welcomePopup);
  }, [data.profile, data.seo, data.welcomePopup]);

  if (!isDashboardOpen) return null;

  // Handle Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  // Handle SEO & Favicon Save
  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeo(seoForm);
  };

  // Handle Welcome Popup Save
  const handleSavePopup = (e: React.FormEvent) => {
    e.preventDefault();
    updateWelcomePopup(popupForm);
  };

  // Add Headline string
  const addHeadline = () => {
    setProfileForm((prev) => ({
      ...prev,
      headlines: [...prev.headlines, 'New headline banner statement.'],
    }));
  };

  const removeHeadline = (index: number) => {
    setProfileForm((prev) => ({
      ...prev,
      headlines: prev.headlines.filter((_, i) => i !== index),
    }));
  };

  const updateHeadline = (index: number, val: string) => {
    setProfileForm((prev) => {
      const next = [...prev.headlines];
      next[index] = val;
      return { ...prev, headlines: next };
    });
  };

  // Education Helpers
  const startAddEducation = () => {
    setEduForm({
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      fieldOfStudy: '',
      period: '2020 - 2024',
      grade: 'CGPA 3.8 / 4.0',
      location: 'Dhaka, Bangladesh',
      description: '',
      highlights: [],
    });
    setHighlightInput('');
    setIsAddingEdu(true);
    setEditingEduId(null);
  };

  const startEditEducation = (edu: EducationItem) => {
    setEduForm({ ...edu });
    setHighlightInput('');
    setEditingEduId(edu.id);
    setIsAddingEdu(false);
  };

  const saveEducationItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduForm.degree || !eduForm.institution) {
      showToast('Please fill in Degree and Institution name.');
      return;
    }

    if (isAddingEdu) {
      addEducation(eduForm);
      setIsAddingEdu(false);
    } else if (editingEduId) {
      editEducation(editingEduId, eduForm);
      setEditingEduId(null);
    }
  };

  const addEduHighlight = () => {
    if (highlightInput.trim()) {
      setEduForm((prev) => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput.trim()],
      }));
      setHighlightInput('');
    }
  };

  const removeEduHighlight = (index: number) => {
    setEduForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  // Skill Category & Skill Item Helpers
  const startAddCategory = () => {
    setCategoryForm({
      id: `cat-${Date.now()}`,
      title: '',
      highlight: 'Specialization',
    });
    setIsAddingCategory(true);
    setEditingCategoryId(null);
  };

  const startEditCategory = (cat: SkillCategory) => {
    setCategoryForm({
      id: cat.id,
      title: cat.title,
      highlight: cat.highlight,
    });
    setEditingCategoryId(cat.id);
    setIsAddingCategory(false);
  };

  const saveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.title.trim()) {
      showToast('Please enter a category title.');
      return;
    }

    if (isAddingCategory) {
      const newCategory: SkillCategory = {
        id: categoryForm.id || `cat-${Date.now()}`,
        title: categoryForm.title.trim(),
        highlight: categoryForm.highlight.trim() || 'CORE EXPERTISE',
        skills: [],
      };
      updateSkillCategories([...data.skillCategories, newCategory]);
      setIsAddingCategory(false);
      showToast(`Category "${newCategory.title}" created!`);
    } else if (editingCategoryId) {
      const nextCategories = data.skillCategories.map((c) =>
        c.id === editingCategoryId
          ? { ...c, title: categoryForm.title.trim(), highlight: categoryForm.highlight.trim() }
          : c
      );
      updateSkillCategories(nextCategories);
      setEditingCategoryId(null);
      showToast('Category updated!');
    }
  };

  const deleteCategory = (catId: string) => {
    const cat = data.skillCategories.find((c) => c.id === catId);
    const confirmed = window.confirm(`Are you sure you want to delete the category "${cat?.title || ''}" and all its skills?`);
    if (confirmed) {
      const nextCategories = data.skillCategories.filter((c) => c.id !== catId);
      updateSkillCategories(nextCategories);
      showToast('Skill category deleted.');
    }
  };

  // Skill Items inside Category Helpers
  const startAddSkillItem = (catId: string) => {
    setAddingSkillToCatId(catId);
    setEditingSkillInfo(null);
    setSkillItemForm({
      name: '',
      level: 85,
      years: 3,
    });
  };

  const startEditSkillItem = (catId: string, sIdx: number, item: { name: string; level: number; years: number }) => {
    setEditingSkillInfo({ catId, sIdx });
    setAddingSkillToCatId(null);
    setSkillItemForm({ ...item });
  };

  const saveSkillItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillItemForm.name.trim()) {
      showToast('Please enter a skill name.');
      return;
    }

    if (addingSkillToCatId) {
      const nextCategories = data.skillCategories.map((cat) => {
        if (cat.id === addingSkillToCatId) {
          return {
            ...cat,
            skills: [
              ...cat.skills,
              {
                name: skillItemForm.name.trim(),
                level: Number(skillItemForm.level) || 80,
                years: Number(skillItemForm.years) || 1,
              },
            ],
          };
        }
        return cat;
      });
      updateSkillCategories(nextCategories);
      setAddingSkillToCatId(null);
      showToast(`Skill "${skillItemForm.name.trim()}" added!`);
    } else if (editingSkillInfo) {
      const { catId, sIdx } = editingSkillInfo;
      const nextCategories = data.skillCategories.map((cat) => {
        if (cat.id === catId) {
          const updatedSkills = [...cat.skills];
          updatedSkills[sIdx] = {
            name: skillItemForm.name.trim(),
            level: Number(skillItemForm.level) || 80,
            years: Number(skillItemForm.years) || 1,
          };
          return { ...cat, skills: updatedSkills };
        }
        return cat;
      });
      updateSkillCategories(nextCategories);
      setEditingSkillInfo(null);
      showToast('Skill updated!');
    }
  };

  const deleteSkillItem = (catId: string, sIdx: number) => {
    const nextCategories = data.skillCategories.map((cat) => {
      if (cat.id === catId) {
        return {
          ...cat,
          skills: cat.skills.filter((_, i) => i !== sIdx),
        };
      }
      return cat;
    });
    updateSkillCategories(nextCategories);
    showToast('Skill deleted.');
  };

  // Export JSON file download
  const handleDownloadBackup = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-content-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON downloaded!');
  };

  if (!isDashboardOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-6xl h-[94vh] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-zinc-100"
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-600 text-white shadow-sm">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Portfolio Content Management Dashboard
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-semibold flex items-center gap-1.5 ${
                  isCloudConnected
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950/80 border-amber-500/30 text-amber-700 dark:text-amber-300'
                }`}>
                  <Cloud className="w-3 h-3" />
                  <span>{isCloudConnected ? 'CLOUD DATABASE LIVE' : 'LOCAL CACHE'}</span>
                </span>
                {isSyncingCloud && (
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 animate-pulse font-mono">
                    Syncing...
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-2">
                <span>All changes automatically sync to Firebase Firestore & live globally across all PCs.</span>
                {lastCloudSyncTime && (
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                    (Last synced: {lastCloudSyncTime})
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span className="font-medium text-slate-700 dark:text-zinc-300">
                  {currentUser.role === 'admin' ? 'Admin:' : 'Collab:'} <strong>{currentUser.username}</strong>
                </span>
              </div>
            )}
            <button
              onClick={() => syncToCloudNow()}
              disabled={isSyncingCloud}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 dark:hover:bg-purple-900/60 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              title="Force push all local data to Cloud database immediately"
            >
              <CloudCheck className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncingCloud ? 'Syncing...' : 'Sync Cloud'}</span>
            </button>
            <button
              onClick={() => setIsDashboardOpen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold shadow-sm transition-all cursor-pointer"
              title="Close panel and return to portfolio"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Site</span>
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-all cursor-pointer"
              title="Log out and lock dashboard"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock & Sign Out</span>
            </button>
            <button
              onClick={() => setIsDashboardOpen(false)}
              aria-label="Close Dashboard"
              className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body with Sidebar Tabs & Content */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar Navigation */}
          <div className="w-56 sm:w-64 border-r border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/40 p-3 space-y-1 overflow-y-auto">
            <TabButton
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
              icon={<User className="w-4 h-4" />}
              label="Profile & Bio"
            />
            <TabButton
              active={activeTab === 'media'}
              onClick={() => setActiveTab('media')}
              icon={<ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
              label="Logo & Website Media"
            />
            <TabButton
              active={activeTab === 'seo'}
              onClick={() => setActiveTab('seo')}
              icon={<Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
              label="Favicon & SEO Meta"
            />
            <TabButton
              active={activeTab === 'popup'}
              onClick={() => setActiveTab('popup')}
              icon={<Bell className="w-4 h-4 text-amber-500" />}
              label="Greeting Popup"
            />
            <TabButton
              active={activeTab === 'education'}
              onClick={() => setActiveTab('education')}
              icon={<GraduationCap className="w-4 h-4" />}
              label="Education & Degrees"
              badge={data.education.length}
            />
            <TabButton
              active={activeTab === 'experience'}
              onClick={() => setActiveTab('experience')}
              icon={<Briefcase className="w-4 h-4" />}
              label="Work Experience"
              badge={data.workTimeline.length}
            />
            <TabButton
              active={activeTab === 'skills'}
              onClick={() => setActiveTab('skills')}
              icon={<Cpu className="w-4 h-4" />}
              label="Skills & Tech Matrix"
              badge={data.skillCategories.length}
            />
            <TabButton
              active={activeTab === 'services'}
              onClick={() => setActiveTab('services')}
              icon={<ShoppingBag className="w-4 h-4" />}
              label="Services Offered"
              badge={data.services.length}
            />
            <TabButton
              active={activeTab === 'projects'}
              onClick={() => setActiveTab('projects')}
              icon={<Layers className="w-4 h-4" />}
              label="Projects & Work"
              badge={data.projects.length}
            />
            <TabButton
              active={activeTab === 'stats'}
              onClick={() => setActiveTab('stats')}
              icon={<BarChart3 className="w-4 h-4" />}
              label="Counter Statistics"
            />
            <TabButton
              active={activeTab === 'testimonials'}
              onClick={() => setActiveTab('testimonials')}
              icon={<MessageSquare className="w-4 h-4" />}
              label="Client Testimonials"
              badge={data.testimonials.length}
            />
            <TabButton
              active={activeTab === 'security'}
              onClick={() => setActiveTab('security')}
              icon={<Lock className="w-4 h-4" />}
              label="Security & Access Keys"
            />
            <TabButton
              active={activeTab === 'backup'}
              onClick={() => setActiveTab('backup')}
              icon={<Download className="w-4 h-4" />}
              label="Backup, Import & Reset"
            />
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-white dark:bg-zinc-900">
            
            {/* 1. PROFILE TAB */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Profile & Contact Information</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Update your primary display name, role, contact info, and typewriter headlines.</p>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Full Name">
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="input-field"
                    />
                  </FormField>

                  <FormField label="Primary Role / Title">
                    <input
                      type="text"
                      value={profileForm.role}
                      onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                      className="input-field"
                    />
                  </FormField>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <FormField label="Availability Badge">
                    <input
                      type="text"
                      value={profileForm.badge}
                      onChange={(e) => setProfileForm({ ...profileForm, badge: e.target.value })}
                      className="input-field"
                    />
                  </FormField>

                  <FormField label="Years of Experience (e.g. 4+)">
                    <input
                      type="text"
                      value={profileForm.experienceYears}
                      onChange={(e) => setProfileForm({ ...profileForm, experienceYears: e.target.value })}
                      className="input-field"
                    />
                  </FormField>

                  <FormField label="Location & Country">
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="input-field"
                    />
                  </FormField>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <FormField label="Email Address">
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="input-field"
                    />
                  </FormField>

                  <FormField label="Phone Number">
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="input-field"
                    />
                  </FormField>

                  <FormField label="WhatsApp Number / Link">
                    <input
                      type="text"
                      value={profileForm.whatsapp}
                      onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                      className="input-field"
                    />
                  </FormField>
                </div>

                <FormField label="Bio Narrative (About Section)">
                  <textarea
                    rows={4}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="input-field resize-none"
                  />
                </FormField>

                <FormField label="Tagline / Short Pitch">
                  <input
                    type="text"
                    value={profileForm.tagline}
                    onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                    className="input-field"
                  />
                </FormField>

                {/* Dynamic Headlines / Typewriter Strings */}
                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Typewriter Headlines</h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">These phrases rotate dynamically in the hero banner.</p>
                    </div>
                    <button
                      type="button"
                      onClick={addHeadline}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Phrase</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {profileForm.headlines.map((headline, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400 w-6">#{idx + 1}</span>
                        <input
                          type="text"
                          value={headline}
                          onChange={(e) => updateHeadline(idx, e.target.value)}
                          className="input-field flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => removeHeadline(idx)}
                          className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          title="Delete phrase"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Social Media Links</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <FormField label="GitHub Profile URL">
                      <input
                        type="url"
                        value={profileForm.socials.github}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            socials: { ...profileForm.socials, github: e.target.value },
                          })
                        }
                        className="input-field"
                      />
                    </FormField>
                    <FormField label="LinkedIn Profile URL">
                      <input
                        type="url"
                        value={profileForm.socials.linkedin}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            socials: { ...profileForm.socials, linkedin: e.target.value },
                          })
                        }
                        className="input-field"
                      />
                    </FormField>
                    <FormField label="Twitter Profile URL">
                      <input
                        type="url"
                        value={profileForm.socials.twitter}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            socials: { ...profileForm.socials, twitter: e.target.value },
                          })
                        }
                        className="input-field"
                      />
                    </FormField>
                    <FormField label="Facebook Profile URL">
                      <input
                        type="url"
                        value={profileForm.socials.facebook}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            socials: { ...profileForm.socials, facebook: e.target.value },
                          })
                        }
                        className="input-field"
                      />
                    </FormField>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Profile Changes</span>
                  </button>
                </div>
              </form>
            )}

            {/* 1.5 BRAND LOGO & WEBSITE MEDIA TAB */}
            {activeTab === 'media' && (
              <form onSubmit={handleSaveProfile} className="space-y-8 max-w-4xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Brand Logo & Website Media Assets</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Customize the Header & Footer brand logo, hero portrait photo, about section image, and project cover images.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Media Assets</span>
                  </button>
                </div>

                {/* Section 1: Header & Footer Brand Logo */}
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-zinc-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>Header & Footer Brand Logo</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Set a custom image logo (PNG, SVG, JPG, WebP) or combine dynamic icons with your custom brand name.
                      </p>
                    </div>
                    {profileForm.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setProfileForm({ ...profileForm, logoUrl: '', logoType: 'combined' })}
                        className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset to Default Logo</span>
                      </button>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField label="Logo Display Mode">
                      <select
                        value={profileForm.logoType || 'combined'}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            logoType: e.target.value as 'combined' | 'image' | 'text',
                          })
                        }
                        className="input-field cursor-pointer"
                      >
                        <option value="combined">Icon / Logo Image + Brand Name (Combined)</option>
                        <option value="image">Pure Image Logo Only</option>
                        <option value="text">Icon Badge + Brand Name</option>
                      </select>
                    </FormField>

                    <FormField label="Brand / Logo Text">
                      <input
                        type="text"
                        value={profileForm.logoText || ''}
                        placeholder={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, logoText: e.target.value })}
                        className="input-field"
                      />
                    </FormField>
                  </div>

                  {/* Logo Image URL & Direct File Upload */}
                  <div className="space-y-3">
                    <FormField label="Custom Logo Image URL or Upload">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                        <input
                          type="text"
                          value={profileForm.logoUrl || ''}
                          placeholder="https://example.com/brand-logo.png (or upload a file below)"
                          onChange={(e) => setProfileForm({ ...profileForm, logoUrl: e.target.value })}
                          className="input-field flex-1"
                        />
                        <label className="px-4 py-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm flex-shrink-0">
                          <Upload className="w-4 h-4" />
                          <span>Upload Logo File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageFilePick(e.target.files?.[0] || null, (url) =>
                                setProfileForm({ ...profileForm, logoUrl: url })
                              )
                            }
                          />
                        </label>
                      </div>
                    </FormField>
                  </div>

                  {/* Logo Icon Style Selection (if not pure image) */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField label="Logo Dynamic Icon (when not using image)">
                      <select
                        value={profileForm.logoIcon || 'code'}
                        onChange={(e) => setProfileForm({ ...profileForm, logoIcon: e.target.value })}
                        className="input-field cursor-pointer"
                      >
                        <option value="code">Code &lt;/&gt; (Developer Theme)</option>
                        <option value="shopping-bag">Shopping Bag (Shopify / Ecommerce)</option>
                        <option value="sparkles">Sparkles ✨ (AI & Modern Tech)</option>
                        <option value="terminal">Terminal &gt;_ (Backend & Scripting)</option>
                        <option value="zap">Zap ⚡ (High Performance)</option>
                        <option value="layers">Layers 📦 (Full Stack & Cloud)</option>
                        <option value="cpu">CPU 💻 (Computer Systems)</option>
                      </select>
                    </FormField>
                  </div>

                  {/* Live Logo Preview Box */}
                  <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                      Live Logo Preview (Header & Footer Mockup)
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {/* Light Mode Mockup */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {profileForm.logoType === 'image' && profileForm.logoUrl ? (
                            <img
                              src={profileForm.logoUrl}
                              alt="Logo Preview"
                              className="h-8 max-w-[140px] object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <>
                              {profileForm.logoUrl ? (
                                <div className="w-8 h-8 rounded-lg overflow-hidden border border-purple-200 bg-purple-50 p-1 flex items-center justify-center">
                                  <img src={profileForm.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                                  <Code2 className="w-4 h-4" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-bold text-slate-900 leading-tight">
                                  {profileForm.logoText || profileForm.name}
                                </p>
                                <p className="text-[10px] font-mono text-purple-600 leading-tight">/ Portfolio</p>
                              </div>
                            </>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">Light Mode</span>
                      </div>

                      {/* Dark Mode Mockup */}
                      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {profileForm.logoType === 'image' && profileForm.logoUrl ? (
                            <img
                              src={profileForm.logoUrl}
                              alt="Logo Preview"
                              className="h-8 max-w-[140px] object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <>
                              {profileForm.logoUrl ? (
                                <div className="w-8 h-8 rounded-lg overflow-hidden border border-purple-800 bg-purple-950/60 p-1 flex items-center justify-center">
                                  <img src={profileForm.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-purple-600/30 text-purple-300 border border-purple-500/30 flex items-center justify-center">
                                  <Code2 className="w-4 h-4" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-bold text-white leading-tight">
                                  {profileForm.logoText || profileForm.name}
                                </p>
                                <p className="text-[10px] font-mono text-purple-400 leading-tight">/ Portfolio</p>
                              </div>
                            </>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">Dark Mode</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Hero Section & About Section Portraits */}
                <div className="grid sm:grid-cols-2 gap-6">
                  
                  {/* Hero Portrait Card */}
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Camera className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span>Hero Section Portrait Image</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                          Main photo shown in the top hero presentation card.
                        </p>
                      </div>
                    </div>

                    <FormField label="Hero Photo URL or Local Upload">
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={profileForm.heroImage || ''}
                          placeholder="https://images.unsplash.com/... or upload"
                          onChange={(e) => setProfileForm({ ...profileForm, heroImage: e.target.value })}
                          className="input-field"
                        />
                        <div className="flex items-center gap-2">
                          <label className="px-3.5 py-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm flex-1 justify-center">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Hero Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageFilePick(e.target.files?.[0] || null, (url) =>
                                  setProfileForm({ ...profileForm, heroImage: url })
                                )
                              }
                            />
                          </label>
                          {profileForm.heroImage && (
                            <button
                              type="button"
                              onClick={() => setProfileForm({ ...profileForm, heroImage: '' })}
                              className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-zinc-800 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-700 cursor-pointer"
                              title="Reset to default portrait"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </FormField>

                    {/* Preview */}
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 relative">
                      <img
                        src={profileForm.heroImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800'}
                        alt="Hero Preview"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800';
                        }}
                      />
                      <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded bg-black/70 text-white text-[11px] font-mono text-center backdrop-blur-sm">
                        Hero Photo Preview
                      </div>
                    </div>
                  </div>

                  {/* About Section Showcase Photo */}
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span>About Section Portrait Image</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                          Photo showcased in the comprehensive About Me bio card.
                        </p>
                      </div>
                    </div>

                    <FormField label="About Photo URL or Local Upload">
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={profileForm.aboutImage || ''}
                          placeholder="https://images.unsplash.com/... or upload"
                          onChange={(e) => setProfileForm({ ...profileForm, aboutImage: e.target.value })}
                          className="input-field"
                        />
                        <div className="flex items-center gap-2">
                          <label className="px-3.5 py-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm flex-1 justify-center">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload About Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageFilePick(e.target.files?.[0] || null, (url) =>
                                  setProfileForm({ ...profileForm, aboutImage: url })
                                )
                              }
                            />
                          </label>
                          {profileForm.aboutImage && (
                            <button
                              type="button"
                              onClick={() => setProfileForm({ ...profileForm, aboutImage: '' })}
                              className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-zinc-800 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-700 cursor-pointer"
                              title="Reset to default portrait"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </FormField>

                    {/* Preview */}
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 relative">
                      <img
                        src={profileForm.aboutImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800'}
                        alt="About Preview"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800';
                        }}
                      />
                      <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded bg-black/70 text-white text-[11px] font-mono text-center backdrop-blur-sm">
                        About Photo Preview
                      </div>
                    </div>
                  </div>

                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Media & Logo Changes</span>
                  </button>
                </div>
              </form>
            )}

            {/* 2. EDUCATION TAB */}
            {activeTab === 'education' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Education & Degrees Manager</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Add, edit, or remove your academic qualifications and achievements.</p>
                  </div>
                  {!isAddingEdu && !editingEduId && (
                    <button
                      onClick={startAddEducation}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Degree</span>
                    </button>
                  )}
                </div>

                {/* Add/Edit Education Form */}
                {(isAddingEdu || editingEduId) && (
                  <motion.form
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={saveEducationItem}
                    className="p-6 rounded-2xl bg-purple-50/50 dark:bg-zinc-950 border border-purple-200 dark:border-purple-800/40 space-y-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-purple-100 dark:border-zinc-800 pb-3">
                      <h4 className="text-sm font-bold text-purple-900 dark:text-purple-300">
                        {isAddingEdu ? 'Add New Academic Qualification' : 'Edit Degree Details'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingEdu(false);
                          setEditingEduId(null);
                        }}
                        className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Degree / Diploma Name *">
                        <input
                          type="text"
                          required
                          value={eduForm.degree}
                          onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                          placeholder="e.g. B.Sc in Computer Science & Engineering"
                          className="input-field"
                        />
                      </FormField>

                      <FormField label="Institution / University Name *">
                        <input
                          type="text"
                          required
                          value={eduForm.institution}
                          onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                          placeholder="e.g. Dhaka International University"
                          className="input-field"
                        />
                      </FormField>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <FormField label="Field of Study / Major">
                        <input
                          type="text"
                          value={eduForm.fieldOfStudy}
                          onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })}
                          placeholder="e.g. Software Engineering & Web Systems"
                          className="input-field"
                        />
                      </FormField>

                      <FormField label="Time Period (Years)">
                        <input
                          type="text"
                          value={eduForm.period}
                          onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                          placeholder="e.g. 2019 - 2023"
                          className="input-field"
                        />
                      </FormField>

                      <FormField label="Grade / CGPA / Distinction">
                        <input
                          type="text"
                          value={eduForm.grade || ''}
                          onChange={(e) => setEduForm({ ...eduForm, grade: e.target.value })}
                          placeholder="e.g. First Class / CGPA 3.8"
                          className="input-field"
                        />
                      </FormField>
                    </div>

                    <FormField label="Description & Academic Focus">
                      <textarea
                        rows={3}
                        value={eduForm.description}
                        onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
                        placeholder="Key skills learned, major coursework, thesis or specialization..."
                        className="input-field resize-none"
                      />
                    </FormField>

                    {/* Highlights / Bullet points */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400">
                        Key Accomplishments & Bullet Points:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={highlightInput}
                          onChange={(e) => setHighlightInput(e.target.value)}
                          placeholder="e.g. Lead project for Capstone E-commerce system"
                          className="input-field flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addEduHighlight();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={addEduHighlight}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold cursor-pointer"
                        >
                          Add Bullet
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {eduForm.highlights.map((h, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-800 dark:text-zinc-200"
                          >
                            <span>{h}</span>
                            <button
                              type="button"
                              onClick={() => removeEduHighlight(idx)}
                              className="text-rose-500 hover:text-rose-700 cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase cursor-pointer"
                      >
                        {isAddingEdu ? 'Add Degree' : 'Save Degree'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingEdu(false);
                          setEditingEduId(null);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* List Existing Education */}
                <div className="space-y-3">
                  {data.education.map((edu, idx) => (
                    <div
                      key={edu.id || idx}
                      className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-start justify-between gap-4 hover:border-purple-400 dark:hover:border-purple-600 transition-colors shadow-sm"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">{edu.degree}</h4>
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-mono">
                            {edu.period}
                          </span>
                          {edu.grade && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-mono">
                              {edu.grade}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">{edu.institution}</p>
                        <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1">{edu.description}</p>
                        {edu.highlights && edu.highlights.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {edu.highlights.map((h, hIdx) => (
                              <span
                                key={hIdx}
                                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 text-[10px] text-slate-600 dark:text-zinc-400"
                              >
                                • {h}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => startEditEducation(edu)}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 cursor-pointer"
                          title="Edit degree"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEducation(edu.id)}
                          className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          title="Delete degree"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. WORK EXPERIENCE TAB */}
            {activeTab === 'experience' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Work Experience & Timeline</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Manage career positions, roles, accomplishments, and tech tags.</p>
                  </div>
                  {!isAddingExp && !editingExpId && (
                    <button
                      onClick={() => {
                        setExpForm({
                          period: '2024 - Present',
                          role: '',
                          company: '',
                          description: '',
                          skills: [],
                        });
                        setIsAddingExp(true);
                        setEditingExpId(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Experience</span>
                    </button>
                  )}
                </div>

                {(isAddingExp || editingExpId) && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (isAddingExp) {
                        addExperience(expForm);
                        setIsAddingExp(false);
                      } else if (editingExpId) {
                        editExperience(editingExpId, expForm);
                        setEditingExpId(null);
                      }
                    }}
                    className="p-6 rounded-2xl bg-purple-50/50 dark:bg-zinc-950 border border-purple-200 dark:border-purple-800/40 space-y-4"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Role / Job Title *">
                        <input
                          type="text"
                          required
                          value={expForm.role}
                          onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                          className="input-field"
                        />
                      </FormField>
                      <FormField label="Company / Organization *">
                        <input
                          type="text"
                          required
                          value={expForm.company}
                          onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                          className="input-field"
                        />
                      </FormField>
                    </div>

                    <FormField label="Period / Duration">
                      <input
                        type="text"
                        value={expForm.period}
                        onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                        className="input-field"
                      />
                    </FormField>

                    <FormField label="Role Description & Achievements">
                      <textarea
                        rows={3}
                        value={expForm.description}
                        onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                        className="input-field resize-none"
                      />
                    </FormField>

                    <div className="space-y-2">
                      <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400">
                        Tech Stack Tags:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={expSkillInput}
                          onChange={(e) => setExpSkillInput(e.target.value)}
                          placeholder="e.g. Shopify, Django, React"
                          className="input-field flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (expSkillInput.trim()) {
                              setExpForm((prev) => ({
                                ...prev,
                                skills: [...prev.skills, expSkillInput.trim()],
                              }));
                              setExpSkillInput('');
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold cursor-pointer"
                        >
                          Add Tag
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {expForm.skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs flex items-center gap-1.5"
                          >
                            <span>{s}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setExpForm((prev) => ({
                                  ...prev,
                                  skills: prev.skills.filter((_, i) => i !== idx),
                                }))
                              }
                              className="text-rose-500 cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase cursor-pointer"
                      >
                        Save Experience
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingExp(false);
                          setEditingExpId(null);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {data.workTimeline.map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-start justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">{exp.role}</h4>
                          <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-mono">
                            {exp.period}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">{exp.company}</p>
                        <p className="text-xs text-slate-600 dark:text-zinc-300 mt-1">{exp.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1.5">
                          {exp.skills.map((s, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[10px] font-mono"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setExpForm({ ...exp });
                            setEditingExpId(exp.id || exp.role);
                            setIsAddingExp(false);
                          }}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteExperience(exp.id || exp.role)}
                          className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. SKILLS TAB */}
            {activeTab === 'skills' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Skills & Proficiency Matrix</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Add new categories, add individual skills, edit levels, years of experience, or delete items.</p>
                  </div>
                  {!isAddingCategory && !editingCategoryId && (
                    <button
                      onClick={startAddCategory}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer w-fit"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Category</span>
                    </button>
                  )}
                </div>

                {/* Category Add/Edit Form */}
                {(isAddingCategory || editingCategoryId) && (
                  <motion.form
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={saveCategory}
                    className="p-6 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/60 space-y-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-purple-200/60 dark:border-purple-800/40 pb-3">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>{isAddingCategory ? 'Add New Skill Domain / Category' : 'Edit Skill Category'}</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingCategory(false);
                          setEditingCategoryId(null);
                        }}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Category Title (e.g. Shopify & Liquid, Frontend & UI)">
                        <input
                          type="text"
                          required
                          value={categoryForm.title}
                          onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                          className="input-field"
                          placeholder="e.g. Full-Stack & Python"
                        />
                      </FormField>

                      <FormField label="Highlight Badge (e.g. CORE EXPERTISE, MODERN STACK)">
                        <input
                          type="text"
                          value={categoryForm.highlight}
                          onChange={(e) => setCategoryForm({ ...categoryForm, highlight: e.target.value })}
                          className="input-field"
                          placeholder="e.g. HIGH PERFORMANCE"
                        />
                      </FormField>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase cursor-pointer"
                      >
                        {isAddingCategory ? 'Create Category' : 'Save Category'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingCategory(false);
                          setEditingCategoryId(null);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Skill Item Add / Edit Modal / Inline Form */}
                {(addingSkillToCatId || editingSkillInfo) && (
                  <motion.form
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onSubmit={saveSkillItem}
                    className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-purple-500 shadow-md space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2">
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>
                          {addingSkillToCatId ? 'Add Individual Skill' : 'Edit Skill Details'}
                        </span>
                      </h5>
                      <button
                        type="button"
                        onClick={() => {
                          setAddingSkillToCatId(null);
                          setEditingSkillInfo(null);
                        }}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                          Skill Name
                        </label>
                        <input
                          type="text"
                          required
                          value={skillItemForm.name}
                          onChange={(e) => setSkillItemForm({ ...skillItemForm, name: e.target.value })}
                          className="input-field"
                          placeholder="e.g. Liquid, Python, React.js"
                        />
                      </div>

                      <div className="sm:col-span-1">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                          Proficiency ({skillItemForm.level}%)
                        </label>
                        <div className="flex items-center gap-3 pt-1">
                          <input
                            type="range"
                            min="20"
                            max="100"
                            value={skillItemForm.level}
                            onChange={(e) =>
                              setSkillItemForm({
                                ...skillItemForm,
                                level: parseInt(e.target.value, 10),
                              })
                            }
                            className="w-full accent-purple-600 cursor-pointer"
                          />
                          <span className="text-xs font-mono font-bold text-purple-600 w-10 text-right">
                            {skillItemForm.level}%
                          </span>
                        </div>
                      </div>

                      <div className="sm:col-span-1">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                          Experience (Years)
                        </label>
                        <input
                          type="number"
                          min="0.5"
                          step="0.5"
                          max="25"
                          value={skillItemForm.years}
                          onChange={(e) =>
                            setSkillItemForm({
                              ...skillItemForm,
                              years: parseFloat(e.target.value) || 1,
                            })
                          }
                          className="input-field"
                          placeholder="e.g. 4"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        {addingSkillToCatId ? 'Add Skill' : 'Update Skill'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAddingSkillToCatId(null);
                          setEditingSkillInfo(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Categories & Skills List */}
                <div className="space-y-6">
                  {data.skillCategories.map((cat, catIdx) => (
                    <div
                      key={cat.id || catIdx}
                      className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-zinc-800 pb-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-purple-600 dark:text-purple-400 font-bold tracking-wider">
                            {cat.highlight}
                          </span>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{cat.title}</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-zinc-800 text-[11px] font-mono text-slate-600 dark:text-zinc-400">
                              {cat.skills.length} skills
                            </span>
                          </h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startAddSkillItem(cat.id)}
                            className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                            title="Add skill to this category"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Skill</span>
                          </button>

                          <button
                            onClick={() => startEditCategory(cat)}
                            className="p-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-purple-400 text-slate-700 dark:text-zinc-300 hover:text-purple-600 cursor-pointer"
                            title="Edit Category Title"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => deleteCategory(cat.id)}
                            className="p-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-rose-400 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Skills inside this category */}
                      {cat.skills.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400 dark:text-zinc-500 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl">
                          No skills added yet in this category. Click &quot;Add Skill&quot; above to add one.
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {cat.skills.map((skill, sIdx) => (
                            <div
                              key={sIdx}
                              className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2.5 shadow-xs"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900 dark:text-white">{skill.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">
                                    {skill.level}%
                                  </span>
                                  <button
                                    onClick={() => startEditSkillItem(cat.id, sIdx, skill)}
                                    className="p-1 rounded text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer"
                                    title="Edit skill details"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => deleteSkillItem(cat.id, sIdx)}
                                    className="p-1 rounded text-slate-400 hover:text-rose-500 cursor-pointer"
                                    title="Delete skill"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Interactive Quick Slider */}
                              <input
                                type="range"
                                min="20"
                                max="100"
                                value={skill.level}
                                onChange={(e) => {
                                  const newLevel = parseInt(e.target.value, 10);
                                  const nextCategories = [...data.skillCategories];
                                  nextCategories[catIdx].skills[sIdx].level = newLevel;
                                  updateSkillCategories(nextCategories);
                                }}
                                className="w-full accent-purple-600 cursor-pointer"
                              />

                              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                                <span>Experience:</span>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    min="0.5"
                                    step="0.5"
                                    max="25"
                                    value={skill.years}
                                    onChange={(e) => {
                                      const years = parseFloat(e.target.value) || 1;
                                      const nextCategories = [...data.skillCategories];
                                      nextCategories[catIdx].skills[sIdx].years = years;
                                      updateSkillCategories(nextCategories);
                                    }}
                                    className="w-16 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-right text-slate-800 dark:text-zinc-200"
                                  />
                                  <span>yrs</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. SERVICES TAB */}
            {activeTab === 'services' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Services Offered</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Configure service descriptions, icon keys, and feature tags.</p>
                  </div>
                  {!isAddingService && !editingServiceId && (
                    <button
                      onClick={() => {
                        setServiceForm({
                          id: `serv-${Date.now()}`,
                          icon: 'shopping-bag',
                          title: '',
                          description: '',
                          tags: [],
                        });
                        setIsAddingService(true);
                        setEditingServiceId(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Service</span>
                    </button>
                  )}
                </div>

                {(isAddingService || editingServiceId) && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (isAddingService) {
                        addService(serviceForm);
                        setIsAddingService(false);
                      } else if (editingServiceId) {
                        editService(editingServiceId, serviceForm);
                        setEditingServiceId(null);
                      }
                    }}
                    className="p-6 rounded-2xl bg-purple-50/50 dark:bg-zinc-950 border border-purple-200 dark:border-purple-800/40 space-y-4"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Service Title *">
                        <input
                          type="text"
                          required
                          value={serviceForm.title}
                          onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                          className="input-field"
                        />
                      </FormField>

                      <FormField label="Icon Type">
                        <select
                          value={serviceForm.icon}
                          onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                          className="input-field"
                        >
                          <option value="shopping-bag">Shopping Bag (Shopify/E-commerce)</option>
                          <option value="server">Server (Python/Django)</option>
                          <option value="code-2">Code (React/Frontend)</option>
                          <option value="layout">Layout (Figma/Design)</option>
                        </select>
                      </FormField>
                    </div>

                    <FormField label="Service Description *">
                      <textarea
                        rows={3}
                        required
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                        className="input-field resize-none"
                      />
                    </FormField>

                    <div className="space-y-2">
                      <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400">
                        Feature Badges / Tags:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={serviceTagInput}
                          onChange={(e) => setServiceTagInput(e.target.value)}
                          placeholder="e.g. Custom Liquid, Speed Boost"
                          className="input-field flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (serviceTagInput.trim()) {
                              setServiceForm((prev) => ({
                                ...prev,
                                tags: [...prev.tags, serviceTagInput.trim()],
                              }));
                              setServiceTagInput('');
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold cursor-pointer"
                        >
                          Add Tag
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {serviceForm.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs flex items-center gap-1.5"
                          >
                            <span>{t}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setServiceForm((prev) => ({
                                  ...prev,
                                  tags: prev.tags.filter((_, i) => i !== idx),
                                }))
                              }
                              className="text-rose-500 cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase cursor-pointer"
                      >
                        Save Service
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingService(false);
                          setEditingServiceId(null);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  {data.services.map((serv, idx) => (
                    <div
                      key={serv.id || idx}
                      className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex flex-col justify-between space-y-3 shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">{serv.title}</h4>
                          <span className="text-xs font-mono text-purple-600 font-bold">{serv.icon}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">{serv.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {serv.tags.map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 text-[10px] font-mono text-slate-600 dark:text-zinc-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800">
                        <button
                          onClick={() => {
                            setServiceForm({ ...serv });
                            setEditingServiceId(serv.id);
                            setIsAddingService(false);
                          }}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteService(serv.id)}
                          className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Portfolio Projects</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Add or edit showcase items, URLs, tech stacks, and highlights.</p>
                  </div>
                  {!isAddingProject && !editingProjectSlug && (
                    <button
                      onClick={() => {
                        setProjectForm({
                          slug: `project-${Date.now()}`,
                          title: '',
                          category: 'Shopify',
                          description: '',
                          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000',
                          tech: [],
                          liveUrl: 'https://example.com',
                          githubUrl: 'https://github.com/xhariful',
                          year: '2024',
                          featured: true,
                          highlight: 'New Project',
                        });
                        setIsAddingProject(true);
                        setEditingProjectSlug(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Project</span>
                    </button>
                  )}
                </div>

                {(isAddingProject || editingProjectSlug) && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (isAddingProject) {
                        addProject(projectForm);
                        setIsAddingProject(false);
                      } else if (editingProjectSlug) {
                        editProject(editingProjectSlug, projectForm);
                        setEditingProjectSlug(null);
                      }
                    }}
                    className="p-6 rounded-2xl bg-purple-50/50 dark:bg-zinc-950 border border-purple-200 dark:border-purple-800/40 space-y-4"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Project Title *">
                        <input
                          type="text"
                          required
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="input-field"
                        />
                      </FormField>

                      <FormField label="Category">
                        <select
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                          className="input-field"
                        >
                          <option value="Shopify">Shopify</option>
                          <option value="Full Stack">Full Stack</option>
                          <option value="Python">Python</option>
                          <option value="Frontend">Frontend</option>
                        </select>
                      </FormField>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Live Demo URL">
                        <input
                          type="url"
                          value={projectForm.liveUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                          className="input-field"
                        />
                      </FormField>

                      <FormField label="GitHub Repository URL">
                        <input
                          type="url"
                          value={projectForm.githubUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                          className="input-field"
                        />
                      </FormField>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Highlight Badge (e.g. 34% Uplift)">
                        <input
                          type="text"
                          value={projectForm.highlight || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, highlight: e.target.value })}
                          className="input-field"
                        />
                      </FormField>

                      <FormField label="Year Released">
                        <input
                          type="text"
                          value={projectForm.year}
                          onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                          className="input-field"
                        />
                      </FormField>
                    </div>

                    <FormField label="Project Description *">
                      <textarea
                        rows={3}
                        required
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        className="input-field resize-none"
                      />
                    </FormField>

                    <div className="space-y-2">
                      <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400">
                        Tech Stack Badges:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={projectTechInput}
                          onChange={(e) => setProjectTechInput(e.target.value)}
                          placeholder="e.g. Liquid, Tailwind, React"
                          className="input-field flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (projectTechInput.trim()) {
                              setProjectForm((prev) => ({
                                ...prev,
                                tech: [...prev.tech, projectTechInput.trim()],
                              }));
                              setProjectTechInput('');
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold cursor-pointer"
                        >
                          Add Tech
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {projectForm.tech.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs flex items-center gap-1.5"
                          >
                            <span>{t}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setProjectForm((prev) => ({
                                  ...prev,
                                  tech: prev.tech.filter((_, i) => i !== idx),
                                }))
                              }
                              className="text-rose-500 cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <FormField label="Project Cover Image URL or Upload">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                          <input
                            type="text"
                            value={projectForm.image}
                            onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                            placeholder="https://images.unsplash.com/... or upload"
                            className="input-field flex-1"
                          />
                          <label className="px-4 py-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm flex-shrink-0">
                            <Upload className="w-4 h-4" />
                            <span>Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageFilePick(e.target.files?.[0] || null, (url) =>
                                  setProjectForm({ ...projectForm, image: url })
                                )
                              }
                            />
                          </label>
                        </div>
                      </FormField>

                      {projectForm.image && (
                        <div className="w-32 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-950 relative">
                          <img
                            src={projectForm.image}
                            alt="Cover Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600';
                            }}
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-mono text-center py-0.5">
                            Cover Preview
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase cursor-pointer"
                      >
                        Save Project
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingProject(false);
                          setEditingProjectSlug(null);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  {data.projects.map((proj) => (
                    <div
                      key={proj.slug}
                      className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex flex-col justify-between space-y-3 shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">{proj.title}</h4>
                          <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-mono">
                            {proj.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2">{proj.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.tech.map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 text-[10px] font-mono text-slate-600 dark:text-zinc-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800">
                        <button
                          onClick={() => {
                            setProjectForm({ ...proj });
                            setEditingProjectSlug(proj.slug);
                            setIsAddingProject(false);
                          }}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProject(proj.slug)}
                          className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. STATS TAB */}
            {activeTab === 'stats' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Hero Metric Stats</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Configure key numeric statistics rendered below the hero section.</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {data.stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-3 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-24">
                          <label className="text-[10px] font-mono text-slate-400 uppercase">Value</label>
                          <input
                            type="number"
                            value={stat.value}
                            onChange={(e) => {
                              const nextStats = [...data.stats];
                              nextStats[idx].value = parseInt(e.target.value, 10) || 0;
                              updateStats(nextStats);
                            }}
                            className="input-field text-lg font-bold"
                          />
                        </div>

                        <div className="w-20">
                          <label className="text-[10px] font-mono text-slate-400 uppercase">Suffix</label>
                          <input
                            type="text"
                            value={stat.suffix}
                            onChange={(e) => {
                              const nextStats = [...data.stats];
                              nextStats[idx].suffix = e.target.value;
                              updateStats(nextStats);
                            }}
                            className="input-field text-lg font-bold text-purple-600"
                          />
                        </div>
                      </div>

                      <FormField label="Stat Label">
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const nextStats = [...data.stats];
                            nextStats[idx].label = e.target.value;
                            updateStats(nextStats);
                          }}
                          className="input-field"
                        />
                      </FormField>

                      <FormField label="Description">
                        <input
                          type="text"
                          value={stat.description}
                          onChange={(e) => {
                            const nextStats = [...data.stats];
                            nextStats[idx].description = e.target.value;
                            updateStats(nextStats);
                          }}
                          className="input-field"
                        />
                      </FormField>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. TESTIMONIALS TAB */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Client Testimonials</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Manage client reviews, quotes, star ratings, and roles.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {data.testimonials.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-3 shadow-sm"
                    >
                      <div className="grid sm:grid-cols-2 gap-3">
                        <FormField label="Client Name">
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => {
                              const next = [...data.testimonials];
                              next[idx].name = e.target.value;
                              updateTestimonials(next);
                            }}
                            className="input-field"
                          />
                        </FormField>

                        <FormField label="Client Role / Company">
                          <input
                            type="text"
                            value={t.role}
                            onChange={(e) => {
                              const next = [...data.testimonials];
                              next[idx].role = e.target.value;
                              updateTestimonials(next);
                            }}
                            className="input-field"
                          />
                        </FormField>
                      </div>

                      <FormField label="Testimonial Quote">
                        <textarea
                          rows={2}
                          value={t.quote}
                          onChange={(e) => {
                            const next = [...data.testimonials];
                            next[idx].quote = e.target.value;
                            updateTestimonials(next);
                          }}
                          className="input-field resize-none"
                        />
                      </FormField>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. SECURITY & ACCESS KEYS TAB */}
            {activeTab === 'security' && (
              <div className="space-y-8 max-w-4xl">
                <div className="border-b border-slate-200 dark:border-zinc-800 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Security & Master Access Control</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Change your master login credentials and manage collaborator keys.
                  </p>
                </div>

                {/* Master Admin Username & Password Change */}
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Update Master Credentials</h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Customize your master username and login password.
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (newPassword !== confirmPassword) {
                        showToast('New passwords do not match!');
                        return;
                      }
                      const res = await updateAdminCredentials(oldPassword, newUsername, newPassword);
                      if (res.success) {
                        setOldPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      } else {
                        showToast(res.message || 'Failed to update credentials.');
                      }
                    }}
                    className="space-y-4 max-w-lg pt-2"
                  >
                    <FormField label="Current Password">
                      <input
                        type="password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Enter current master password..."
                        className="input-field"
                      />
                    </FormField>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="New Username">
                        <input
                          type="text"
                          required
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          placeholder="e.g. admin or shariful"
                          className="input-field"
                        />
                      </FormField>

                      <FormField label="New Password">
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 6 characters..."
                          className="input-field"
                        />
                      </FormField>
                    </div>

                    <FormField label="Confirm New Password">
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type new password..."
                        className="input-field"
                      />
                    </FormField>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save New Credentials</span>
                    </button>
                  </form>
                </div>

                {/* Collaborator Access Keys */}
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">Collaborator Access Keys</h4>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                          Issue guest keys without sharing your master password.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Add Key Form */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <input
                      type="text"
                      value={newKeyLabel}
                      onChange={(e) => setNewKeyLabel(e.target.value)}
                      placeholder="Collaborator name e.g. Freelance Client, Assistant..."
                      className="input-field flex-1 text-xs"
                    />
                    <input
                      type="text"
                      value={customKeyInput}
                      onChange={(e) => setCustomKeyInput(e.target.value)}
                      placeholder="Optional custom code..."
                      className="input-field sm:w-48 font-mono text-xs uppercase"
                    />
                    <button
                      onClick={() => {
                        if (!newKeyLabel.trim()) {
                          showToast('Please specify a label for the key.');
                          return;
                        }
                        addCollaboratorKey(newKeyLabel, customKeyInput);
                        setNewKeyLabel('');
                        setCustomKeyInput('');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Generate Key</span>
                    </button>
                  </div>

                  {/* List of Keys */}
                  <div className="space-y-2 pt-2">
                    {securityConfig.collaboratorKeys.map((k) => (
                      <div
                        key={k.id}
                        className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${k.active ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-200 dark:bg-zinc-800 text-slate-400'}`}>
                            <Key className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-sm tracking-wider">{k.key}</span>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${k.active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                                {k.active ? 'Active' : 'Suspended'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">{k.label} • Created: {k.createdAt}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleCollaboratorKey(k.id)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 text-[11px] font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
                          >
                            {k.active ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            onClick={() => deleteCollaboratorKey(k.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                            title="Delete Key"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 10. BACKUP, IMPORT & RESET TAB */}
            {activeTab === 'backup' && (
              <div className="space-y-6 max-w-4xl">
                <div className="border-b border-slate-200 dark:border-zinc-800 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Data Backup & Factory Sync</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Export your custom configurations, import JSON backup files, or reset everything to default state.
                  </p>
                </div>

                {/* Cloud Database Status & Realtime Sync Card */}
                <div className="p-6 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-purple-600 text-white shadow-sm">
                        <Cloud className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">Cloud Firestore Database Sync</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            isCloudConnected
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-500/30'
                          }`}>
                            {isCloudConnected ? 'Connected & Live' : 'Connecting...'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                          Your portfolio data, custom passwords, access keys, and media are hosted in Firebase Firestore. Any visitor or admin logging in from any PC or phone will see the identical updated content in real time.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => syncToCloudNow()}
                      disabled={isSyncingCloud}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all disabled:opacity-50 shrink-0"
                    >
                      <CloudCheck className={`w-4 h-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                      <span>{isSyncingCloud ? 'Syncing...' : 'Force Sync to Cloud'}</span>
                    </button>
                  </div>

                  {lastCloudSyncTime && (
                    <div className="text-[11px] text-purple-700 dark:text-purple-300 font-mono bg-purple-100/70 dark:bg-purple-900/30 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800 flex items-center justify-between">
                      <span>Live Multi-PC Status: Global Firestore synchronization is active.</span>
                      <span>Last Synced: {lastCloudSyncTime}</span>
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Export Box */}
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-3">
                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60 w-fit">
                      <Download className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Export Full JSON Backup</h4>
                    <p className="text-xs text-slate-600 dark:text-zinc-400">
                      Download a complete copy of all your custom profile, education, projects, and skills settings.
                    </p>
                    <button
                      onClick={handleDownloadBackup}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download JSON Backup</span>
                    </button>
                  </div>

                  {/* Reset Box */}
                  <div className="p-6 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-3">
                    <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 w-fit">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Reset to Initial Defaults</h4>
                    <p className="text-xs text-slate-600 dark:text-zinc-400">
                      Restore all original profile, education, and portfolio data back to default template values.
                    </p>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to reset all portfolio data to factory defaults?')) {
                          resetToDefault();
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset to Factory Defaults</span>
                    </button>
                  </div>
                </div>

                {/* Import Box */}
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-4">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Import JSON Configuration</h4>
                  <p className="text-xs text-slate-600 dark:text-zinc-400">
                    Paste raw JSON or upload a saved configuration file to immediately restore your content.
                  </p>
                  <textarea
                    rows={4}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="Paste valid JSON backup string here..."
                    className="input-field font-mono text-xs"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (!jsonInput.trim()) {
                          showToast('Please paste JSON first.');
                          return;
                        }
                        const success = importData(jsonInput);
                        if (success) setJsonInput('');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Load JSON Data</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SEO & FAVICON TAB */}
            {activeTab === 'seo' && (
              <form onSubmit={handleSaveSeo} className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Favicon, Meta Tags & SEO Configuration</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Manage website title, description, Google search snippets, social share card, and browser tab favicon live.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save SEO & Favicon</span>
                  </button>
                </div>

                {/* Live Google Search Preview Card */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    <Search className="w-3.5 h-3.5 text-blue-500" />
                    <span>Google Search Result Snippet Preview</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1.5 shadow-xs">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                      <div className="w-4 h-4 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 dark:border-zinc-700">
                        {seoForm.faviconUrl ? (
                          <img src={seoForm.faviconUrl} alt="Favicon" className="w-3.5 h-3.5 object-contain" />
                        ) : (
                          <Globe className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                      <span className="truncate max-w-xs">{seoForm.canonicalUrl || 'https://sharif-ul-islam.vercel.app/'}</span>
                    </div>
                    <h4 className="text-base font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">
                      {seoForm.metaTitle || 'Shariful Islam - Senior Full-Stack Developer'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {seoForm.metaDescription || 'Add a compelling meta description to rank higher on Google search results.'}
                    </p>
                  </div>
                </div>

                {/* Favicon Settings Section */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Browser Tab Favicon</h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Choose a quick SVG preset icon or upload your custom logo/favicon image.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 flex items-center justify-center shadow-xs">
                        {seoForm.faviconUrl ? (
                          <img src={seoForm.faviconUrl} alt="Favicon preview" className="w-6 h-6 object-contain" />
                        ) : (
                          <Globe className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Preset Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      Quick Favicon Presets:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        {
                          id: 'code',
                          label: 'Code Symbol (<>)',
                          svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="%239333ea"/><path d="M38 35L22 50L38 65M62 35L78 50L62 65" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`
                        },
                        {
                          id: 'monogram',
                          label: 'Letter S Badge',
                          svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="%234f46e5"/><text x="50" y="68" font-family="Arial,sans-serif" font-size="54" font-weight="900" fill="white" text-anchor="middle">S</text></svg>`
                        },
                        {
                          id: 'sparkle',
                          label: 'Sparkle Star (✨)',
                          svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="%230ea5e9"/><path d="M50 20L58 42L80 50L58 58L50 80L42 58L20 50L42 42Z" fill="white"/></svg>`
                        },
                        {
                          id: 'terminal',
                          label: 'Terminal Prompt (>_)',
                          svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="%2318181b"/><path d="M26 34L44 50L26 66M50 66H74" stroke="%23a855f7" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`
                        },
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setSeoForm((prev) => ({
                              ...prev,
                              faviconUrl: preset.svgUrl,
                              faviconPreset: preset.id,
                              faviconType: 'preset',
                            }));
                            showToast(`Applied "${preset.label}" Favicon preset!`);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border cursor-pointer transition-all ${
                            seoForm.faviconPreset === preset.id
                              ? 'bg-purple-50 dark:bg-purple-950 border-purple-500 text-purple-600 dark:text-purple-300 shadow-xs'
                              : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50'
                          }`}
                        >
                          <img src={preset.svgUrl} alt={preset.label} className="w-3.5 h-3.5 object-contain" />
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Favicon URL or Upload */}
                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    <FormField label="Favicon Image URL or Path">
                      <input
                        type="text"
                        value={seoForm.faviconUrl}
                        onChange={(e) => setSeoForm((prev) => ({ ...prev, faviconUrl: e.target.value, faviconPreset: 'custom' }))}
                        placeholder="/favicon.svg or https://..."
                        className="input-field"
                      />
                    </FormField>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        Upload Local Favicon File
                      </label>
                      <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 hover:border-purple-500 bg-white dark:bg-zinc-900 text-xs font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 text-purple-500" />
                        <span>Upload Favicon (.svg, .png, .ico)</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            handleImageFilePick(file || null, (url) => {
                              setSeoForm((prev) => ({ ...prev, faviconUrl: url, faviconPreset: 'custom' }));
                            });
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Primary Meta Tags */}
                <div className="space-y-4">
                  <FormField label="SEO Meta Title (Browser & Search Snippet)">
                    <input
                      type="text"
                      required
                      value={seoForm.metaTitle}
                      onChange={(e) => setSeoForm((prev) => ({ ...prev, metaTitle: e.target.value }))}
                      placeholder="e.g. Shariful Islam - Senior Full-Stack Developer & Shopify Architect"
                      className="input-field"
                    />
                  </FormField>

                  <FormField label="SEO Meta Description (Target: 140 - 160 characters)">
                    <textarea
                      rows={3}
                      required
                      value={seoForm.metaDescription}
                      onChange={(e) => setSeoForm((prev) => ({ ...prev, metaDescription: e.target.value }))}
                      placeholder="Detailed meta description for Google indexing and search rankings..."
                      className="input-field"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                      <span>Google snippet ideal length: 155 characters</span>
                      <span className={seoForm.metaDescription.length > 165 ? 'text-amber-500 font-semibold' : ''}>
                        {seoForm.metaDescription.length} characters
                      </span>
                    </div>
                  </FormField>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField label="Keywords (Comma separated)">
                      <input
                        type="text"
                        value={seoForm.keywords}
                        onChange={(e) => setSeoForm((prev) => ({ ...prev, keywords: e.target.value }))}
                        placeholder="Shariful Islam, Shopify, Full-Stack, React, Liquid..."
                        className="input-field"
                      />
                    </FormField>

                    <FormField label="Author Name">
                      <input
                        type="text"
                        value={seoForm.author}
                        onChange={(e) => setSeoForm((prev) => ({ ...prev, author: e.target.value }))}
                        placeholder="Shariful Islam"
                        className="input-field"
                      />
                    </FormField>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField label="Canonical Website URL">
                      <input
                        type="text"
                        value={seoForm.canonicalUrl}
                        onChange={(e) => setSeoForm((prev) => ({ ...prev, canonicalUrl: e.target.value }))}
                        placeholder="https://sharif-ul-islam.vercel.app/"
                        className="input-field"
                      />
                    </FormField>

                    <FormField label="OpenGraph & Twitter Social Share Image URL">
                      <input
                        type="text"
                        value={seoForm.ogImage}
                        onChange={(e) => setSeoForm((prev) => ({ ...prev, ogImage: e.target.value }))}
                        placeholder="/myname.png or https://..."
                        className="input-field"
                      />
                    </FormField>
                  </div>

                  <FormField label="Google Search Console Verification Code (Optional)">
                    <input
                      type="text"
                      value={seoForm.googleSiteVerification || ''}
                      onChange={(e) => setSeoForm((prev) => ({ ...prev, googleSiteVerification: e.target.value }))}
                      placeholder="e.g. google-site-verification=abc123xyz"
                      className="input-field font-mono text-xs"
                    />
                  </FormField>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All SEO Settings</span>
                  </button>
                </div>
              </form>
            )}

            {/* GREETING POPUP TAB */}
            {activeTab === 'popup' && (
              <form onSubmit={handleSavePopup} className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Greeting & Contact Popup Settings</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Customize the welcome popup timing, headlines, message, and button texts displayed to visitors.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Popup Settings</span>
                  </button>
                </div>

                {/* Enable / Disable Switch */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Enable Greeting Popup</h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Toggle whether the greeting modal automatically displays to new visitors.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={popupForm.enabled}
                      onChange={(e) => setPopupForm((prev) => ({ ...prev, enabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Time-Based Greeting Toggle */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Show Time-Based Badge</h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Displays &quot;Good Morning&quot;, &quot;Good Afternoon&quot;, or &quot;Good Evening&quot; based on client&apos;s local clock.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={popupForm.showTimeGreeting}
                      onChange={(e) => setPopupForm((prev) => ({ ...prev, showTimeGreeting: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Popup Content Form Fields */}
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField label="Display Delay (Milliseconds)">
                      <input
                        type="number"
                        min="500"
                        max="10000"
                        step="100"
                        value={popupForm.delayMs}
                        onChange={(e) => setPopupForm((prev) => ({ ...prev, delayMs: parseInt(e.target.value) || 2400 }))}
                        placeholder="2400 (approx 2.4 seconds)"
                        className="input-field"
                      />
                    </FormField>

                    <FormField label="Call to Action (CTA) Button Text">
                      <input
                        type="text"
                        value={popupForm.ctaText}
                        onChange={(e) => setPopupForm((prev) => ({ ...prev, ctaText: e.target.value }))}
                        placeholder="Let's Talk"
                        className="input-field"
                      />
                    </FormField>
                  </div>

                  <FormField label="Main Headline Question / Greeting">
                    <input
                      type="text"
                      required
                      value={popupForm.headline}
                      onChange={(e) => setPopupForm((prev) => ({ ...prev, headline: e.target.value }))}
                      placeholder="Need a modern website or Shopify store?"
                      className="input-field"
                    />
                  </FormField>

                  <FormField label="Sub-Text / Pitch Message">
                    <textarea
                      rows={3}
                      required
                      value={popupForm.subText}
                      onChange={(e) => setPopupForm((prev) => ({ ...prev, subText: e.target.value }))}
                      placeholder="If you're planning to build or redesign your website, let's talk about your project goals."
                      className="input-field"
                    />
                  </FormField>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField label="Dismiss / Cancel Button Text">
                      <input
                        type="text"
                        value={popupForm.dismissText}
                        onChange={(e) => setPopupForm((prev) => ({ ...prev, dismissText: e.target.value }))}
                        placeholder="Maybe Later"
                        className="input-field"
                      />
                    </FormField>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => {
                          sessionStorage.removeItem('portfolio_greeting_dismissed');
                          showToast('Popup session cache cleared! Refresh or open the site to see it appear.');
                        }}
                        className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                      >
                        Reset Session Cache (Test Popup Now)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Popup Configuration</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

        {/* Global Live Toast Message */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 right-6 px-4 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center gap-2 z-50 pointer-events-none"
            >
              <Check className="w-4 h-4" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// UI Helpers
const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}> = ({ active, onClick, icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
      active
        ? 'bg-purple-600 text-white shadow-sm'
        : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-200/60 dark:hover:bg-zinc-800/60'
    }`}
  >
    <div className="flex items-center gap-2.5">
      {icon}
      <span>{label}</span>
    </div>
    {badge !== undefined && (
      <span
        className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
          active ? 'bg-purple-700 text-white' : 'bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
        }`}
      >
        {badge}
      </span>
    )}
  </button>
);

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400 block">
      {label}
    </label>
    {children}
  </div>
);
