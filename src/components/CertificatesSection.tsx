import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Eye,
  ShieldCheck,
  Sparkles,
  Search,
  X,
  Copy,
  Check
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { CertificationItem } from '../types';

export const CertificatesSection: React.FC = () => {
  const { data, openAdminPortal, showToast } = usePortfolio();
  const { certifications } = data;

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  const INITIAL_COUNT = 6;
  const STEP = 3;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);

  // Extract unique categories from certifications
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    certifications.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [certifications]);

  // Filter certifications
  const filteredCerts = React.useMemo(() => {
    return certifications.filter((cert) => {
      const matchesCategory =
        activeCategory === 'all' ||
        (cert.category && cert.category.toLowerCase() === activeCategory.toLowerCase());
      
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        cert.title.toLowerCase().includes(q) ||
        cert.org.toLowerCase().includes(q) ||
        (cert.credentialId && cert.credentialId.toLowerCase().includes(q)) ||
        (cert.skills && cert.skills.some((s) => s.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [certifications, activeCategory, searchQuery]);

  const displayedCerts = filteredCerts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCerts.length;
  const isExpanded = visibleCount > INITIAL_COUNT && filteredCerts.length > INITIAL_COUNT;

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(INITIAL_COUNT);
  };

  const handleCopyCredential = (id?: string) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    showToast('Credential ID copied to clipboard!');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + STEP, filteredCerts.length));
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_COUNT);
    const el = document.getElementById('certificates');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="certificates"
      className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/70 dark:bg-zinc-950/70"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800/60 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-mono">
            <Award className="w-3.5 h-3.5" />
            <span>VERIFIED CREDENTIALS & ACHIEVEMENTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Professional <span className="gradient-text">Certificates</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-zinc-400">
            Official certifications, industry qualifications, and technical accreditations earned throughout my software engineering career.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 w-full md:w-auto">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
            >
              All ({certifications.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Search and Admin Link */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search certificates or skills..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={openAdminPortal}
              title="Add or edit certificates from admin panel"
              className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer flex-shrink-0"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredCerts.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
            <Award className="w-10 h-10 mx-auto text-slate-300 dark:text-zinc-600" />
            <h4 className="text-base font-bold text-slate-800 dark:text-zinc-200">No certificates found</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Try adjusting your category filter or search query.</p>
          </div>
        )}

        {/* Certificates Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCerts.map((cert, idx) => (
            <motion.div
              key={cert.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="group rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800/90 hover:border-purple-300 dark:hover:border-purple-600/70 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all space-y-5 relative overflow-hidden"
            >
              {/* Subtle card top gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-500 opacity-80 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4">
                {/* Visual Header / Badge & Org */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/70 dark:border-purple-800/50 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                    {cert.imageUrl ? (
                      <img
                        src={cert.imageUrl}
                        alt={cert.title}
                        className="w-full h-full object-cover rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <ShieldCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-[11px] font-mono font-semibold text-slate-700 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700/60 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-purple-500" />
                      <span>{cert.date}</span>
                    </span>
                    {cert.credentialId && (
                      <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-semibold mt-1">
                        ID: {cert.credentialId}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Organization */}
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                    {cert.org}
                  </p>
                </div>

                {/* Description if provided */}
                {cert.description && (
                  <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                    {cert.description}
                  </p>
                )}

                {/* Verified Skills tags */}
                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {cert.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800/90 text-slate-600 dark:text-zinc-400 text-[10px] font-mono font-medium border border-slate-200/60 dark:border-zinc-700/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-medium transition-colors"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Controls */}
        {filteredCerts.length > INITIAL_COUNT && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/60 dark:border-zinc-800/60">
            {/* Counter */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Showing {displayedCerts.length} of {filteredCerts.length} Certificates
                </p>
                <div className="w-36 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${(displayedCerts.length / filteredCerts.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {hasMore && (
                <button
                  onClick={handleLoadMore}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer flex-1 sm:flex-initial"
                >
                  <span>Load More (+{Math.min(STEP, filteredCerts.length - visibleCount)})</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}

              {hasMore && filteredCerts.length - visibleCount > STEP && (
                <button
                  onClick={() => setVisibleCount(filteredCerts.length)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                >
                  Show All ({filteredCerts.length})
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

      {/* Certificate Modal Dialog */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 z-10 space-y-6 text-left overflow-hidden"
            >
              {/* Modal Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-500 dark:text-zinc-400 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Certificate Image or Badge Banner */}
              {selectedCert.imageUrl ? (
                <div className="w-full h-48 rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
                  <img
                    src={selectedCert.imageUrl}
                    alt={selectedCert.title}
                    className="w-full h-full object-contain p-2"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-full py-6 rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50/40 to-sky-50 dark:from-purple-950/40 dark:via-zinc-900 dark:to-sky-950/20 border border-purple-200/60 dark:border-purple-800/40 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Award className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-300 font-bold">
                    Official Credential
                  </span>
                </div>
              )}

              {/* Title and Organization */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono text-xs font-semibold border border-purple-200 dark:border-purple-800/60">
                    {selectedCert.category || 'Certification'}
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                    {selectedCert.date}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedCert.title}
                </h3>
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  {selectedCert.org}
                </p>
              </div>

              {/* Credential ID and Copy */}
              {selectedCert.credentialId && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase font-mono text-slate-400 dark:text-zinc-500 font-bold">
                      Credential ID / License
                    </p>
                    <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                      {selectedCert.credentialId}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyCredential(selectedCert.credentialId)}
                    className="p-2 rounded-lg bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}

              {/* Description */}
              {selectedCert.description && (
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    Syllabus & Details
                  </p>
                  <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                    {selectedCert.description}
                  </p>
                </div>
              )}

              {/* Skills */}
              {selectedCert.skills && selectedCert.skills.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    Verified Competencies
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCert.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-200/60 dark:border-purple-800/40 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-purple-500" />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Bottom Actions */}
              <div className="flex items-center gap-3 pt-2">
                {selectedCert.credentialUrl && (
                  <a
                    href={selectedCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs tracking-wide shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Verify Credential Online</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedCert(null)}
                  className="py-2.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
