import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { ContactSection } from '../components/ContactSection';

interface PageProps {
  onNavigate: (path: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const ContactPage: React.FC<PageProps> = ({ onNavigate, isDark, onToggleTheme }) => {
  return (
    <PageLayout
      currentPath="/contact"
      onNavigate={onNavigate}
      isDark={isDark}
      onToggleTheme={onToggleTheme}
    >
      <ContactSection />
    </PageLayout>
  );
};
