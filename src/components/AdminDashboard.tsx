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
  FileImage
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
  AchievementItem
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
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<
    | 'profile'
    | 'media'
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

  // JSON Import state
  const [jsonInput, setJsonInput] = useState('');

  // Synchronize profile form if data changes externally
  React.useEffect(() => {
    setProfileForm(data.profile);
  }, [data.profile]);

  if (!isDashboardOpen) return null;

  // Handle Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
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
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-semibold">
                  LIVE SYNC ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                All changes automatically connect to the live website and save to browser storage.
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
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Skills & Proficiency Matrix</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Adjust percentages, experience years, and skill category definitions.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {data.skillCategories.map((cat, catIdx) => (
                    <div
                      key={cat.id}
                      className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-purple-600 dark:text-purple-400 font-bold">
                            {cat.highlight}
                          </span>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white">{cat.title}</h4>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        {cat.skills.map((skill, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">{skill.name}</span>
                              <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">
                                {skill.level}%
                              </span>
                            </div>

                            <input
                              type="range"
                              min="30"
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
                              <input
                                type="number"
                                min="1"
                                max="20"
                                value={skill.years}
                                onChange={(e) => {
                                  const years = parseInt(e.target.value, 10) || 1;
                                  const nextCategories = [...data.skillCategories];
                                  nextCategories[catIdx].skills[sIdx].years = years;
                                  updateSkillCategories(nextCategories);
                                }}
                                className="w-16 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-right"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
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
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Update Master Credentials (ইউজারনেম ও পাসওয়ার্ড)</h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Customize your master username and login password.
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newPassword !== confirmPassword) {
                        showToast('New passwords do not match!');
                        return;
                      }
                      const res = updateAdminCredentials(oldPassword, newUsername, newPassword);
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
                    <FormField label="Current Password (বর্তমান পাসওয়ার্ড)">
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
                      <FormField label="New Username (নতুন ইউজারনেম)">
                        <input
                          type="text"
                          required
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          placeholder="e.g. admin or shariful"
                          className="input-field"
                        />
                      </FormField>

                      <FormField label="New Password (নতুন পাসওয়ার্ড)">
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

                    <FormField label="Confirm New Password (পাসওয়ার্ড নিশ্চিত করুন)">
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
