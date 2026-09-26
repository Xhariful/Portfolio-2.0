import React, { useState, useRef } from 'react';
import {
  RotateCcw,
  Save,
  Sparkles,
  Play,
  Eye,
  Camera,
  CheckCircle2,
  Clock,
  Palette,
  Sliders,
  Image as ImageIcon,
  Upload,
  Trash2,
  RefreshCw,
  FileText,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { InitialLoaderConfig } from '../types';
import { InitialLoader } from './animations/InitialLoader';
import { compressImageFile } from '../lib/imageCompressor';

interface AdminPreloaderTabProps {
  preloaderForm: InitialLoaderConfig;
  setPreloaderForm: React.Dispatch<React.SetStateAction<InitialLoaderConfig>>;
  onSave: (config: InitialLoaderConfig) => void;
  profileAvatar?: string;
  showToast?: (message: string) => void;
}

const PRESET_COLORS = [
  { label: 'Neon Violet (Default)', hex: '#8b5cf6' },
  { label: 'Cyber Cyan', hex: '#06b6d4' },
  { label: 'Emerald Green', hex: '#10b981' },
  { label: 'Electric Indigo', hex: '#6366f1' },
  { label: 'Sunset Amber', hex: '#f59e0b' },
  { label: 'Crimson Rose', hex: '#f43f5e' },
];

export const AdminPreloaderTab: React.FC<AdminPreloaderTabProps> = ({
  preloaderForm,
  setPreloaderForm,
  onSave,
  profileAvatar,
  showToast,
}) => {
  const [previewKey, setPreviewKey] = useState(0);
  const [showFullscreenTest, setShowFullscreenTest] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const restartPreview = () => {
    setPreviewKey((prev) => prev + 1);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(preloaderForm);
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.name.endsWith('.svg') && !file.name.endsWith('.ico')) {
      showToast?.('Please choose an image file (.png, .jpg, .svg, .webp)');
      return;
    }

    try {
      setIsUploading(true);
      showToast?.('Compressing and loading image...');
      const optimizedUrl = await compressImageFile(file, {
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.85,
        mimeType: 'image/webp',
      });
      setPreloaderForm((prev) => ({
        ...prev,
        avatarType: 'photo',
        avatarUrl: optimizedUrl,
      }));
      restartPreview();
      showToast?.('Preloader image uploaded! Click Save to sync to Cloud.');
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast?.('Could not process image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const fillRecommendedPlaceholderContent = () => {
    setPreloaderForm((prev) => ({
      ...prev,
      name: 'Shariful Islam',
      tagline: 'Senior Shopify & Full-Stack Developer',
      initialStatusText: 'INITIALIZING CORE ARCHITECTURE...',
      delayStatusText: 'ESTABLISHING SECURE REALTIME CONNECTION...',
      completionStatusText: 'LAUNCH SUCCESSFUL • WELCOME!',
      durationSeconds: 3.5,
      enableRealisticDelay: true,
      showProgressBar: true,
    }));
    restartPreview();
    showToast?.('Default placeholder content applied!');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.svg"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleImageUpload(e.target.files[0]);
          }
        }}
      />

      {/* Fullscreen Interactive Test Modal */}
      {showFullscreenTest && (
        <div className="fixed inset-0 z-[100000]">
          <InitialLoader
            key={`fullscreen-${previewKey}`}
            config={preloaderForm}
            onComplete={() => setShowFullscreenTest(false)}
          />
          <button
            onClick={() => setShowFullscreenTest(false)}
            className="fixed top-6 right-6 z-[100001] px-4 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-white text-xs font-semibold border border-zinc-700 shadow-2xl cursor-pointer flex items-center gap-2"
          >
            <span>Close Fullscreen Test (Esc)</span>
          </button>
        </div>
      )}

      {/* Header and Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Preloader &amp; Loading Effect Settings</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Customize the animated intro screen, image placeholders, branding text, and realistic delay effect.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              restartPreview();
              setShowFullscreenTest(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-purple-500" />
            <span>Test Fullscreen</span>
          </button>

          <button
            type="button"
            onClick={handleFormSubmit}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save &amp; Sync to Cloud</span>
          </button>
        </div>
      </div>

      {/* Live Interactive Preview Box */}
      <div className="p-6 rounded-3xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
              Live In-Dashboard Simulation
            </span>
          </div>
          <button
            type="button"
            onClick={restartPreview}
            className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-purple-400" />
            <span>Replay Simulation</span>
          </button>
        </div>

        {/* Embedded InitialLoader Preview */}
        <div className="w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
          <InitialLoader
            key={`preview-${previewKey}`}
            config={preloaderForm}
            isPreview={true}
          />
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Enable / Disable Switch */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Enable Preloader Screen</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              When enabled, visitors see the animated loading effect and orbital rings before the website reveals.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preloaderForm.enabled}
              onChange={(e) => setPreloaderForm((prev) => ({ ...prev, enabled: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* SECTION 1: CENTER GRAPHIC DISPLAY MODE & IMAGE PLACEHOLDER */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-500" />
                <span>Center Avatar &amp; Image Placeholder</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Choose the center graphic mode and customize or upload the avatar image.
              </p>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 self-start sm:self-auto font-medium">
              Mode: {preloaderForm.avatarType.toUpperCase()}
            </span>
          </div>

          {/* Mode Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Option 1: Profile Photo / Custom Image */}
            <button
              type="button"
              onClick={() => {
                setPreloaderForm((prev) => ({ ...prev, avatarType: 'photo' }));
                restartPreview();
              }}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                preloaderForm.avatarType === 'photo'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-950 dark:text-purple-200 ring-2 ring-purple-500/20'
                  : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
                  Custom Photo / Image
                </span>
                {preloaderForm.avatarType === 'photo' && <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
              </div>
              <p className="text-[11px] opacity-80 leading-relaxed">
                Circular photo with animated radar aura and neon cyber ring.
              </p>
            </button>

            {/* Option 2: Brand Monogram */}
            <button
              type="button"
              onClick={() => {
                setPreloaderForm((prev) => ({ ...prev, avatarType: 'monogram' }));
                restartPreview();
              }}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                preloaderForm.avatarType === 'monogram'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-950 dark:text-purple-200 ring-2 ring-purple-500/20'
                  : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-500" />
                  Brand Monogram
                </span>
                {preloaderForm.avatarType === 'monogram' && <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
              </div>
              <p className="text-[11px] opacity-80 leading-relaxed">
                Stylized monogram logo letter &quot;S&quot; with metallic gradient.
              </p>
            </button>

            {/* Option 3: Cyber Tech Core */}
            <button
              type="button"
              onClick={() => {
                setPreloaderForm((prev) => ({ ...prev, avatarType: 'tech_core' }));
                restartPreview();
              }}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                preloaderForm.avatarType === 'tech_core'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-950 dark:text-purple-200 ring-2 ring-purple-500/20'
                  : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-500" />
                  Cyber Tech Core
                </span>
                {preloaderForm.avatarType === 'tech_core' && <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
              </div>
              <p className="text-[11px] opacity-80 leading-relaxed">
                Spinning code bracket &amp; hexagonal quantum chip core.
              </p>
            </button>
          </div>

          {/* DEDICATED IMAGE PLACEHOLDER & UPLOAD BOX (Always visible for easy management) */}
          <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-purple-500" />
                <span>Preloader Avatar Image &amp; Placeholder:</span>
              </label>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                Recommended: Square 1:1 image, PNG or WebP
              </span>
            </div>

            {/* Interactive Image Placeholder Frame & Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 sm:p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col sm:flex-row items-center gap-5 ${
                isDragOver
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-slate-300 dark:border-zinc-700 hover:border-purple-400 dark:hover:border-purple-500 bg-white dark:bg-zinc-900/70'
              }`}
            >
              {/* Circular Avatar Placeholder Thumbnail */}
              <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-purple-500/50 shadow-lg flex-shrink-0 bg-zinc-900 flex items-center justify-center">
                {preloaderForm.avatarUrl ? (
                  <img
                    src={preloaderForm.avatarUrl}
                    alt="Preloader placeholder preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/myname.png';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-400">
                    <Camera className="w-6 h-6" />
                    <span className="text-[9px] font-mono mt-0.5">Placeholder</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Upload className="w-5 h-5" />
                </div>
              </div>

              {/* Upload instructions */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-100">
                    {isUploading ? 'Compressing and uploading image...' : 'Click to Upload or Drag & Drop Image Here'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Select your own portrait photo, brand logo, or avatar to display inside the revolving orbital rings.
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                    Current: {preloaderForm.avatarUrl ? (preloaderForm.avatarUrl.startsWith('data:') ? 'Custom Upload (WebP)' : preloaderForm.avatarUrl) : 'None'}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Image File</span>
                </button>
              </div>
            </div>

            {/* Quick Placeholder Preset Buttons */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 block">
                Quick Placeholder Images &amp; Presets:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPreloaderForm((prev) => ({ ...prev, avatarType: 'photo', avatarUrl: '/myname.png' }));
                    restartPreview();
                    showToast?.('Default portrait placeholder loaded (/myname.png)');
                  }}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-purple-400 text-slate-800 dark:text-zinc-200 text-xs font-medium text-left flex items-center gap-2 transition-all cursor-pointer"
                >
                  <img src="/myname.png" alt="Shariful" className="w-6 h-6 rounded-full object-cover border border-purple-500/40" />
                  <span className="truncate">Shariful Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPreloaderForm((prev) => ({ ...prev, avatarType: 'photo', avatarUrl: '/preloader-placeholder.jpg' }));
                    restartPreview();
                    showToast?.('Futuristic Hologram Placeholder loaded (/preloader-placeholder.jpg)');
                  }}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-purple-400 text-slate-800 dark:text-zinc-200 text-xs font-medium text-left flex items-center gap-2 transition-all cursor-pointer"
                >
                  <img src="/preloader-placeholder.jpg" alt="Futuristic Tech" className="w-6 h-6 rounded-full object-cover border border-cyan-500/40" />
                  <span className="truncate">Tech Hologram</span>
                </button>

                {profileAvatar && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreloaderForm((prev) => ({ ...prev, avatarType: 'photo', avatarUrl: profileAvatar }));
                      restartPreview();
                      showToast?.('Main Profile avatar synced to preloader!');
                    }}
                    className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 hover:border-purple-400 text-purple-900 dark:text-purple-200 text-xs font-medium text-left flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <img src={profileAvatar} alt="Profile" className="w-6 h-6 rounded-full object-cover border border-purple-500" />
                    <span className="truncate">Main Profile Avatar</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setPreloaderForm((prev) => ({ ...prev, avatarType: 'photo', avatarUrl: '/loading.svg' }));
                    restartPreview();
                    showToast?.('Cyber SVG animation loaded (/loading.svg)');
                  }}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-purple-400 text-slate-800 dark:text-zinc-200 text-xs font-medium text-left flex items-center gap-2 transition-all cursor-pointer"
                >
                  <img src="/loading.svg" alt="SVG" className="w-6 h-6 rounded-full object-cover bg-zinc-950 border border-purple-500/40 p-0.5" />
                  <span className="truncate">Cyber SVG Icon</span>
                </button>
              </div>
            </div>

            {/* Direct Image URL / Path Input with Placeholder */}
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 block mb-1">
                Or Direct Image URL / File Path:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={preloaderForm.avatarUrl || ''}
                  onChange={(e) => {
                    setPreloaderForm((prev) => ({
                      ...prev,
                      avatarType: 'photo',
                      avatarUrl: e.target.value,
                    }));
                    restartPreview();
                  }}
                  placeholder="e.g. /myname.png, /preloader-placeholder.jpg, or https://example.com/avatar.jpg"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-xs text-slate-900 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {preloaderForm.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreloaderForm((prev) => ({ ...prev, avatarUrl: '' }));
                      restartPreview();
                    }}
                    className="px-3 py-2 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-semibold transition-all cursor-pointer"
                    title="Clear image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: BRANDING & CONTENT PLACEHOLDERS */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-500" />
                <span>Branding Text &amp; Content Placeholders</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Configure the title, professional tagline, and loading progress messages.
              </p>
            </div>

            <button
              type="button"
              onClick={fillRecommendedPlaceholderContent}
              className="px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Fill Default Content</span>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1.5">
                Display Name / Title:
              </label>
              <input
                type="text"
                value={preloaderForm.name ?? ''}
                onChange={(e) => {
                  setPreloaderForm((prev) => ({ ...prev, name: e.target.value }));
                  restartPreview();
                }}
                placeholder="e.g. Shariful Islam"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-xs text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1 block">
                Headline above the progress bar during the loading animation.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1.5">
                Subtitle / Professional Role:
              </label>
              <input
                type="text"
                value={preloaderForm.tagline ?? ''}
                onChange={(e) => {
                  setPreloaderForm((prev) => ({ ...prev, tagline: e.target.value }));
                  restartPreview();
                }}
                placeholder="e.g. Senior Shopify & Full-Stack Developer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-xs text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1 block">
                Subtitle showing your title or specialty.
              </span>
            </div>
          </div>

          {/* Dynamic Loading Step Text Placeholders */}
          <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-3">
            <h5 className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Progress Status Messages (Timeline Content):</span>
            </h5>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 block mb-1">
                  1. Initial Status Message (0% - 35%):
                </label>
                <input
                  type="text"
                  value={preloaderForm.initialStatusText ?? ''}
                  onChange={(e) => {
                    setPreloaderForm((prev) => ({ ...prev, initialStatusText: e.target.value }));
                    restartPreview();
                  }}
                  placeholder="e.g. INITIALIZING CORE ARCHITECTURE..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-xs text-slate-900 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 block mb-1">
                  2. Realistic Pause Message (~90% delay phase):
                </label>
                <input
                  type="text"
                  value={preloaderForm.delayStatusText ?? ''}
                  onChange={(e) => {
                    setPreloaderForm((prev) => ({ ...prev, delayStatusText: e.target.value }));
                    restartPreview();
                  }}
                  placeholder="e.g. ESTABLISHING SECURE REALTIME CONNECTION..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-xs text-slate-900 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 block mb-1">
                  3. Completion Message (100% Launch):
                </label>
                <input
                  type="text"
                  value={preloaderForm.completionStatusText ?? ''}
                  onChange={(e) => {
                    setPreloaderForm((prev) => ({ ...prev, completionStatusText: e.target.value }));
                    restartPreview();
                  }}
                  placeholder="e.g. LAUNCH SUCCESSFUL • WELCOME!"
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-xs text-slate-900 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: DURATION & TIMING */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                <span>Loading Duration &amp; 90% Delay Animation</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Controls the total display time and pacing of the preloader effect.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono text-xs font-bold">
              {preloaderForm.durationSeconds}s
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-400 font-mono">
              <span>Fast (2.0s)</span>
              <span>Balanced (3.5s)</span>
              <span>Cinematic (6.0s)</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="6.0"
              step="0.5"
              value={preloaderForm.durationSeconds}
              onChange={(e) => {
                setPreloaderForm((prev) => ({ ...prev, durationSeconds: parseFloat(e.target.value) || 3.5 }));
                restartPreview();
              }}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Realistic 90% Pause Checkbox */}
          <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                Simulate Realistic 90% Delay Pause
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                Quickly loads to ~88%, holds momentarily so users see the tech animation, then shoots to 100%.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preloaderForm.enableRealisticDelay}
                onChange={(e) => {
                  setPreloaderForm((prev) => ({ ...prev, enableRealisticDelay: e.target.checked }));
                  restartPreview();
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Show Progress Bar Checkbox */}
          <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                Show Glowing Progress Bar &amp; Percentage
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                Displays the luminous neon progress bar and exact numerical percentage.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preloaderForm.showProgressBar}
                onChange={(e) => {
                  setPreloaderForm((prev) => ({ ...prev, showProgressBar: e.target.checked }));
                  restartPreview();
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>

        {/* SECTION 4: NEON RING ACCENT COLOR */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-500" />
                <span>Orbital Ring &amp; Glow Accent Color</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Futuristic glowing accent color for rotating orbital rings and radar beacon.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-full border border-white/20 shadow-md"
                style={{ backgroundColor: preloaderForm.ringColor }}
              />
              <span className="font-mono text-xs text-slate-600 dark:text-zinc-400 font-bold uppercase">
                {preloaderForm.ringColor}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {PRESET_COLORS.map((preset) => {
              const isSelected = preloaderForm.ringColor?.toLowerCase() === preset.hex.toLowerCase();
              return (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => {
                    setPreloaderForm((prev) => ({ ...prev, ringColor: preset.hex }));
                    restartPreview();
                  }}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-950 dark:text-purple-200 ring-2 ring-purple-500/20'
                      : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: preset.hex }}
                  />
                  <span className="truncate">{preset.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="text-xs text-slate-600 dark:text-zinc-400 font-semibold whitespace-nowrap">
              Or Custom Hex Color:
            </label>
            <input
              type="color"
              value={preloaderForm.ringColor || '#8b5cf6'}
              onChange={(e) => {
                setPreloaderForm((prev) => ({ ...prev, ringColor: e.target.value }));
                restartPreview();
              }}
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={preloaderForm.ringColor || '#8b5cf6'}
              onChange={(e) => {
                setPreloaderForm((prev) => ({ ...prev, ringColor: e.target.value }));
                restartPreview();
              }}
              placeholder="#8b5cf6"
              className="w-28 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 font-mono text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Final Save Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={fillRecommendedPlaceholderContent}
            className="text-xs text-slate-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Recommended Placeholders</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preloader Settings &amp; Sync to Cloud</span>
          </button>
        </div>
      </form>
    </div>
  );
};
