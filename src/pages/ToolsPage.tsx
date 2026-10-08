import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { ToolsSection } from '../components/ToolsSection';
import { GamesSection } from '../components/GamesSection';
import { ShieldCheck, Zap, Sparkles, Download } from 'lucide-react';
import { openSnakeGameModal } from '../components/NeonSnakeModal';

interface PageProps {
  onNavigate: (path: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const ToolsPage: React.FC<PageProps> = ({ onNavigate, isDark, onToggleTheme }) => {
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('snake')) {
      setTimeout(() => {
        openSnakeGameModal();
      }, 300);
    }
  }, []);

  return (
    <PageLayout
      currentPath="/tools"
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleTheme={onToggleTheme}
    >
      {/* Interactive Tools Hub */}
      <ToolsSection onNavigateToTool={(route) => onNavigate(route)} />

      {/* Feature & Privacy Highlights Bento */}
      <section className="mt-16 rounded-3xl p-6 sm:p-10 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            WHY USE OUR TOOLS?
          </span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Built for Maximum Speed, Privacy & Precision
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-2">
            Every utility in the Shariful Tools suite is completely free with no registration, no hidden watermarks, and zero paywalls.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sub-Second Processing</h4>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Optimized WASM and cloud edge acceleration deliver rapid conversions without lag.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">100% Privacy-First</h4>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Your assets are processed in-memory and never stored on third-party public databases.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Zero Watermarks</h4>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Download pristine, unbranded cutouts and optimized graphics ready for production stores.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Batch & ZIP Exports</h4>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Compress up to 50+ photos simultaneously and download all results in a single organized ZIP.
            </p>
          </div>
        </div>
      </section>

      {/* Our Games Section - Separated below tools */}
      <div className="mt-8">
        <GamesSection onNavigateToGame={(route) => onNavigate(route)} />
      </div>
    </PageLayout>
  );
};
