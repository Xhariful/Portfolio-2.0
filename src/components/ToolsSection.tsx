import React from 'react';
import { Sparkles, Wand2, ArrowUpRight, FileImage, Code2, Zap, CheckCircle2 } from 'lucide-react';
import { Magnetic } from './animations/Magnetic';

interface ToolsSectionProps {
  onNavigateToTool?: (route: string) => void;
}

export const ToolsSection: React.FC<ToolsSectionProps> = ({ onNavigateToTool }) => {
  const handleLaunchTool = (route: string) => {
    if (onNavigateToTool) {
      onNavigateToTool(route);
    } else {
      window.history.pushState(null, '', route);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <section id="tools" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-mono font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Interactive Utilities</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Our <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Tools</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
            Free, high-performance utilities for everyone. Easily remove image backgrounds, optimize your assets, and speed up your workflow with zero watermarks and zero registration fees.
          </p>
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Active Background Remover */}
          <div className="group relative rounded-3xl bg-white dark:bg-zinc-900/90 border-2 border-purple-500/40 dark:border-purple-500/50 p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Badge & Icon */}
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-700 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Wand2 className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live & Free
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  AI Background Remover
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  Isolate photos, portraits, and graphics in 1-click. Generate lossless transparent PNG or web-ready WebP cutouts with clean edge precision.
                </p>
              </div>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2.5 py-1 rounded-md bg-purple-50 dark:bg-zinc-800 text-purple-700 dark:text-purple-300 text-[11px] font-mono">
                  Transparent Cutout
                </span>
                <span className="px-2.5 py-1 rounded-md bg-purple-50 dark:bg-zinc-800 text-purple-700 dark:text-purple-300 text-[11px] font-mono">
                  AI Powered
                </span>
                <span className="px-2.5 py-1 rounded-md bg-purple-50 dark:bg-zinc-800 text-purple-700 dark:text-purple-300 text-[11px] font-mono">
                  Lossless PNG & WebP
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-zinc-800">
              <Magnetic strength={0.25}>
                <button
                  type="button"
                  onClick={() => handleLaunchTool('/tools/remove-background')}
                  className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-600 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Launch Tool Free</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </Magnetic>
            </div>
          </div>

          {/* Card 2: Upcoming Image Compressor */}
          <div className="group relative rounded-3xl bg-white/70 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between opacity-85 hover:opacity-100 transition-opacity">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center">
                  <FileImage className="w-7 h-7 text-indigo-500" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 text-[10px] font-mono uppercase font-semibold">
                  Coming Next
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Image Compressor & WebP Optimizer
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Compress photos and graphics by up to 80% without visible quality loss to boost website performance and load speeds.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-[11px] font-mono">
                  Speed Booster
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-[11px] font-mono">
                  Batch WebP Convert
                </span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-zinc-800">
              <div className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-zinc-800/80 text-slate-400 dark:text-zinc-500 font-semibold text-xs text-center">
                In Active Development
              </div>
            </div>
          </div>

          {/* Card 3: Upcoming Code Helper */}
          <div className="group relative rounded-3xl bg-white/70 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between opacity-85 hover:opacity-100 transition-opacity">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center">
                  <Code2 className="w-7 h-7 text-purple-500" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 text-[10px] font-mono uppercase font-semibold">
                  In Roadmap
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Code & Markup Helper
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Quickly generate clean code snippets, structured data schemas, and modern web presets.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-[11px] font-mono">
                  Clean Code
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-[11px] font-mono">
                  Schema Presets
                </span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-zinc-800">
              <div className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-zinc-800/80 text-slate-400 dark:text-zinc-500 font-semibold text-xs text-center">
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
