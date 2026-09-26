import React, { useState, useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { EducationSection } from './components/EducationSection';
import { CertificatesSection } from './components/CertificatesSection';
import { SkillsSection } from './components/SkillsSection';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLenisScroll, getLenis } from './hooks/useLenisScroll';
import { ScrollProgress } from './components/animations/ScrollProgress';
import { CustomCursor } from './components/animations/CustomCursor';
import { MobileTouchEffect } from './components/animations/MobileTouchEffect';
import { ScrollReveal } from './components/animations/ScrollReveal';
import { Floating3DParticles } from './components/ui/floating-3d-particles';
import { InitialLoader } from './components/animations/InitialLoader';

// Lazy-load non-critical modals and heavy admin portal to keep mobile bundle ultra-lightweight
const WelcomeGreetingModal = React.lazy(() =>
  import('./components/WelcomeGreetingModal').then((m) => ({ default: m.WelcomeGreetingModal }))
);
const AdminLoginModal = React.lazy(() =>
  import('./components/AdminLoginModal').then((m) => ({ default: m.AdminLoginModal }))
);
const AdminDashboard = React.lazy(() =>
  import('./components/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);

function PortfolioApp() {
  // Initialize buttery-smooth Lenis inertial scroll linked with GSAP ScrollTrigger
  useLenisScroll();

  const [activeSection, setActiveSection] = useState('hero');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_theme');
      if (saved) return saved === 'dark';
    }
    return true;
  });
  const { data, toastMessage } = usePortfolio();
  const bgFx = data.backgroundEffects;

  // Synchronize and apply theme across documentElement and body
  const applyTheme = (dark: boolean) => {
    setIsDark(dark);
    const root = document.documentElement;
    const body = document.body;

    if (dark) {
      root.classList.add('dark');
      root.classList.remove('light');
      if (body) {
        body.classList.add('dark');
        body.classList.remove('light');
      }
      try {
        localStorage.setItem('portfolio_theme', 'dark');
      } catch (e) {}
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      if (body) {
        body.classList.remove('dark');
        body.classList.add('light');
      }
      try {
        localStorage.setItem('portfolio_theme', 'light');
      } catch (e) {}
    }
  };

  const toggleTheme = () => {
    applyTheme(!isDark);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio_theme');
      const prefersDark = saved !== null ? saved === 'dark' : true;
      applyTheme(prefersDark);
    } catch (e) {
      applyTheme(true);
    }
  }, []);

  // Section Observer for Active Nav
  useEffect(() => {
    const sectionIds = [
      'hero',
      'about',
      'education',
      'certificates',
      'skills',
      'services',
      'projects',
      'reviews',
      'contact',
    ];
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // When near or at the bottom of the page, highlight 'contact'
      if (scrollY + windowHeight >= fullHeight - 80) {
        setActiveSection('contact');
        return;
      }

      // When near top of the page, highlight 'hero'
      if (scrollY < 120) {
        setActiveSection('hero');
        return;
      }

      // Viewport probe point (offset 160px down from viewport top to account for floating navbar)
      const probePosition = scrollY + 160;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id) || (id === 'reviews' ? document.getElementById('testimonials') : null);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollY;
          if (probePosition >= elementTop) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const targetId = sectionId === 'testimonials' ? 'reviews' : sectionId;
    const element = document.getElementById(targetId) || document.getElementById(sectionId);
    if (element) {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(element, { offset: -90, duration: 1.15 });
      } else {
        const navOffset = 90; // Fixed navbar buffer
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 selection:bg-purple-600 selection:text-white transition-colors duration-300 antialiased relative">
      {/* Dynamic Initial Loading Screen with Photo/Avatar & Orbital High-Tech Animation */}
      <InitialLoader config={data.initialLoader} />

      {/* Magic UI Floating 3D Particles Background Effect */}
      {bgFx?.floatingParticles !== false && (
        <Floating3DParticles
          className="fixed inset-0 pointer-events-none z-0"
          quantity={bgFx?.quantity ?? 220}
          color={bgFx?.color ?? (isDark ? '#8B5CF6' : '#7c3aed')}
          speed={bgFx?.speed ?? 0.35}
          depth={bgFx?.depth ?? 0.65}
          radius={bgFx?.radius ?? 1.6}
          opacity={bgFx?.opacity ?? (isDark ? 0.55 : 0.35)}
          connectParticles={bgFx?.connectParticles ?? true}
        />
      )}

      {/* Top GSAP Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Pro-Level Interactive Fluid Custom Cursor (Desktop) */}
      <CustomCursor />

      {/* Pro-Level Interactive Touch Ripple & Hover Halo Effect (Mobile & Tablets) */}
      <MobileTouchEffect
        enabled={bgFx?.mobileTouchEffect !== false}
        color={bgFx?.touchGlowColor || bgFx?.color || '#8B5CF6'}
      />

      {/* Floating Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Sections */}
      <main className="space-y-0">
        {/* Clean, Modern Hero Section */}
        <HeroSection
          onContactClick={() => scrollToSection('contact')}
          onProjectsClick={() => scrollToSection('projects')}
        />

        {/* About & Credentials */}
        <ScrollReveal direction="up" distance={36} duration={0.7} blur amount={0.06}>
          <AboutSection onContactClick={() => scrollToSection('contact')} />
        </ScrollReveal>

        {/* Education & Courses */}
        <ScrollReveal direction="up" distance={36} duration={0.7} blur amount={0.06}>
          <EducationSection />
        </ScrollReveal>

        {/* Professional Certifications */}
        <ScrollReveal direction="up" distance={36} duration={0.7} blur amount={0.06}>
          <CertificatesSection />
        </ScrollReveal>

        {/* Technical Skills Matrix with Core Technologies Ticker */}
        <ScrollReveal direction="up" distance={36} duration={0.7} blur amount={0.06}>
          <SkillsSection />
        </ScrollReveal>

        {/* Services & Offerings */}
        <ScrollReveal direction="up" distance={36} duration={0.7} blur amount={0.06}>
          <ServicesSection onContactClick={() => scrollToSection('contact')} />
        </ScrollReveal>

        {/* Featured Projects & Case Studies */}
        <ScrollReveal direction="up" distance={36} duration={0.7} blur amount={0.06}>
          <ProjectsSection />
        </ScrollReveal>

        {/* Client Endorsements & Store Reviews */}
        <ScrollReveal direction="up" distance={36} duration={0.7} blur amount={0.06}>
          <TestimonialsSection />
        </ScrollReveal>

        {/* Contact & Proposal Form */}
        <ScrollReveal direction="up" distance={36} duration={0.7} blur amount={0.06}>
          <ContactSection />
        </ScrollReveal>
      </main>

      {/* Footer */}
      <ScrollReveal direction="up" distance={32} duration={0.7} blur amount={0.05}>
        <Footer onNavigate={scrollToSection} />
      </ScrollReveal>

      {/* Floating Back To Top Button (Shows on scroll at bottom right) */}
      <BackToTop />

      {/* Lazy Loaded Admin Portal & Modals */}
      <React.Suspense fallback={null}>
        {/* Dynamic Time-Based Greeting & Project Inquiry Popup */}
        <WelcomeGreetingModal onContactClick={() => scrollToSection('contact')} />

        {/* Admin Login Popup (Triggered when accessing /admin or shortcut Ctrl+Shift+A) */}
        <AdminLoginModal />

        {/* Admin Content Management Dashboard Modal (Accessible only after successful authentication) */}
        <AdminDashboard />
      </React.Suspense>

      {/* Live Toast Feedback Notification */}
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
}

export default function App() {
  return (
    <ErrorBoundary>
      <PortfolioProvider>
        <PortfolioApp />
      </PortfolioProvider>
    </ErrorBoundary>
  );
}
