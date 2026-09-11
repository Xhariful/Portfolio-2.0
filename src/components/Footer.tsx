import React, { useState, useEffect } from 'react';
import {
  Code2,
  ShoppingBag,
  Sparkles,
  Terminal,
  Zap,
  Layers,
  Cpu,
  Mail,
  MessageSquare,
  Globe,
  Clock,
  ArrowUpRight,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Check
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

// Helper to render dynamic logo icon
const renderLogoIcon = (iconName?: string) => {
  switch (iconName) {
    case 'shopping-bag': return <ShoppingBag className="w-4 h-4" />;
    case 'sparkles': return <Sparkles className="w-4 h-4" />;
    case 'terminal': return <Terminal className="w-4 h-4" />;
    case 'zap': return <Zap className="w-4 h-4" />;
    case 'layers': return <Layers className="w-4 h-4" />;
    case 'cpu': return <Cpu className="w-4 h-4" />;
    default: return <Code2 className="w-4 h-4" />;
  }
};

export const Footer: React.FC<{ onNavigate: (sectionId: string) => void }> = ({ onNavigate }) => {
  const { data } = usePortfolio();
  const { profile } = data;
  const [logoImgError, setLogoImgError] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Live Dhaka Timezone clock (UTC+6)
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeString = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Dhaka',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(now);
        setCurrentTime(timeString);
      } catch {
        setCurrentTime('UTC+6');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyEmail = () => {
    if (profile.email) {
      navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const hasCustomLogoImg = profile.logoUrl && profile.logoUrl.trim().length > 0 && !logoImgError;
  const isImageOnly = profile.logoType === 'image' && hasCustomLogoImg;

  return (
    <footer className="relative border-t border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden text-slate-600 dark:text-zinc-400">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-sky-500/5 dark:bg-sky-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Bento Top Banner: Fast Action & Project Collaboration */}
        <div className="rounded-3xl p-6 sm:p-8 bg-slate-50 dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 shadow-xs dark:shadow-none">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Available for new projects & contracts
                </span>
                {currentTime && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-slate-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700/60">
                    <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    Dhaka: {currentTime} (UTC+6)
                  </span>
                )}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Ready to elevate your digital presence?
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-xl">
                Whether you need a custom high-converting Shopify store, a scalable Python backend, or a modern web experience, let's turn your ideas into reality.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-start lg:justify-end gap-3">
              <button
                onClick={copyEmail}
                className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs hover:shadow-sm transition-all cursor-pointer"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-300" /> : <Mail className="w-4 h-4" />}
                <span>{copiedEmail ? 'Email Copied!' : 'Copy Email Address'}</span>
              </button>

              {profile.socials?.whatsapp && (
                <a
                  href={profile.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Middle Multi-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pt-4">
          
          {/* Col 1: Brand & Logo Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <button
              onClick={() => onNavigate('hero')}
              className="flex items-center gap-3 group text-left cursor-pointer"
            >
              {isImageOnly ? (
                <div className="h-9 flex items-center">
                  <img
                    src={profile.logoUrl}
                    alt={profile.logoText || profile.name}
                    onError={() => setLogoImgError(true)}
                    className="max-h-9 w-auto max-w-[160px] object-contain transition-transform group-hover:scale-105"
                  />
                </div>
              ) : (
                <>
                  {hasCustomLogoImg ? (
                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center shadow-sm p-1 transition-transform group-hover:scale-105">
                      <img
                        src={profile.logoUrl}
                        alt={profile.logoText || profile.name}
                        onError={() => setLogoImgError(true)}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-purple-600 dark:bg-purple-600/20 border border-purple-600 dark:border-purple-500/30 flex items-center justify-center text-white dark:text-purple-300 shadow-sm transition-transform group-hover:scale-105">
                      {renderLogoIcon(profile.logoIcon)}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                      {profile.logoText || profile.name}
                    </span>
                    <span className="text-xs font-mono text-purple-600 dark:text-purple-400">
                      {profile.role ? profile.role.split('&')[0] : 'Full-Stack Developer'}
                    </span>
                  </div>
                </>
              )}
            </button>

            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed max-w-sm">
              {profile.tagline || profile.bio.slice(0, 160) + '...'}
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400 pt-1">
              <Globe className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{profile.location || 'Dhaka, Bangladesh · Remote'}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (2.5 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigation
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <button onClick={() => onNavigate('hero')} className="text-left hover:text-purple-600 dark:hover:text-white transition-colors cursor-pointer py-1">
                Home
              </button>
              <button onClick={() => onNavigate('about')} className="text-left hover:text-purple-600 dark:hover:text-white transition-colors cursor-pointer py-1">
                About Me
              </button>
              <button onClick={() => onNavigate('education')} className="text-left hover:text-purple-600 dark:hover:text-white transition-colors cursor-pointer py-1">
                Education
              </button>
              <button onClick={() => onNavigate('core-skills')} className="text-left hover:text-purple-600 dark:hover:text-white transition-colors cursor-pointer py-1">
                Core Skills
              </button>
              <button onClick={() => onNavigate('skills')} className="text-left hover:text-purple-600 dark:hover:text-white transition-colors cursor-pointer py-1">
                Skills Stack
              </button>
              <button onClick={() => onNavigate('services')} className="text-left hover:text-purple-600 dark:hover:text-white transition-colors cursor-pointer py-1">
                Services
              </button>
              <button onClick={() => onNavigate('projects')} className="text-left hover:text-purple-600 dark:hover:text-white transition-colors cursor-pointer py-1">
                Projects
              </button>
              <button onClick={() => onNavigate('contact')} className="text-left hover:text-purple-600 dark:hover:text-white transition-colors cursor-pointer py-1">
                Get in Touch
              </button>
            </div>
          </div>

          {/* Col 3: Core Technology Badges (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Tech Expertise
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
              <span className="px-2 py-1 rounded-md bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">Shopify 2.0</span>
              <span className="px-2 py-1 rounded-md bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">Liquid</span>
              <span className="px-2 py-1 rounded-md bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">Python</span>
              <span className="px-2 py-1 rounded-md bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">Django REST</span>
              <span className="px-2 py-1 rounded-md bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">React.js</span>
              <span className="px-2 py-1 rounded-md bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">Next.js</span>
              <span className="px-2 py-1 rounded-md bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">Tailwind CSS</span>
              <span className="px-2 py-1 rounded-md bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">PostgreSQL</span>
            </div>
          </div>

          {/* Col 4: Connect & Social Channels (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Connect & Socials
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {profile.socials?.github && (
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-white hover:border-purple-300 dark:hover:border-purple-600 transition-all cursor-pointer shadow-xs"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.socials?.linkedin && (
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-white hover:border-purple-300 dark:hover:border-purple-600 transition-all cursor-pointer shadow-xs"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.socials?.twitter && (
                <a
                  href={profile.socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-white hover:border-purple-300 dark:hover:border-purple-600 transition-all cursor-pointer shadow-xs"
                  title="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile.socials?.facebook && (
                <a
                  href={profile.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-white hover:border-purple-300 dark:hover:border-purple-600 transition-all cursor-pointer shadow-xs"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {profile.socials?.instagram && (
                <a
                  href={profile.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-white hover:border-purple-300 dark:hover:border-purple-600 transition-all cursor-pointer shadow-xs"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {profile.socials?.whatsapp && (
                <a
                  href={profile.socials.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 transition-all cursor-pointer shadow-xs"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="pt-2">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 font-mono transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{profile.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-zinc-500">
          <div className="flex items-center gap-2">
            <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-purple-600 dark:text-purple-400 font-mono">Senior Full-Stack & Shopify</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 dark:text-zinc-500 text-[11px] font-mono">
              Designed & Built with React & Tailwind
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
