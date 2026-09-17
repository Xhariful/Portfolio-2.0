import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCounterProps {
  value: string | number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = '',
  prefix = '',
  duration = 1.8,
  className = '',
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    // Extract numeric part
    const strVal = String(value);
    const numericMatch = strVal.match(/[\d.]+/);
    if (!numericMatch) {
      el.textContent = `${prefix}${value}${suffix}`;
      return;
    }

    const targetNum = parseFloat(numericMatch[0]);
    const isDecimal = numericMatch[0].includes('.');
    const decimalPlaces = isDecimal ? numericMatch[0].split('.')[1].length : 0;

    const counterObj = { val: 0 };

    const ctx = gsap.context(() => {
      gsap.to(counterObj, {
        val: targetNum,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          if (el) {
            const formatted = isDecimal
              ? counterObj.val.toFixed(decimalPlaces)
              : Math.round(counterObj.val).toString();
            el.textContent = `${prefix}${formatted}${suffix}`;
          }
        },
      });
    });

    return () => ctx.revert();
  }, [value, suffix, prefix, duration]);

  return (
    <span ref={spanRef} className={className}>
      {prefix}0{suffix}
    </span>
  );
};
