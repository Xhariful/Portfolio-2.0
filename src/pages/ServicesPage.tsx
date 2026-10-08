import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { ServicesSection } from '../components/ServicesSection';

interface PageProps {
  onNavigate: (path: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const ServicesPage: React.FC<PageProps> = ({ onNavigate, isDark, onToggleTheme }) => {
  return (
    <PageLayout
      currentPath="/services"
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleTheme={onToggleTheme}
    >
      <ServicesSection onContactClick={() => onNavigate('/contact')} />
    </PageLayout>
  );
};
