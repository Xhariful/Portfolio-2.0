import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isFinePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
    if (!isFinePointer) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Fast quickTo for dot, slightly damped quickTo for trailing ring
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power2.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power2.out' });

    const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement | null;
      const interactiveEl = target?.closest('a, button, input, textarea, select, [data-cursor], [role="button"]');

      if (interactiveEl) {
        setIsHovered(true);
        const customText = interactiveEl.getAttribute('data-cursor');
        setCursorText(customText || '');
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[99999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Center pinpoint dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-purple-600 dark:bg-purple-400 pointer-events-none z-10 transition-transform duration-100"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />

      {/* Trailing smooth magnetic ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -ml-5 -mt-5 rounded-full border border-purple-500/60 dark:border-purple-400/70 pointer-events-none flex items-center justify-center transition-all duration-300 ${
          isHovered
            ? cursorText
              ? 'w-14 h-14 -ml-7 -mt-7 bg-purple-600/90 text-white border-transparent backdrop-blur-xs scale-110 shadow-lg'
              : 'w-12 h-12 -ml-6 -mt-6 bg-purple-500/15 dark:bg-purple-400/20 scale-125 border-purple-600 dark:border-purple-300'
            : 'w-10 h-10 bg-transparent'
        }`}
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        {cursorText && (
          <span className="text-[9px] font-bold uppercase tracking-wider select-none">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
