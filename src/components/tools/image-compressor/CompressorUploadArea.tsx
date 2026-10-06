import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, Layers, ShieldCheck } from 'lucide-react';

interface CompressorUploadAreaProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export const CompressorUploadArea: React.FC<CompressorUploadAreaProps> = ({
  onFilesSelected,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const isImg =
        (file.type && file.type.startsWith('image/')) ||
        /\.(jpe?g|png|webp|heic|heif|gif|bmp)$/i.test(file.name);
      if (isImg) {
        files.push(file);
      }
    }
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset so same files can be re-selected if needed
    e.target.value = '';
  };

  const handleDemoSample = async (url: string, name: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], name, { type: blob.type || 'image/jpeg' });
      onFilesSelected([file]);
    } catch (err) {
      console.warn('Could not load demo sample', err);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Multi-file Drag & Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative group border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : 'border-slate-300 dark:border-zinc-700/80 bg-white/70 dark:bg-zinc-900/60 hover:border-indigo-500/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20'
        } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
          disabled={disabled}
        />

        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-indigo-700/20 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 text-indigo-600 dark:text-indigo-400 shadow-inner">
          <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-zinc-100 mb-2">
          Drop single or <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-400/40 underline-offset-4">batch of images</span> here
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-md mx-auto mb-4">
          Compress 1 image or upload 50+ photos at once. Converts to WebP/JPG with up to 85% reduction without visible quality loss.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800/80 px-3 py-1 rounded-full border border-slate-200 dark:border-zinc-700">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Single & Bulk Batch Upload</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800/80 px-3 py-1 rounded-full border border-slate-200 dark:border-zinc-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% Client-Side • Private & Secure</span>
          </div>
        </div>
      </div>

      {/* Quick Demo Test Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 pt-1 text-xs">
        <span className="text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Quick test with sample photo:
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDemoSample('/preloader-placeholder.jpg', 'sample-highres.jpg');
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-300 font-medium transition-colors cursor-pointer border border-slate-200 dark:border-zinc-700 text-xs flex items-center gap-1.5"
        >
          <ImageIcon className="w-3 h-3 text-indigo-500" />
          <span>Load Demo Sample</span>
        </button>
      </div>
    </div>
  );
};
