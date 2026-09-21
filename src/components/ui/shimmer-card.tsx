import React from 'react';

interface ShimmerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string; // Border light color (e.g. #a855f7 or rgba(168, 85, 247, 0.9))
  borderRadius?: string; // e.g. 1rem (rounded-2xl)
  borderWidth?: string; // e.g. 1.5px
  duration?: string; // e.g. 4s
  featured?: boolean; // Always runs perimeter light if true; otherwise runs purely on hover
  innerClassName?: string;
}

/**
 * ShimmerCard
 * Wraps any card or container (Service card, Project card, Contact box).
 * By default runs a glowing perimeter beam when the user hovers over the card,
 * maintaining 60fps performance and zero visual clutter.
 * If `featured={true}`, the perimeter beam smoothly travels continuously.
 */
export const ShimmerCard: React.FC<ShimmerCardProps> = ({
  children,
  className = '',
  shimmerColor = '#a855f7',
  borderRadius = '1rem',
  borderWidth = '1.5px',
  duration = '4s',
  featured = false,
  innerClassName = '',
  ...props
}) => {
  return (
    <div
      style={
        {
          '--shimmer-card-color': shimmerColor,
          '--shimmer-card-radius': borderRadius,
          '--shimmer-card-cut': borderWidth,
          '--shimmer-card-speed': duration,
        } as React.CSSProperties
      }
      className={`group/shimmer relative p-[1px] [border-radius:var(--shimmer-card-radius)] overflow-hidden transition-all duration-300 ${className}`}
      {...props}
    >
      {/* 1. ROTATING CONIC LIGHT BEAM (Hidden until hover, or constantly visible if featured) */}
      <div
        className={`pointer-events-none absolute -inset-[150%] transition-opacity duration-500 ease-out ${
          featured
            ? 'opacity-100'
            : 'opacity-0 group-hover/shimmer:opacity-100'
        }`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 animate-spin-around [background:conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_60deg,var(--shimmer-card-color)_110deg,transparent_160deg,transparent_360deg)]" />
      </div>

      {/* 2. SUBTLE DEFAULT BORDER (fallback when not hovering) */}
      <div
        className={`pointer-events-none absolute inset-0 [border-radius:var(--shimmer-card-radius)] border border-slate-200 dark:border-zinc-800 transition-opacity duration-300 ${
          featured ? 'opacity-0' : 'group-hover/shimmer:opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* 3. INNER CONTAINER (Masks out the center so light only travels the perimeter border) */}
      <div
        className={`relative z-10 h-full w-full [border-radius:calc(var(--shimmer-card-radius)-var(--shimmer-card-cut))] bg-white/75 dark:bg-zinc-900/65 backdrop-blur-md overflow-hidden transition-colors duration-200 ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
};
