import React, { useEffect, useRef } from 'react';

export interface Floating3DParticlesProps {
  className?: string;
  quantity?: number;
  color?: string;
  radius?: number;
  opacity?: number;
  speed?: number;
  depth?: number;
  connectParticles?: boolean;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  baseRadius: number;
  baseOpacity: number;
  phase: number;
}

// Convert 3-hex or 6-hex or rgb to RGB object
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const intVal = parseInt(cleanHex, 16);
  if (isNaN(intVal) || cleanHex.length !== 6) {
    return { r: 139, g: 92, b: 246 }; // Default to purple #8B5CF6
  }
  return {
    r: (intVal >> 16) & 255,
    g: (intVal >> 8) & 255,
    b: intVal & 255,
  };
};

export const Floating3DParticles: React.FC<Floating3DParticlesProps> = ({
  className = '',
  quantity = 220,
  color = '#8B5CF6',
  radius = 1.6,
  opacity = 0.55,
  speed = 0.35,
  depth = 0.65,
  connectParticles = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only run on desktop/tablet viewports (>= 768px) to maximize mobile performance
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let particles: Particle3D[] = [];

    // Screen perspective constants
    const focalLength = 400 + (1 - depth) * 400; // Focal distance for perspective projection
    const maxDepth = 600 * Math.max(0.2, depth);

    // Mouse coordinates and gentle parallax target
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    // Continuous 3D rotation angles
    let rotationY = 0;
    let rotationX = 0;

    const rgb = hexToRgb(color);

    // Resize Handler
    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Re-init particles based on viewport (scale down for mobile < 768px to 30%)
      const isMobile = width < 768;
      const count = isMobile ? Math.max(40, Math.floor(quantity * 0.3)) : quantity;

      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: (Math.random() - 0.5) * width * 1.5,
          y: (Math.random() - 0.5) * height * 1.5,
          z: (Math.random() - 0.5) * maxDepth,
          vx: (Math.random() - 0.5) * 0.15,
          vy: -Math.abs(speed) * (0.6 + Math.random() * 0.8), // Upward buoyant drift
          vz: (Math.random() - 0.5) * 0.15,
          baseRadius: radius * (0.6 + Math.random() * 0.8),
          baseOpacity: Math.min(1, Math.max(0.1, opacity + (Math.random() - 0.5) * 0.3)),
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Mouse Move Listener for interactive 3D camera tilt
    const handleMouseMove = (e: MouseEvent) => {
      const halfW = width / 2;
      const halfH = height / 2;
      mouse.targetX = (e.clientX - halfW) * 0.05;
      mouse.targetY = (e.clientY - halfH) * 0.05;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let lastTime = performance.now();

    // Render loop
    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // Slow 3D continuous rotation drift
      rotationY += 0.0003;
      rotationX += 0.00015;

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      const halfW = width / 2;
      const halfH = height / 2;

      // Projected points cache for connection lines
      interface ProjectedPoint {
        x: number;
        y: number;
        z: number;
        alpha: number;
      }
      const projectedList: ProjectedPoint[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Buoyant drift upwards with subtle harmonic sway
        p.y += p.vy * (dt * 60);
        p.x += Math.sin(time * 0.001 + p.phase) * 0.15;
        p.z += p.vz * (dt * 60);

        // Boundary wraparound in 3D volume
        const boundY = height * 0.9;
        const boundX = width * 0.9;
        const boundZ = maxDepth * 0.6;

        if (p.y < -boundY) p.y = boundY;
        if (p.y > boundY) p.y = -boundY;
        if (p.x < -boundX) p.x = boundX;
        if (p.x > boundX) p.x = -boundX;
        if (p.z < -boundZ) p.z = boundZ;
        if (p.z > boundZ) p.z = -boundZ;

        // Apply 3D Rotation (Y-axis then X-axis)
        let rx1 = p.x * cosY + p.z * sinY;
        let rz1 = -p.x * sinY + p.z * cosY;

        let ry2 = p.y * cosX - rz1 * sinX;
        let rz2 = p.y * sinX + rz1 * cosX;

        // Apply mouse tilt offset
        const finalX = rx1 + mouse.x;
        const finalY = ry2 + mouse.y;
        const finalZ = rz2 + maxDepth * 0.5; // Offset so particles are in front of camera

        // Perspective Projection calculation
        const perspective = focalLength / Math.max(10, focalLength + finalZ);
        const screenX = halfW + finalX * perspective;
        const screenY = halfH + finalY * perspective;

        // Cull if outside visible canvas padding
        if (screenX < -50 || screenX > width + 50 || screenY < -50 || screenY > height + 50) {
          continue;
        }

        const screenRadius = Math.max(0.4, p.baseRadius * perspective);
        // Depth-aware alpha fade
        const depthFactor = Math.max(0.12, Math.min(1, 1 - (finalZ / (maxDepth * 1.3))));
        const alpha = p.baseOpacity * depthFactor;

        if (connectParticles && i % 2 === 0) {
          projectedList.push({ x: screenX, y: screenY, z: finalZ, alpha });
        }

        // Draw luminous particle
        ctx.beginPath();
        ctx.arc(screenX, screenY, screenRadius, 0, Math.PI * 2);

        // Draw soft glow for prominent particles
        if (screenRadius > 1.2 && depthFactor > 0.45) {
          const glow = ctx.createRadialGradient(
            screenX,
            screenY,
            0,
            screenX,
            screenY,
            screenRadius * 2.8
          );
          glow.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.9})`);
          glow.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.3})`);
          glow.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(screenX, screenY, screenRadius * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, screenRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw faint constellation lines between neighboring particles
      if (connectParticles && projectedList.length > 1) {
        const maxDist = 85;
        const maxDistSq = maxDist * maxDist;
        const lineCountLimit = Math.min(projectedList.length, 75);

        for (let i = 0; i < lineCountLimit; i++) {
          for (let j = i + 1; j < lineCountLimit; j++) {
            const p1 = projectedList[i];
            const p2 = projectedList[j];

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxDistSq) {
              const distance = Math.sqrt(distSq);
              const lineAlpha = (1 - distance / maxDist) * Math.min(p1.alpha, p2.alpha) * 0.25;

              ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${lineAlpha})`;
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [quantity, color, radius, opacity, speed, depth, connectParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};

export default Floating3DParticles;
