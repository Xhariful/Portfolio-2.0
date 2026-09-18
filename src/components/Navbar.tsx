import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code2,
  ShoppingBag,
  Sparkles,
  Terminal,
  Zap,
  Layers,
  Cpu,
  Menu,
  X,
  Sun,
  Moon,
  ArrowUpRight
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Magnetic } from './animations/Magnetic';

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

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  isDark,
  onToggleTheme,
}) => {
  const { data } = usePortfolio();
  const { profile } = data;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoImgError, setLogoImgError] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'education', label: 'Education & Courses' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'skills', label: 'Skills' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const hasCustomLogoImg = profile.logoUrl && profile.logoUrl.trim().length > 0 && !logoImgError;
  const isImageOnly = profile.logoType === 'image' && hasCustomLogoImg;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-white/90 dark:bg-zinc-900/85 backdrop-blur-xl border border-slate-200/90 dark:border-zinc-800/80 shadow-md shadow-slate-900/5 dark:shadow-none transition-all">
          
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('hero')}
            className="flex items-center gap-3 group cursor-pointer text-left"
          >
            {isImageOnly ? (
              <div className="h-9 flex items-center">
                <img
                  src={profile.logoUrl}
                  alt={profile.logoText || profile.name}
                  width={140}
                  height={36}
                  loading="eager"
                  decoding="async"
                  onError={() => setLogoImgError(true)}
                  className="max-h-9 w-auto max-w-[160px] sm:max-w-[200px] object-contain transition-transform group-hover:scale-105"
                  style={{ maxHeight: `${profile.logoWidth ? Math.min(48, Math.max(28, profile.logoWidth / 3)) : 36}px` }}
                />
              </div>
            ) : (
              <>
                {hasCustomLogoImg ? (
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 p-1">
                    <img
                      src={profile.logoUrl}
                      alt={profile.logoText || profile.name}
                      width={36}
                      height={36}
                      loading="eager"
                      decoding="async"
                      onError={() => setLogoImgError(true)}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-purple-600 dark:bg-purple-600/20 border border-purple-600 dark:border-purple-500/30 flex items-center justify-center text-white dark:text-purple-300 shadow-xs transition-transform group-hover:scale-105">
                    {renderLogoIcon(profile.logoIcon)}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                    {profile.logoText || profile.name}
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-purple-600 dark:text-purple-400 line-clamp-1 max-w-[140px] sm:max-w-[200px]">
                    {profile.role.split('&')[0] || profile.role}
                  </span>
                </div>
              </>
            )}
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 dark:bg-zinc-950/60 p-1.5 rounded-xl border border-slate-200/90 dark:border-zinc-800">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-700 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-white/80 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-purple-600 rounded-lg -z-10 shadow-xs"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <Magnetic strength={0.3}>
              <button
                onClick={onToggleTheme}
                aria-label="Toggle Dark/Light Mode"
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/90 dark:border-zinc-700/60 text-slate-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer shadow-xs"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>
            </Magnetic>

            {/* Quick Contact CTA */}
            <Magnetic strength={0.25}>
              <button
                onClick={() => handleNav('contact')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs tracking-wide shadow-xs hover:shadow-sm transition-all cursor-pointer"
              >
                <span>Contact</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </Magnetic>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open Navigation Menu"
              className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200/90 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 cursor-pointer shadow-xs"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-2 p-4 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-slate-200 dark:border-zinc-800 shadow-xl space-y-2"
            >
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-zinc-800">
                <button
                  onClick={() => handleNav('contact')}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Contact</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
};
