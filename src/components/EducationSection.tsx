import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  CheckCircle2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Eye
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { TiltCard } from './animations/TiltCard';
import { Magnetic } from './animations/Magnetic';

export const EducationSection: React.FC = () => {
  const { data } = usePortfolio();
  const { education } = data;

  const INITIAL_COUNT = 3;
  const STEP = 3;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);

  const displayedEducation = education.slice(0, visibleCount);
  const hasMore = visibleCount < education.length;
  const isExpanded = visibleCount > INITIAL_COUNT && education.length > INITIAL_COUNT;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + STEP, education.length));
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_COUNT);
    const el = document.getElementById('education');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="education" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/70 dark:bg-zinc-950/60 scroll-mt-24">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800/60 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-mono">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>ACADEMIC BACKGROUND & CONTINUING COURSES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Education & <span className="gradient-text">Courses</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-zinc-400">
            Educational foundation, engineering degrees, and professional software engineering courses shaping my technical expertise.
          </p>
        </div>

        {/* Education Timeline / Cards Grid */}
        <div className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {displayedEducation.map((edu, idx) => (
              <motion.div
                key={edu.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="h-full"
              >
                <TiltCard maxTilt={5} scale={1.015} glare={true} className="h-full rounded-2xl">
                  <div className="p-7 h-full rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 hover:border-purple-300 dark:hover:border-purple-600 transition-all flex flex-col justify-between shadow-xs dark:shadow-none space-y-5">
                <div className="space-y-4">
                  {/* Top Metadata Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-300 font-mono text-xs font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>{edu.period}</span>
                    </span>

                    {edu.grade && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-semibold">
                        {edu.grade}
                      </span>
                    )}
                  </div>

                  {/* Degree & Institution */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {edu.degree}
                    </h3>
                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 flex-shrink-0" />
                      <span>{edu.institution}</span>
                    </p>
                    {edu.location && (
                      <p className="text-xs text-slate-500 dark:text-zinc-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{edu.location}</span>
                      </p>
                    )}
                  </div>

                  {/* Field of study */}
                  {edu.fieldOfStudy && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80">
                      <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">
                        Specialization:
                      </span>
                      <p className="text-xs font-medium text-slate-800 dark:text-zinc-200 mt-0.5">
                        {edu.fieldOfStudy}
                      </p>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                    {edu.description}
                  </p>

                  {/* Highlights / Key Coursework */}
                  {edu.highlights && edu.highlights.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
                      <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 uppercase tracking-wider font-semibold">
                        Key Focus & Honors:
                      </span>
                      <ul className="space-y-1">
                        {edu.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="text-xs text-slate-600 dark:text-zinc-300 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-2 text-right">
                  <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-600">
                    ID #{idx + 1}
                  </span>
                </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          {/* Load More / Show Less Controls & Counter */}
          {education.length > INITIAL_COUNT && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 shadow-xs">
              {/* Counter */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Showing {displayedEducation.length} of {education.length} Qualifications
                  </p>
                  <div className="w-36 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all duration-300"
                      style={{ width: `${(displayedEducation.length / education.length) * 100}%` }}
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
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer flex-1 sm:flex-initial"
                    >
                      <span>Load More (+{Math.min(STEP, education.length - visibleCount)})</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </Magnetic>
                )}

                {hasMore && education.length - visibleCount > STEP && (
                  <Magnetic strength={0.25}>
                    <button
                      onClick={() => setVisibleCount(education.length)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                    >
                      Show All ({education.length})
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
        </div>

      </div>
    </section>
  );
};
