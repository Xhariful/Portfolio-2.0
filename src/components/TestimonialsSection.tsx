import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, MessageSquare, CheckCircle2, MapPin, Briefcase, Quote, ChevronDown, ChevronUp } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { TiltCard } from './animations/TiltCard';
import { Magnetic } from './animations/Magnetic';

export const TestimonialsSection: React.FC = () => {
  const { data } = usePortfolio();
  const { testimonials } = data;

  const INITIAL_COUNT = 6;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);
  const displayedReviews = testimonials.slice(0, visibleCount);
  const hasMore = visibleCount < testimonials.length;

  return (
    <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 scroll-mt-24">
      {/* Fallback alias for any legacy links referencing #testimonials */}
      <div id="testimonials" className="absolute -top-24 pointer-events-none opacity-0" />

      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-purple-500/5 dark:bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800/60 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-mono">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>CLIENT REVIEWS & STORE ENDORSEMENTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Client Reviews & <span className="gradient-text">Store Feedback</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-zinc-400">
            Real feedback from international founders, e-commerce brand owners, and agency leaders who partnered with me.
          </p>
        </div>

        {/* Top summary stats without admin CTA button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
              5.0 Average Rating across {testimonials.length} Verified Projects
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-zinc-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>100% Client Satisfaction Guarantee</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedReviews.map((t, idx) => (
            <motion.div
              key={t.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className="h-full"
            >
              <TiltCard maxTilt={5} scale={1.015} glare={true} className="h-full rounded-2xl">
                <div className="group h-full p-6 sm:p-7 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800/90 hover:border-purple-300 dark:hover:border-purple-600/70 space-y-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative overflow-hidden">
                  {/* Card top decorative accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-purple-500 to-indigo-500 opacity-70 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4">
                {/* Header: Stars & Project / Verification Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Verified Client</span>
                  </span>
                </div>

                {/* Project tag if available */}
                {t.project && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-[10px] font-mono font-semibold text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
                    <Briefcase className="w-3 h-3 text-purple-500" />
                    <span>{t.project}</span>
                  </div>
                )}

                {/* Review Text */}
                <div className="relative">
                  <Quote className="w-6 h-6 text-purple-200 dark:text-purple-900/50 absolute -top-2 -left-1 pointer-events-none -z-0" />
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed relative z-10 pt-1 font-normal">
                    "{t.quote}"
                  </p>
                </div>
              </div>

              {/* Client Info Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {t.avatarUrl ? (
                    <img
                      src={t.avatarUrl}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-purple-200 dark:border-purple-800 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
                      {t.name.charAt(0)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {t.name}
                    </h4>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium truncate">
                      {t.role}
                      {t.company ? ` • ${t.company}` : ''}
                    </p>
                  </div>
                </div>

                {t.country && (
                  <span className="text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-1 font-mono flex-shrink-0">
                    <MapPin className="w-3 h-3" />
                    <span>{t.country}</span>
                  </span>
                )}
              </div>
            </div>
          </TiltCard>
        </motion.div>
          ))}
        </div>

        {/* Load More Controls */}
        {testimonials.length > INITIAL_COUNT && (
          <div className="text-center pt-4 flex justify-center">
            {hasMore ? (
              <Magnetic strength={0.25}>
                <button
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 3, testimonials.length))}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase inline-flex items-center gap-2 shadow-xs cursor-pointer transition-all"
                >
                  <span>Load More Reviews</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </Magnetic>
            ) : (
              <Magnetic strength={0.25}>
                <button
                  onClick={() => setVisibleCount(INITIAL_COUNT)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Show Less</span>
                  <ChevronUp className="w-4 h-4" />
                </button>
              </Magnetic>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
