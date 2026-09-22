import React from 'react';
import { motion } from 'motion/react';
import {
  User,
  ArrowUpRight,
  Briefcase,
  Award,
  Zap,
  Globe
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { AnimatedCounter } from './animations/AnimatedCounter';
import { TiltCard } from './animations/TiltCard';
import { Magnetic } from './animations/Magnetic';
import { AOS } from './animations/AOS';
import { Text3DFlip } from './ui/text-3d-flip';
import sharifulFull from '../assets/myhero2.jpg';
import sharifulAlt from '../assets/myhero.jpg';

export const AboutSection: React.FC<{ onContactClick: () => void }> = ({ onContactClick }) => {
  const { data } = usePortfolio();
  const { profile, workTimeline, achievements } = data;

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-slate-200/80 dark:border-zinc-800/80 bg-transparent scroll-mt-24">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800/60 bg-purple-50/80 dark:bg-purple-950/60 backdrop-blur-xs text-purple-700 dark:text-purple-300 text-xs font-mono">
            <User className="w-3.5 h-3.5" />
            <span>BACKGROUND & EXPERIENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            <Text3DFlip
              className="font-extrabold justify-center"
              textClassName="text-slate-900 dark:text-white"
              flipTextClassName="text-purple-600 dark:text-purple-400"
              rotateDirection="top"
              staggerDuration={0.025}
            >
              Engineering High-Impact <span className="gradient-text">Digital Solutions</span>
            </Text3DFlip>
          </h2>
          <p className="text-base text-slate-600 dark:text-zinc-400">
            A look into my background, engineering philosophy, and hands-on milestones across e-commerce and full-stack software development.
          </p>
        </div>

        {/* Narrative & Visual Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Portrait & Stats (5 Cols) */}
          <AOS animation="fade-right" duration={650} className="lg:col-span-5 space-y-4">
            <TiltCard maxTilt={6} scale={1.02} glare={true} className="rounded-3xl">
              <div className="rounded-3xl overflow-hidden border border-slate-200/70 dark:border-zinc-800/70 bg-white/35 dark:bg-zinc-900/35 backdrop-blur-md p-2.5 shadow-md shadow-slate-900/5 dark:shadow-2xl">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-950 relative border border-slate-200/80 dark:border-zinc-800">
                  <img
                    src={profile.aboutImage && profile.aboutImage.trim().length > 0 ? profile.aboutImage : (sharifulFull || sharifulAlt)}
                    alt={`${profile.name} - Senior Full-Stack Engineer and Shopify Expert`}
                    width={400}
                    height={500}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover filter brightness-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = sharifulAlt;
                    }}
                  />
                  
                  {/* Overlay Badge */}
                  <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-white/95 dark:bg-zinc-900/90 backdrop-blur-md border border-slate-200/90 dark:border-zinc-700/80 shadow-xs space-y-0.5">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{profile.name}</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-mono font-semibold">{profile.role}</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{profile.location}</p>
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* Quick Stat Blocks with AnimatedCounter */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white/35 dark:bg-zinc-900/35 backdrop-blur-md border border-slate-200/70 dark:border-zinc-800/70 shadow-xs text-center hover:border-purple-300 dark:hover:border-purple-600 transition-all">
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center">
                  <AnimatedCounter value="150" suffix="+" />
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">Projects Delivered</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/35 dark:bg-zinc-900/35 backdrop-blur-md border border-slate-200/70 dark:border-zinc-800/70 shadow-xs text-center hover:border-emerald-300 dark:hover:border-emerald-600 transition-all">
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <AnimatedCounter value="99" suffix="%" />
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">Client Satisfaction</p>
              </div>
            </div>
          </AOS>

          {/* Right Column: Bio Narrative & Pillars (7 Cols) */}
          <AOS animation="fade-left" duration={650} className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Focused on clean architecture, lightning store speed, and scalable workflows.
              </h3>
              <p className="text-sm sm:text-base text-slate-700 dark:text-zinc-300 leading-relaxed">
                {profile.bio}
              </p>
              <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
                Whether creating bespoke Liquid themes for high-growth Shopify brands, building Python & Django automated endpoints, or crafting responsive React web interfaces, I bring technical precision and business-focused thinking to every deliverable.
              </p>
            </div>

            {/* Value Pillars */}
            <div className="grid sm:grid-cols-2 gap-4 pt-1">
              <AOS animation="zoom-in" delay={150} className="p-5 rounded-2xl bg-white/35 dark:bg-zinc-900/35 backdrop-blur-md border border-slate-200/70 dark:border-zinc-800/70 space-y-2 shadow-xs hover:border-purple-300 dark:hover:border-purple-500/50 transition-all">
                <div className="p-2 rounded-xl bg-purple-50/80 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60 w-fit">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Store Speed & Conversion</h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Sub-second page speeds, mobile-first responsiveness, and conversion-optimized checkout funnels.
                </p>
              </AOS>

              <AOS animation="zoom-in" delay={300} className="p-5 rounded-2xl bg-white/35 dark:bg-zinc-900/35 backdrop-blur-md border border-slate-200/70 dark:border-zinc-800/70 space-y-2 shadow-xs hover:border-sky-300 dark:hover:border-sky-500/50 transition-all">
                <div className="p-2 rounded-xl bg-sky-50/80 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60 w-fit">
                  <Globe className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">International Standards</h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Proven experience working with founders across North America, Europe, Australia, and Asia.
                </p>
              </AOS>
            </div>

            {/* CTA with Magnetic */}
            <div className="pt-2 flex items-center gap-4">
              <Magnetic strength={0.3}>
                <button
                  onClick={onContactClick}
                  className="px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold text-sm shadow-md shadow-purple-600/20 hover:shadow-lg hover:shadow-purple-500/30 dark:shadow-purple-900/30 dark:hover:shadow-purple-500/25 border border-purple-400/30 hover:border-purple-300/60 transition-all duration-300 flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Discuss Your Project</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </Magnetic>
            </div>
          </AOS>

        </div>

        {/* Career Timeline Section */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-zinc-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Career Experience</h3>
            <p className="text-sm text-slate-600 dark:text-zinc-400">Engineering history and technical milestones</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {workTimeline.map((item, idx) => (
              <AOS
                key={item.id || idx}
                animation="fade-up"
                delay={idx * 150}
                className="p-6 rounded-2xl bg-white/35 dark:bg-zinc-900/35 backdrop-blur-md border border-slate-200/70 dark:border-zinc-800/70 space-y-3 shadow-xs hover:border-purple-300 dark:hover:border-purple-500/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-50/80 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-300 font-mono text-xs font-semibold">
                    {item.period}
                  </span>
                  <Briefcase className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{item.role}</h4>
                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">{item.company}</p>
                </div>

                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.skills.map((s, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-white/50 dark:bg-zinc-950/60 text-slate-700 dark:text-zinc-400 border border-slate-200/70 dark:border-zinc-800 text-[10px] font-mono"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </AOS>
            ))}
          </div>
        </div>

        {/* Recognitions & Key Accomplishments */}
        <AOS animation="fade-up" className="p-6 sm:p-8 rounded-3xl bg-white/35 dark:bg-zinc-900/35 backdrop-blur-md border border-slate-200/70 dark:border-zinc-800/70 space-y-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50/80 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recognitions & Standards</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Milestones achieved across client engagements</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((ach, idx) => (
              <AOS
                key={idx}
                animation="zoom-in-up"
                delay={idx * 120}
                className="p-4 rounded-xl bg-white/30 dark:bg-zinc-950/40 backdrop-blur-xs border border-slate-200/70 dark:border-zinc-800/70 space-y-1.5 shadow-xs hover:border-purple-400/80 dark:hover:border-purple-500/50 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
              >
                <span className="text-[10px] font-mono uppercase text-purple-600 dark:text-purple-400 font-semibold tracking-wider group-hover:text-purple-500 dark:group-hover:text-purple-300 transition-colors">
                  {ach.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ach.title}</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400">{ach.organization} • {ach.year}</p>
                <p className="text-xs text-slate-600 dark:text-zinc-300 mt-1 leading-relaxed">{ach.description}</p>
              </AOS>
            ))}
          </div>
        </AOS>

      </div>
    </section>
  );
};
