import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ScrollProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.15,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[9999] pointer-events-none bg-transparent">
      <div
        ref={barRef}
        className="h-full w-full bg-gradient-to-r from-purple-600 via-indigo-500 to-sky-400 origin-left transform-gpu"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};
