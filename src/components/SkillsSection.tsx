import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, Layers, CheckCircle2, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { CoreSkillsTicker } from './CoreSkillsSection';

export const SkillsSection: React.FC = () => {
  const { data } = usePortfolio();
  const { skillCategories } = data;
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const INITIAL_COUNT = 2;
  const STEP = 2;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);

  const filteredCategories =
    activeCategory === 'all'
      ? skillCategories
      : skillCategories.filter((c) => c.id === activeCategory);

  const displayedCategories = filteredCategories.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCategories.length;
  const isExpanded = visibleCount > INITIAL_COUNT && filteredCategories.length > INITIAL_COUNT;

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setVisibleCount(INITIAL_COUNT);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + STEP, filteredCategories.length));
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_COUNT);
    const el = document.getElementById('skills');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-slate-200/60 dark:border-zinc-800/60 bg-slate-100/50 dark:bg-zinc-950/40">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>TECHNICAL CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Skills & <span className="gradient-text">Proficiency Matrix</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-zinc-400">
            A comprehensive overview of programming languages, e-commerce architectures, and frontend toolkits I specialize in.
          </p>
        </div>

        {/* Dynamic Core Skills Ticker Showcase */}
        <CoreSkillsTicker />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
            }`}
          >
            All Disciplines
          </button>
          {skillCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {displayedCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm dark:shadow-none space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-4">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 uppercase tracking-wider font-semibold">
                    {category.highlight}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{category.title}</h3>
                </div>
                <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50">
                  <Layers className="w-4 h-4" />
                </span>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        {skill.name}
                      </span>
                      <div className="flex items-center gap-2 font-mono text-slate-500 dark:text-zinc-400">
                        <span className="text-[11px]">{skill.years}y exp</span>
                        <span className="text-purple-600 dark:text-purple-400 font-bold">{skill.level}%</span>
                      </div>
                    </div>
                    
                    {/* Clean Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-950 rounded-full overflow-hidden border border-slate-200/60 dark:border-zinc-800/60">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: sIdx * 0.04, ease: 'easeOut' }}
                        className="h-full bg-purple-600 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More / Show Less Controls & Counter */}
        {filteredCategories.length > INITIAL_COUNT && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
            {/* Counter */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Showing {displayedCategories.length} of {filteredCategories.length} Skill Domains
                </p>
                <div className="w-36 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${(displayedCategories.length / filteredCategories.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {hasMore && (
                <button
                  onClick={handleLoadMore}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer flex-1 sm:flex-initial"
                >
                  <span>Load More (+{Math.min(STEP, filteredCategories.length - visibleCount)})</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}

              {hasMore && filteredCategories.length - visibleCount > STEP && (
                <button
                  onClick={() => setVisibleCount(filteredCategories.length)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                >
                  Show All ({filteredCategories.length})
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
    </section>
  );
};
