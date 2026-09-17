import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getLenis } from '../hooks/useLenisScroll';
import { Magnetic } from './animations/Magnetic';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button only when user has scrolled down more than 350px
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-40">
          <Magnetic strength={0.35}>
            <motion.button
              id="back-to-top-button"
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0.8, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.94 }}
              className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25 border border-purple-500/30 flex items-center justify-center cursor-pointer transition-colors group"
              aria-label="Back to top"
              title="Back to top"
            >
              <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
            </motion.button>
          </Magnetic>
        </div>
      )}
    </AnimatePresence>
  );
};
