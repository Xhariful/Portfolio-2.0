import React from 'react';
import { Sliders, Zap, FileType, Maximize2 } from 'lucide-react';
import { CompressionOptions, OutputFormat } from '../../../services/imageCompressionService';

interface CompressionSettingsProps {
  options: CompressionOptions;
  onChange: (options: CompressionOptions) => void;
  disabled?: boolean;
}

export const CompressionSettings: React.FC<CompressionSettingsProps> = ({
  options,
  onChange,
  disabled = false,
}) => {
  const handleQualityChange = (val: number) => {
    onChange({ ...options, quality: val });
  };

  const handleFormatChange = (fmt: OutputFormat) => {
    onChange({ ...options, format: fmt });
  };

  const handleMaxWidthChange = (val: number | undefined) => {
    onChange({ ...options, maxWidth: val });
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900/90 rounded-3xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 shadow-md space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Compression & Format Controls
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              Fine-tune balance between image quality and file size reduction
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-bold">
          {Math.round(options.quality * 100)}% Quality
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Quality Presets & Slider */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Optimization Level</span>
          </label>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleQualityChange(0.6)}
              className={`py-1.5 px-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                options.quality === 0.6
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Max Save (60%)
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleQualityChange(0.8)}
              className={`py-1.5 px-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                options.quality === 0.8
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Balanced (80%)
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleQualityChange(0.92)}
              className={`py-1.5 px-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                options.quality === 0.92
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              High Res (92%)
            </button>
          </div>

          <div className="pt-1">
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={options.quality}
              disabled={disabled}
              onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-lg"
            />
          </div>
        </div>

        {/* 2. Output Format Selector */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
            <FileType className="w-3.5 h-3.5 text-indigo-500" />
            <span>Target Output Format</span>
          </label>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleFormatChange('webp')}
              className={`py-2 px-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                options.format === 'webp'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-750'
              }`}
            >
              <span>WebP (Fastest)</span>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => handleFormatChange('jpeg')}
              className={`py-2 px-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                options.format === 'jpeg'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-750'
              }`}
            >
              <span>JPG / JPEG</span>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => handleFormatChange('png')}
              className={`py-2 px-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                options.format === 'png'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-750'
              }`}
            >
              <span>PNG (Lossless)</span>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => handleFormatChange('original')}
              className={`py-2 px-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                options.format === 'original'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-750'
              }`}
            >
              <span>Keep Original</span>
            </button>
          </div>
        </div>

        {/* 3. Max Width Resize Constraint */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-purple-500" />
            <span>Resize Dimensions (Optional)</span>
          </label>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleMaxWidthChange(undefined)}
              className={`py-2 px-2 rounded-xl text-xs transition-all cursor-pointer ${
                !options.maxWidth
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-750'
              }`}
            >
              Original Dimensions
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleMaxWidthChange(1920)}
              className={`py-2 px-2 rounded-xl text-xs transition-all cursor-pointer ${
                options.maxWidth === 1920
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-750'
              }`}
            >
              Max 1920px (Full HD)
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleMaxWidthChange(1200)}
              className={`py-2 px-2 rounded-xl text-xs transition-all cursor-pointer ${
                options.maxWidth === 1200
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-750'
              }`}
            >
              Max 1200px (Web Std)
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleMaxWidthChange(800)}
              className={`py-2 px-2 rounded-xl text-xs transition-all cursor-pointer ${
                options.maxWidth === 800
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-750'
              }`}
            >
              Max 800px (Thumbnails)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
