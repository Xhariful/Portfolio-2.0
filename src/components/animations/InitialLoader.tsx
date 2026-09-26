import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InitialLoaderConfig } from '../../types';

interface InitialLoaderProps {
  config?: InitialLoaderConfig;
  onComplete?: () => void;
  // In preview mode inside Admin Dashboard, keep it looping or replayable
  isPreview?: boolean;
}

export const InitialLoader: React.FC<InitialLoaderProps> = ({
  config,
  onComplete,
  isPreview = false,
}) => {
  const enabled = config?.enabled ?? true;
  const avatarType = config?.avatarType ?? 'photo';
  const avatarUrl = config?.avatarUrl || '/myname.png';
  const name = config?.name || 'Shariful Islam';
  const tagline = config?.tagline || 'Senior Shopify & Full-Stack Developer';
  const durationSeconds = config?.durationSeconds ?? 3.5;
  const ringColor = config?.ringColor || '#8b5cf6';
  const enableRealisticDelay = config?.enableRealisticDelay ?? true;
  const showProgressBar = config?.showProgressBar ?? true;

  const initialStatus = config?.initialStatusText || 'INITIALIZING CORE ARCHITECTURE...';
  const delayStatus = config?.delayStatusText || 'ESTABLISHING SECURE REALTIME CONNECTION...';
  const completionStatus = config?.completionStatusText || 'LAUNCH SUCCESSFUL • WELCOME!';

  const [isVisible, setIsVisible] = useState(enabled);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(initialStatus);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!enabled && !isPreview) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    setProgress(0);

    // Prevent body scroll during initial loading unless in dashboard preview
    const originalOverflow = document.body.style.overflow;
    if (!isPreview) {
      document.body.style.overflow = 'hidden';
    }

    // Remove static HTML instant loader if present in DOM
    const htmlLoader = document.getElementById('initial-instant-preloader');
    if (htmlLoader && !isPreview) {
      htmlLoader.style.display = 'none';
    }

    const startTime = performance.now();
    let animationFrameId: number;

    const totalMs = Math.max(2000, durationSeconds * 1000);
    // Dynamic timeline phases:
    // 0 -> 40%: Rapid rise to 88%
    // 40% -> 72%: Realistic suspense delay hovering around 88% - 92%
    // 72% -> 88%: Acceleration from 92% to 100%
    // 88% -> 100%: Celebration at 100%
    const FAST_DURATION = totalMs * (enableRealisticDelay ? 0.38 : 0.65);
    const DELAY_END = totalMs * (enableRealisticDelay ? 0.72 : 0.75);
    const COMPLETION_TIME = totalMs * 0.88;
    const EXIT_TIME = totalMs;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      let currentPercent = 0;

      if (elapsed < FAST_DURATION) {
        // Fast dynamic climb to 88%
        const fraction = elapsed / FAST_DURATION;
        const eased = 1 - Math.pow(1 - fraction, 1.5);
        currentPercent = Math.min(88, Math.round(eased * 88));
        
        if (currentPercent < 35) {
          setStatusText(initialStatus);
        } else if (currentPercent < 65) {
          setStatusText('LOADING LIQUID & REACT ENGINES...');
        } else {
          setStatusText('SYNCING ASSETS & REPOSITORIES...');
        }
      } else if (enableRealisticDelay && elapsed < DELAY_END) {
        // Deliberate realistic delay around 88% - 92%
        const delayFraction = (elapsed - FAST_DURATION) / (DELAY_END - FAST_DURATION);
        currentPercent = Math.round(88 + delayFraction * 4);
        setStatusText(delayStatus);
      } else if (elapsed < COMPLETION_TIME) {
        // Final acceleration from 92% to 100%
        const finalFraction = (elapsed - (enableRealisticDelay ? DELAY_END : FAST_DURATION)) / (COMPLETION_TIME - (enableRealisticDelay ? DELAY_END : FAST_DURATION));
        const eased = Math.pow(finalFraction, 1.3);
        currentPercent = Math.min(100, Math.round(92 + eased * 8));
        setStatusText('FINALIZING STOREFRONT EXPERIENCE...');
      } else {
        currentPercent = 100;
        setStatusText(completionStatus);
      }

      progressRef.current = currentPercent;
      setProgress(currentPercent);

      if (elapsed < EXIT_TIME) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setStatusText(completionStatus);

        if (!isPreview) {
          const timer = setTimeout(() => {
            setIsVisible(false);
            document.body.style.overflow = originalOverflow;
            onComplete?.();
          }, 200);
          return () => clearTimeout(timer);
        }
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (!isPreview) {
        document.body.style.overflow = originalOverflow;
      }
    };
  }, [enabled, durationSeconds, enableRealisticDelay, onComplete, isPreview]);

  if (!enabled && !isPreview) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="initial-preloader-experience"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(14px)',
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
          }}
          className={`${
            isPreview ? 'relative w-full h-[520px] rounded-3xl overflow-hidden' : 'fixed inset-0 z-[99999]'
          } flex flex-col items-center justify-center bg-zinc-950 text-white select-none pointer-events-auto`}
          role="status"
          aria-live="polite"
        >
          {/* Cybernetic ambient glow background */}
          <div
            className="absolute w-[30rem] h-[30rem] rounded-full blur-[140px] pointer-events-none opacity-30 animate-pulse"
            style={{ backgroundColor: ringColor }}
          />
          <div className="absolute w-80 h-80 rounded-full bg-sky-500/15 blur-[100px] pointer-events-none translate-x-20 translate-y-16" />

          {/* Central Animated Core with Custom Image & High-Tech Rings */}
          <div className="relative flex flex-col items-center justify-center z-10 px-6">
            <div className="relative flex items-center justify-center w-56 h-56 md:w-64 md:h-64 mb-6">
              {/* Outer Cyber Radar Ring (Clockwise Rotation) */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-purple-500/30"
              >
                {/* Orbital Planetary Beacon 1 */}
                <div
                  className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full shadow-[0_0_12px_#38bdf8]"
                  style={{ backgroundColor: '#38bdf8' }}
                />
                {/* Orbital Beacon 2 */}
                <div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full shadow-[0_0_10px_#a855f7]"
                  style={{ backgroundColor: '#a855f7' }}
                />
              </motion.div>

              {/* Middle Conic Neon Radiant Ring (Counter-Clockwise Rotation) */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-4 rounded-full border-2 border-t-transparent border-b-transparent"
                style={{
                  borderLeftColor: ringColor,
                  borderRightColor: '#38bdf8',
                  filter: `drop-shadow(0 0 10px ${ringColor})`,
                }}
              />

              {/* Segmented Tech Crosshair Ring */}
              <motion.div
                animate={{ rotate: 180 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-8 rounded-full border border-purple-400/20"
              >
                {/* 4 Tech Crosshair notches */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-purple-400/60" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-purple-400/60" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-0.5 bg-purple-400/60" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-0.5 bg-purple-400/60" />
              </motion.div>

              {/* 4 HUD Corner Tech Brackets */}
              <div className="absolute inset-2 pointer-events-none flex items-center justify-center opacity-70">
                <span className="absolute top-2 left-2 text-[10px] font-mono text-purple-400/70">┌</span>
                <span className="absolute top-2 right-2 text-[10px] font-mono text-purple-400/70">┐</span>
                <span className="absolute bottom-2 left-2 text-[10px] font-mono text-purple-400/70">└</span>
                <span className="absolute bottom-2 right-2 text-[10px] font-mono text-purple-400/70">┘</span>
              </div>

              {/* Inner Pulsing Avatar/Image Container */}
              <motion.div
                animate={{ scale: [0.97, 1.03, 0.97] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-28 h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-purple-600 via-indigo-500 to-sky-400 shadow-2xl flex items-center justify-center"
                style={{
                  boxShadow: `0 0 28px ${ringColor}60, inset 0 0 14px rgba(0,0,0,0.8)`,
                }}
              >
                {/* Inner Bezel */}
                <div className="w-full h-full rounded-full overflow-hidden bg-zinc-950 p-1 flex items-center justify-center relative">
                  {avatarType === 'photo' ? (
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="w-full h-full object-cover rounded-full filter contrast-105"
                      onError={(e) => {
                        // Fallback to stylized monogram if custom image fails
                        e.currentTarget.style.display = 'none';
                        const fallback = document.getElementById('loader-fallback-monogram');
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : avatarType === 'monogram' ? (
                    <div className="w-full h-full rounded-full flex items-center justify-center bg-zinc-900 text-purple-400 font-bold text-2xl tracking-tighter shadow-inner">
                      <span>S</span>
                    </div>
                  ) : (
                    // Tech Core Code Hexagon
                    <div className="w-full h-full rounded-full flex items-center justify-center bg-zinc-900 text-sky-400">
                      <svg className="w-10 h-10 animate-spin" viewBox="0 0 24 24" fill="none">
                        <polygon points="12 2 2 8.5 2 15.5 12 22 22 15.5 22 8.5 12 2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M9 10 L7 12 L9 14 M15 10 L17 12 L15 14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}

                  {/* Monogram Fallback if image fails */}
                  <div id="loader-fallback-monogram" style={{ display: 'none' }} className="w-full h-full rounded-full items-center justify-center bg-zinc-900 text-purple-400 font-bold text-2xl">
                    <span>{name ? name.charAt(0) : 'S'}</span>
                  </div>

                  {/* High-tech scanner line beam passing vertically over the photo */}
                  <motion.div
                    animate={{ y: ['-100%', '100%'] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-purple-400/25 to-transparent pointer-events-none"
                  />
                </div>
              </motion.div>
            </div>

            {/* Name & Title Branding */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-base md:text-lg font-extrabold tracking-[0.22em] uppercase text-zinc-100 flex items-center justify-center gap-2">
                <span>{name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </h2>
              <p
                className="text-xs md:text-sm font-mono tracking-wider mt-1 opacity-90 font-medium"
                style={{ color: ringColor }}
              >
                {tagline}
              </p>
            </motion.div>

            {/* Glowing High-Definition Progress Bar */}
            {showProgressBar && (
              <div className="w-60 md:w-72 mt-6">
                {/* Track */}
                <div className="h-2.5 w-full bg-zinc-900 rounded-full border border-zinc-800 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] overflow-hidden relative p-[2px]">
                  {/* Fill */}
                  <div
                    className="h-full rounded-full transition-all duration-75 ease-out relative"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${ringColor} 0%, #a855f7 50%, #38bdf8 100%)`,
                      boxShadow: `0 0 16px ${ringColor}, 0 0 6px rgba(56, 189, 248, 0.7)`,
                    }}
                  >
                    {/* Glowing Leading Tip */}
                    {progress > 2 && (
                      <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/95 rounded-full blur-[0.5px] shadow-[0_0_10px_#ffffff]" />
                    )}
                  </div>
                </div>

                {/* Progress Details & Engineering Status */}
                <div className="flex justify-between items-center mt-2.5 font-mono text-[10px] text-zinc-400">
                  <span className="tracking-wider uppercase text-zinc-500 font-semibold truncate max-w-[180px]">
                    {statusText}
                  </span>
                  <span className="text-zinc-200 font-bold tracking-wider ml-2">{progress}%</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
