import React, { useState, useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectItem } from '../types';
import { TiltCard } from './animations/TiltCard';
import { Magnetic } from './animations/Magnetic';
import { AOS } from './animations/AOS';
import { Text3DFlip } from './ui/text-3d-flip';
import { pauseLenis, resumeLenis } from '../hooks/useLenisScroll';

export const ProjectsSection: React.FC = () => {
  const { data } = usePortfolio();
  const { projects } = data;

  const INITIAL_COUNT = 4;
  const STEP = 2;

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);

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

  // Lock background Lenis & website scroll when project detail modal is open
  useEffect(() => {
    if (selectedProject) {
      pauseLenis();
      const prevBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedProject(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        resumeLenis();
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedProject]);

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

                      {/* Bottom Highlight Tag */}
                      {project.highlight && (
                        <div className="absolute bottom-3 left-3 pointer-events-none">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50/90 dark:bg-emerald-950/90 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold backdrop-blur-md">
                            <TrendingUp className="w-3.5 h-3.5" />
                            {project.highlight}
                          </span>
                        </div>
                      )}
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

      {/* Project Detail Modal - Wide Landscape Presentation portaled to document.body */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedProject && (
              <div
                data-lenis-prevent
                className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-6 lg:p-8 bg-slate-950/80 backdrop-blur-md overflow-y-auto overscroll-contain"
                onClick={() => setSelectedProject(null)}
              >
                <motion.div
                  data-lenis-prevent
                  initial={{ opacity: 0, scale: 0.96, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 15 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-4xl lg:max-w-5xl max-h-[90vh] my-auto bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white overscroll-contain"
                >
                  {/* Close Button Top Right */}
                  <button
                    onClick={() => setSelectedProject(null)}
                    aria-label="Close Project Modal"
                    className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 dark:bg-zinc-800/90 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white backdrop-blur-md border border-slate-200/80 dark:border-zinc-700 transition-all cursor-pointer shadow-sm"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Scrollable Content Container */}
                  <div className="overflow-y-auto flex-1 p-5 sm:p-7 md:p-8 lg:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
                      
                      {/* Left Column: Media Preview & Live Domain Info */}
                      <div className="md:col-span-6 space-y-4">
                        <div className="relative aspect-[16/10] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 group shadow-inner">
                          <img
                            src={selectedProject.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000'}
                            alt={selectedProject.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />

                          {/* Top Badges over image */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                            <span className="px-3 py-1 rounded-lg bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200/80 dark:border-zinc-700 text-purple-700 dark:text-purple-300 text-xs font-mono font-bold shadow-xs">
                              {selectedProject.category}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200/80 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 text-xs font-mono font-medium shadow-xs">
                              Year: {selectedProject.year}
                            </span>
                          </div>

                          {/* Bottom Highlight Tag over image */}
                          {selectedProject.highlight && (
                            <div className="absolute bottom-3 left-3 pointer-events-none">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-md backdrop-blur-md">
                                <TrendingUp className="w-3.5 h-3.5" />
                                {selectedProject.highlight}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Live Production Domain Bar */}
                        {selectedProject.liveUrl && (
                          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800/80 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800/40">
                                <Globe className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                                    Live Production Store
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
                              className="px-3 py-1.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-700 dark:text-purple-300 text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
                            >
                              <span>Visit</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Right Column: Title, Description, Tech Stack, & CTA Buttons */}
                      <div className="md:col-span-6 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                          {/* Header Tags */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold">
                              {selectedProject.category}
                            </span>
                            {selectedProject.featured && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                                <Sparkles className="w-3 h-3" />
                                Featured Project
                              </span>
                            )}
                          </div>

                          {/* Project Title */}
                          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                            {selectedProject.title}
                          </h3>

                          {/* Description */}
                          <div className="space-y-2 text-slate-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
                            <p>{selectedProject.description}</p>
                          </div>

                          {/* Tech Stack */}
                          <div className="space-y-2.5 pt-2">
                            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold">
                              Technologies & Architecture:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.tech.map((t, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 text-xs font-mono font-medium shadow-2xs"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 border-t border-slate-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          {selectedProject.liveUrl && (
                            <a
                              href={selectedProject.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-600 text-white font-bold text-xs sm:text-sm tracking-wide uppercase text-center transition-all shadow-md hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer"
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
                              className="py-3.5 px-6 rounded-xl border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-bold text-xs sm:text-sm tracking-wide uppercase text-center transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
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
    </section>
  );
};
