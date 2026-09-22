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
    <div className="fixed top-0 left-0 right-0 h-[3.5px] z-[9999] pointer-events-none bg-slate-200/20 dark:bg-zinc-800/30">
      <div
        ref={barRef}
        className="h-full w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-sky-400 origin-left transform-gpu shadow-[0_0_12px_rgba(192,132,252,0.8)] dark:shadow-[0_0_14px_rgba(168,85,247,0.9)]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};
