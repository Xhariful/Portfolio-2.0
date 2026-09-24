import React, { useEffect, useRef } from 'react';

interface MobileTouchEffectProps {
  enabled?: boolean;
  color?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  decay: number;
  color: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  isInteractive: boolean;
}

// Convert any hex or color string to valid rgba(...) CSS string safely
const toRgba = (c: string, a: number): string => {
  const safeAlpha = Math.max(0, Math.min(1, isNaN(a) ? 0 : a));
  if (typeof c === 'string' && c.startsWith('#')) {
    let clean = c.slice(1).trim();
    if (clean.length === 3) clean = clean.split('').map((x) => x + x).join('');
    const num = parseInt(clean, 16);
    if (!isNaN(num) && clean.length === 6) {
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return `rgba(${r}, ${g}, ${b}, ${safeAlpha.toFixed(3)})`;
    }
  }
  return `rgba(139, 92, 246, ${safeAlpha.toFixed(3)})`;
};

export const MobileTouchEffect: React.FC<MobileTouchEffectProps> = ({
  enabled = true,
  color = '#8B5CF6'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const touchState = useRef<{
    active: boolean;
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    radius: number;
    targetRadius: number;
    alpha: number;
    targetAlpha: number;
  }>({
    active: false,
    x: -100,
    y: -100,
    targetX: -100,
    targetY: -100,
    radius: 0,
    targetRadius: 0,
    alpha: 0,
    targetAlpha: 0
  });

  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Detect if the device has touch capabilities
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    if (!isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const onResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    onResize();
    window.addEventListener('resize', onResize, { passive: true });

    // Spawn ripple helper
    const triggerRipple = (clientX: number, clientY: number, isInteractive: boolean) => {
      ripplesRef.current.push({
        x: clientX,
        y: clientY,
        radius: 8,
        maxRadius: isInteractive ? 56 : 38,
        alpha: isInteractive ? 0.75 : 0.5,
        color: color,
        isInteractive
      });
      // Cap ripples
      if (ripplesRef.current.length > 8) {
        ripplesRef.current.shift();
      }
    };

    // Spawn particles on drag helper
    const spawnDragParticle = (clientX: number, clientY: number) => {
      if (particlesRef.current.length > 35) return;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.5;
      particlesRef.current.push({
        x: clientX,
        y: clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.4,
        radius: Math.random() * 2.2 + 1,
        alpha: 0.7,
        maxAlpha: 0.7,
        decay: Math.random() * 0.03 + 0.02,
        color: color
      });
    };

    let isLooping = false;
    const startLoop = () => {
      if (!isLooping) {
        isLooping = true;
        animFrameId.current = requestAnimationFrame(render);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      const target = e.target as HTMLElement | null;
      const isInteractive = !!target?.closest('a, button, input, select, textarea, [role="button"], .card-tilt, [data-interactive]');

      touchState.current.active = true;
      touchState.current.targetX = touch.clientX;
      touchState.current.targetY = touch.clientY;
      touchState.current.x = touch.clientX;
      touchState.current.y = touch.clientY;
      touchState.current.targetRadius = isInteractive ? 34 : 24;
      touchState.current.targetAlpha = isInteractive ? 0.75 : 0.55;

      triggerRipple(touch.clientX, touch.clientY, isInteractive);
      startLoop();
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      touchState.current.targetX = touch.clientX;
      touchState.current.targetY = touch.clientY;

      // Emit subtle trail particles as the finger moves (like hover trail)
      if (Math.random() < 0.6) {
        spawnDragParticle(touch.clientX, touch.clientY);
      }
      startLoop();
    };

    const handleTouchEnd = () => {
      touchState.current.active = false;
      touchState.current.targetAlpha = 0;
      touchState.current.targetRadius = touchState.current.radius * 1.4;
      startLoop();
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    // Animation Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const ts = touchState.current;

      // Smooth lerp for touch halo position and scale
      ts.x += (ts.targetX - ts.x) * 0.35;
      ts.y += (ts.targetY - ts.y) * 0.35;
      ts.radius += (ts.targetRadius - ts.radius) * 0.2;
      ts.alpha += (ts.targetAlpha - ts.alpha) * 0.15;

      // Draw Floating Touch Halo (Hover-like aura around the finger)
      if (ts.alpha > 0.02 && ts.radius > 2) {
        // Outer soft glow
        const gradient = ctx.createRadialGradient(
          ts.x,
          ts.y,
          0,
          ts.x,
          ts.y,
          ts.radius * 1.8
        );
        gradient.addColorStop(0, toRgba(color, 0.25));
        gradient.addColorStop(0.5, toRgba(color, 0.08));
        gradient.addColorStop(1, toRgba(color, 0));

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(ts.x, ts.y, ts.radius * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Inner glowing ring
        ctx.strokeStyle = toRgba(color, ts.alpha);
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(ts.x, ts.y, ts.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Center pinpoint spark
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ts.x, ts.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Expanding Ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const ripple = ripplesRef.current[i];
        ripple.radius += (ripple.maxRadius - ripple.radius) * 0.18 + 0.8;
        ripple.alpha -= 0.025;

        if (ripple.alpha <= 0 || ripple.radius >= ripple.maxRadius) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        // Ripple border
        ctx.strokeStyle = toRgba(ripple.color, ripple.alpha);
        ctx.lineWidth = ripple.isInteractive ? 2.2 : 1.4;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Soft internal aura
        const fillGradient = ctx.createRadialGradient(
          ripple.x,
          ripple.y,
          0,
          ripple.x,
          ripple.y,
          ripple.radius
        );
        fillGradient.addColorStop(0, toRgba(ripple.color, ripple.alpha * 0.25));
        fillGradient.addColorStop(1, toRgba(ripple.color, 0));
        ctx.fillStyle = fillGradient;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Drag Trail Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = toRgba(p.color, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      const hasActiveObjects = ts.alpha > 0.01 || ripplesRef.current.length > 0 || particlesRef.current.length > 0;
      if (hasActiveObjects) {
        animFrameId.current = requestAnimationFrame(render);
      } else {
        isLooping = false;
        ctx.clearRect(0, 0, width, height);
      }
    };

    // Only starts on user touch interaction

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [enabled, color]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[99998]"
      style={{ touchAction: 'none' }}
    />
  );
};
