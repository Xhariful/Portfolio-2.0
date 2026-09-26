import React, { useState } from 'react';
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
} from 'lucide-react';
import { InitialLoaderConfig } from '../types';
import { InitialLoader } from './animations/InitialLoader';

interface AdminPreloaderTabProps {
  preloaderForm: InitialLoaderConfig;
  setPreloaderForm: React.Dispatch<React.SetStateAction<InitialLoaderConfig>>;
  onSave: (config: InitialLoaderConfig) => void;
  profileAvatar?: string;
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
}) => {
  const [previewKey, setPreviewKey] = useState(0);
  const [showFullscreenTest, setShowFullscreenTest] = useState(false);

  const restartPreview = () => {
    setPreviewKey((prev) => prev + 1);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(preloaderForm);
  };

  return (
    <div className="space-y-8 max-w-4xl">
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
            className="fixed top-6 right-6 z-[100001] px-4 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-white text-xs font-semibold border border-zinc-700 shadow-xl cursor-pointer"
          >
            Close Fullscreen Test (Esc)
          </button>
        </div>
      )}

      {/* Header and Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Preloader &amp; Orbital Animation Settings</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Customize the high-tech intro loading screen, photo avatar, display name, duration delay, and orbital rings.
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
            <span>Test Run Fullscreen</span>
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
              When enabled, new visitors and reloads experience the animated orbital loader before entering the site.
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

        {/* Avatar Center Graphic Selector */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-purple-500" />
              <span>Center Graphic Display Mode</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Select what appears inside the inner glowing circular core of the rotating rings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Option 1: Profile Photo */}
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
                <span className="text-xs font-bold uppercase tracking-wider">Profile Photo</span>
                {preloaderForm.avatarType === 'photo' && <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
              </div>
              <p className="text-[11px] opacity-80 leading-relaxed">
                Your circular photo with neon halo and cybernetic radar scan line.
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
                <span className="text-xs font-bold uppercase tracking-wider">Brand Monogram</span>
                {preloaderForm.avatarType === 'monogram' && <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
              </div>
              <p className="text-[11px] opacity-80 leading-relaxed">
                Stylized monogram logo mark &quot;S&quot; inside the core.
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
                <span className="text-xs font-bold uppercase tracking-wider">Cyber Tech Core</span>
                {preloaderForm.avatarType === 'tech_core' && <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
              </div>
              <p className="text-[11px] opacity-80 leading-relaxed">
                Spinning code bracket &amp; geometric tech hexagon.
              </p>
            </button>
          </div>

          {/* Photo URL Input when avatarType === 'photo' */}
          {preloaderForm.avatarType === 'photo' && (
            <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 space-y-3">
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block">
                Avatar Photo URL or Path:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={preloaderForm.avatarUrl || '/myname.png'}
                  onChange={(e) => {
                    setPreloaderForm((prev) => ({ ...prev, avatarUrl: e.target.value }));
                    restartPreview();
                  }}
                  placeholder="/myname.png or https://..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPreloaderForm((prev) => ({ ...prev, avatarUrl: '/myname.png' }));
                      restartPreview();
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                  >
                    Default Photo (/myname.png)
                  </button>
                  {profileAvatar && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreloaderForm((prev) => ({ ...prev, avatarUrl: profileAvatar }));
                        restartPreview();
                      }}
                      className="px-3 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                    >
                      Use Profile Avatar
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Branding Typography & Text */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-500" />
            <span>Branding Titles &amp; Copy</span>
          </h4>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1.5">
                Display Name:
              </label>
              <input
                type="text"
                value={preloaderForm.name || 'Shariful Islam'}
                onChange={(e) => {
                  setPreloaderForm((prev) => ({ ...prev, name: e.target.value }));
                  restartPreview();
                }}
                placeholder="Shariful Islam"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1.5">
                Tagline / Subtitle:
              </label>
              <input
                type="text"
                value={preloaderForm.tagline || 'Senior Shopify & Full-Stack Developer'}
                onChange={(e) => {
                  setPreloaderForm((prev) => ({ ...prev, tagline: e.target.value }));
                  restartPreview();
                }}
                placeholder="Senior Shopify & Full-Stack Developer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Duration and Realistic Delay */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                <span>Loading Duration &amp; Timing</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Controls how long the intro animation is displayed before revealing the portfolio.
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
              <span>Showcase (6.0s)</span>
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
                Quickly loads to ~88%, pauses momentarily to let visitors admire the animations, then accelerates smoothly to 100%.
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
                Show Glowing Progress Bar &amp; Status
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                Displays the horizontal luminous progress bar and technical status telemetry.
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

        {/* Neon Ring Accent Color */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-500" />
                <span>Orbital Ring &amp; Glow Accent Color</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Choose the futuristic neon color for the animated orbits and background radiant aura.
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
              className="w-28 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 font-mono text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Final Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preloader Settings &amp; Sync to Cloud</span>
          </button>
        </div>
      </form>
    </div>
  );
};
