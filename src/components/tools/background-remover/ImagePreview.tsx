import React from 'react';
import { Sparkles, Trash2, ArrowRight, FileCheck } from 'lucide-react';

interface ImagePreviewProps {
  file: File;
  previewUrl: string;
  onRemoveBackground: () => void;
  onClear: () => void;
  disabled?: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  file,
  previewUrl,
  onRemoveBackground,
  onClear,
  disabled = false,
}) => {
  const [hasError, setHasError] = React.useState(false);

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900/80 rounded-3xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-7 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Thumbnail Preview Container */}
        <div className="relative w-full md:w-56 h-56 rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-center shrink-0 group">
          {!hasError ? (
            <img
              src={previewUrl}
              alt="Original upload"
              onError={() => setHasError(true)}
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                Image Loaded
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {file.name}
              </span>
            </div>
          )}
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider">
            Original
          </div>
        </div>

        {/* File Metadata & Actions */}
        <div className="flex-1 w-full space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <FileCheck className="w-4 h-4" />
              <span>Image Ready For AI Segmentation</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate max-w-md">
              {file.name}
            </h4>
            <p className="text-xs font-mono text-slate-500 dark:text-zinc-400">
              Type: {file.type || 'image'} • Size: {formatSize(file.size)}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/40 text-xs text-purple-900 dark:text-purple-200 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>Neural AI engine will isolate the subject and generate a clean, watermark-free alpha cutout.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onRemoveBackground}
              disabled={disabled}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-600 text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Remove Background</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClear}
              disabled={disabled}
              className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-zinc-800 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-600 dark:text-zinc-300 dark:hover:text-rose-400 font-semibold text-xs transition-colors border border-slate-200 dark:border-zinc-700 cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Choose Another</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
