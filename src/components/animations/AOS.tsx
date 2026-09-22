import React from 'react';
import { motion, TargetAndTransition, Transition } from 'motion/react';

export type AOSEffect =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'zoom-in-up'
  | 'zoom-out'
  | 'flip-up'
  | 'flip-left'
  | 'fade';

export interface AOSProps {
  children: React.ReactNode;
  animation?: AOSEffect;
  delay?: number; // Accepts ms (e.g. 100, 200) or seconds (0.1, 0.2)
  duration?: number; // Accepts ms (e.g. 600) or seconds (0.6)
  offset?: number; // Distance in pixels
  once?: boolean; // Whether animation happens once or every scroll into view
  threshold?: number; // Viewport visibility amount 0-1
  blur?: boolean; // Add subtle optical blur entrance
  className?: string;
  id?: string;
}

export const AOS: React.FC<AOSProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 0.65,
  offset = 40,
  once = false,
  threshold = 0.12,
  blur = true,
  className = '',
  id,
}) => {
  // Normalize delay and duration if provided in milliseconds
  const normalizedDelay = delay > 10 ? delay / 1000 : delay;
  const normalizedDuration = duration > 10 ? duration / 1000 : duration;

  // Build initial hidden state
  const getInitialState = (): TargetAndTransition => {
    const state: TargetAndTransition = {
      opacity: 0,
    };

    if (blur) {
      state.filter = 'blur(6px)';
    }

    switch (animation) {
      case 'fade-up':
        state.y = offset;
        break;
      case 'fade-down':
        state.y = -offset;
        break;
      case 'fade-left':
        // Enters from the right moving left
        state.x = offset;
        break;
      case 'fade-right':
        // Enters from the left moving right
        state.x = -offset;
        break;
      case 'zoom-in':
        state.scale = 0.88;
        break;
      case 'zoom-in-up':
        state.scale = 0.92;
        state.y = offset;
        break;
      case 'zoom-out':
        state.scale = 1.08;
        break;
      case 'flip-up':
        state.rotateX = 35;
        state.y = offset / 2;
        break;
      case 'flip-left':
        state.rotateY = 35;
        state.x = offset / 2;
        break;
      case 'fade':
      default:
        break;
    }

    return state;
  };

  // Build active in-view state
  const getAnimateState = (): TargetAndTransition => {
    const state: TargetAndTransition = {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
    };

    if (blur) {
      state.filter = 'blur(0px)';
    }

    return state;
  };

  const transition: Transition = {
    duration: normalizedDuration,
    delay: normalizedDelay,
    ease: [0.22, 1, 0.36, 1], // Smooth cubic-bezier
  };

  return (
    <motion.div
      id={id}
      initial={getInitialState()}
      whileInView={getAnimateState()}
      viewport={{ once, amount: threshold }}
      transition={transition}
      className={className}
      style={{
        transformStyle: animation.startsWith('flip') ? 'preserve-3d' : undefined,
        perspective: animation.startsWith('flip') ? 1000 : undefined,
      }}
    >
      {children}
    </motion.div>
  );
};

export default AOS;
