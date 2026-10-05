import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';

interface ProcessingStateProps {
  previewUrl: string;
}

const STEPS = [
  'Detecting foreground subject & contours...',
  'Extracting hair, edges & complex boundaries...',
  'Generating transparent alpha mask...',
  'Rendering final crystal-clear cutout...',
];

export const ProcessingState: React.FC<ProcessingStateProps> = ({ previewUrl }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIdx((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white dark:bg-zinc-900/90 rounded-3xl border border-purple-300 dark:border-purple-800/60 p-8 sm:p-12 shadow-2xl text-center space-y-6 flex flex-col items-center justify-center">
      {/* Animated Image Scanner */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden bg-slate-900 border-2 border-purple-500/40 shadow-xl flex items-center justify-center">
        <img
          src={previewUrl}
          alt="Processing"
          className="w-full h-full object-contain p-2 opacity-60 filter blur-[0.5px]"
        />

        {/* Laser Scanning Bar */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 shadow-[0_0_15px_#a855f7] animate-[bounce_2s_infinite] top-0" />

        {/* Center Glow Spinner */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
          <div className="p-4 rounded-full bg-purple-600/90 text-white shadow-xl animate-spin">
            <Loader2 className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Progress Messaging */}
      <div className="space-y-2 max-w-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-spin" />
          <span>AI Neural Engine Working</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <span>Removing Background</span>
          <Wand2 className="w-5 h-5 text-indigo-500 animate-pulse" />
        </h3>

        <p className="text-sm font-mono text-purple-600 dark:text-purple-400 transition-all duration-300">
          {STEPS[currentStepIdx]}
        </p>
      </div>

      {/* Subtle Progress Bar */}
      <div className="w-64 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 animate-pulse w-full rounded-full" />
      </div>
    </div>
  );
};
