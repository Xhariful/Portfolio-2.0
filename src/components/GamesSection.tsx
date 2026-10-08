import React from 'react';
import { Gamepad2, Play, Sparkles, Trophy, Flame, Layers, ArrowUpRight } from 'lucide-react';
import { Text3DFlip } from './ui/text-3d-flip';
import { openSnakeGameModal } from './NeonSnakeModal';

interface GamesSectionProps {
  onNavigateToGame?: (route: string) => void;
}

export const GamesSection: React.FC<GamesSectionProps> = ({ onNavigateToGame }) => {
  return (
    <section
      id="games"
      className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-slate-200/80 dark:border-zinc-800/80 bg-transparent scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-xs text-emerald-700 dark:text-emerald-300 text-xs font-mono">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>RETRO ARCADE & CASUAL GAMES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            <Text3DFlip
              className="font-extrabold justify-center"
              textClassName="text-slate-900 dark:text-white"
              flipTextClassName="text-emerald-600 dark:text-emerald-400"
              rotateDirection="top"
              staggerDuration={0.025}
            >
              Our <span className="gradient-text">Games</span>
            </Text3DFlip>
          </h2>

          <p className="text-base text-slate-600 dark:text-zinc-400">
            Fun, lightweight retro arcade and casual mini-games built with smooth 60 FPS HTML5 canvas physics and Web Audio. Play right in your browser with zero installs or downloads.
          </p>
        </div>

        {/* Games Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Neon Snake Retro Arcade (Live & Playable) */}
          <div className="group relative rounded-3xl bg-white dark:bg-zinc-900/90 border-2 border-emerald-500/40 dark:border-emerald-500/50 p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Badge & Icon */}
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-slate-950 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-7 h-7 text-white" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Playable Now
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <span>Neon Snake Arcade</span>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  Classic retro arcade snake built with 60 FPS canvas physics. Eat glowing berries, dodge self-collisions, adapt as speeds ramp up, and set high score records!
                </p>
              </div>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono">
                  60 FPS Canvas
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono">
                  Web Audio SFX
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono">
                  Touch D-Pad
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono">
                  High Scores
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => openSnakeGameModal()}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:via-teal-400 hover:to-emerald-500 text-slate-950 font-black text-xs tracking-wider uppercase shadow-md hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer text-center group/btn active:scale-98"
              >
                <Play className="w-4 h-4 fill-current group-hover/btn:scale-110 transition-transform" />
                <span>Play Neon Snake</span>
              </button>
            </div>
          </div>

          {/* Card 2: Cyber Pong 1982 */}
          <div className="group relative rounded-3xl bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 shadow-md hover:shadow-xl hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                  <Trophy className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 text-[10px] font-mono uppercase font-bold tracking-wide">
                  Coming Soon
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <span>Cyber Pong 1982</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  The legendary two-paddle table tennis arcade game modernized with dynamic spin physics, CRT scanline effects, and reactive computer bot difficulty.
                </p>
              </div>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2.5 py-1 rounded-md bg-cyan-50 dark:bg-zinc-800 text-cyan-700 dark:text-cyan-300 text-[11px] font-mono">
                  Paddle Physics
                </span>
                <span className="px-2.5 py-1 rounded-md bg-cyan-50 dark:bg-zinc-800 text-cyan-700 dark:text-cyan-300 text-[11px] font-mono">
                  Smart CPU AI
                </span>
                <span className="px-2.5 py-1 rounded-md bg-cyan-50 dark:bg-zinc-800 text-cyan-700 dark:text-cyan-300 text-[11px] font-mono">
                  CRT Neon Shaders
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-zinc-800">
              <div className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-zinc-800/80 text-slate-500 dark:text-zinc-400 font-semibold text-xs tracking-wide flex items-center justify-center gap-2 text-center cursor-not-allowed">
                <span>In Development</span>
              </div>
            </div>
          </div>

          {/* Card 3: 2048 Neon Grid */}
          <div className="group relative rounded-3xl bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 shadow-md hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                  <Layers className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[10px] font-mono uppercase font-bold tracking-wide">
                  Coming Soon
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>2048 Neon Grid</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  Slide numbered tile blocks across a glowing 4×4 board, combine power-of-two blocks, and build your score to unlock the elusive 2048 neon badge.
                </p>
              </div>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-zinc-800 text-amber-700 dark:text-amber-300 text-[11px] font-mono">
                  Brain Puzzle
                </span>
                <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-zinc-800 text-amber-700 dark:text-amber-300 text-[11px] font-mono">
                  Dark Neon Theme
                </span>
                <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-zinc-800 text-amber-700 dark:text-amber-300 text-[11px] font-mono">
                  Undo Moves
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-zinc-800">
              <div className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-zinc-800/80 text-slate-500 dark:text-zinc-400 font-semibold text-xs tracking-wide flex items-center justify-center gap-2 text-center cursor-not-allowed">
                <span>In Development</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
