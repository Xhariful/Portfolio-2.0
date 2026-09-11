import React from 'react';
import {
  ShoppingBag,
  Palette,
  Droplet,
  Code2,
  Atom,
  Terminal,
  Globe,
  Zap,
  Database,
  Smartphone,
  Store,
  Layout,
  Server,
  TrendingUp,
  GitBranch,
  Users,
  MessageSquare,
  Lightbulb,
  FolderKanban,
  Sparkles
} from 'lucide-react';

interface SkillItem {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  tag: string;
}

// Top Row Skills (10 skills)
const row1Skills: SkillItem[] = [
  {
    id: 'shopify-dev',
    name: 'Shopify Development',
    category: 'E-commerce',
    tag: 'Core Expert',
    accentBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    accentText: 'text-emerald-700 dark:text-emerald-300',
    accentBorder: 'border-emerald-500/30',
    icon: (
      <svg className="w-5 h-5 text-[#96bf48]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.344 7.277c-.03-.234-.234-.41-.469-.417l-3.328-.109-2.18-2.18c-.148-.148-.359-.227-.57-.227-.039 0-.078 0-.117.008-.258.031-.469.219-.531.477l-1.07 4.438-2.453.758c-.359.109-.562.492-.453.852l3.414 11.023c.094.305.375.516.695.516h.047c.32-.016.594-.25.664-.562l2.391-10.43 3.641-.117c.281-.008.523-.195.6-.469l.391-1.578c.039-.148.016-.305-.062-.43zM15.422 2.898c-.164-.164-.391-.258-.625-.258s-.461.094-.625.258l-1.68 1.68 2.93 2.93 1.68-1.68c.344-.344.344-.906 0-1.25l-2.3-1.68z" />
      </svg>
    ),
  },
  {
    id: 'shopify-theme',
    name: 'Shopify Theme Development',
    category: 'Theme Architecture',
    tag: 'OS 2.0',
    accentBg: 'bg-teal-500/10 dark:bg-teal-500/15',
    accentText: 'text-teal-700 dark:text-teal-300',
    accentBorder: 'border-teal-500/30',
    icon: <Palette className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  },
  {
    id: 'shopify-liquid',
    name: 'Shopify Liquid',
    category: 'Templating Engine',
    tag: 'Custom Logic',
    accentBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    accentText: 'text-emerald-700 dark:text-emerald-300',
    accentBorder: 'border-emerald-500/30',
    icon: <Droplet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Core Language',
    tag: 'ES6+ / Async',
    accentBg: 'bg-amber-500/10 dark:bg-amber-500/15',
    accentText: 'text-amber-700 dark:text-amber-300',
    accentBorder: 'border-amber-500/30',
    icon: (
      <div className="w-5 h-5 rounded bg-[#F7DF1E] text-black font-extrabold flex items-center justify-center text-[10px] leading-none shadow-xs">
        JS
      </div>
    ),
  },
  {
    id: 'react-js',
    name: 'React.js',
    category: 'Frontend Library',
    tag: 'Hooks & SPA',
    accentBg: 'bg-sky-500/10 dark:bg-sky-500/15',
    accentText: 'text-sky-700 dark:text-sky-300',
    accentBorder: 'border-sky-500/30',
    icon: <Atom className="w-5 h-5 text-[#00D8FF] animate-spin-slow" />,
  },
  {
    id: 'python-django',
    name: 'Python & Django',
    category: 'Backend & Web Framework',
    tag: 'DRF & APIs',
    accentBg: 'bg-blue-500/10 dark:bg-blue-500/15',
    accentText: 'text-blue-700 dark:text-blue-300',
    accentBorder: 'border-blue-500/30',
    icon: <Terminal className="w-5 h-5 text-[#3776AB] dark:text-[#5294d4]" />,
  },
  {
    id: 'html5-css3',
    name: 'HTML5 & CSS3',
    category: 'Markup & Styling',
    tag: 'Semantic & BEM',
    accentBg: 'bg-orange-500/10 dark:bg-orange-500/15',
    accentText: 'text-orange-700 dark:text-orange-300',
    accentBorder: 'border-orange-500/30',
    icon: <Code2 className="w-5 h-5 text-[#E34F26]" />,
  },
  {
    id: 'rest-api',
    name: 'REST API Integration',
    category: 'Data & Networking',
    tag: 'Webhooks & Auth',
    accentBg: 'bg-purple-500/10 dark:bg-purple-500/15',
    accentText: 'text-purple-700 dark:text-purple-300',
    accentBorder: 'border-purple-500/30',
    icon: <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL & Database Management',
    category: 'Relational DB',
    tag: 'SQL & ORM',
    accentBg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    accentText: 'text-indigo-700 dark:text-indigo-300',
    accentBorder: 'border-indigo-500/30',
    icon: <Database className="w-5 h-5 text-[#336791] dark:text-[#5c98cf]" />,
  },
  {
    id: 'responsive-web',
    name: 'Responsive Web Development',
    category: 'UI/UX Engineering',
    tag: 'Mobile-First',
    accentBg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    accentText: 'text-cyan-700 dark:text-cyan-300',
    accentBorder: 'border-cyan-500/30',
    icon: <Smartphone className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
  },
];

