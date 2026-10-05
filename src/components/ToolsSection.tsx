import React from 'react';
import { Wand2, ArrowUpRight, FileImage, Code2 } from 'lucide-react';
import { Text3DFlip } from './ui/text-3d-flip';

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
    <section id="tools" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-slate-200/80 dark:border-zinc-800/80 bg-transparent scroll-mt-24">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 backdrop-blur-xs text-purple-700 dark:text-purple-300 text-xs font-mono">
            <Wand2 className="w-3.5 h-3.5" />
            <span>INTERACTIVE UTILITIES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            <Text3DFlip
              className="font-extrabold justify-center"
              textClassName="text-slate-900 dark:text-white"
              flipTextClassName="text-purple-600 dark:text-purple-400"
              rotateDirection="top"
              staggerDuration={0.025}
            >
              Our <span className="gradient-text">Tools</span>
            </Text3DFlip>
          </h2>

          <p className="text-base text-slate-600 dark:text-zinc-400">
            Free, high-performance web utilities for everyone. Easily remove image backgrounds and optimize assets with zero watermarks.
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

            {/* CTA Button - Full Width Centered matching other cards */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => handleLaunchTool('/tools/remove-background')}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-600 text-white font-bold text-xs tracking-wide shadow-md hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>Let's Remove BG</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
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
