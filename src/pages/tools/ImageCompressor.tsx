import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sun,
  Moon,
  Sparkles,
  FileArchive,
  Layers,
  Zap,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { CompressorUploadArea } from '../../components/tools/image-compressor/CompressorUploadArea';
import { CompressionSettings } from '../../components/tools/image-compressor/CompressionSettings';
import { CompressorSummary } from '../../components/tools/image-compressor/CompressorSummary';
import { CompressorItemCard } from '../../components/tools/image-compressor/CompressorItemCard';
import {
  CompressionOptions,
  CompressedImageResult,
  compressSingleImage,
  createZipArchive,
  triggerFileDownload,
} from '../../services/imageCompressionService';

interface ImageCompressorProps {
  onBackToPortfolio?: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const ImageCompressor: React.FC<ImageCompressorProps> = ({
  onBackToPortfolio,
  isDark = true,
  onToggleTheme,
}) => {
  const [items, setItems] = useState<CompressedImageResult[]>([]);
  const [options, setOptions] = useState<CompressionOptions>({
    quality: 0.8, // 80% default balanced quality
    format: 'webp', // WebP default for website performance
    maxWidth: undefined,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync title and SEO
  useEffect(() => {
    document.title = 'Free Image Compressor & WebP Optimizer | Shariful Islam';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Process incoming files batch
  const handleFilesSelected = async (newFiles: File[]) => {
    setErrorMsg(null);
    setIsProcessing(true);

    const newPendingItems: CompressedImageResult[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      originalName: file.name,
      originalSize: file.size,
      originalType: file.type || 'image/jpeg',
      compressedBlob: new Blob(),
      compressedSize: 0,
      compressedType: 'image/webp',
      previewUrl: '',
      width: 0,
      height: 0,
      savedBytes: 0,
      savedPercentage: 0,
      status: 'processing',
    }));

    setItems((prev) => [...prev, ...newPendingItems]);

    // Compress concurrently with concurrency limit of 3 for smooth browser UX
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const pendingItem = newPendingItems[i];

      try {
        const result = await compressSingleImage(file, options, pendingItem.id);
        setItems((prev) =>
          prev.map((item) => (item.id === pendingItem.id ? result : item))
        );
      } catch (err: any) {
        console.error('Compression error for file:', file.name, err);
        setItems((prev) =>
          prev.map((item) =>
            item.id === pendingItem.id
              ? {
                  ...item,
                  status: 'error',
                  errorMessage: err?.message || 'Compression failed',
                }
              : item
          )
        );
      }
    }

    setIsProcessing(false);
  };

  // Re-compress existing items if user changes settings
  const handleRecompressAll = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);

    // Mark all as processing
    setItems((prev) =>
      prev.map((i) => ({ ...i, status: 'processing' as const }))
    );

    // Note: Re-compress requires source files or converts existing blobs
    const updatedItems = await Promise.all(
      items.map(async (item) => {
        if (!item.compressedBlob) return item;
        try {
          const fakeFile = new File([item.compressedBlob], item.originalName, {
            type: item.originalType,
          });
          const res = await compressSingleImage(fakeFile, options, item.id);
          return res;
        } catch {
          return item;
        }
      })
    );

    setItems(updatedItems);
    setIsProcessing(false);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleClearAll = () => {
    items.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setItems([]);
  };

  const handleDownloadAllZip = async () => {
    const readyItems = items.filter((i) => i.status === 'done');
    if (readyItems.length === 0) return;

    setIsZipping(true);
    try {
      const zipBlob = await createZipArchive(readyItems);
      const timestamp = new Date().toISOString().slice(0, 10);
      triggerFileDownload(zipBlob, `compressed-images-${timestamp}.zip`);
    } catch (err) {
      console.error('ZIP creation error:', err);
      setErrorMsg('Failed to create ZIP package. You can download images individually.');
    } finally {
      setIsZipping(false);
    }
  };

  const handleBack = () => {
    if (onBackToPortfolio) {
      onBackToPortfolio();
    } else {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col selection:bg-indigo-600 selection:text-white transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </button>

          <div className="h-4 w-px bg-slate-300 dark:bg-zinc-700 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-zinc-200">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>Image Compressor & WebP Optimizer</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-[11px] font-mono font-semibold hidden md:inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>100% Free • Unlimited Bulk</span>
          </span>

          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle Color Theme"
              className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer border border-slate-200 dark:border-zinc-700"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Header Hero Section */}
        <div className="text-center space-y-3.5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-bold tracking-wide">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Fast Client-Side Compression Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Compress Images &{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Optimize for Web
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Reduce photo file sizes by up to 85% with zero visible quality loss. Convert to lightning-fast WebP, JPG, or PNG. Compress single images or batch process hundreds of photos with 1-click ZIP download.
          </p>
        </div>

        {/* Notice Message if any */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-rose-500 hover:text-rose-700 font-bold ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Compression Settings Controls */}
        <CompressionSettings
          options={options}
          onChange={setOptions}
          disabled={isProcessing}
        />

        {/* Dropzone Upload Area */}
        <CompressorUploadArea
          onFilesSelected={handleFilesSelected}
          disabled={isProcessing}
        />

        {/* Results & Summary */}
        {items.length > 0 && (
          <div className="space-y-6 pt-4">
            {/* Stats Dashboard */}
            <CompressorSummary
              items={items}
              onDownloadAllZip={handleDownloadAllZip}
              onClearAll={handleClearAll}
              onRecompressAll={handleRecompressAll}
              isZipping={isZipping}
            />

            {/* List of Compressed Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <span>Images Queue ({items.length})</span>
                </h4>
                <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
                  Drag more images anytime to append
                </span>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <CompressorItemCard
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-slate-200/80 dark:border-zinc-800/80 text-xs">
          <div className="p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Zap className="w-4 h-4 text-indigo-500" />
              <span>Smart WebP Compression</span>
            </div>
            <p className="text-slate-500 dark:text-zinc-400 leading-relaxed">
              Google-recommended next-gen image format that speeds up web loading by reducing bandwidth usage by up to 80%.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <FileArchive className="w-4 h-4 text-purple-500" />
              <span>Bulk 1-Click ZIP Download</span>
            </div>
            <p className="text-slate-500 dark:text-zinc-400 leading-relaxed">
              Batch compress multiple files and package them into an archive in seconds without waiting for upload queues.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Private & Free</span>
            </div>
            <p className="text-slate-500 dark:text-zinc-400 leading-relaxed">
              Processes directly inside your device memory. Zero watermark, no registration, and zero monthly subscriptions.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200/80 dark:border-zinc-800/80 text-center text-xs text-slate-500 dark:text-zinc-400">
        <p>© 2026 Shariful Islam • All rights reserved.</p>
      </footer>
    </div>
  );
};
