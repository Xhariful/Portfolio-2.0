import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface CustomCursorProps {
  color?: string;
}

// Convert hex to rgba helper
const hexToRgba = (hex: string, alpha: number): string => {
  let clean = (hex || '#8B5CF6').replace('#', '').trim();
  if (clean.length === 3) clean = clean.split('').map((x) => x + x).join('');
  const num = parseInt(clean, 16);
  if (!isNaN(num) && clean.length === 6) {
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgba(139, 92, 246, ${alpha})`;
};

export const CustomCursor: React.FC<CustomCursorProps> = ({ color = '#8B5CF6' }) => {
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
        className="fixed top-0 left-0 w-2.5 h-2.5 -ml-1.25 -mt-1.25 rounded-full pointer-events-none z-10 transition-transform duration-100"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          backgroundColor: color,
          boxShadow: `0 0 10px ${hexToRgba(color, 0.85)}, 0 0 4px ${color}`,
        }}
      />

      {/* Trailing smooth magnetic ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -ml-5 -mt-5 rounded-full pointer-events-none flex items-center justify-center transition-all duration-300 ${
          isHovered
            ? cursorText
              ? 'w-14 h-14 -ml-7 -mt-7 text-white backdrop-blur-xs scale-110 shadow-lg'
              : 'w-12 h-12 -ml-6 -mt-6 scale-125'
            : 'w-10 h-10'
        }`}
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          borderWidth: '1.5px',
          borderColor: isHovered ? color : hexToRgba(color, 0.6),
          backgroundColor: isHovered
            ? cursorText
              ? color
              : hexToRgba(color, 0.18)
            : 'transparent',
          boxShadow: isHovered
            ? `0 0 20px ${hexToRgba(color, 0.45)}`
            : `0 0 8px ${hexToRgba(color, 0.12)}`,
        }}
      >
        {cursorText && (
          <span className="text-[9px] font-bold uppercase tracking-wider select-none text-white">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
