import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ExternalLink,
  Github,
  ArrowUpRight,
  Layers,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  Globe,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  Images,
  Scroll,
  Monitor,
  CheckCircle2,
  Info
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectItem } from '../types';
import { TiltCard } from './animations/TiltCard';
import { Magnetic } from './animations/Magnetic';
import { AOS } from './animations/AOS';
import { Text3DFlip } from './ui/text-3d-flip';
import { pauseLenis, resumeLenis } from '../hooks/useLenisScroll';

interface NormalizedProjectImage {
  url: string;
  title: string;
  caption?: string;
}

const getProjectImages = (project: ProjectItem | null): NormalizedProjectImage[] => {
  if (!project) return [];
  const list: NormalizedProjectImage[] = [];

  if (Array.isArray(project.images) && project.images.length > 0) {
    project.images.forEach((item, idx) => {
      if (typeof item === 'string') {
        if (item.trim()) {
          list.push({
            url: item.trim(),
            title: idx === 0 ? 'Homepage Showcase' : `Page ${idx + 1}`,
          });
        }
      } else if (item && item.url) {
        list.push({
          url: item.url,
          title: item.title || (idx === 0 ? 'Homepage Showcase' : `Page ${idx + 1}`),
          caption: item.caption,
        });
      }
    });
  }

  // Ensure cover image is included if list is empty or doesn't have it
  if (list.length === 0 && project.image) {
    list.push({
      url: project.image,
      title: 'Homepage Showcase',
    });
  } else if (project.image && !list.some((img) => img.url === project.image)) {
    list.unshift({
      url: project.image,
      title: 'Homepage Showcase',
    });
  }

  return list;
};

