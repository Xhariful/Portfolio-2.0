import React, { useRef } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  Atom,
  Globe,
  Palette,
  Terminal,
  Database,
  Zap,
  Shield,
  User,
  Code2,
  Server,
  Layers,
  Cpu,
  Sparkles,
  Workflow,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { AnimatedBeam } from './ui/animated-beam';
import { Text3DFlip } from './ui/text-3d-flip';
import { BeamNodeItem } from '../types';

// Helper to render icon based on preset name or custom image
export const renderNodeIcon = (node: BeamNodeItem, className = 'w-5 h-5') => {
  if (node.iconUrl && node.iconUrl.trim().length > 0) {
    return (
      <img
        src={node.iconUrl}
        alt={node.title}
        className={`${className} object-contain rounded-sm`}
        referrerPolicy="no-referrer"
      />
    );
  }

  const iconLower = (node.icon || '').toLowerCase();

  switch (iconLower) {
    case 'shoppingbag':
    case 'shopify':
      return (
        <svg className={`${className} text-[#96bf48]`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.344 7.277c-.03-.234-.234-.41-.469-.417l-3.328-.109-2.18-2.18c-.148-.148-.359-.227-.57-.227-.039 0-.078 0-.117.008-.258.031-.469.219-.531.477l-1.07 4.438-2.453.758c-.359.109-.562.492-.453.852l3.414 11.023c.094.305.375.516.695.516h.047c.32-.016.594-.25.664-.562l2.391-10.43 3.641-.117c.281-.008.523-.195.6-.469l.391-1.578c.039-.148.016-.305-.062-.43zM15.422 2.898c-.164-.164-.391-.258-.625-.258s-.461.094-.625.258l-1.68 1.68 2.93 2.93 1.68-1.68c.344-.344.344-.906 0-1.25l-2.3-1.68z" />
        </svg>
      );
    case 'atom':
    case 'react':
      return <Atom className={`${className} text-[#00D8FF] animate-spin-slow`} />;
    case 'globe':
    case 'nextjs':
      return <Globe className={`${className} text-indigo-500`} />;
    case 'palette':
    case 'tailwind':
      return <Palette className={`${className} text-teal-500`} />;
    case 'terminal':
    case 'python':
    case 'django':
      return <Terminal className={`${className} text-amber-500`} />;
    case 'database':
    case 'postgresql':
    case 'sql':
      return <Database className={`${className} text-sky-500`} />;
    case 'zap':
    case 'firebase':
      return <Zap className={`${className} text-orange-500`} />;
    case 'shield':
    case 'stripe':
    case 'security':
      return <Shield className={`${className} text-emerald-500`} />;
    case 'server':
    case 'backend':
      return <Server className={`${className} text-rose-500`} />;
    case 'cpu':
    case 'core':
      return <Cpu className={`${className} text-purple-500`} />;
    case 'layers':
      return <Layers className={`${className} text-blue-500`} />;
    case 'code2':
    case 'code':
      return <Code2 className={`${className} text-violet-500`} />;
    case 'sparkles':
      return <Sparkles className={`${className} text-amber-400`} />;
    case 'user':
    default:
      return <User className={`${className} text-purple-600 dark:text-purple-400`} />;
  }
};

export const TechBeamSection: React.FC = () => {
  const { data } = usePortfolio();
  const beamConfig = data.animatedBeam;

  // Container ref for relative bounding box calculations
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic refs storage for up to 9 nodes
  const nodeRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement | null> }>({});

  if (!beamConfig || beamConfig.enabled === false) {
    return null;
  }

  // STRICT USER RULE:
  // "Max 9 ta thakbe. ami je je data dibo ta show hove filed empty hole oi filed er data show korbe na. only data thakle ta show korbe."
  // Filter out any node whose title is empty, null, or whitespace only!
  const rawNodes = beamConfig.nodes || [];
  const activeNodes = rawNodes
    .filter((node) => node && typeof node.title === 'string' && node.title.trim().length > 0)
    .slice(0, 9); // strictly capped at max 9

  if (activeNodes.length === 0) {
    return null;
  }

  // Ensure each active node has a stable ref
  activeNodes.forEach((node) => {
    if (!nodeRefs.current[node.id]) {
      nodeRefs.current[node.id] = React.createRef<HTMLDivElement>();
    }
  });

  // Group nodes by position: Left, Center, Right
  const leftNodes = activeNodes.filter((n) => n.position === 'left');
  const centerNodes = activeNodes.filter((n) => n.position === 'center');
  const rightNodes = activeNodes.filter((n) => n.position === 'right');

  // Fallback: If no center node is marked 'center', pick the first node or middle one
  const primaryCenterNode =
    centerNodes.length > 0
      ? centerNodes[0]
      : activeNodes[Math.floor(activeNodes.length / 2)];

  const centerRef = primaryCenterNode ? nodeRefs.current[primaryCenterNode.id] : null;

  // Compute beam connections:
  // 1. Left nodes connect into center node
  // 2. Center node connects into right nodes
  // 3. Or custom connectedTo if specified and target exists
  interface BeamItem {
    id: string;
    fromRef: React.RefObject<HTMLElement | null>;
    toRef: React.RefObject<HTMLElement | null>;
    curvature: number;
    reverse?: boolean;
    gradientStart?: string;
    gradientStop?: string;
    delay?: number;
  }

  const beams: BeamItem[] = [];

  // Connect left nodes to target (default primaryCenterNode)
  leftNodes.forEach((node, index) => {
    const fromR = nodeRefs.current[node.id];
    const targetId = node.connectedTo || primaryCenterNode?.id;
    const targetRef = targetId && nodeRefs.current[targetId] ? nodeRefs.current[targetId] : centerRef;

    if (fromR && targetRef && fromR !== targetRef) {
      // Calculate smooth vertical curvature based on offset from vertical center
      const total = leftNodes.length;
      const normalizedIndex = index - (total - 1) / 2;
      const autoCurve = node.curvature !== undefined ? node.curvature : normalizedIndex * 28;

      beams.push({
        id: `beam-left-${node.id}`,
        fromRef: fromR,
        toRef: targetRef,
        curvature: autoCurve,
        reverse: node.reverse ?? false,
        gradientStart: node.color || beamConfig.gradientStartColor || '#8b5cf6',
        gradientStop: beamConfig.gradientStopColor || '#3b82f6',
        delay: index * 0.4,
      });
    }
  });

  // Connect center to right nodes (or custom connectedTo)
  rightNodes.forEach((node, index) => {
    const toR = nodeRefs.current[node.id];
    const sourceId = node.connectedTo || primaryCenterNode?.id;
    const sourceRef = sourceId && nodeRefs.current[sourceId] ? nodeRefs.current[sourceId] : centerRef;

    if (sourceRef && toR && sourceRef !== toR) {
      const total = rightNodes.length;
      const normalizedIndex = index - (total - 1) / 2;
      const autoCurve = node.curvature !== undefined ? node.curvature : normalizedIndex * 28;

      beams.push({
        id: `beam-right-${node.id}`,
        fromRef: sourceRef,
        toRef: toR,
        curvature: autoCurve,
        reverse: node.reverse ?? false,
        gradientStart: beamConfig.gradientStartColor || '#8b5cf6',
        gradientStop: node.color || beamConfig.gradientStopColor || '#3b82f6',
        delay: 0.5 + index * 0.4,
      });
    }
  });

  return (
    <div className="w-full my-8">
      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-mono font-semibold">
          <Workflow className="w-3.5 h-3.5 animate-pulse" />
          <span>{beamConfig.sectionBadge || 'INTERACTIVE ECOSYSTEM'}</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          <Text3DFlip
            className="font-extrabold justify-center"
            textClassName="text-slate-900 dark:text-white"
            flipTextClassName="text-purple-600 dark:text-purple-400"
            rotateDirection="top"
            staggerDuration={0.025}
          >
            {beamConfig.sectionTitle || 'Full-Stack Integration Architecture'}
          </Text3DFlip>
        </h3>
        {beamConfig.sectionSubtitle && (
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            {beamConfig.sectionSubtitle}
          </p>
        )}
      </div>

      {/* Main Diagram Area with Animated Beams */}
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 p-6 sm:p-10 shadow-sm overflow-hidden min-h-[380px] flex items-center justify-center"
      >
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Ambient Glow Orbs */}
        <div className="absolute -top-24 left-1/4 w-72 h-72 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-72 h-72 bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic Animated Beams */}
        {beams.map((beam) => (
          <AnimatedBeam
            key={beam.id}
            containerRef={containerRef}
            fromRef={beam.fromRef}
            toRef={beam.toRef}
            curvature={beam.curvature}
            reverse={beam.reverse}
            duration={beamConfig.beamDuration || 4}
            delay={beam.delay || 0}
            pathColor={beamConfig.beamPathColor || 'rgba(139, 92, 246, 0.15)'}
            pathWidth={2.5}
            pathOpacity={0.6}
            gradientStartColor={beam.gradientStart}
            gradientStopColor={beam.gradientStop}
          />
        ))}

        {/* Nodes Grid Layout: 3 Columns (Left -> Center -> Right) */}
        <div className="relative z-20 w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 max-w-5xl mx-auto">
          
          {/* Left Column (Inputs / Frontend / Storefront) */}
          <div className="flex flex-col gap-4 sm:gap-6 items-center md:items-start w-full md:w-auto">
            {leftNodes.map((node) => {
              const nodeRef = nodeRefs.current[node.id];
              return (
                <motion.div
                  key={node.id}
                  ref={nodeRef}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white dark:bg-zinc-950/90 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all cursor-pointer group w-60 max-w-full"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-all"
                    style={{
                      backgroundColor: `${node.color || '#8b5cf6'}18`,
                      borderColor: `${node.color || '#8b5cf6'}40`,
                    }}
                  >
                    {renderNodeIcon(node, 'w-5 h-5')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {node.title}
                    </h4>
                    {node.subtitle && (
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                        {node.subtitle}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Center Column (Core Hub / Architect) */}
          <div className="flex flex-col items-center justify-center my-4 md:my-0">
            {primaryCenterNode && (
              <motion.div
                ref={centerRef}
                whileHover={{ scale: 1.06 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-purple-500/10 via-white to-sky-500/10 dark:from-purple-950/40 dark:via-zinc-900 dark:to-sky-950/30 border-2 border-purple-500/40 dark:border-purple-500/50 shadow-lg shadow-purple-500/10 flex flex-col items-center text-center cursor-pointer group w-64 max-w-full"
              >
                {/* Pulsating Ring Indicator */}
                <div className="absolute -top-2.5 px-3 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-mono font-bold tracking-wider uppercase shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>CORE HUB</span>
                </div>

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-md border border-purple-400/40 dark:border-purple-400/30"
                  style={{
                    backgroundColor: `${primaryCenterNode.color || '#9333ea'}25`,
                  }}
                >
                  {renderNodeIcon(primaryCenterNode, 'w-7 h-7')}
                </div>

                <h4 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {primaryCenterNode.title}
                </h4>
                {primaryCenterNode.subtitle && (
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-0.5">
                    {primaryCenterNode.subtitle}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                  <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                  <span>{activeNodes.length} Active Nodes Connected</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column (Outputs / Backend / APIs / Database) */}
          <div className="flex flex-col gap-4 sm:gap-6 items-center md:items-end w-full md:w-auto">
            {rightNodes.map((node) => {
              const nodeRef = nodeRefs.current[node.id];
              return (
                <motion.div
                  key={node.id}
                  ref={nodeRef}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white dark:bg-zinc-950/90 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-sky-500/50 dark:hover:border-sky-500/50 transition-all cursor-pointer group w-60 max-w-full"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-all order-last md:order-first"
                    style={{
                      backgroundColor: `${node.color || '#3b82f6'}18`,
                      borderColor: `${node.color || '#3b82f6'}40`,
                    }}
                  >
                    {renderNodeIcon(node, 'w-5 h-5')}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {node.title}
                    </h4>
                    {node.subtitle && (
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                        {node.subtitle}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TechBeamSection;
