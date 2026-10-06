import React from 'react';
import { Download, Trash2, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import {
  CompressedImageResult,
  formatBytes,
  getOutputFilename,
  triggerFileDownload,
} from '../../../services/imageCompressionService';

interface CompressorItemCardProps {
  item: CompressedImageResult;
  onRemove: (id: string) => void;
}

export const CompressorItemCard: React.FC<CompressorItemCardProps> = ({ item, onRemove }) => {
  const handleDownload = () => {
    if (item.compressedBlob) {
      const filename = getOutputFilename(item.originalName, item.compressedType);
      triggerFileDownload(item.compressedBlob, filename);
    }
  };

  const getFormatBadge = (mime: string) => {
    if (mime.includes('webp')) return 'WebP';
    if (mime.includes('png')) return 'PNG';
    return 'JPG';
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900/80 rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center gap-4">
      {/* Thumbnail */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shrink-0 flex items-center justify-center">
        {item.status === 'processing' ? (
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        ) : item.status === 'error' ? (
          <AlertCircle className="w-6 h-6 text-rose-500" />
        ) : (
          <img
            src={item.previewUrl}
            alt={item.originalName}
            className="w-full h-full object-contain p-1"
          />
        )}

        {item.status === 'done' && (
          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white text-[9px] font-mono font-bold uppercase">
            {getFormatBadge(item.compressedType)}
          </span>
        )}
      </div>

      {/* Details & Metrics */}
      <div className="flex-1 w-full min-w-0 space-y-1.5 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
            {item.originalName}
          </h5>
          {item.status === 'done' && (
            <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              <span>-{item.savedPercentage}%</span>
            </span>
          )}
        </div>

        {/* Dimensions & Comparison */}
        {item.status === 'done' ? (
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs font-mono">
            <span className="text-slate-400 dark:text-zinc-500 line-through">
              {formatBytes(item.originalSize)}
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              {formatBytes(item.compressedSize)}
            </span>
            <span className="text-slate-400 dark:text-zinc-600">•</span>
            <span className="text-slate-500 dark:text-zinc-400">
              {item.width} × {item.height}px
            </span>
          </div>
        ) : item.status === 'processing' ? (
          <p className="text-xs text-indigo-500 font-medium animate-pulse">
            Optimizing pixel density & compressing...
          </p>
        ) : (
          <p className="text-xs text-rose-500 font-medium">
            {item.errorMessage || 'Failed to process this image'}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
        {item.status === 'done' && (
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          title="Remove from list"
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-zinc-800 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 transition-colors border border-slate-200 dark:border-zinc-700 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