// Bottom Row Skills (9 skills)
const row2Skills: SkillItem[] = [
  {
    id: 'ecommerce-dev',
    name: 'E-commerce Development',
    category: 'Store Architecture',
    tag: 'Conversions & Sales',
    accentBg: 'bg-rose-500/10 dark:bg-rose-500/15',
    accentText: 'text-rose-700 dark:text-rose-300',
    accentBorder: 'border-rose-500/30',
    icon: <Store className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
  },
  {
    id: 'frontend-dev',
    name: 'Frontend Development',
    category: 'Client Side',
    tag: 'Interactive UI',
    accentBg: 'bg-violet-500/10 dark:bg-violet-500/15',
    accentText: 'text-violet-700 dark:text-violet-300',
    accentBorder: 'border-violet-500/30',
    icon: <Layout className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
  },
  {
    id: 'backend-dev',
    name: 'Backend Development',
    category: 'Server Side',
    tag: 'Architecture & Scale',
    accentBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    accentText: 'text-emerald-700 dark:text-emerald-300',
    accentBorder: 'border-emerald-500/30',
    icon: <Server className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
  },
  {
    id: 'seo-optimization',
    name: 'SEO & Website Optimization',
    category: 'Performance',
    tag: 'Core Web Vitals',
    accentBg: 'bg-amber-500/10 dark:bg-amber-500/15',
    accentText: 'text-amber-700 dark:text-amber-300',
    accentBorder: 'border-amber-500/30',
    icon: <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
  },
  {
    id: 'git-github',
    name: 'Git & GitHub',
    category: 'Version Control',
    tag: 'CI/CD & Branching',
    accentBg: 'bg-orange-500/10 dark:bg-orange-500/15',
    accentText: 'text-orange-700 dark:text-orange-300',
    accentBorder: 'border-orange-500/30',
    icon: <GitBranch className="w-5 h-5 text-[#F05032]" />,
  },
  {
    id: 'team-leadership',
    name: 'Team Leadership',
    category: 'Collaboration',
    tag: 'Mentorship & Agile',
    accentBg: 'bg-yellow-500/10 dark:bg-yellow-500/15',
    accentText: 'text-yellow-700 dark:text-yellow-300',
    accentBorder: 'border-yellow-500/30',
    icon: <Users className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
  },
  {
    id: 'client-comm',
    name: 'Client Communication',
    category: 'Soft Skills',
    tag: 'Clear & Global',
    accentBg: 'bg-sky-500/10 dark:bg-sky-500/15',
    accentText: 'text-sky-700 dark:text-sky-300',
    accentBorder: 'border-sky-500/30',
    icon: <MessageSquare className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
  },
  {
    id: 'problem-solving',
    name: 'Problem Solving',
    category: 'Analytical Thinking',
    tag: 'Root Cause & Fixes',
    accentBg: 'bg-fuchsia-500/10 dark:bg-fuchsia-500/15',
    accentText: 'text-fuchsia-700 dark:text-fuchsia-300',
    accentBorder: 'border-fuchsia-500/30',
    icon: <Lightbulb className="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-400" />,
  },
  {
    id: 'project-management',
    name: 'Project & Data Management',
    category: 'Delivery & Flow',
    tag: 'Deadlines & Accuracy',
    accentBg: 'bg-blue-500/10 dark:bg-blue-500/15',
    accentText: 'text-blue-700 dark:text-blue-300',
    accentBorder: 'border-blue-500/30',
    icon: <FolderKanban className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
  },
];

export const CoreSkillsSection: React.FC = () => {
  return (
    <section id="core-skills" className="py-20 relative overflow-hidden bg-slate-50/80 dark:bg-zinc-950 border-t border-b border-slate-200/80 dark:border-zinc-800/80">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-sky-500/5 dark:bg-sky-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CORE COMPETENCIES & STACK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Core <span className="gradient-text">Skills & Technologies</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400">
            A comprehensive spectrum of modern e-commerce engineering, robust full-stack languages, and professional delivery disciplines.
          </p>
        </div>
      </div>

      {/* Dual Infinite Scroll Ticker Container */}
      <div className="mt-10 space-y-5 relative pause-on-hover">
        {/* Left & Right Gradient Vignette Overlays for seamless edge fade */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 dark:from-zinc-950 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 dark:from-zinc-950 to-transparent z-20 pointer-events-none" />

        {/* Row 1: Left to Right Marquee */}
        <div className="overflow-hidden flex">
          <div className="animate-marquee-left flex gap-4 pr-4">
            {/* Render 2 duplicates for smooth infinite seamless wrap */}
            {[...row1Skills, ...row1Skills].map((skill, idx) => (
              <div
                key={`${skill.id}-row1-${idx}`}
                className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-white dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-200 select-none group flex-shrink-0 cursor-default"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center p-2 ${skill.accentBg} ${skill.accentBorder} border shadow-xs transition-transform group-hover:scale-110 flex-shrink-0`}
                >
                  {skill.icon}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                      {skill.name}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${skill.accentBg} ${skill.accentText} border ${skill.accentBorder} whitespace-nowrap`}>
                      {skill.tag}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium whitespace-nowrap">
                    {skill.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Right to Left (Opposite Direction) Marquee */}
        <div className="overflow-hidden flex">
          <div className="animate-marquee-right flex gap-4 pr-4">
            {/* Render 2 duplicates for smooth infinite seamless wrap */}
            {[...row2Skills, ...row2Skills].map((skill, idx) => (
              <div
                key={`${skill.id}-row2-${idx}`}
                className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-white dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-200 select-none group flex-shrink-0 cursor-default"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center p-2 ${skill.accentBg} ${skill.accentBorder} border shadow-xs transition-transform group-hover:scale-110 flex-shrink-0`}
                >
                  {skill.icon}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                      {skill.name}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${skill.accentBg} ${skill.accentText} border ${skill.accentBorder} whitespace-nowrap`}>
                      {skill.tag}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium whitespace-nowrap">
                    {skill.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
