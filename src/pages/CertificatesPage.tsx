import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { CertificatesSection } from '../components/CertificatesSection';
import { GraduationCap, ArrowRight } from 'lucide-react';

interface PageProps {
  onNavigate: (path: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const CertificatesPage: React.FC<PageProps> = ({ onNavigate, isDark, onToggleTheme }) => {
  return (
    <PageLayout
      currentPath="/certificates"
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleTheme={onToggleTheme}
    >
      <CertificatesSection />

      {/* Quick jump to Education */}
      <div className="mt-12 text-center">
        <button
          type="button"
          onClick={() => onNavigate('/education')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-50 dark:bg-zinc-800 border border-purple-200 dark:border-zinc-700 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase tracking-wide hover:bg-purple-100 dark:hover:bg-zinc-700 transition-all cursor-pointer"
        >
          <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>View Academic Education & Qualifications</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </PageLayout>
  );
};