export const ProjectsSection: React.FC = () => {
  const { data } = usePortfolio();
  const { projects } = data;

  const INITIAL_COUNT = 4;
  const STEP = 2;

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);

  // Multi-image gallery states
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isScrollFullMode, setIsScrollFullMode] = useState<boolean>(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [viewerScrollTop, setViewerScrollTop] = useState<number>(0);
  const mainViewerRef = useRef<HTMLDivElement>(null);
  const thumbStripRef = useRef<HTMLDivElement>(null);

  // Extract unique categories dynamically + 'All'
  const uniqueCategories = Array.from(new Set(projects.map((p) => p.category))).filter((c): c is string => Boolean(c));
  const categories: string[] = ['All', ...uniqueCategories];

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter(
          (p) =>
            p.category.toLowerCase() === activeCategory.toLowerCase() ||
            p.tech.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()))
        );

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;
  const isExpanded = visibleCount > INITIAL_COUNT && filteredProjects.length > INITIAL_COUNT;

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(INITIAL_COUNT);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + STEP, filteredProjects.length));
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_COUNT);
    // Smooth scroll back up to projects section anchor
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset gallery view when selected project changes
  useEffect(() => {
    if (selectedProject) {
      setActiveImageIndex(0);
      setIsScrollFullMode(true);
      setIsLightboxOpen(false);
    }
  }, [selectedProject?.slug]);

  // Reset main image scroll position to top whenever active image changes
  useEffect(() => {
    setViewerScrollTop(0);
    if (mainViewerRef.current) {
      mainViewerRef.current.scrollTop = 0;
    }
    if (thumbStripRef.current) {
      const activeEl = thumbStripRef.current.children[activeImageIndex] as HTMLElement | undefined;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeImageIndex]);

  const scrollToViewerTop = () => {
    if (mainViewerRef.current) {
      mainViewerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Lock background Lenis & website scroll when project detail modal is open
  useEffect(() => {
    if (selectedProject) {
      pauseLenis();
      const prevBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (isLightboxOpen) {
            setIsLightboxOpen(false);
          } else {
            setSelectedProject(null);
          }
        } else if (e.key === 'ArrowLeft') {
          setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'ArrowRight') {
          const list = getProjectImages(selectedProject);
          setActiveImageIndex((prev) => (prev < list.length - 1 ? prev + 1 : prev));
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        resumeLenis();
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedProject, isLightboxOpen]);

  const currentProjectImages = getProjectImages(selectedProject);
  const currentImage = currentProjectImages[activeImageIndex] || currentProjectImages[0] || {
    url: selectedProject?.image || '',
    title: 'Homepage',
  };

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbStripRef.current) {
      thumbStripRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-slate-200/60 dark:border-zinc-800/60 bg-transparent scroll-mt-24">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 backdrop-blur-xs text-purple-700 dark:text-purple-300 text-xs font-mono">
            <Layers className="w-3.5 h-3.5" />
            <span>PORTFOLIO & CASE STUDIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            <Text3DFlip
              className="font-extrabold justify-center"
              textClassName="text-slate-900 dark:text-white"
              flipTextClassName="text-purple-600 dark:text-purple-400"
              rotateDirection="top"
              staggerDuration={0.025}
            >
              Featured <span className="gradient-text">Work & Implementations</span>
            </Text3DFlip>
          </h2>
          <p className="text-base text-slate-600 dark:text-zinc-400">
            A selection of live e-commerce storefronts, Python backends, and modern web applications built for international businesses.
          </p>

          <div className="pt-1">
            <a
              href="/projects"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all cursor-pointer"
            >
              <span>Explore Dedicated Projects Page</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Filter Categories */}
        <AOS animation="fade-down" delay={100} className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white/35 dark:bg-zinc-900/35 backdrop-blur-md border border-slate-200/70 dark:border-zinc-800/70 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </AOS>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {displayedProjects.map((project, idx) => (
            <AOS
              key={project.slug || idx}
              animation="fade-up"
              delay={idx * 100}
              className="h-full"
            >
              <TiltCard maxTilt={5} scale={1.015} glare={false} className="h-full rounded-2xl">
                <div className="group h-full rounded-2xl bg-white/35 dark:bg-zinc-900/35 backdrop-blur-md border border-slate-200/70 dark:border-zinc-800/70 hover:border-purple-300 dark:hover:border-purple-500/50 overflow-hidden flex flex-col justify-between shadow-xs transition-colors">
                  <div className="flex flex-col h-full justify-between">
                    {/* Project Image Preview */}
                    <div
                      className="relative aspect-[16/10] overflow-hidden bg-slate-100/60 dark:bg-zinc-950/60 cursor-pointer"
                      onClick={() => setSelectedProject(project)}
                      data-cursor="View"
                    >
                      <img
                        src={project.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000'}
                        alt={`${project.title} - ${project.category} project by Shariful Islam`}
                        width={640}
                        height={400}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000';
                        }}
                      />

                      {/* Top Badge: Category & Year */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="px-3 py-1 rounded-lg bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-slate-200 dark:border-zinc-700 text-purple-700 dark:text-purple-300 text-xs font-mono font-semibold">
                          {project.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 text-xs font-mono">
                          {project.year}
                        </span>
                      </div>

                      {/* Bottom Tags: Highlight & Gallery count */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-2">
                        {project.highlight ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50/90 dark:bg-emerald-950/90 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold backdrop-blur-md">
                            <TrendingUp className="w-3.5 h-3.5" />
                            {project.highlight}
                          </span>
                        ) : <div />}

                        {Array.isArray(project.images) && project.images.length > 1 && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/85 text-white text-[11px] font-mono backdrop-blur-md border border-white/20 shadow-xs">
                            <Images className="w-3 h-3 text-purple-400" />
                            <span>{project.images.length} Pages</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Project Body */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3
                          onClick={() => setSelectedProject(project)}
                          className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors cursor-pointer"
                        >
                          {project.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-2">
                          {project.description}
                        </p>
                      </div>

                      {/* Tech Stack Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tech.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-md bg-slate-100/70 dark:bg-zinc-950/60 backdrop-blur-xs text-slate-700 dark:text-zinc-400 border border-slate-200/80 dark:border-zinc-800/80 text-[11px] font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Action Links */}
                      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* View Details Button */}
                          <Magnetic strength={0.25}>
                            <button
                              onClick={() => setSelectedProject(project)}
                              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/90 dark:bg-zinc-800/90 dark:hover:bg-zinc-750 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs"
                            >
                              <span>View Details</span>
                              <ArrowUpRight className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            </button>
                          </Magnetic>

                          {/* Preview Store Button with background color */}
                          {project.liveUrl && (
                            <Magnetic strength={0.25}>
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-600 text-white text-xs font-bold tracking-wide shadow-xs hover:shadow-md hover:shadow-purple-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
                                title="Preview Store (Opens in new tab)"
                              >
                                <span>Preview Store</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </Magnetic>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 ml-auto">
                          {project.githubUrl && (
                            <Magnetic strength={0.3}>
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-xl bg-slate-100/70 dark:bg-zinc-950/60 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200/80 dark:border-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer block"
                                title="GitHub Source"
                              >
                                <Github className="w-4 h-4" />
                              </a>
                            </Magnetic>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </AOS>
          ))}
        </div>

        {/* Load More / Show Less Controls & Counter */}
        {filteredProjects.length > INITIAL_COUNT && (
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white/35 dark:bg-zinc-900/35 backdrop-blur-md border border-slate-200/70 dark:border-zinc-800/70 shadow-xs">
            {/* Progress / Counter Indicator */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Showing {displayedProjects.length} of {filteredProjects.length} Projects
                </p>
                <div className="w-36 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${(displayedProjects.length / filteredProjects.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {hasMore && (
                <button
                  onClick={handleLoadMore}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer flex-1 sm:flex-initial"
                >
                  <span>Load More (+{Math.min(STEP, filteredProjects.length - visibleCount)})</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}

              {hasMore && filteredProjects.length - visibleCount > STEP && (
                <button
                  onClick={() => setVisibleCount(filteredProjects.length)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                >
                  Show All ({filteredProjects.length})
                </button>
              )}

              {isExpanded && (
                <button
                  onClick={handleShowLess}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer flex-1 sm:flex-initial"
                >
                  <span>Show Less</span>
                  <ChevronUp className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Project Detail Modal - Multi-Image Showcase portaled to document.body */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedProject && (
              <div
                data-lenis-prevent
                className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 bg-slate-950/85 backdrop-blur-md overflow-y-auto overscroll-contain"
                onClick={() => setSelectedProject(null)}
              >
                <motion.div
                  data-lenis-prevent
                  initial={{ opacity: 0, scale: 0.96, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 15 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-5xl xl:max-w-6xl max-h-[92vh] my-auto bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white overscroll-contain"
                >
                  {/* Close Button Top Right */}
                  <button
                    onClick={() => setSelectedProject(null)}
                    aria-label="Close Project Modal"
                    className="absolute top-3.5 right-3.5 z-30 p-2.5 rounded-full bg-white/95 dark:bg-zinc-800/95 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white backdrop-blur-md border border-slate-200/80 dark:border-zinc-700 transition-all cursor-pointer shadow-md"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Scrollable Content Container */}
                  <div className="overflow-y-auto flex-1 p-4 sm:p-6 md:p-7 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                      
                      {/* Left Column: Interactive Multi-Image Browser Viewport & Thumbnail Strip (7 cols on lg) */}
                      <div className="lg:col-span-7 space-y-3.5">
                        
                        {/* Browser Window Header Mockup with View Controls */}
                        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-t-2xl">
                          <div className="flex items-center gap-2 min-w-0">
                            {/* Window Controls Dots */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                            </div>

                            {/* Address / Page indicator */}
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-[11px] font-mono text-slate-600 dark:text-zinc-300 truncate max-w-[180px] sm:max-w-xs">
                              <Globe className="w-3 h-3 text-purple-600 shrink-0" />
                              <span className="font-semibold text-purple-600 dark:text-purple-400 shrink-0">
                                {currentImage.title}
                              </span>
                              <span className="text-slate-400 shrink-0">•</span>
                              <span className="text-slate-500 dark:text-zinc-400 truncate">
                                Page {activeImageIndex + 1}/{currentProjectImages.length}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons: Fullscreen & Fit/Scroll Toggle */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Scroll vs Fit mode toggle */}
                            <button
                              type="button"
                              onClick={() => setIsScrollFullMode((prev) => !prev)}
                              className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                              title={isScrollFullMode ? "Switch to Fit Screen View" : "Switch to Full Page Scroll View"}
                            >
                              {isScrollFullMode ? (
                                <>
                                  <Monitor className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                  <span className="hidden sm:inline">Fit Screen</span>
                                </>
                              ) : (
                                <>
                                  <Scroll className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                  <span className="hidden sm:inline">Scroll Full Page</span>
                                </>
                              )}
                            </button>

                            {/* Fullscreen Lightbox Button */}
                            <button
                              type="button"
                              onClick={() => setIsLightboxOpen(true)}
                              className="p-1.5 rounded-lg bg-white dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 transition-colors cursor-pointer"
                              title="Expand to Fullscreen Lightbox"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Main Screen Viewport Container */}
                        <div className="relative bg-slate-900/5 dark:bg-zinc-950 border-x border-b border-slate-200 dark:border-zinc-800 rounded-b-2xl overflow-hidden shadow-inner group">
                          
                          {/* Left Navigation Overlay Button */}
                          {activeImageIndex > 0 && (
                            <button
                              type="button"
                              onClick={() => setActiveImageIndex((prev) => prev - 1)}
                              aria-label="Previous Page Screenshot"
                              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-100 shadow-lg backdrop-blur-md border border-slate-200 dark:border-zinc-700 transition-all opacity-85 hover:opacity-100 cursor-pointer"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                          )}

                          {/* Right Navigation Overlay Button */}
                          {activeImageIndex < currentProjectImages.length - 1 && (
                            <button
                              type="button"
                              onClick={() => setActiveImageIndex((prev) => prev + 1)}
                              aria-label="Next Page Screenshot"
                              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-100 shadow-lg backdrop-blur-md border border-slate-200 dark:border-zinc-700 transition-all opacity-85 hover:opacity-100 cursor-pointer"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          )}

                          {/* The Image Viewer: Scrollable Full Page (Free Size/Height) or Fit Screen */}
                          <div
                            ref={mainViewerRef}
                            onScroll={(e) => setViewerScrollTop((e.target as HTMLDivElement).scrollTop)}
                            className={`w-full h-[350px] sm:h-[420px] md:h-[480px] lg:h-[510px] ${
                              isScrollFullMode
                                ? 'overflow-y-auto overscroll-contain relative custom-scrollbar scroll-smooth bg-slate-100/90 dark:bg-zinc-950/90'
                                : 'flex items-center justify-center p-3.5 sm:p-5 bg-slate-100/70 dark:bg-zinc-950/90 cursor-zoom-in'
                            }`}
                            onClick={() => {
                              if (!isScrollFullMode) setIsLightboxOpen(true);
                            }}
                          >
                            <img
                              src={currentImage.url}
                              alt={currentImage.title}
                              className={
                                isScrollFullMode
                                  ? 'w-full max-w-full h-auto block select-none'
                                  : 'max-w-full max-h-full object-contain mx-auto rounded-lg shadow-sm block select-none'
                              }
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000';
                              }}
                            />
                          </div>

                          {/* Floating Back to Top Button if scrolled down */}
                          {isScrollFullMode && viewerScrollTop > 80 && (
                            <button
                              type="button"
                              onClick={scrollToViewerTop}
                              className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-full bg-purple-600/90 hover:bg-purple-600 text-white text-xs font-semibold shadow-lg backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer animate-fade-in"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                              <span>Top</span>
                            </button>
                          )}

                          {/* Scroll hint bar if full scroll mode and near top */}
                          {isScrollFullMode && viewerScrollTop < 40 && (
                            <div className="absolute bottom-2.5 right-3 pointer-events-none z-10 transition-opacity duration-300">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 text-white text-[11px] font-mono backdrop-blur-md border border-white/10 shadow-sm animate-pulse">
                                <span>↕ Scroll down for full page view</span>
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Horizontal Thumbnail Scrollbar (নিচেতে ছোট একটা বারে স্ক্রলবার থাকবে) */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between px-1">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold flex items-center gap-1.5">
                              <Images className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                              <span>Page Showcase ({currentProjectImages.length} Screenshots)</span>
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                              Click any thumbnail to view
                            </span>
                          </div>

                          <div className="relative flex items-center gap-1">
                            {/* Left Scroll Button */}
                            <button
                              type="button"
                              onClick={() => scrollThumbnails('left')}
                              aria-label="Scroll thumbnails left"
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors shrink-0 cursor-pointer shadow-xs"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>

                            {/* The Horizontal Thumbnail Strip with visible scrollbar */}
                            <div
                              ref={thumbStripRef}
                              className="flex items-center gap-2.5 overflow-x-auto py-2.5 px-1 scroll-smooth flex-1 custom-scrollbar-horizontal overscroll-contain"
                            >
                              {currentProjectImages.map((img, idx) => {
                                const isActive = activeImageIndex === idx;
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      setActiveImageIndex(idx);
                                      if (mainViewerRef.current) {
                                        mainViewerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                                      }
                                    }}
                                    className={`relative w-24 sm:w-28 md:w-32 shrink-0 rounded-xl overflow-hidden border-2 text-left transition-all duration-200 cursor-pointer group ${
                                      isActive
                                        ? 'border-purple-600 ring-2 ring-purple-500/50 shadow-md scale-102 bg-purple-50 dark:bg-purple-950/40'
                                        : 'border-slate-200 dark:border-zinc-800 opacity-75 hover:opacity-100 hover:border-slate-300 dark:hover:border-zinc-700 bg-slate-50 dark:bg-zinc-950'
                                    }`}
                                  >
                                    <div className="aspect-[16/10] w-full overflow-hidden bg-slate-200 dark:bg-zinc-900 relative">
                                      <img
                                        src={img.url}
                                        alt={img.title}
                                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src =
                                            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600';
                                        }}
                                      />
                                      {/* Active check pill */}
                                      {isActive && (
                                        <div className="absolute top-1 right-1 p-0.5 rounded-full bg-purple-600 text-white shadow-xs">
                                          <CheckCircle2 className="w-3 h-3" />
                                        </div>
                                      )}
                                      {/* Page number badge */}
                                      <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-mono leading-none">
                                        #{idx + 1}
                                      </div>
                                    </div>
                                    <div className="p-1 px-1.5">
                                      <p className="text-[10px] font-semibold text-slate-800 dark:text-zinc-200 truncate">
                                        {img.title}
                                      </p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Right Scroll Button */}
                            <button
                              type="button"
                              onClick={() => scrollThumbnails('right')}
                              aria-label="Scroll thumbnails right"
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors shrink-0 cursor-pointer shadow-xs"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Page Caption / Description if present */}
                        {currentImage.caption && (
                          <div className="p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/40 text-xs text-purple-900 dark:text-purple-300 flex items-start gap-2">
                            <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">{currentImage.title}:</span> {currentImage.caption}
                            </div>
                          </div>
                        )}

                        {/* Live Production Domain Bar with client domain note */}
                        {selectedProject.liveUrl && (
                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800/80 space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800/40">
                                  <Globe className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                                      Live Store
                                    </span>
                                  </div>
                                  <p className="text-xs font-mono text-slate-600 dark:text-zinc-400 truncate max-w-[200px] sm:max-w-xs">
                                    {selectedProject.liveUrl.replace(/^https?:\/\//, '')}
                                  </p>
                                </div>
                              </div>

                              <a
                                href={selectedProject.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-1 shadow-xs"
                              >
                                <span>Visit Site</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-500 leading-normal pl-1">
                              💡 Note: Client store domains may occasionally update or rebrand. You can view all high-resolution design pages and full layouts directly above.
                            </p>
                          </div>
                        )}

                      </div>

                      {/* Right Column: Title, Description, Tech Stack, & CTA Buttons (5 cols on lg) */}
                      <div className="lg:col-span-5 flex flex-col justify-between space-y-6 pt-1">
                        <div className="space-y-4">
                          {/* Header Tags */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold">
                              {selectedProject.category}
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-mono">
                              Year {selectedProject.year}
                            </span>
                            {selectedProject.featured && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                                <Sparkles className="w-3 h-3" />
                                Featured
                              </span>
                            )}
                            {selectedProject.highlight && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                                <TrendingUp className="w-3.5 h-3.5" />
                                {selectedProject.highlight}
                              </span>
                            )}
                          </div>

                          {/* Project Title */}
                          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                            {selectedProject.title}
                          </h3>

                          {/* Description */}
                          <div className="space-y-2 text-slate-600 dark:text-zinc-300 text-sm leading-relaxed">
                            <p>{selectedProject.description}</p>
                          </div>

                          {/* Tech Stack */}
                          <div className="space-y-2 pt-1">
                            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold">
                              Technologies & Architecture:
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedProject.tech.map((t, idx) => (
                                <span
                                  key={idx}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 text-xs font-mono font-medium shadow-2xs"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Client Delivery Archival Note */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950/40 border border-slate-200/80 dark:border-zinc-800/80 text-[11px] text-slate-500 dark:text-zinc-400 space-y-1">
                            <div className="font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                              <Images className="w-3.5 h-3.5 text-purple-600" />
                              <span>Preserved High-Res Page Previews</span>
                            </div>
                            <p>
                              Full page layouts and mockups are archived directly in this showcase, allowing you to review all store sections even if client domains update.
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-5 border-t border-slate-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          {selectedProject.liveUrl && (
                            <a
                              href={selectedProject.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-600 text-white font-bold text-xs sm:text-sm tracking-wide uppercase text-center transition-all shadow-md hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <span>Preview Store</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {selectedProject.githubUrl && (
                            <a
                              href={selectedProject.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-3 px-5 rounded-xl border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-bold text-xs sm:text-sm tracking-wide uppercase text-center transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                            >
                              <Github className="w-4 h-4" />
                              <span>GitHub</span>
                            </a>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Fullscreen Lightbox Modal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isLightboxOpen && selectedProject && (
              <div
                data-lenis-prevent
                className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl p-3 sm:p-6"
                onClick={() => setIsLightboxOpen(false)}
              >
                {/* Top Toolbar */}
                <div
                  className="w-full max-w-6xl flex items-center justify-between pb-3 text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold truncate">
                    <span className="text-purple-400 font-mono">[{activeImageIndex + 1}/{currentProjectImages.length}]</span>
                    <span className="truncate">{selectedProject.title} — {currentImage.title}</span>
                  </div>
                  <button
                    onClick={() => setIsLightboxOpen(false)}
                    aria-label="Close Lightbox"
                    className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Lightbox Image Container */}
                <div
                  className="relative w-full max-w-6xl max-h-[85vh] overflow-y-auto overscroll-contain flex items-center justify-center p-2 rounded-2xl bg-zinc-950/60 custom-scrollbar"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Left Arrow */}
                  {activeImageIndex > 0 && (
                    <button
                      onClick={() => setActiveImageIndex((p) => p - 1)}
                      className="fixed left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all cursor-pointer z-30"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}

                  {/* Right Arrow */}
                  {activeImageIndex < currentProjectImages.length - 1 && (
                    <button
                      onClick={() => setActiveImageIndex((p) => p + 1)}
                      className="fixed right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all cursor-pointer z-30"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}

                  <img
                    src={currentImage.url}
                    alt={currentImage.title}
                    className="max-w-full h-auto object-contain rounded-xl shadow-2xl"
                  />
                </div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
};
