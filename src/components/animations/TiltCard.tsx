import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // degrees, default 10
  perspective?: number; // default 1000
  scale?: number; // hover scale, default 1.02
  glare?: boolean;
}

/**
 * High-performance 3D perspective tilt card powered by GSAP quickTo.
 * Responds instantaneously without layout thrashing and renders a dynamic specular glare.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 8,
  perspective = 1000,
  scale = 1.015,
  glare = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Check if pointer/hover is supported
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasHover) return;

    gsap.set(card, {
      transformPerspective: perspective,
      transformStyle: 'preserve-3d',
    });

    const rotateXTo = gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power2.out' });
    const rotateYTo = gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power2.out' });
    const scaleTo = gsap.quickTo(card, 'scale', { duration: 0.5, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (-maxTilt to +maxTilt)
      const rotateX = -((y - centerY) / centerY) * maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      rotateXTo(rotateX);
      rotateYTo(rotateY);
      scaleTo(scale);

      // Update glare position
      if (glare && glareRef.current) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        glareRef.current.style.opacity = '1';
        glareRef.current.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.15), transparent 70%)`;
      }
    };

    const handleMouseLeave = () => {
      rotateXTo(0);
      rotateYTo(0);
      scaleTo(1);

      if (glare && glareRef.current) {
        glareRef.current.style.opacity = '0';
      }
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(card);
    };
  }, [maxTilt, perspective, scale, glare]);

  return (
    <div
      ref={cardRef}
      className={`relative will-change-transform ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300 opacity-0 z-10"
        />
      )}
    </div>
  );
};
