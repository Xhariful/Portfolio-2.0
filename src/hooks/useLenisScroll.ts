import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let globalLenis: Lenis | null = null;

export const getLenis = () => globalLenis;

export const smoothScrollTo = (target: string | HTMLElement, offset: number = -90, duration: number = 1.2) => {
  if (globalLenis) {
    globalLenis.scrollTo(target, { offset, duration });
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) as HTMLElement : target;
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
};

export const useLenisScroll = () => {
  useEffect(() => {
    // Only skip on small screen mobile phones (<640px) if user prefers native touch
    const isSmallPhone = typeof window !== 'undefined' && window.innerWidth < 640;

    if (isSmallPhone) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      infinite: false,
    });

    globalLenis = lenis;

    // Connect Lenis scroll events to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger when DOM content or window size updates
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      globalLenis = null;
    };
  }, []);
};
