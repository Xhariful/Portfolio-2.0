import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { TestimonialsSection } from '../components/TestimonialsSection';

interface PageProps {
  onNavigate: (path: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const ReviewsPage: React.FC<PageProps> = ({ onNavigate, isDark, onToggleTheme }) => {
  return (
    <PageLayout
      currentPath="/reviews"
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleTheme={onToggleTheme}
    >
      <TestimonialsSection />
    </PageLayout>
  );
};
