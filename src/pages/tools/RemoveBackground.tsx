import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Shield, Zap, Image as ImageIcon, Sun, Moon, AlertTriangle, ExternalLink } from 'lucide-react';
import { UploadArea } from '../../components/tools/background-remover/UploadArea';
import { ImagePreview } from '../../components/tools/background-remover/ImagePreview';
import { ProcessingState } from '../../components/tools/background-remover/ProcessingState';
import { BeforeAfter } from '../../components/tools/background-remover/BeforeAfter';
import { DownloadOptions } from '../../components/tools/background-remover/DownloadOptions';
import { removeBackground } from '../../services/backgroundRemovalService';

interface RemoveBackgroundProps {
  onBackToPortfolio: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const RemoveBackground: React.FC<RemoveBackgroundProps> = ({
  onBackToPortfolio,
  isDark = true,
  onToggleTheme,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processedSize, setProcessedSize] = useState<number | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Clean up object URLs to prevent browser memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageSelected = (file: File) => {
    setErrorMsg(null);
    setResultUrl(null);
    setSelectedFile(file);
    const objUrl = URL.createObjectURL(file);
    setPreviewUrl(objUrl);
  };

  const handleStartRemoval = async () => {
    if (!selectedFile) return;
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const response = await removeBackground(selectedFile);
      if (response.success && response.image) {
        setResultUrl(response.image);
        setProcessedSize(response.processedSize);
      } else {
        setErrorMsg(response.error || 'Failed to remove background. Please try again.');
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unexpected error during processing';
      setErrorMsg(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setProcessedSize(undefined);
    setErrorMsg(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col selection:bg-purple-600 selection:text-white transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToPortfolio}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold transition-all cursor-pointer border border-slate-200 dark:border-zinc-700 shadow-2xs hover:shadow-xs"
            title="Return to Shariful's main portfolio"
          >
            <ArrowLeft className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Back to Portfolio</span>
          </button>

          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-zinc-800">
            <span className="font-bold text-sm text-slate-900 dark:text-white">Shariful Islam</span>
            <span className="text-xs text-slate-400">• Tools Studio</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Free Utility</span>
          </span>

          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer border border-slate-200 dark:border-zinc-700"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>
          )}
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Hero Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-mono font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>100% Free AI Background Remover</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Remove Image Backgrounds in <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">1-Click</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
            Upload any photo, portrait, or graphic. Get a pixel-perfect transparent PNG or optimized WebP cutout in seconds.
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block font-semibold">Processing Notice:</strong>
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-rose-500 hover:text-rose-700 font-bold ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Dynamic Studio Stage */}
        <div className="w-full">
          {!selectedFile && (
            <UploadArea
              onImageSelected={handleImageSelected}
              onError={(err) => setErrorMsg(err)}
              disabled={isProcessing}
            />
          )}

          {selectedFile && previewUrl && !isProcessing && !resultUrl && (
            <ImagePreview
              file={selectedFile}
              previewUrl={previewUrl}
              onRemoveBackground={handleStartRemoval}
              onClear={handleReset}
              disabled={isProcessing}
            />
          )}

          {isProcessing && previewUrl && (
            <ProcessingState previewUrl={previewUrl} />
          )}

          {resultUrl && previewUrl && (
            <div className="space-y-6">
              <BeforeAfter originalUrl={previewUrl} resultUrl={resultUrl} />

              <DownloadOptions
                resultUrl={resultUrl}
                originalSize={selectedFile?.size}
                processedSize={processedSize}
                originalFilename={selectedFile?.name}
                onReset={handleReset}
              />
            </div>
          )}
        </div>

        {/* Key Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-zinc-800">
          <div className="p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Clean Edge Isolation</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Neural segmentation precisely handles fine hair, complex contours, and semi-transparent objects.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">High-Resolution Output</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Export in transparent PNG for maximum clarity or lightweight WebP for fast web loading and sharing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">100% Free & Private</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              No watermarks, no account signup required. Processed directly through high-speed server pipeline.
            </p>
          </div>
        </div>

        {/* Developer CTA Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-900/90 via-indigo-950 to-zinc-950 text-white border border-purple-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-mono uppercase tracking-widest text-purple-300 font-semibold">
              Built by Shariful Islam
            </span>
            <h3 className="text-lg sm:text-2xl font-bold">
              Need custom web development or modern software engineering?
            </h3>
            <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl">
              I build custom web applications, responsive user interfaces, and high-performance digital solutions for clients worldwide.
            </p>
          </div>

          <button
            onClick={onBackToPortfolio}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-purple-50 text-purple-950 font-bold text-xs sm:text-sm tracking-wide shadow-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 group"
          >
            <span>View Full Portfolio</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-zinc-800 py-6 px-4 text-center text-xs text-slate-500 dark:text-zinc-500">
        <p>© {new Date().getFullYear()} Shariful Islam • All rights reserved.</p>
      </footer>
    </div>
  );
};
