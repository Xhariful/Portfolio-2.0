import React, { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BackToTop } from './BackToTop';
import { ScrollProgress } from './animations/ScrollProgress';
import { CustomCursor } from './animations/CustomCursor';
import { MobileTouchEffect } from './animations/MobileTouchEffect';
import { Floating3DParticles } from './ui/floating-3d-particles';
import { usePortfolio } from '../context/PortfolioContext';
import { getPageSeo, applyPageSeo } from '../utils/seoData';
import {
  ChevronRight,
  Home,
  ArrowLeft,
  Sparkles,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PageLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  children: React.ReactNode;
  hideHeaderHero?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  currentPath,
  onNavigate,
  isDark,
  onToggleTheme,
  children,
  hideHeaderHero = false,
}) => {
  const { data, toastMessage } = usePortfolio();
  const bgFx = data.backgroundEffects;
  const seoInfo = getPageSeo(currentPath, data.seo);

  // Apply SEO to head on path or seo change
  useEffect(() => {
    applyPageSeo(currentPath, data.seo);
  }, [currentPath, data.seo]);

  // Map route to active nav id
  const getActiveNavId = (path: string): string => {
    if (path === '/') return 'hero';
    if (path.startsWith('/about')) return 'about';
    if (path.startsWith('/education')) return 'education';
    if (path.startsWith('/certificates')) return 'certificates';
    if (path.startsWith('/skills')) return 'skills';
    if (path.startsWith('/services')) return 'services';
    if (path.startsWith('/projects')) return 'projects';
    if (path.startsWith('/reviews') || path.startsWith('/testimonials')) return 'reviews';
    if (path.startsWith('/contact')) return 'contact';
    if (path.startsWith('/tools') || path.startsWith('/games')) return 'gadgets';
    return 'hero';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 selection:bg-purple-600 selection:text-white transition-colors duration-300 antialiased relative flex flex-col justify-between">
      {/* Magic UI Floating 3D Particles Background Effect */}
      {bgFx?.floatingParticles !== false && (
        <Floating3DParticles
          key={`particles-page-${bgFx?.color || 'default'}-${isDark ? 'dark' : 'light'}`}
          className="fixed inset-0 pointer-events-none z-0"
          quantity={bgFx?.quantity ?? 160}
          color={bgFx?.color || (isDark ? '#8B5CF6' : '#7c3aed')}
          speed={bgFx?.speed ?? 0.3}
          depth={bgFx?.depth ?? 0.6}
          radius={bgFx?.radius ?? 1.5}
          opacity={bgFx?.opacity ?? (isDark ? 0.55 : 0.4)}
          connectParticles={bgFx?.connectParticles ?? true}
        />
      )}

      {/* Top Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Custom Cursor */}
      <CustomCursor color={bgFx?.touchGlowColor || bgFx?.color || '#8B5CF6'} />

      {/* Mobile Touch Ripple Effect */}
      <MobileTouchEffect
        enabled={bgFx?.mobileTouchEffect !== false}
        color={bgFx?.touchGlowColor || bgFx?.color || '#8B5CF6'}
      />

      {/* Fixed Navigation Bar */}
      <Navbar
        activeSection={getActiveNavId(currentPath)}
        onNavigate={(target) => {
          if (target === 'hero' || target === 'home') {
            onNavigate('/');
          } else if (target.startsWith('/')) {
            onNavigate(target);
          } else {
            onNavigate(`/${target}`);
          }
        }}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
      />

      {/* Main Page Content Area */}
      <main className="flex-1 pt-24 sm:pt-28 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation Bar & Back to Home Button */}
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center justify-between gap-3 py-2 px-4 rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 shadow-xs">
            <ol className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/')}
                  className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Home</span>
                </button>
              </li>
              {seoInfo.breadcrumbs.slice(1).map((crumb, idx) => {
                const isLast = idx === seoInfo.breadcrumbs.length - 2;
                return (
                  <li key={crumb.path} className="flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-slate-400 dark:text-zinc-600" />
                    {isLast ? (
                      <span className="text-purple-600 dark:text-purple-400 font-semibold" aria-current="page">
                        {crumb.name}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onNavigate(crumb.path)}
                        className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                      >
                        {crumb.name}
                      </button>
                    )}
                  </li>
                );
              })}
            </ol>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Full Landing Page</span>
            </button>
          </nav>

          {/* Dedicated Page Hero Header */}
          {!hideHeaderHero && (
            <header className="mb-10 text-center max-w-3xl mx-auto space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 backdrop-blur-xs text-purple-700 dark:text-purple-300 text-xs font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{seoInfo.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                {seoInfo.headline}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                {seoInfo.subheadline}
              </p>
            </header>
          )}

          {/* Children section content */}
          <div className="relative">
            {children}
          </div>

          {/* Bottom Conversion CTA Banner */}
          <div className="mt-20 rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-purple-900/20 via-indigo-900/20 to-purple-900/20 border border-purple-500/30 backdrop-blur-md relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                NEED A HIGH-PERFORMANCE WEB SOLUTION?
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Let's turn your vision into pixel-perfect reality.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
                Available for custom Shopify theme builds, React web apps, Python backends, or technical store optimization.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wide flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/services')}
                className="px-5 py-3 rounded-2xl bg-white dark:bg-zinc-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                View Services
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Shared Global Footer */}
      <Footer
        onNavigate={(target) => {
          if (target === 'hero' || target === 'home') {
            onNavigate('/');
          } else if (target.startsWith('/')) {
            onNavigate(target);
          } else {
            onNavigate(`/${target}`);
          }
        }}
      />

      {/* Floating Back To Top Button */}
      <BackToTop />

      {/* Live Toast Notification Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-2xl border border-zinc-700 dark:border-zinc-300 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
