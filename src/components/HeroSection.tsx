import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  MessageSquare,
  Sparkles,
  MapPin,
  Clock,
  Layers,
  ShoppingBag,
  Code2
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Magnetic } from './animations/Magnetic';
import { TiltCard } from './animations/TiltCard';
import { AnimatedCounter } from './animations/AnimatedCounter';
import sharifulImg from '../assets/onlyshariful1.webp';
import portraitBackup from '../assets/Shariful.jpg';

interface HeroSectionProps {
  onContactClick: () => void;
  onProjectsClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onContactClick, onProjectsClick }) => {
  const { data } = usePortfolio();
  const { profile, stats } = data;

  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Dynamic interactive spotlight ref
  const heroRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Safe fallback headlines
  const headlines = profile.headlines && profile.headlines.length > 0
    ? profile.headlines
    : ["Senior Full-Stack & Shopify Specialist"];

  // Mouse spotlight tracker
  useEffect(() => {
    const heroEl = heroRef.current;
    const spotlightEl = spotlightRef.current;
    if (!heroEl || !spotlightEl) return;

    const hasFinePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
    if (!hasFinePointer) return;

    const xTo = gsap.quickTo(spotlightEl, 'x', { duration: 0.6, ease: 'power2.out' });
    const yTo = gsap.quickTo(spotlightEl, 'y', { duration: 0.6, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = heroEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      xTo(x);
      yTo(y);
      gsap.to(spotlightEl, { opacity: 0.8, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to(spotlightEl, { opacity: 0, duration: 0.5 });
    };

    heroEl.addEventListener('mousemove', handleMouseMove);
    heroEl.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      heroEl.removeEventListener('mousemove', handleMouseMove);
      heroEl.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(spotlightEl);
    };
  }, []);

  // Smooth Typewriter effect
  useEffect(() => {
    const currentHeadline = headlines[headlineIndex % headlines.length];
    const typingSpeed = isDeleting ? 30 : 55;
    const pauseDelay = isDeleting ? 350 : 2000;

    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText === currentHeadline) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDelay);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setHeadlineIndex((prev) => (prev + 1) % headlines.length);
    } else {
      timeout = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting
            ? currentHeadline.substring(0, prev.length - 1)
            : currentHeadline.substring(0, prev.length + 1)
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, headlineIndex, headlines]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[90vh] flex flex-col justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-grid-clean opacity-70 pointer-events-none" />

      {/* Dynamic Cursor Spotlight Effect */}
      <div
        ref={spotlightRef}
        className="absolute top-0 left-0 w-[500px] h-[500px] -ml-[250px] -mt-[250px] rounded-full bg-radial from-purple-500/15 dark:from-purple-500/20 via-sky-500/5 to-transparent blur-3xl pointer-events-none opacity-0 will-change-transform z-0"
      />
      
      {/* Soft Ambient Glows */}
      <div className="absolute top-20 left-1/4 w-80 h-80 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-sky-500/10 dark:bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10 space-y-16">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Clean Hero Copy (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-wrap items-center gap-2.5"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>{profile.badge || "AVAILABLE FOR FREELANCE & CONTRACTS"}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 px-3 py-1 rounded-full border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
                <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>{profile.responseTime ? `Fast ${profile.responseTime} Response` : 'Fast Response'}</span>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 px-3 py-1 rounded-full border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>{profile.timezone || 'Dhaka (UTC+6)'}</span>
              </div>
            </motion.div>

            {/* Main Greeting & Title */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Hi, I'm <span className="gradient-text">{profile.name}</span>
              </h1>

              {/* Clean Typewriter Subtitle */}
              <div className="min-h-[48px] sm:min-h-[56px] flex items-center">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800 dark:text-zinc-200">
                  <span>{displayText}</span>
                  <span className="inline-block w-0.5 h-6 ml-1 bg-purple-600 dark:bg-purple-400 animate-pulse align-middle" />
                </h2>
              </div>
            </motion.div>

            {/* Concise Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-700 dark:text-zinc-300 leading-relaxed max-w-2xl"
            >
              {profile.tagline || profile.bio}
            </motion.p>

            {/* Action Buttons with GSAP Magnetic attraction */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3.5 pt-2"
            >
              <Magnetic strength={0.25}>
                <button
                  onClick={onContactClick}
                  className="px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md hover:shadow-purple-500/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
                >
                  <span>Hire Me / Start Project</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </Magnetic>

              <Magnetic strength={0.25}>
                <button
                  onClick={onProjectsClick}
                  className="px-6 py-3.5 rounded-xl border border-slate-300/90 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>View Portfolio</span>
                </button>
              </Magnetic>

              {profile.socials?.whatsapp && (
                <Magnetic strength={0.35}>
                  <a
                    href={profile.socials.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                    title="WhatsApp Quick Chat"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </a>
                </Magnetic>
              )}
            </motion.div>

            {/* Social Links with GSAP Magnetic */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-2.5 pt-2 text-slate-500 dark:text-zinc-400"
            >
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500 mr-1">
                Social:
              </span>
              {profile.socials?.github && (
                <Magnetic strength={0.4}>
                  <CleanSocialLink href={profile.socials.github} icon={<Github className="w-4 h-4" />} label="GitHub" />
                </Magnetic>
              )}
              {profile.socials?.linkedin && (
                <Magnetic strength={0.4}>
                  <CleanSocialLink href={profile.socials.linkedin} icon={<Linkedin className="w-4 h-4" />} label="LinkedIn" />
                </Magnetic>
              )}
              {profile.socials?.twitter && (
                <Magnetic strength={0.4}>
                  <CleanSocialLink href={profile.socials.twitter} icon={<Twitter className="w-4 h-4" />} label="Twitter" />
                </Magnetic>
              )}
              {profile.socials?.facebook && (
                <Magnetic strength={0.4}>
                  <CleanSocialLink href={profile.socials.facebook} icon={<Facebook className="w-4 h-4" />} label="Facebook" />
                </Magnetic>
              )}
              {profile.socials?.instagram && (
                <Magnetic strength={0.4}>
                  <CleanSocialLink href={profile.socials.instagram} icon={<Instagram className="w-4 h-4" />} label="Instagram" />
                </Magnetic>
              )}
            </motion.div>
          </div>

          {/* Right Column: Clean Profile Showcase Card with 3D TiltCard (5 Cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-sm"
            >
              <TiltCard maxTilt={7} scale={1.02} glare={true} className="rounded-3xl">
                <div className="rounded-3xl p-3 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 shadow-xl shadow-slate-900/5 dark:shadow-2xl space-y-4">
                  
                  {/* Clean Photo Container */}
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-950 relative border border-slate-200/80 dark:border-zinc-800">
                    <img
                      src={profile.heroImage && profile.heroImage.trim().length > 0 ? profile.heroImage : (sharifulImg || portraitBackup)}
                      alt={`${profile.name} - Senior Full-Stack Developer & Shopify Specialist`}
                      className="w-full h-full object-cover object-center filter brightness-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = portraitBackup;
                      }}
                    />
                    
                    {/* Bottom Minimal Info Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/95 dark:bg-zinc-900/90 backdrop-blur-md border border-slate-200/90 dark:border-zinc-700/80 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{profile.name}</p>
                          <p className="text-xs text-purple-600 dark:text-purple-400 font-mono font-semibold line-clamp-1">{profile.role}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 font-mono text-[11px] font-semibold flex-shrink-0">
                          {profile.experienceYears} Yrs Exp
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Capability Tags */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-center transition-colors hover:border-purple-300 dark:hover:border-purple-700">
                      <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center justify-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        <span>Shopify 2.0</span>
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono mt-0.5">Liquid & Themes</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-center transition-colors hover:border-sky-300 dark:hover:border-sky-700">
                      <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center justify-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                        <span>Python/Django</span>
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono mt-0.5">APIs & Backend</p>
                    </div>
                  </div>

                </div>
              </TiltCard>
            </motion.div>
          </div>

        </div>

        {/* Bottom Clean Metric Bar with GSAP Animated Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-8 border-t border-slate-200/80 dark:border-zinc-800"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200/90 dark:border-zinc-800 shadow-xs dark:shadow-none transition-all hover:border-purple-300 dark:hover:border-purple-600 hover:-translate-y-1 duration-300"
              >
                <div className="flex items-baseline gap-0.5">
                  <AnimatedCounter
                    value={item.value}
                    suffix={item.suffix}
                    className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white"
                  />
                </div>
                <p className="mt-1 text-sm font-bold text-slate-800 dark:text-zinc-200">{item.label}</p>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

const CleanSocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    aria-label={label}
    className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-300 hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer shadow-sm block"
    title={label}
  >
    {icon}
  </a>
);

