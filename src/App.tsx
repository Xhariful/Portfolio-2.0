import React, { useState, useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { EducationSection } from './components/EducationSection';
import { SkillsSection } from './components/SkillsSection';
import { CoreSkillsSection } from './components/CoreSkillsSection';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { WelcomeGreetingModal } from './components/WelcomeGreetingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function PortfolioApp() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_theme');
      if (saved) return saved === 'dark';
    }
    return true;
  });
  const { toastMessage } = usePortfolio();

  // Toggle Theme Class on HTML root
  const toggleTheme = () => {
    setIsDark((prev) => {
      const nextState = !prev;
      if (nextState) {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        localStorage.setItem('portfolio_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('portfolio_theme', 'light');
      }
      return nextState;
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_theme');
    const prefersDark = saved ? saved === 'dark' : true;
    setIsDark(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, []);

  // Section Observer for Active Nav
  useEffect(() => {
    const sectionIds = ['hero', 'about', 'education', 'skills', 'services', 'projects', 'contact'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 selection:bg-purple-600 selection:text-white transition-colors duration-300 antialiased">
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
        <AboutSection onContactClick={() => scrollToSection('contact')} />

        {/* Education & Academic Journey */}
        <EducationSection />

        {/* Dynamic Dual-Scroll Core Skills Ticker */}
        <CoreSkillsSection />

        {/* Technical Skills Matrix */}
        <SkillsSection />

        {/* Services & Offerings */}
        <ServicesSection onContactClick={() => scrollToSection('contact')} />

        {/* Featured Projects & Case Studies */}
        <ProjectsSection />

        {/* Client Endorsements */}
        <TestimonialsSection />

        {/* Contact & Proposal Form */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Floating Back To Top Button (Shows on scroll at bottom right) */}
      <BackToTop />

      {/* Dynamic Time-Based Greeting & Project Inquiry Popup */}
      <WelcomeGreetingModal onContactClick={() => scrollToSection('contact')} />

      {/* Admin Login Popup (Triggered when accessing /admin, #admin, or ?admin=true) */}
      <AdminLoginModal />

      {/* Admin Content Management Dashboard Modal (Accessible only after successful authentication) */}
      <AdminDashboard />

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
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
