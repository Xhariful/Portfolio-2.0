import React, { useState, useRef, useCallback } from 'react';
import { Columns, SplitSquareVertical, Check } from 'lucide-react';

interface BeforeAfterProps {
  originalUrl: string;
  resultUrl: string;
}

type BgOption = 'checker' | 'white' | 'dark' | 'purple' | 'emerald';

export const BeforeAfter: React.FC<BeforeAfterProps> = ({ originalUrl, resultUrl }) => {
  const [sliderPos, setSliderPos] = useState(50); // percentage (0 - 100)
  const [isSideBySide, setIsSideBySide] = useState(false);
  const [bgChoice, setBgChoice] = useState<BgOption>('checker');
  const [originalLoadError, setOriginalLoadError] = useState(false);
  const [resultLoadError, setResultLoadError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Directly calculate and update slider position from clientX coordinate
  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  // Pointer event handlers with pointer capture for buttery smooth mobile dragging
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    updateSliderPosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    updateSliderPosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}
  };

  // Dedicated touch event listeners to guarantee 100% responsiveness on mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches && e.touches.length > 0) {
      isDraggingRef.current = true;
      updateSliderPosition(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDraggingRef.current && e.touches && e.touches.length > 0) {
      updateSliderPosition(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const getBgStyle = () => {
    switch (bgChoice) {
      case 'white':
        return 'bg-white';
      case 'dark':
        return 'bg-zinc-950';
      case 'purple':
        return 'bg-purple-900';
      case 'emerald':
        return 'bg-emerald-950';
      case 'checker':
      default:
        return 'bg-[linear-gradient(45deg,#e5e7eb_25%,transparent_25%),linear-gradient(-45deg,#e5e7eb_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e5e7eb_75%),linear-gradient(-45deg,transparent_75%,#e5e7eb_75%)] dark:bg-[linear-gradient(45deg,#27272a_25%,transparent_25%),linear-gradient(-45deg,#27272a_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#27272a_75%),linear-gradient(-45deg,transparent_75%,#27272a_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* View Mode & Background Switchers Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 text-xs shadow-xs">
        {/* Toggle Slider vs Side-by-Side */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setIsSideBySide(false)}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              !isSideBySide
                ? 'bg-white dark:bg-zinc-700 text-purple-600 dark:text-purple-300 shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Split Slider</span>
          </button>
          <button
            type="button"
            onClick={() => setIsSideBySide(true)}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isSideBySide
                ? 'bg-white dark:bg-zinc-700 text-purple-600 dark:text-purple-300 shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side by Side</span>
          </button>
        </div>

        {/* Test Background Color Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-zinc-400 text-[11px] font-medium hidden sm:inline">
            Test Background:
          </span>
          <div className="flex items-center gap-1.5">
            {/* Transparent checker */}
            <button
              type="button"
              onClick={() => setBgChoice('checker')}
              title="Transparent Grid"
              className={`w-6 h-6 rounded-full border border-slate-300 dark:border-zinc-700 cursor-pointer flex items-center justify-center transition-all bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:6px_6px] ${
                bgChoice === 'checker' ? 'ring-2 ring-purple-500 scale-110' : ''
              }`}
            >
              {bgChoice === 'checker' && <Check className="w-3 h-3 text-slate-800" />}
            </button>

            {/* Pure White */}
            <button
              type="button"
              onClick={() => setBgChoice('white')}
              title="Pure White"
              className={`w-6 h-6 rounded-full border border-slate-300 cursor-pointer bg-white flex items-center justify-center transition-all ${
                bgChoice === 'white' ? 'ring-2 ring-purple-500 scale-110' : ''
              }`}
            >
              {bgChoice === 'white' && <Check className="w-3 h-3 text-slate-900" />}
            </button>

            {/* Dark Charcoal */}
            <button
              type="button"
              onClick={() => setBgChoice('dark')}
              title="Dark Background"
              className={`w-6 h-6 rounded-full border border-zinc-700 cursor-pointer bg-zinc-900 flex items-center justify-center transition-all ${
                bgChoice === 'dark' ? 'ring-2 ring-purple-500 scale-110' : ''
              }`}
            >
              {bgChoice === 'dark' && <Check className="w-3 h-3 text-white" />}
            </button>

            {/* Brand Purple */}
            <button
              type="button"
              onClick={() => setBgChoice('purple')}
              title="Brand Purple"
              className={`w-6 h-6 rounded-full border border-purple-400 cursor-pointer bg-purple-700 flex items-center justify-center transition-all ${
                bgChoice === 'purple' ? 'ring-2 ring-purple-500 scale-110' : ''
              }`}
            >
              {bgChoice === 'purple' && <Check className="w-3 h-3 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Preview Container */}
      {!isSideBySide ? (
        /* 1. Interactive Split Slider */
        <div className="space-y-2">
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative w-full h-[380px] sm:h-[480px] rounded-3xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-2xl select-none cursor-ew-resize touch-none ${getBgStyle()}`}
          >
            {/* Result (Transparent Cutout Layer on Selected Background) */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              {!resultLoadError ? (
                <img
                  src={resultUrl}
                  alt="Removed background cutout"
                  onError={() => setResultLoadError(true)}
                  className="w-full h-full object-contain pointer-events-none drop-shadow-md"
                />
              ) : (
                <div className="text-center text-xs text-slate-400 p-4">
                  <span>Cutout Render Ready</span>
                </div>
              )}
            </div>

            {/* Original Layer with clip-path matching sliderPos */}
            <div
              className="absolute inset-0 overflow-hidden bg-slate-100 dark:bg-zinc-950 pointer-events-none"
              style={{
                clipPath: `polygon(0% 0%, ${sliderPos}% 0%, ${sliderPos}% 100%, 0% 100%)`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center p-4">
                {!originalLoadError ? (
                  <img
                    src={originalUrl}
                    alt="Original photo"
                    onError={() => setOriginalLoadError(true)}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                ) : (
                  <div className="text-center text-xs text-slate-400 p-4">
                    <span>Original Image</span>
                  </div>
                )}
              </div>
              {/* Top Left Original Badge */}
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[11px] font-mono uppercase tracking-wider font-semibold shadow-md">
                Before
              </span>
            </div>

            {/* Top Right Removed Badge */}
            <span className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-purple-600/90 backdrop-blur-md text-white text-[11px] font-mono uppercase tracking-wider font-semibold pointer-events-none shadow-md">
              Cutout (After)
            </span>

            {/* Draggable Vertical Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.7)] pointer-events-none z-20"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-zinc-900 border-2 border-purple-600 text-purple-600 dark:text-purple-400 shadow-2xl flex items-center justify-center gap-1 active:scale-110 transition-transform">
                <span className="text-[9px] font-extrabold select-none text-purple-600 dark:text-purple-400 leading-none">
                  ◀
                </span>
                <div className="w-0.5 h-3.5 bg-purple-400/70 rounded-full" />
                <span className="text-[9px] font-extrabold select-none text-purple-600 dark:text-purple-400 leading-none">
                  ▶
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Drag Instruction Hint */}
          <div className="text-center">
            <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium sm:hidden">
              Touch and slide anywhere left or right to compare
            </span>
          </div>
        </div>
      ) : (
        /* 2. Side by Side Comparison */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before Card */}
          <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 p-4 flex items-center justify-center shadow-lg">
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-mono uppercase font-semibold z-10">
              Original (Before)
            </span>
            <img
              src={originalUrl}
              alt="Original"
              className="w-full h-full object-contain"
            />
          </div>

          {/* After Card */}
          <div
            className={`relative h-80 sm:h-96 rounded-3xl overflow-hidden border border-purple-300 dark:border-purple-800/80 p-4 flex items-center justify-center shadow-xl ${getBgStyle()}`}
          >
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-purple-600 backdrop-blur-md text-white text-[11px] font-mono uppercase font-semibold z-10 shadow-md">
              Cutout (After)
            </span>
            <img
              src={resultUrl}
              alt="Removed Background"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};
