import React from 'react';
import { motion, Variants } from 'motion/react';

export type ScrollDirection = 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: ScrollDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  blur?: boolean;
  once?: boolean;
  amount?: number | 'some' | 'all';
  scale?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.65,
  distance = 36,
  className = '',
  blur = true,
  once = false,
  amount = 0.15,
  scale = 1,
}) => {
  const isMobileScreen = typeof window !== 'undefined' && window.innerWidth < 768;
  const shouldBlur = blur && !isMobileScreen;

  const getInitial = () => {
    const base: { opacity: number; filter?: string; x?: number; y?: number; scale?: number } = {
      opacity: 0,
    };

    if (shouldBlur) {
      base.filter = 'blur(6px)';
    }

    switch (direction) {
      case 'up':
        base.y = distance;
        break;
      case 'down':
        base.y = -distance;
        break;
      case 'left':
        base.x = distance;
        break;
      case 'right':
        base.x = -distance;
        break;
      case 'zoom':
        base.scale = scale !== 1 ? scale : 0.94;
        break;
      case 'fade':
      default:
        break;
    }

    return base;
  };

  const getAnimate = () => {
    const base: { opacity: number; filter?: string; x: number; y: number; scale: number } = {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
    };

    if (shouldBlur) {
      base.filter = 'blur(0px)';
    }

    return base;
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Custom smooth cubic bezier
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Container for cascading / staggered scroll animations
interface ScrollStaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  delay?: number;
  className?: string;
  once?: boolean;
  amount?: number | 'some' | 'all';
}

export const ScrollStagger: React.FC<ScrollStaggerProps> = ({
  children,
  staggerDelay = 0.1,
  delay = 0,
  className = '',
  once = false,
  amount = 0.12,
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Child item within ScrollStagger container
interface ScrollStaggerItemProps {
  children: React.ReactNode;
  direction?: ScrollDirection;
  distance?: number;
  duration?: number;
  className?: string;
  blur?: boolean;
}

export const ScrollStaggerItem: React.FC<ScrollStaggerItemProps> = ({
  children,
  direction = 'up',
  distance = 32,
  duration = 0.55,
  className = '',
  blur = true,
}) => {
  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      filter: blur ? 'blur(6px)' : 'none',
      y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
      x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
      scale: direction === 'zoom' ? 0.94 : 1,
    },
    show: {
      opacity: 1,
      filter: blur ? 'blur(0px)' : 'none',
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

export { AOS } from './AOS';
export type { AOSEffect, AOSProps } from './AOS';
