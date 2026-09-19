import React from 'react';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * ShimmerButton (Magic UI / Tailwind pattern)
 * Displays an elegant beam of light that smoothly travels around the perimeter of the button.
 * Hardware-accelerated and light on resources.
 */
export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = '#ffffff',
      shimmerSize = '0.08em',
      shimmerDuration = '3s',
      borderRadius = '0.75rem', // 12px / rounded-xl
      background = 'rgb(147, 51, 234)', // purple-600
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        style={
          {
            '--spread': '90deg',
            '--shimmer-color': shimmerColor,
            '--radius': borderRadius,
            '--speed': shimmerDuration,
            '--cut': shimmerSize,
            '--bg': background,
          } as React.CSSProperties
        }
        className={`group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] px-6 py-3 font-semibold text-white [background:var(--bg)] transition-all duration-300 active:scale-[0.98] hover:scale-[1.02] shadow-md shadow-purple-600/20 hover:shadow-lg hover:shadow-purple-500/30 ${className}`}
        {...props}
      >
        {/* SPARK / ROTATING LIGHT BEAM */}
        <div
          className="-z-30 blur-[2px] absolute inset-0 overflow-visible [container-type:size]"
          aria-hidden="true"
        >
          {/* Rotating beam container */}
          <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
            {/* Spark ray */}
            <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
          </div>
        </div>

        {/* INNER BACKDROP / MASK (Creates the perimeter border effect) */}
        <div
          className="absolute [inset:var(--cut)] -z-20 [border-radius:calc(var(--radius)-var(--cut))] [background:var(--bg)] transition-colors duration-300 group-hover:brightness-105"
          aria-hidden="true"
        />

        {/* FOREGROUND BUTTON CONTENT */}
        <span className="relative z-10 inline-flex items-center gap-2 text-sm font-semibold tracking-wide">
          {children}
        </span>
      </button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';
