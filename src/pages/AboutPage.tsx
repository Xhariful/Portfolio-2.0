import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { AboutSection } from '../components/AboutSection';

interface PageProps {
  onNavigate: (path: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const AboutPage: React.FC<PageProps> = ({ onNavigate, isDark, onToggleTheme }) => {
  return (
    <PageLayout
      currentPath="/about"
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleTheme={onToggleTheme}
    >
      <AboutSection onContactClick={() => onNavigate('/contact')} />
    </PageLayout>
  );
};
