import React, { useRef, useState } from 'react';
import {
  Workflow,
  Save,
  Sparkles,
  Check,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  Sliders,
  ChevronDown,
  ChevronUp,
  Radio,
  ArrowRight,
  Info,
} from 'lucide-react';
import { AnimatedBeamConfig, BeamNodeItem } from '../types';
import { AnimatedBeam } from './ui/animated-beam';
import { renderNodeIcon } from './TechBeamSection';

interface AdminAnimatedBeamTabProps {
  beamForm: AnimatedBeamConfig;
  setBeamForm: React.Dispatch<React.SetStateAction<AnimatedBeamConfig>>;
  isBeamDirty: React.MutableRefObject<boolean>;
  onSave: (config: AnimatedBeamConfig) => void;
  onResetDefaults: () => void;
}

const ICON_PRESETS = [
  { label: 'Shopify', icon: 'ShoppingBag', color: '#10b981' },
  { label: 'React', icon: 'Atom', color: '#06b6d4' },
  { label: 'Next.js', icon: 'Globe', color: '#8b5cf6' },
  { label: 'Tailwind', icon: 'Palette', color: '#3b82f6' },
  { label: 'Core / User', icon: 'User', color: '#9333ea' },
  { label: 'Python / Django', icon: 'Terminal', color: '#f59e0b' },
  { label: 'PostgreSQL', icon: 'Database', color: '#3b82f6' },
  { label: 'Cloud / Firebase', icon: 'Zap', color: '#ef4444' },
  { label: 'Stripe / Security', icon: 'Shield', color: '#6366f1' },
  { label: 'Server', icon: 'Server', color: '#f43f5e' },
  { label: 'Cpu / Core', icon: 'Cpu', color: '#a855f7' },
  { label: 'Code', icon: 'Code2', color: '#6366f1' },
  { label: 'Sparkles', icon: 'Sparkles', color: '#eab308' },
];

const PRESET_NODES_DEFAULT: BeamNodeItem[] = [
  { id: 'node-1', title: 'Shopify OS 2.0', subtitle: 'Liquid Architecture', icon: 'ShoppingBag', position: 'left', connectedTo: 'node-center', color: '#10b981', curvature: -35 },
  { id: 'node-2', title: 'React.js', subtitle: 'Interactive UI', icon: 'Atom', position: 'left', connectedTo: 'node-center', color: '#06b6d4', curvature: -15 },
  { id: 'node-3', title: 'Next.js', subtitle: 'SSR & Headless', icon: 'Globe', position: 'left', connectedTo: 'node-center', color: '#8b5cf6', curvature: 15 },
  { id: 'node-4', title: 'Tailwind CSS', subtitle: 'Responsive Design', icon: 'Palette', position: 'left', connectedTo: 'node-center', color: '#3b82f6', curvature: 35 },
  { id: 'node-center', title: 'Shariful Islam', subtitle: 'Full-Stack Core Hub', icon: 'User', position: 'center', color: '#9333ea' },
  { id: 'node-6', title: 'Python & Django', subtitle: 'RESTful Backend', icon: 'Terminal', position: 'right', connectedTo: 'node-center', color: '#f59e0b', curvature: -35 },
  { id: 'node-7', title: 'PostgreSQL', subtitle: 'Relational DB', icon: 'Database', position: 'right', connectedTo: 'node-center', color: '#3b82f6', curvature: -15 },
  { id: 'node-8', title: 'Cloud & Firebase', subtitle: 'Realtime Sync', icon: 'Zap', position: 'right', connectedTo: 'node-center', color: '#ef4444', curvature: 15 },
  { id: 'node-9', title: 'Stripe & APIs', subtitle: 'Payment Gateways', icon: 'Shield', position: 'right', connectedTo: 'node-center', color: '#6366f1', curvature: 35 },
];

