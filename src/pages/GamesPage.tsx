import React, { useEffect } from 'react';
import { PageLayout } from '../components/PageLayout';
import { GamesSection } from '../components/GamesSection';
import { Gamepad2, Trophy, Flame, Play, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { openSnakeGameModal } from '../components/NeonSnakeModal';

interface GamesPageProps {
  onNavigate: (path: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const GamesPage: React.FC<GamesPageProps> = ({ onNavigate, isDark, onToggleTheme }) => {
  // Auto-open snake game if hash is #snake
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('snake')) {
      setTimeout(() => {
        openSnakeGameModal();
      }, 300);
    }
  }, []);

  return (
    <PageLayout
      currentPath="/games"
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleTheme={onToggleTheme}
      hideHeaderHero={true}
    >
      <div className="space-y-12">
        {/* Retro Arcade Hero Banner */}
        <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-emerald-950/70 via-zinc-900 to-purple-950/70 border border-emerald-500/30 shadow-2xl overflow-hidden">
          {/* Cyber grid lines background effect */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>DEDICATED ARCADE & GAMING HUB</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Retro Arcade & Mini Games
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Step into our neon cyber arcade! Enjoy classic 60 FPS mechanics, custom synthesizer audio, and local high-score tracking. Zero downloads, zero ads, pure interactive nostalgia.
            </p>

            {/* Quick Action & Controls Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => openSnakeGameModal()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs sm:text-sm font-black transition-all cursor-pointer shadow-lg shadow-emerald-500/25 group"
              >
                <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                <span>Play Neon Snake Now</span>
              </button>

              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs font-mono">
                <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Local High Score Enabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Arcade Games Section */}
        <div>
          <GamesSection onNavigateToGame={(route) => onNavigate(route)} />
        </div>

        {/* How to Play & Controls Bento Card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 space-y-6">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <Flame className="w-4 h-4" />
            <span>Arcade Controls & Pro Tips</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-zinc-700 font-mono text-xs">↑ ↓ ← →</span>
                <span>Keyboard Navigation</span>
              </div>
              <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed">
                Use Arrow keys or W, A, S, D for sharp 90-degree turns. Fluid responsive input with zero input latency.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-zinc-700 font-mono text-xs">Spacebar</span>
                <span>Pause & Resume</span>
              </div>
              <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed">
                Press Spacebar anytime to pause the game or resume your run when you are ready to climb the high scores.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-zinc-700 font-mono text-xs">Touch</span>
                <span>Mobile Swipe Support</span>
              </div>
              <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed">
                On smartphones or tablets, use simple swipe gestures or on-screen directional buttons to steer effortlessly.
              </p>
            </div>
          </div>
        </div>

        {/* Cross-Link Card to Interactive Tools Hub */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-purple-900/30 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              NEED WORK UTILITIES?
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Explore Our Interactive Tools Studio
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              AI Background Remover, Image Compressor & WebP batch converter, and Real-Time IP Network Inspector.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/tools')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-all cursor-pointer shadow-md shadow-purple-600/20 shrink-0"
          >
            <span>Open Tools Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </PageLayout>
  );
};
export default GamesPage;
