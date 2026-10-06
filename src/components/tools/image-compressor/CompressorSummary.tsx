import React from 'react';
import { Download, Trash2, ArrowDownCircle, Layers, CheckCircle, RefreshCw } from 'lucide-react';
import { CompressedImageResult, formatBytes } from '../../../services/imageCompressionService';

interface CompressorSummaryProps {
  items: CompressedImageResult[];
  onDownloadAllZip: () => void;
  onClearAll: () => void;
  onRecompressAll?: () => void;
  isZipping?: boolean;
}

export const CompressorSummary: React.FC<CompressorSummaryProps> = ({
  items,
  onDownloadAllZip,
  onClearAll,
  onRecompressAll,
  isZipping = false,
}) => {
  const completedItems = items.filter((i) => i.status === 'done');
  const totalOriginalBytes = items.reduce((acc, i) => acc + i.originalSize, 0);
  const totalCompressedBytes = completedItems.reduce((acc, i) => acc + i.compressedSize, 0);
  const totalSavedBytes = Math.max(0, totalOriginalBytes - totalCompressedBytes);
  const totalPercentage =
    totalOriginalBytes > 0
      ? Math.round((totalSavedBytes / totalOriginalBytes) * 100)
      : 0;

  return (
    <div className="w-full bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-zinc-900/60 rounded-3xl border border-indigo-500/30 p-5 sm:p-7 shadow-xl space-y-6">
      {/* Top Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Stat 1: Total Images */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xs rounded-2xl p-4 border border-slate-200/80 dark:border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs">
            <span>Total Images</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {items.length}
            </span>
            <span className="text-[11px] text-slate-500 ml-1.5 font-medium">files</span>
          </div>
        </div>

        {/* Stat 2: Original Size */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xs rounded-2xl p-4 border border-slate-200/80 dark:border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs">
            <span>Original Size</span>
            <span className="w-2 h-2 rounded-full bg-slate-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-700 dark:text-zinc-300">
              {formatBytes(totalOriginalBytes)}
            </span>
          </div>
        </div>

        {/* Stat 3: Compressed Size */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xs rounded-2xl p-4 border border-slate-200/80 dark:border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs">
            <span>Optimized Size</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {formatBytes(totalCompressedBytes)}
            </span>
          </div>
        </div>

        {/* Stat 4: Saved Space */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/15 to-teal-500/10 rounded-2xl p-4 border border-emerald-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <span>Bandwidth Saved</span>
            <ArrowDownCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              -{totalPercentage}%
            </span>
            <span className="text-xs font-mono text-emerald-600/80 font-bold">
              ({formatBytes(totalSavedBytes)})
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-600 dark:text-zinc-400 font-medium text-center sm:text-left">
          {completedItems.length} of {items.length} images processed and ready for instant download.
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {onRecompressAll && (
            <button
              type="button"
              onClick={onRecompressAll}
              className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-300 font-semibold text-xs transition-colors border border-slate-200 dark:border-zinc-700 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Apply to All</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClearAll}
            className="px-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 font-semibold text-xs transition-colors border border-rose-200 dark:border-rose-900/60 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear List</span>
          </button>

          <button
            type="button"
            onClick={onDownloadAllZip}
            disabled={isZipping || completedItems.length === 0}
            className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>
              {isZipping
                ? 'Creating ZIP...'
                : `Download All as ZIP (${completedItems.length})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
