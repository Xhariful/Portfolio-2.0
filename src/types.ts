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
  id: string;
  title: string;
  org: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl?: string;
  description?: string;
  skills?: string[];
  category?: string;
}

export interface TestimonialItem {
  id?: string;
  quote: string;
  name: string;
  role: string;
  company?: string;
  rating: number;
  avatarUrl?: string;
  project?: string;
  date?: string;
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
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export interface BackgroundEffectsConfig {
  floatingParticles: boolean;
  quantity?: number;
  color?: string;
  speed?: number;
  depth?: number;
  radius?: number;
  opacity?: number;
  connectParticles?: boolean;
  mobileTouchEffect?: boolean;
  touchGlowColor?: string;
}

export interface InquiryItem {
  id?: string;
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  targetEmail?: string;
  status?: 'new' | 'replied' | 'archived';
  createdAt: string;
}

export interface BeamNodeItem {
  id: string; // e.g. 'node-1' to 'node-9'
  title: string; // If empty string or whitespace, this element is NOT shown and its beam is not drawn!
  subtitle?: string; // Optional badge or descriptive subtext
  icon: string; // Preset icon key or Lucide icon name
  iconUrl?: string; // Optional custom uploaded icon image URL
  position: 'left' | 'center' | 'right'; // Left column, Center core hub, Right column
  connectedTo?: string; // id of target node to connect to (e.g. 'node-center')
  color?: string; // Accent color hex
  curvature?: number; // Curve angle
  reverse?: boolean; // Reverse flow animation direction
}

export interface AnimatedBeamConfig {
  enabled: boolean;
  sectionBadge?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  beamDuration?: number;
  beamPathColor?: string;
  gradientStartColor?: string;
  gradientStopColor?: string;
  nodes: BeamNodeItem[]; // Maximum 9 items!
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
  backgroundEffects?: BackgroundEffectsConfig;
  animatedBeam?: AnimatedBeamConfig;
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

