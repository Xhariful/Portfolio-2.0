import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface InitialLoaderProps {
  duration?: number; // Duration in ms (default: 2000ms = 2s)
  onComplete?: () => void;
  customSvgPath?: string;
}

export const InitialLoader: React.FC<InitialLoaderProps> = ({
  duration = 2000,
  onComplete,
  customSvgPath = '/loading.svg',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Prevent body scroll during initial preloader
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const startTime = performance.now();
    let animationFrameId: number;

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const calculatedProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(calculatedProgress);

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        // Small buffer for natural transition
        const timer = setTimeout(() => {
          setIsVisible(false);
          document.body.style.overflow = originalOverflow;
          onComplete?.();
        }, 150);
        return () => clearTimeout(timer);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.body.style.overflow = originalOverflow;
    };
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="initial-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(10px)',
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-zinc-950 text-white select-none pointer-events-auto"
          role="status"
          aria-live="polite"
        >
          {/* Ambient luminous glow backdrops */}
          <div className="absolute w-80 h-80 rounded-full bg-purple-600/15 blur-[100px] pointer-events-none" />
          <div className="absolute w-64 h-64 rounded-full bg-sky-500/10 blur-[80px] pointer-events-none translate-x-12 translate-y-12" />

          {/* Center SVG Loader container */}
          <div className="relative flex flex-col items-center justify-center z-10 px-6">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative mb-6 flex items-center justify-center"
            >
              {/* Outer soft pulsating halo */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-600/30 to-blue-600/30 blur-xl animate-pulse" />

              {/* The User-Provided / Custom SVG Graphic */}
              <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
                <img
                  src={customSvgPath}
                  alt="Loading..."
                  className="w-full h-full object-contain filter drop-shadow-[0_0_16px_rgba(168,85,247,0.4)]"
                  onError={(e) => {
                    // Fallback to inline SVG spinner if file not accessible
                    e.currentTarget.style.display = 'none';
                    const fallback = document.getElementById('loader-fallback-svg');
                    if (fallback) fallback.style.display = 'block';
                  }}
                />

                {/* Inline SVG Fallback */}
                <div id="loader-fallback-svg" style={{ display: 'none' }} className="w-full h-full">
                  <svg className="w-full h-full animate-spin" viewBox="0 0 50 50">
                    <circle
                      className="opacity-20"
                      cx="25"
                      cy="25"
                      r="20"
                      stroke="#8b5cf6"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="25"
                      cy="25"
                      r="20"
                      stroke="#a855f7"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray="80"
                      strokeDashoffset="60"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Title / Name Branding */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-sm md:text-base font-bold tracking-[0.25em] uppercase text-zinc-200">
                Shariful Islam
              </h2>
              <p className="text-[11px] md:text-xs text-purple-400 font-mono tracking-wider mt-1 opacity-90">
                Senior Shopify &amp; Full-Stack Developer
              </p>
            </motion.div>

            {/* Precision Micro Progress Bar */}
            <div className="w-48 md:w-56 mt-6">
              <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80 p-[1px]">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-sky-400 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 font-mono text-[10px] text-zinc-500">
                <span className="tracking-wider uppercase">Loading experience</span>
                <span className="text-zinc-300 font-medium">{progress}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
