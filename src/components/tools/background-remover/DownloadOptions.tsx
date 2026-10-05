import React, { useState } from 'react';
import { Download, RefreshCw, Copy, Check, Sparkles, FileImage } from 'lucide-react';
import { convertDataUrlToWebp, triggerDownload } from '../../../services/backgroundRemovalService';

interface DownloadOptionsProps {
  resultUrl: string;
  originalSize?: number;
  processedSize?: number;
  originalFilename?: string;
  onReset: () => void;
}

export const DownloadOptions: React.FC<DownloadOptionsProps> = ({
  resultUrl,
  originalSize,
  processedSize,
  originalFilename = 'cutout',
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [isConvertingWebp, setIsConvertingWebp] = useState(false);

  const baseName = originalFilename.replace(/\.[^/.]+$/, '');

  const handleDownloadPng = () => {
    triggerDownload(resultUrl, `${baseName}-no-bg.png`);
  };

  const handleDownloadWebp = async () => {
    try {
      setIsConvertingWebp(true);
      const webpUrl = await convertDataUrlToWebp(resultUrl, 0.92);
      triggerDownload(webpUrl, `${baseName}-transparent.webp`);
    } catch (e) {
      console.error('WebP conversion failed', e);
      handleDownloadPng();
    } finally {
      setIsConvertingWebp(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      // Fetch blob from dataURL
      const res = await fetch(resultUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Clipboard copy failed:', e);
    }
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return null;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Background Removed Successfully!
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Studio-quality cutout with transparent alpha channel ready for your store.
          </p>
        </div>

        {/* Stats Pill */}
        {(originalSize || processedSize) && (
          <div className="flex items-center gap-3 text-xs font-mono bg-slate-100 dark:bg-zinc-800 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 shrink-0">
            {originalSize && (
              <span className="text-slate-500 dark:text-zinc-400">
                In: <strong>{formatBytes(originalSize)}</strong>
              </span>
            )}
            {processedSize && (
              <>
                <span className="text-slate-300 dark:text-zinc-600">•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Out: <strong>{formatBytes(processedSize)}</strong>
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Main Download Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* 1. Download PNG */}
        <button
          onClick={handleDownloadPng}
          className="p-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-600 text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
        >
          <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          <span>Download PNG</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/20 uppercase">
            Lossless
          </span>
        </button>

        {/* 2. Download WebP (Optimized) */}
        <button
          onClick={handleDownloadWebp}
          disabled={isConvertingWebp}
          className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer group disabled:opacity-50"
        >
          <FileImage className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          <span>{isConvertingWebp ? 'Optimizing...' : 'Download WebP'}</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/20 uppercase">
            Web Ready
          </span>
        </button>

        {/* 3. Copy to Clipboard */}
        <button
          onClick={handleCopyToClipboard}
          className="p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-800 dark:text-zinc-200 font-bold text-sm border border-slate-200 dark:border-zinc-700 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>Copy Image</span>
            </>
          )}
        </button>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-zinc-800">
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Upload Another Image</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>100% Free • High Definition Output</span>
        </div>
      </div>
    </div>
  );
};
