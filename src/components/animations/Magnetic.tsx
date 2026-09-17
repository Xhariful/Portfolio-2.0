import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface MagneticProps {
  children: React.ReactElement<{ className?: string; onMouseMove?: React.MouseEventHandler; onMouseLeave?: React.MouseEventHandler }>;
  strength?: number; // 0.1 to 0.8
  className?: string;
  active?: boolean;
}

/**
 * Pro-level Magnetic component using GSAP elastic spring physics.
 * Pulls the child gently toward the user cursor on hover and snaps back seamlessly.
 */
export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 0.35,
  className = '',
  active = true,
}) => {
  const magneticRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !magneticRef.current) return;
    const el = magneticRef.current;

    // Check if device supports hover/pointer
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasHover) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1.1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1.1, 0.4)' });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (clientX - centerX) * strength;
      const deltaY = (clientY - centerY) * strength;

      xTo(deltaX);
      yTo(deltaY);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(el);
    };
  }, [strength, active]);

  return (
    <div ref={magneticRef} className={`inline-block ${className}`}>
      {children}
    </div>
  );
};
