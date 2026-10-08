import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { SkillsSection } from '../components/SkillsSection';

interface PageProps {
  onNavigate: (path: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const SkillsPage: React.FC<PageProps> = ({ onNavigate, isDark, onToggleTheme }) => {
  return (
    <PageLayout
      currentPath="/skills"
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleTheme={onToggleTheme}
    >
      <SkillsSection />
    </PageLayout>
  );
};
