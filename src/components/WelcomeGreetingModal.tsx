import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  Sunset,
  Moon,
  ArrowRight,
  MessageCircle,
  X
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface WelcomeGreetingModalProps {
  onContactClick: () => void;
}

export const WelcomeGreetingModal: React.FC<WelcomeGreetingModalProps> = ({ onContactClick }) => {
  const { data } = usePortfolio();
  const { profile, welcomePopup } = data;
  const [isOpen, setIsOpen] = useState(false);

  // Fallbacks if not set
  const isEnabled = welcomePopup ? welcomePopup.enabled : true;
  const delay = welcomePopup?.delayMs ?? 2400;
  const showGreetingBadge = welcomePopup?.showTimeGreeting ?? true;
  const headline = welcomePopup?.headline || 'Need a modern website or Shopify store?';
  const subText = welcomePopup?.subText || "If you're planning to build or redesign your website, let's talk about your project goals.";
  const ctaText = welcomePopup?.ctaText || "Let's Talk";
  const dismissText = welcomePopup?.dismissText || 'Maybe Later';

  // Format WhatsApp Link and default first message
  const rawNumber = welcomePopup?.whatsappNumber || profile.whatsapp || profile.socials?.whatsapp || profile.phone || '+8801996954104';
  const cleanPhone = rawNumber.replace(/[^0-9]/g, '') || '8801996954104';
  const defaultWhatsAppMsg = welcomePopup?.whatsappMessage || `Hi ${profile.name || 'Shariful'}, I saw your portfolio and I would love to discuss a project with you!`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultWhatsAppMsg)}`;

  // Dynamic greeting based on current local hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return {
        title: 'Good Morning!',
        icon: <Sun className="w-4 h-4 text-amber-500" />,
        badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        title: 'Good Afternoon!',
        icon: <Sunset className="w-4 h-4 text-orange-500" />,
        badge: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
      };
    } else if (hour >= 17 && hour < 22) {
      return {
        title: 'Good Evening!',
        icon: <Sunset className="w-4 h-4 text-indigo-400" />,
        badge: 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/20',
      };
    } else {
      return {
        title: 'Good Night!',
        icon: <Moon className="w-4 h-4 text-purple-400" />,
        badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      };
    }
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const hasSeenGreeting = sessionStorage.getItem('portfolio_greeting_dismissed');
    if (!hasSeenGreeting) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isEnabled, delay]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('portfolio_greeting_dismissed', 'true');
  };

  const handleCtaClick = () => {
    handleClose();
    // Open WhatsApp in a new tab with pre-filled message
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    if (onContactClick) {
      onContactClick();
    }
  };

  if (!isEnabled) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
          {/* Subtle backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Minimalist, Clean Popup Box */}
          <motion.div
            id="welcome-greeting-popup"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-sm sm:max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-7 z-10 space-y-5 text-left"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header: Time Badge + Greeting */}
            <div className="space-y-2 pr-6">
              {showGreetingBadge && (
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${greeting.badge}`}>
                  {greeting.icon}
                  <span>{greeting.title}</span>
                </div>
              )}

              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                {headline}
              </h3>
            </div>

            {/* Direct, Clean Message */}
            <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
              Hi, I&apos;m <span className="font-semibold text-slate-900 dark:text-white">{profile.name}</span>. {subText}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                id="greeting-popup-contact-cta"
                onClick={handleCtaClick}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all hover:shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 opacity-80" />
              </button>

              <button
                onClick={handleClose}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-slate-700 dark:text-zinc-300 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
              >
                {dismissText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
