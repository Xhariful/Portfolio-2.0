import React, { useState, useRef, useEffect } from 'react';
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
  ArrowUpRight,
  ChevronDown,
  Wand2,
  Gamepad2,
  GraduationCap,
  Award,
  ArrowRight,
  Laptop
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Magnetic } from './animations/Magnetic';
import { ShimmerButton } from './ui/shimmer-button';

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

  // Dropdown states for desktop
  const [gadgetsOpen, setGadgetsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const gadgetsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const moreTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns on outside click or Esc key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setGadgetsOpen(false);
        setMoreOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setGadgetsOpen(false);
        setMoreOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
      if (gadgetsTimeoutRef.current) clearTimeout(gadgetsTimeoutRef.current);
      if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
    };
  }, []);

  const handleNav = (target: string) => {
    setGadgetsOpen(false);
    setMoreOpen(false);
    setMobileMenuOpen(false);
    onNavigate(target);
  };

  const openGadgets = () => {
    if (gadgetsTimeoutRef.current) clearTimeout(gadgetsTimeoutRef.current);
    setMoreOpen(false);
    setGadgetsOpen(true);
  };

  const closeGadgetsWithDelay = () => {
    if (gadgetsTimeoutRef.current) clearTimeout(gadgetsTimeoutRef.current);
    gadgetsTimeoutRef.current = setTimeout(() => {
      setGadgetsOpen(false);
    }, 180);
  };

  const openMore = () => {
    if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
    setGadgetsOpen(false);
    setMoreOpen(true);
  };

  const closeMoreWithDelay = () => {
    if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
    moreTimeoutRef.current = setTimeout(() => {
      setMoreOpen(false);
    }, 180);
  };

  // Primary top links
  const primaryLinks = [
    { id: 'hero', route: '/', label: 'Home' },
    { id: 'about', route: '/about', label: 'About' },
    { id: 'services', route: '/services', label: 'Services' },
    { id: 'projects', route: '/projects', label: 'Projects' },
  ];

  const secondaryLinks = [
    { id: 'skills', route: '/skills', label: 'Skills' },
    { id: 'reviews', route: '/reviews', label: 'Reviews' },
  ];

  // Gadgets dropdown items: Strictly 2 items as requested (Interactive Tools & Games)
  const gadgetOptions = [
    {
      id: 'interactive-tools',
      title: 'Interactive Tools',
      desc: 'AI Background Remover, Image Compressor, IP Inspector & utilities',
      badge: '3 Tools',
      route: '/tools',
      icon: Wand2,
      badgeColor: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/80',
      iconBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white',
    },
    {
      id: 'games',
      title: 'Games',
      desc: 'Neon Snake arcade, retro challenges & interactive mini games',
      badge: 'Arcade',
      route: '/games',
      icon: Gamepad2,
      badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white',
    },
  ];

  const moreLinks = [
    {
      id: 'education',
      title: 'Academic Education',
      desc: 'Degree, coursework & academic achievements',
      route: '/education',
      icon: GraduationCap,
    },
    {
      id: 'certificates',
      title: 'Professional Certificates',
      desc: 'Industry accreditations and credentials',
      route: '/certificates',
      icon: Award,
    },
  ];

  const isGadgetsActive =
    activeSection === 'gadgets' ||
    activeSection === 'tools' ||
    activeSection === 'games';

  const isMoreActive =
    activeSection === 'education' ||
    activeSection === 'certificates';

  const hasCustomLogoImg = profile.logoUrl && profile.logoUrl.trim().length > 0 && !logoImgError;
  const isImageOnly = profile.logoType === 'image' && hasCustomLogoImg;

  // Dynamic logo zoom, width, and height dimensions from Admin Dashboard
  const customWidth = profile.logoWidth || 130;
  const customHeight = profile.logoHeight || 42;
  const customZoom = (profile.logoZoom || 100) / 100;
  const imageMaxHeight = Math.min(78, Math.max(22, Math.round(customHeight * customZoom)));
  const imageMaxWidth = Math.min(340, Math.max(36, Math.round(customWidth * customZoom)));
  const boxSize = Math.min(68, Math.max(28, Math.round(36 * (customWidth / 120) * customZoom)));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4">
      <div className="max-w-7xl mx-auto" ref={navContainerRef}>
        <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white/90 dark:bg-zinc-900/85 backdrop-blur-xl border border-slate-200/90 dark:border-zinc-800/80 shadow-md shadow-slate-900/5 dark:shadow-none transition-all">
          
          {/* Brand Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/');
            }}
            className="flex items-center gap-3 group cursor-pointer text-left"
          >
            {isImageOnly ? (
              <div className="flex items-center" style={{ height: `${imageMaxHeight + 4}px` }}>
                <img
                  src={profile.logoUrl}
                  alt={profile.logoText || profile.name}
                  loading="eager"
                  decoding="async"
                  onError={() => setLogoImgError(true)}
                  className="w-auto object-contain transition-transform group-hover:scale-105"
                  style={{
                    maxHeight: `${imageMaxHeight}px`,
                    maxWidth: `${Math.round(customWidth * customZoom)}px`,
                  }}
                />
              </div>
            ) : (
              <>
                {hasCustomLogoImg ? (
                  <div
                    style={{ width: `${boxSize}px`, height: `${boxSize}px` }}
                    className="rounded-xl overflow-hidden bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 p-1 shrink-0"
                  >
                    <img
                      src={profile.logoUrl}
                      alt={profile.logoText || profile.name}
                      width={boxSize}
                      height={boxSize}
                      loading="eager"
                      decoding="async"
                      onError={() => setLogoImgError(true)}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div
                    style={{ width: `${boxSize}px`, height: `${boxSize}px` }}
                    className="rounded-xl bg-purple-600 dark:bg-purple-600/20 border border-purple-600 dark:border-purple-500/30 flex items-center justify-center text-white dark:text-purple-300 shadow-xs transition-transform group-hover:scale-105 shrink-0"
                  >
                    {renderLogoIcon(profile.logoIcon)}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                    {profile.logoText || profile.name}
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-purple-600 dark:text-purple-400 line-clamp-1 max-w-[130px] sm:max-w-[200px]">
                    {profile.role.split('&')[0] || profile.role}
                  </span>
                </div>
              </>
            )}
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 dark:bg-zinc-950/60 p-1.5 rounded-xl border border-slate-200/90 dark:border-zinc-800">
            {/* Primary Links */}
            {primaryLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.route}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(item.route);
                  }}
                  className={`relative px-3 py-1.5 rounded-lg text-xs tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-slate-600 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-white/80 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md shadow-purple-600/30"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}

            {/* GADGETS DROPDOWN (Tools & Games) */}
            <div
              className="relative"
              onMouseEnter={openGadgets}
              onMouseLeave={closeGadgetsWithDelay}
            >
              <button
                type="button"
                onClick={() => setGadgetsOpen((prev) => !prev)}
                className={`relative flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs tracking-wide transition-all duration-200 cursor-pointer ${
                  isGadgetsActive
                    ? 'text-white font-bold'
                    : 'text-slate-600 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-white/80 dark:hover:bg-zinc-800/50'
                }`}
                aria-expanded={gadgetsOpen}
                aria-haspopup="true"
              >
                {isGadgetsActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md shadow-purple-600/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>Gadgets</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${gadgetsOpen ? 'rotate-180' : ''}`} />
                </span>
              </button>

              {/* Gadgets Dropdown Menu Floating Card */}
              <AnimatePresence>
                {gadgetsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[340px] sm:w-[360px] rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl p-3 z-50 space-y-2"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-slate-100 dark:border-zinc-800/80">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                        <Laptop className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        <span>Gadgets</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/40">
                        Interactive
                      </span>
                    </div>

                    {/* Only Two Options: Interactive Tools & Games */}
                    <div className="space-y-1.5">
                      {gadgetOptions.map((item) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={item.id}
                            href={item.route}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNav(item.route);
                            }}
                            className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/70 border border-transparent hover:border-slate-200/60 dark:hover:border-zinc-700/60 transition-all cursor-pointer"
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all group-hover:scale-105 shadow-xs ${item.iconBg}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-800 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                  {item.title}
                                </span>
                                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${item.badgeColor}`}>
                                  {item.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all self-center" />
                          </a>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Secondary Links */}
            {secondaryLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.route}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(item.route);
                  }}
                  className={`relative px-3 py-1.5 rounded-lg text-xs tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-slate-600 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-white/80 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md shadow-purple-600/30"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}

            {/* MORE DROPDOWN (Education & Certificates) */}
            <div
              className="relative"
              onMouseEnter={openMore}
              onMouseLeave={closeMoreWithDelay}
            >
              <button
                type="button"
                onClick={() => setMoreOpen((prev) => !prev)}
                className={`relative flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs tracking-wide transition-all duration-200 cursor-pointer ${
                  isMoreActive
                    ? 'text-white font-bold'
                    : 'text-slate-600 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-white/80 dark:hover:bg-zinc-800/50'
                }`}
                aria-expanded={moreOpen}
                aria-haspopup="true"
              >
                {isMoreActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md shadow-purple-600/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <span>More</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
                </span>
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl p-2 z-50 space-y-1"
                  >
                    {moreLinks.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.id;
                      return (
                        <a
                          key={item.id}
                          href={item.route}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNav(item.route);
                          }}
                          className={`flex items-start gap-2.5 p-2 rounded-xl transition-all cursor-pointer ${
                            isActive
                              ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-semibold'
                              : 'hover:bg-slate-50 dark:hover:bg-zinc-800/70 text-slate-700 dark:text-zinc-300'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0 mt-0.5 text-purple-600 dark:text-purple-400" />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold block truncate">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-zinc-500 block truncate">
                              {item.desc}
                            </span>
                          </div>
                        </a>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <Magnetic strength={0.3}>
              <button
                onClick={onToggleTheme}
                aria-label="Toggle Dark/Light Mode"
                className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/90 dark:border-zinc-700/60 text-slate-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer shadow-xs"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>
            </Magnetic>

            {/* Quick Contact CTA with Shimmer Beam */}
            <Magnetic strength={0.25}>
              <ShimmerButton
                onClick={() => handleNav('contact')}
                shimmerColor="#ffffff"
                shimmerDuration="3.5s"
                background="linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)"
                borderRadius="0.75rem"
                className="hidden sm:inline-flex px-3.5 py-1.5 text-xs"
              >
                <span>Contact</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </ShimmerButton>
            </Magnetic>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open Navigation Menu"
              className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200/90 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 cursor-pointer shadow-xs"
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
              className="lg:hidden mt-2 p-4 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl space-y-3 max-h-[82vh] overflow-y-auto"
            >
              {/* Primary Pages Grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'hero', route: '/', label: 'Home' },
                  { id: 'about', route: '/about', label: 'About' },
                  { id: 'services', route: '/services', label: 'Services' },
                  { id: 'projects', route: '/projects', label: 'Projects' },
                  { id: 'skills', route: '/skills', label: 'Skills' },
                  { id: 'reviews', route: '/reviews', label: 'Reviews' },
                  { id: 'education', route: '/education', label: 'Education' },
                  { id: 'certificates', route: '/certificates', label: 'Certificates' },
                ].map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.route}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNav(item.route);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-600/25'
                          : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-800 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>

              {/* Dedicated Gadgets & Studio Mobile Card */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-950/70 border border-slate-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <Laptop className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Gadgets</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300">
                    Interactive
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-1">
                  {gadgetOptions.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.id}
                        href={item.route}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNav(item.route);
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 hover:border-purple-500 transition-colors cursor-pointer"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</span>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${item.badgeColor}`}>{item.badge}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">{item.desc}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Contact Button */}
              <div className="pt-1">
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/contact');
                  }}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer text-center shadow-lg shadow-purple-600/30"
                >
                  <span>Contact Shariful</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
};
