import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Shield, Zap, Image as ImageIcon, AlertTriangle, ExternalLink } from 'lucide-react';
import { PageLayout } from '../../components/PageLayout';
import { UploadArea } from '../../components/tools/background-remover/UploadArea';
import { ImagePreview } from '../../components/tools/background-remover/ImagePreview';
import { ProcessingState } from '../../components/tools/background-remover/ProcessingState';
import { BeforeAfter } from '../../components/tools/background-remover/BeforeAfter';
import { DownloadOptions } from '../../components/tools/background-remover/DownloadOptions';
import { removeBackground } from '../../services/backgroundRemovalService';
import { applyPageSeo } from '../../utils/seoData';

interface RemoveBackgroundProps {
  onBackToPortfolio?: () => void;
  onNavigate?: (path: string) => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const RemoveBackground: React.FC<RemoveBackgroundProps> = ({
  onBackToPortfolio,
  onNavigate,
  isDark = true,
  onToggleTheme,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processedSize, setProcessedSize] = useState<number | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize SEO and cleanup object URLs on unmount
  useEffect(() => {
    applyPageSeo('/tools/remove-background');
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch {}
      }
    };
  }, []);

  const handleImageSelected = async (file: File) => {
    setErrorMsg(null);
    setResultUrl(null);

    // Check if this is an iPhone / Samsung HEIC or HEIF photo
    const isHeic =
      file.name.toLowerCase().endsWith('.heic') ||
      file.name.toLowerCase().endsWith('.heif') ||
      file.type.includes('heic') ||
      file.type.includes('heif');

    let processedFile = file;

    if (isHeic) {
      try {
        const heic2anyModule = (await import('heic2any')).default;
        const converted = await heic2anyModule({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.92,
        });
        const singleBlob = Array.isArray(converted) ? converted[0] : converted;
        processedFile = new File(
          [singleBlob],
          file.name.replace(/\.(heic|heif)$/i, '.jpg'),
          { type: 'image/jpeg' }
        );
      } catch (convErr) {
        console.warn('[HEIC client conversion error, server Sharp will handle]', convErr);
      }
    }

    setSelectedFile(processedFile);

    // Fast initial object URL
    try {
      const initialUrl = URL.createObjectURL(processedFile);
      setPreviewUrl(initialUrl);
    } catch {}

    // Read full persistent base64 data URL so mobile browsers never lose the image
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setPreviewUrl(dataUrl);
      }
    };
    reader.readAsDataURL(processedFile);
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
    <PageLayout
      currentPath="/tools/remove-background"
      onNavigate={(path) => {
        if (onNavigate) onNavigate(path);
        else if (onBackToPortfolio) onBackToPortfolio();
        else window.location.href = path;
      }}
      isDark={isDark}
      onToggleTheme={onToggleTheme || (() => {})}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation & Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              if (onNavigate) onNavigate('/tools');
              else if (onBackToPortfolio) onBackToPortfolio();
              else window.location.href = '/tools';
            }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Tools</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>100% Free AI Tool</span>
            </span>
          </div>
        </div>

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
            onClick={() => {
              if (onNavigate) onNavigate('/projects');
              else if (onBackToPortfolio) onBackToPortfolio();
              else window.location.href = '/projects';
            }}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-purple-50 text-purple-950 font-bold text-xs sm:text-sm tracking-wide shadow-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 group"
          >
            <span>View Full Portfolio</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </PageLayout>
  );
};
