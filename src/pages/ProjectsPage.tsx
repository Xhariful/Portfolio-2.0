import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { ProjectsSection } from '../components/ProjectsSection';

interface PageProps {
  onNavigate: (path: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const ProjectsPage: React.FC<PageProps> = ({ onNavigate, isDark, onToggleTheme }) => {
  return (
    <PageLayout
      currentPath="/projects"
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleTheme={onToggleTheme}
    >
      <ProjectsSection />
    </PageLayout>
  );
};
