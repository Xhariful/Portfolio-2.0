import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

interface UploadAreaProps {
  onImageSelected: (file: File) => void;
  onError: (msg: string) => void;
  disabled?: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({
  onImageSelected,
  onError,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcess = (file: File) => {
    const isImage =
      (file.type && file.type.startsWith('image/')) ||
      /\.(jpe?g|png|webp|heic|heif|gif|bmp|svg)$/i.test(file.name);

    if (!isImage) {
      onError('Please upload a valid image file (PNG, JPG, JPEG, WebP, or HEIC).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      onError('File size exceeds 15MB limit. Please choose a smaller image.');
      return;
    }
    onImageSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcess(e.target.files[0]);
    }
  };

  // Pre-loaded e-commerce demo sample to try in 1-click
  const handleSampleClick = async (sampleUrl: string, sampleName: string) => {
    try {
      const res = await fetch(sampleUrl);
      const blob = await res.blob();
      const file = new File([blob], sampleName, { type: blob.type || 'image/jpeg' });
      validateAndProcess(file);
    } catch {
      onError('Could not load sample image. Please upload an image from your device.');
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Drag & Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative group border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
          isDragging
            ? 'border-purple-500 bg-purple-500/10 scale-[1.01]'
            : 'border-slate-300 dark:border-zinc-700/80 bg-white/60 dark:bg-zinc-900/60 hover:border-purple-500/60 hover:bg-purple-50/50 dark:hover:bg-purple-950/20'
        } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />

        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-500/15 via-indigo-500/15 to-purple-700/20 border border-purple-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 text-purple-600 dark:text-purple-400 shadow-inner">
          <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-zinc-100 mb-2">
          Drop your image here, or <span className="text-purple-600 dark:text-purple-400 underline decoration-purple-400/40 underline-offset-4">Browse File</span>
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-md mx-auto mb-4">
          Supports high-resolution PNG, JPG, JPEG, and WebP up to 15MB. Perfect for portraits, photos, graphics, and cutouts.
        </p>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800/80 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>100% Free • No watermark • High definition output</span>
        </div>
      </div>

      {/* Quick Sample Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 pt-1 text-xs">
        <span className="text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          No image on hand? Try a demo photo:
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSampleClick('/preloader-placeholder.jpg', 'demo-portrait.jpg');
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-300 font-medium transition-colors cursor-pointer border border-slate-200 dark:border-zinc-700 text-xs flex items-center gap-1"
          >
            <ImageIcon className="w-3 h-3 text-purple-500" />
            <span>Demo Portrait</span>
          </button>
        </div>
      </div>
    </div>
  );
};