export const AdminAnimatedBeamTab: React.FC<AdminAnimatedBeamTabProps> = ({
  beamForm,
  setBeamForm,
  isBeamDirty,
  onSave,
  onResetDefaults,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Guarantee exactly 9 slots are available for management
  const currentNodes: BeamNodeItem[] = [...(beamForm.nodes || [])];
  while (currentNodes.length < 9) {
    const idx = currentNodes.length;
    currentNodes.push({
      id: `node-${idx + 1}`,
      title: '',
      subtitle: '',
      icon: 'Atom',
      position: idx < 4 ? 'left' : idx === 4 ? 'center' : 'right',
      connectedTo: 'node-center',
      color: '#8b5cf6',
      curvature: 0,
    });
  }
  const nodes = currentNodes.slice(0, 9); // strictly max 9

  // Calculate active (visible) nodes count
  const activeCount = nodes.filter((n) => n && typeof n.title === 'string' && n.title.trim().length > 0).length;

  const handleUpdateNode = (index: number, updates: Partial<BeamNodeItem>) => {
    isBeamDirty.current = true;
    const updatedNodes = [...nodes];
    updatedNodes[index] = {
      ...updatedNodes[index],
      ...updates,
    };
    setBeamForm((prev) => ({
      ...prev,
      nodes: updatedNodes,
    }));
  };

  const handleClearSlot = (index: number) => {
    isBeamDirty.current = true;
    handleUpdateNode(index, { title: '', subtitle: '' });
  };

  const handleRestoreSlotPreset = (index: number) => {
    isBeamDirty.current = true;
    const preset = PRESET_NODES_DEFAULT[index] || {
      id: `node-${index + 1}`,
      title: `Node ${index + 1}`,
      subtitle: 'Component',
      icon: 'Atom',
      position: index < 4 ? 'left' : index === 4 ? 'center' : 'right',
      connectedTo: 'node-center',
      color: '#8b5cf6',
      curvature: 0,
    };
    handleUpdateNode(index, preset);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(beamForm);
  };

  // Live preview container ref & node refs
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const previewNodeRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement | null> }>({});

  const previewActiveNodes = nodes
    .filter((n) => n && typeof n.title === 'string' && n.title.trim().length > 0)
    .slice(0, 9);

  previewActiveNodes.forEach((node) => {
    if (!previewNodeRefs.current[node.id]) {
      previewNodeRefs.current[node.id] = React.createRef<HTMLDivElement>();
    }
  });

  const previewLeft = previewActiveNodes.filter((n) => n.position === 'left');
  const previewCenter = previewActiveNodes.filter((n) => n.position === 'center');
  const previewRight = previewActiveNodes.filter((n) => n.position === 'right');
  const previewPrimaryCenter = previewCenter[0] || previewActiveNodes[Math.floor(previewActiveNodes.length / 2)];
  const previewCenterRef = previewPrimaryCenter ? previewNodeRefs.current[previewPrimaryCenter.id] : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      {/* Tab Header & Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Workflow className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Animated Beam Architecture (Max 9 Slots)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Configure dynamic SVG laser beams connecting your tech stack. Empty slots are automatically hidden.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset 9 Defaults</span>
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Beam Settings</span>
          </button>
        </div>
      </div>

      {/* Strict Rule Notice Card */}
      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-start gap-3">
        <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 dark:text-zinc-300 space-y-1">
          <p className="font-bold text-purple-900 dark:text-purple-200">
            Strict Display Rule: Max 9 Slots & Only Filled Data Renders
          </p>
          <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
            There are exactly <strong>9 slots</strong>. If you leave a slot's <strong>Title</strong> empty, it will <strong>NOT</strong> appear on your website (no empty cards or broken beams). Only slots with a title are rendered and connected.
          </p>
          <div className="pt-1 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white font-mono font-bold text-[11px]">
              {activeCount} of 9 Active
            </span>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">
              ({9 - activeCount} slots hidden from website)
            </span>
          </div>
        </div>
      </div>

      {/* Global Section Settings */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800/80">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Section Visibility & Global Parameters</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Toggle the entire animated beam showcase on or off and customize speed and styling.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              isBeamDirty.current = true;
              setBeamForm((prev) => ({ ...prev, enabled: !prev.enabled }));
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              beamForm.enabled !== false
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
            }`}
          >
            {beamForm.enabled !== false ? '● Section Enabled' : '○ Section Disabled'}
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400 block">
              Badge Label
            </label>
            <input
              type="text"
              value={beamForm.sectionBadge || ''}
              onChange={(e) => {
                isBeamDirty.current = true;
                setBeamForm((prev) => ({ ...prev, sectionBadge: e.target.value }));
              }}
              placeholder="INTERACTIVE ECOSYSTEM"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400 block">
              Section Title
            </label>
            <input
              type="text"
              value={beamForm.sectionTitle || ''}
              onChange={(e) => {
                isBeamDirty.current = true;
                setBeamForm((prev) => ({ ...prev, sectionTitle: e.target.value }));
              }}
              placeholder="Full-Stack Integration Architecture"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400 block">
            Section Subtitle
          </label>
          <textarea
            rows={2}
            value={beamForm.sectionSubtitle || ''}
            onChange={(e) => {
              isBeamDirty.current = true;
              setBeamForm((prev) => ({ ...prev, sectionSubtitle: e.target.value }));
            }}
            placeholder="Live visualization showing how custom Shopify storefronts, reactive frontend clients, and Python/Django backend engines seamlessly interconnect."
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
          />
        </div>

        {/* Laser Beam Visuals & Speed */}
        <div className="grid sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200 dark:border-zinc-800/80">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-zinc-300">Beam Duration:</span>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                {beamForm.beamDuration || 4}s
              </span>
            </div>
            <input
              type="range"
              min="1.5"
              max="8"
              step="0.5"
              value={beamForm.beamDuration || 4}
              onChange={(e) => {
                isBeamDirty.current = true;
                setBeamForm((prev) => ({ ...prev, beamDuration: parseFloat(e.target.value) || 4 }));
              }}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Fast (1.5s)</span>
              <span>Slow (8s)</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400 block">
              Beam Gradient Start
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={beamForm.gradientStartColor || '#a855f7'}
                onChange={(e) => {
                  isBeamDirty.current = true;
                  setBeamForm((prev) => ({ ...prev, gradientStartColor: e.target.value }));
                }}
                className="w-9 h-9 rounded-xl border border-slate-300 dark:border-zinc-700 cursor-pointer bg-transparent p-0.5"
              />
              <input
                type="text"
                value={beamForm.gradientStartColor || '#a855f7'}
                onChange={(e) => {
                  isBeamDirty.current = true;
                  setBeamForm((prev) => ({ ...prev, gradientStartColor: e.target.value }));
                }}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400 block">
              Beam Gradient Stop
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={beamForm.gradientStopColor || '#3b82f6'}
                onChange={(e) => {
                  isBeamDirty.current = true;
                  setBeamForm((prev) => ({ ...prev, gradientStopColor: e.target.value }));
                }}
                className="w-9 h-9 rounded-xl border border-slate-300 dark:border-zinc-700 cursor-pointer bg-transparent p-0.5"
              />
              <input
                type="text"
                value={beamForm.gradientStopColor || '#3b82f6'}
                onChange={(e) => {
                  isBeamDirty.current = true;
                  setBeamForm((prev) => ({ ...prev, gradientStopColor: e.target.value }));
                }}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 9 SLOTS MANAGEMENT */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Configurable Ecosystem Nodes (Slots 1 to 9)</span>
          </h4>
          <span className="text-xs text-slate-500 dark:text-zinc-400">
            Click any slot to expand & edit
          </span>
        </div>

        <div className="space-y-2.5">
          {nodes.map((node, index) => {
            const isFilled = typeof node.title === 'string' && node.title.trim().length > 0;
            const isExpanded = expandedIndex === index;

            return (
              <div
                key={node.id || `slot-${index}`}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isFilled
                    ? 'bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800'
                    : 'bg-slate-50/70 dark:bg-zinc-950/40 border-dashed border-slate-300 dark:border-zinc-800/80 opacity-80'
                }`}
              >
                {/* Slot Summary Bar */}
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>

                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${node.color || '#8b5cf6'}18`,
                        borderColor: `${node.color || '#8b5cf6'}40`,
                      }}
                    >
                      {renderNodeIcon(node, 'w-4 h-4')}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {isFilled ? node.title : `Slot ${index + 1} (Empty - Hidden from site)`}
                        </span>
                        {node.position && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                            {node.position}
                          </span>
                        )}
                      </div>
                      {node.subtitle && (
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                          {node.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                        isFilled
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-200 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {isFilled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{isFilled ? 'Visible' : 'Hidden'}</span>
                    </span>

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Slot Form */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-slate-200 dark:border-zinc-800/80 space-y-4 bg-slate-50/50 dark:bg-zinc-900/30">
                    <div className="grid sm:grid-cols-2 gap-4 pt-4">
                      <div className="space-y-1">
                        <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400 block">
                          Element Title <span className="text-purple-600 font-normal">(Leave blank to hide)</span>
                        </label>
                        <input
                          type="text"
                          value={node.title || ''}
                          onChange={(e) => handleUpdateNode(index, { title: e.target.value })}
                          placeholder="e.g. Shopify OS 2.0 (Leave blank to hide)"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400 block">
                          Subtitle / Role
                        </label>
                        <input
                          type="text"
                          value={node.subtitle || ''}
                          onChange={(e) => handleUpdateNode(index, { subtitle: e.target.value })}
                          placeholder="e.g. Liquid Architecture"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      {/* Position */}
                      <div className="space-y-1">
                        <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400 block">
                          Column Position
                        </label>
                        <select
                          value={node.position || 'left'}
                          onChange={(e) => handleUpdateNode(index, { position: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
                        >
                          <option value="left">Left Column (Frontend / Storefront)</option>
                          <option value="center">Center (Core Hub / Architect)</option>
                          <option value="right">Right Column (Backend / Databases)</option>
                        </select>
                      </div>

                      {/* Connects to */}
                      <div className="space-y-1">
                        <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400 block">
                          Connects To
                        </label>
                        <select
                          value={node.connectedTo || 'node-center'}
                          onChange={(e) => handleUpdateNode(index, { connectedTo: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
                        >
                          <option value="node-center">Primary Center Hub</option>
                          {nodes
                            .filter((n, i) => i !== index && n.title && n.title.trim().length > 0)
                            .map((target) => (
                              <option key={target.id} value={target.id}>
                                {target.title} ({target.position})
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Accent Color */}
                      <div className="space-y-1">
                        <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400 block">
                          Node Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={node.color || '#8b5cf6'}
                            onChange={(e) => handleUpdateNode(index, { color: e.target.value })}
                            className="w-9 h-9 rounded-xl border border-slate-300 dark:border-zinc-700 cursor-pointer bg-transparent p-0.5"
                          />
                          <input
                            type="text"
                            value={node.color || '#8b5cf6'}
                            onChange={(e) => handleUpdateNode(index, { color: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-xs font-mono text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Icon Preset Picker */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400 block">
                        Preset Icons (Click to apply)
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {ICON_PRESETS.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              handleUpdateNode(index, {
                                icon: preset.icon,
                                color: preset.color,
                              });
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                              node.icon?.toLowerCase() === preset.icon.toLowerCase()
                                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                                : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-slate-300'
                            }`}
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: preset.color }}
                            />
                            <span>{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Curvature and Actions */}
                    <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-zinc-800/80">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-700 dark:text-zinc-300">
                            Beam Curvature:
                          </span>
                          <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                            {node.curvature ?? 0}°
                          </span>
                        </div>
                        <input
                          type="range"
                          min="-60"
                          max="60"
                          step="5"
                          value={node.curvature ?? 0}
                          onChange={(e) =>
                            handleUpdateNode(index, { curvature: parseInt(e.target.value) || 0 })
                          }
                          className="w-full accent-purple-600 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Curve Up (-60°)</span>
                          <span>Straight (0°)</span>
                          <span>Curve Down (+60°)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3">
                        <button
                          type="button"
                          onClick={() => handleRestoreSlotPreset(index)}
                          className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Load Preset</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleClearSlot(index)}
                          className="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Clear / Hide Slot</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Preview Toggle & Card */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Live Diagram Preview ({previewActiveNodes.length} Active Nodes)</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Only filled slots are displayed below with animated laser beams.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            {showLivePreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        {showLivePreview && (
          <div
            ref={previewContainerRef}
            className="relative w-full rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 shadow-sm overflow-hidden min-h-[300px] flex items-center justify-center"
          >
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            {/* Render preview beams */}
            {previewLeft.map((node, i) => {
              const fromR = previewNodeRefs.current[node.id];
              const targetR = previewCenterRef;
              if (!fromR || !targetR) return null;
              return (
                <AnimatedBeam
                  key={`preview-l-${node.id}`}
                  containerRef={previewContainerRef}
                  fromRef={fromR}
                  toRef={targetR}
                  curvature={node.curvature ?? (i - (previewLeft.length - 1) / 2) * 25}
                  duration={beamForm.beamDuration || 4}
                  pathColor={beamForm.beamPathColor || 'rgba(139, 92, 246, 0.15)'}
                  gradientStartColor={node.color || beamForm.gradientStartColor}
                  gradientStopColor={beamForm.gradientStopColor}
                />
              );
            })}

            {previewRight.map((node, i) => {
              const toR = previewNodeRefs.current[node.id];
              const fromR = previewCenterRef;
              if (!fromR || !toR) return null;
              return (
                <AnimatedBeam
                  key={`preview-r-${node.id}`}
                  containerRef={previewContainerRef}
                  fromRef={fromR}
                  toRef={toR}
                  curvature={node.curvature ?? (i - (previewRight.length - 1) / 2) * 25}
                  duration={beamForm.beamDuration || 4}
                  pathColor={beamForm.beamPathColor || 'rgba(139, 92, 246, 0.15)'}
                  gradientStartColor={beamForm.gradientStartColor}
                  gradientStopColor={node.color || beamForm.gradientStopColor}
                />
              );
            })}

            {/* Nodes Layout */}
            <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
              {/* Left */}
              <div className="flex flex-col gap-3 w-full md:w-auto">
                {previewLeft.map((node) => (
                  <div
                    key={node.id}
                    ref={previewNodeRefs.current[node.id]}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-xs w-48"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${node.color || '#8b5cf6'}20`,
                        borderColor: `${node.color || '#8b5cf6'}40`,
                      }}
                    >
                      {renderNodeIcon(node, 'w-3.5 h-3.5')}
                    </div>
                    <div className="min-w-0 flex-1 truncate">
                      <p className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">
                        {node.title}
                      </p>
                      {node.subtitle && (
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                          {node.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Center */}
              <div className="flex flex-col items-center">
                {previewPrimaryCenter && (
                  <div
                    ref={previewCenterRef}
                    className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-500/40 shadow-sm flex flex-col items-center text-center w-52"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 shadow-xs border border-purple-400/40"
                      style={{
                        backgroundColor: `${previewPrimaryCenter.color || '#9333ea'}25`,
                      }}
                    >
                      {renderNodeIcon(previewPrimaryCenter, 'w-5 h-5')}
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {previewPrimaryCenter.title}
                    </p>
                    {previewPrimaryCenter.subtitle && (
                      <p className="text-[10px] text-purple-600 dark:text-purple-400 truncate">
                        {previewPrimaryCenter.subtitle}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Right */}
              <div className="flex flex-col gap-3 w-full md:w-auto">
                {previewRight.map((node) => (
                  <div
                    key={node.id}
                    ref={previewNodeRefs.current[node.id]}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-xs w-48"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${node.color || '#3b82f6'}20`,
                        borderColor: `${node.color || '#3b82f6'}40`,
                      }}
                    >
                      {renderNodeIcon(node, 'w-3.5 h-3.5')}
                    </div>
                    <div className="min-w-0 flex-1 truncate">
                      <p className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">
                        {node.title}
                      </p>
                      {node.subtitle && (
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                          {node.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-zinc-800">
        <span className="text-xs text-slate-500 dark:text-zinc-400">
          Save will sync instantly to Cloud Firestore and live visitors.
        </span>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Beam Settings & Sync to Cloud</span>
        </button>
      </div>
    </form>
  );
};

export default AdminAnimatedBeamTab;
