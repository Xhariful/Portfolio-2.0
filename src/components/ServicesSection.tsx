import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  Server,
  Code2,
  Layout,
  ArrowUpRight,
  Zap,
  Check,
  ChevronDown,
  ChevronUp,
  Eye
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { TiltCard } from './animations/TiltCard';
import { Magnetic } from './animations/Magnetic';

export const ServicesSection: React.FC<{ onContactClick: () => void }> = ({ onContactClick }) => {
  const { data } = usePortfolio();
  const { services } = data;

  const INITIAL_COUNT = 4;
  const STEP = 2;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);

  const displayedServices = services.slice(0, visibleCount);
  const hasMore = visibleCount < services.length;
  const isExpanded = visibleCount > INITIAL_COUNT && services.length > INITIAL_COUNT;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + STEP, services.length));
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_COUNT);
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'shopping-bag':
        return <ShoppingBag className="w-5 h-5" />;
      case 'server':
        return <Server className="w-5 h-5" />;
      case 'code-2':
        return <Code2 className="w-5 h-5" />;
      case 'layout':
      default:
        return <Layout className="w-5 h-5" />;
    }
  };

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-slate-200/60 dark:border-zinc-800/60 scroll-mt-24">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-mono">
            <Zap className="w-3.5 h-3.5" />
            <span>SOLUTIONS & EXPERTISE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Services That Drive <span className="gradient-text">Growth</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-zinc-400">
            From custom Shopify storefronts to robust Python backend automation and high-converting modern web applications.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {displayedServices.map((service, idx) => (
            <motion.div
              key={service.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="h-full"
            >
              <TiltCard maxTilt={5} scale={1.015} glare={true} className="h-full rounded-2xl">
                <div className="p-7 h-full rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all space-y-5 flex flex-col justify-between shadow-sm dark:shadow-none">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center">
                        {getIcon(service.icon)}
                      </div>
                      <span className="text-xs font-mono text-slate-400 dark:text-zinc-500 font-semibold">0{idx + 1}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {service.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
                      {service.description}
                    </p>

                    {/* Feature Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {service.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 text-xs font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                    <Magnetic strength={0.25}>
                      <button
                        onClick={onContactClick}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 tracking-wide uppercase transition-colors cursor-pointer"
                      >
                        <span>Request Proposal</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </Magnetic>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Load More / Show Less Controls & Counter */}
        {services.length > INITIAL_COUNT && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
            {/* Counter */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Showing {displayedServices.length} of {services.length} Services
                </p>
                <div className="w-36 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${(displayedServices.length / services.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {hasMore && (
                <Magnetic strength={0.25}>
                  <button
                    onClick={handleLoadMore}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer flex-1 sm:flex-initial"
                  >
                    <span>Load More (+{Math.min(STEP, services.length - visibleCount)})</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </Magnetic>
              )}

              {hasMore && services.length - visibleCount > STEP && (
                <Magnetic strength={0.25}>
                  <button
                    onClick={() => setVisibleCount(services.length)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                  >
                    Show All ({services.length})
                  </button>
                </Magnetic>
              )}

              {isExpanded && (
                <Magnetic strength={0.25}>
                  <button
                    onClick={handleShowLess}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer flex-1 sm:flex-initial"
                  >
                    <span>Show Less</span>
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </Magnetic>
              )}
            </div>
          </div>
        )}

        {/* Clean Consultation Banner */}
        <div className="rounded-2xl bg-purple-50 dark:bg-zinc-900 border border-purple-200 dark:border-zinc-800 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm dark:shadow-none">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Have a unique technical challenge?</h3>
            <p className="text-sm text-slate-600 dark:text-zinc-300 max-w-xl">
              Let's schedule a free 30-minute discovery call to evaluate your requirements, timeline, and architectural approach.
            </p>
          </div>
          <button
            onClick={onContactClick}
            className="px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm hover:shadow-md whitespace-nowrap cursor-pointer"
          >
            Schedule Free Call
          </button>
        </div>

      </div>
    </section>
  );
};
