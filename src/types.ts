export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
}

export interface ProfileData {
  name: string;
  role: string;
  badge: string;
  experienceYears: string;
  headlines: string[];
  tagline: string;
  bio: string;
  location: string;
  timezone: string;
  responseTime: string;
  email: string;
  phone: string;
  whatsapp: string;
  resumeUrl: string;
  socials: SocialLinks;
  
  // Brand & Logo Customization
  logoUrl?: string;
  logoText?: string;
  logoIcon?: string;
  logoType?: 'image' | 'text' | 'combined';
  logoWidth?: number;

  // Website Custom Images
  heroImage?: string;
  aboutImage?: string;
  avatarUrl?: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export interface SkillItem {
  name: string;
  level: number;
  years: number;
}

export interface SkillCategory {
  id: string;
  title: string;
  highlight: string;
  skills: SkillItem[];
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

export interface ProjectItem {
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  year: string;
  featured: boolean;
  highlight?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  period: string;
  grade?: string;
  location?: string;
  description: string;
  highlights: string[];
}

export interface WorkExperienceItem {
  id?: string;
  period: string;
  role: string;
  company: string;
  description: string;
  skills: string[];
}

export interface CertificationItem {
  title: string;
  org: string;
  date: string;
  id: string;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  rating: number;
}

export interface AchievementItem {
  category: string;
  title: string;
  organization: string;
  year: string;
  description: string;
}

export interface SeoConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  author: string;
  canonicalUrl: string;
  ogImage: string;
  faviconUrl: string;
  faviconType?: 'preset' | 'custom';
  faviconPreset?: string;
  googleSiteVerification?: string;
  structuredDataEnabled?: boolean;
}

export interface WelcomePopupConfig {
  enabled: boolean;
  delayMs: number;
  headline: string;
  subText: string;
  ctaText: string;
  dismissText: string;
  showTimeGreeting: boolean;
}

export interface PortfolioData {
  profile: ProfileData;
  stats: StatItem[];
  skillCategories: SkillCategory[];
  services: ServiceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  workTimeline: WorkExperienceItem[];
  certifications: CertificationItem[];
  testimonials: TestimonialItem[];
  achievements: AchievementItem[];
  seo?: SeoConfig;
  welcomePopup?: WelcomePopupConfig;
}

export interface SecurityCredentials {
  adminUsername: string;
  adminPasswordHash: string; // Plain or hashed string for client-side storage
  salt: string;
  isCredentialsCustomized: boolean;
  updatedAt: string;
}

export interface CollaboratorKey {
  id: string;
  key: string;
  label: string;
  createdAt: string;
  active: boolean;
}

export interface SecurityConfig {
  credentials: SecurityCredentials;
  collaboratorKeys: CollaboratorKey[];
}

export interface AuthenticatedUser {
  username: string;
  role: 'admin' | 'collaborator';
  keyLabel?: string;
  authenticatedAt: string;
}

