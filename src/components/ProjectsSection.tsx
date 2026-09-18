import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectItem } from '../types';
import { TiltCard } from './animations/TiltCard';
import { Magnetic } from './animations/Magnetic';

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

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-slate-200/60 dark:border-zinc-800/60 bg-slate-100/40 dark:bg-zinc-950/40 scroll-mt-24">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-mono">
            <Layers className="w-3.5 h-3.5" />
            <span>PORTFOLIO & CASE STUDIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Featured <span className="gradient-text">Work & Implementations</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-zinc-400">
            A selection of live e-commerce storefronts, Python backends, and modern web applications built for international businesses.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {displayedProjects.map((project, idx) => (
            <motion.div
              key={project.slug || idx}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="h-full"
            >
              <TiltCard maxTilt={5} scale={1.015} glare={true} className="h-full rounded-2xl">
                <div className="group h-full rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all overflow-hidden shadow-sm dark:shadow-none flex flex-col justify-between">
                  {/* Project Image Preview */}
                  <div
                    className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-zinc-950 cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                    data-cursor="View"
                  >
                    <img
                      src={project.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000'}
                      alt={`${project.title} - ${project.category} project by Shariful Islam`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
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
                          className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Action Links */}
                    <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                      <Magnetic strength={0.3}>
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 tracking-wide uppercase flex items-center gap-1 cursor-pointer"
                        >
                          <span>View Details</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </Magnetic>

                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <Magnetic strength={0.4}>
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-950 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer block"
                              title="GitHub Source"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          </Magnetic>
                        )}
                        {project.liveUrl && (
                          <Magnetic strength={0.4}>
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-950 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer block"
                              title="Live Demo"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Magnetic>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Load More / Show Less Controls & Counter */}
        {filteredProjects.length > INITIAL_COUNT && (
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
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

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-zinc-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-white"
            >
              <button
                onClick={() => setSelectedProject(null)}
                aria-label="Close Project Modal"
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                <img
                  src={selectedProject.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000'}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-md bg-purple-50 dark:bg-purple-600/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 text-xs font-mono">
                    {selectedProject.category}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">Year: {selectedProject.year}</span>
                </div>
                
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {selectedProject.title}
                </h3>
                
                <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Technologies Used:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 text-xs font-mono font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 flex items-center gap-4">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs tracking-wide uppercase text-center transition-all flex items-center justify-center gap-2"
                  >
                    <span>Launch Live Demo</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 rounded-xl border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-bold text-xs tracking-wide uppercase text-center transition-all flex items-center justify-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
