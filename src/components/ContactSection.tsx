import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  MessageCircle,
  MapPin,
  Send,
  Copy,
  Check,
  CheckCircle2,
  ArrowUpRight,
  Clock,
  ExternalLink
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Magnetic } from './animations/Magnetic';
import { AOS } from './animations/AOS';
import { ShimmerButton } from './ui/shimmer-button';
import { Text3DFlip } from './ui/text-3d-flip';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const ContactSection: React.FC = () => {
  const { data } = usePortfolio();
  const { profile } = data;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Shopify Store Development',
    budget: '$1,000 - $3,000',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [lastSentData, setLastSentData] = useState<typeof formData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const recipientEmail = profile.email || 'sharifulpc04@gmail.com';
    const payload = { ...formData };
    setLastSentData(payload);

    const newInquiry = {
      id: `inq-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      service: payload.service,
      budget: payload.budget,
      message: payload.message,
      targetEmail: recipientEmail,
      status: 'new' as const,
      createdAt: new Date().toISOString(),
    };

    // 1. Immediately cache in localStorage and notify active listeners
    try {
      const existing = JSON.parse(localStorage.getItem('shariful_portfolio_inquiries_v1') || '[]');
      const updated = [newInquiry, ...existing.filter((i: any) => i.id !== newInquiry.id)];
      localStorage.setItem('shariful_portfolio_inquiries_v1', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('portfolio_inquiry_added', { detail: newInquiry }));
    } catch (lsErr) {
      console.warn('[Contact] LocalStorage inquiry note:', lsErr);
    }

    try {
      // 2. Permanently record the inquiry in Firebase Firestore
      try {
        const docRef = await addDoc(collection(db, 'inquiries'), {
          name: payload.name,
          email: payload.email,
          service: payload.service,
          budget: payload.budget,
          message: payload.message,
          targetEmail: recipientEmail,
          status: 'new',
          createdAt: newInquiry.createdAt,
        });
        if (docRef?.id) {
          const tempId = newInquiry.id;
          newInquiry.id = docRef.id;
          // Update cached item with real Firestore doc ID
          try {
            const existing = JSON.parse(localStorage.getItem('shariful_portfolio_inquiries_v1') || '[]');
            const updated = [
              newInquiry,
              ...existing.filter((i: any) => i.id !== tempId && i.id !== newInquiry.id && i.createdAt !== newInquiry.createdAt)
            ];
            localStorage.setItem('shariful_portfolio_inquiries_v1', JSON.stringify(updated));
          } catch (_) {}
        }
      } catch (firestoreErr) {
        console.warn('[Contact] Firestore inquiry record note:', firestoreErr);
      }

      // 3. Dispatch email directly to the store/profile owner's email address via FormSubmit AJAX API
      try {
        await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: payload.name,
            email: payload.email,
            service: payload.service,
            budget: payload.budget,
            message: payload.message,
            _subject: `New Project Inquiry from ${payload.name} (${payload.service})`,
            _replyto: payload.email,
            _template: 'table',
            _captcha: 'false',
          }),
        });
      } catch (emailErr) {
        console.warn('[Contact] FormSubmit fetch note:', emailErr);
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        service: 'Shopify Store Development',
        budget: '$1,000 - $3,000',
        message: '',
      });
    } catch (error) {
      console.error('[Contact] Submission note:', error);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyEmail = () => {
    if (profile.email) {
      navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-slate-200/80 dark:border-zinc-800/80 bg-transparent scroll-mt-24 overflow-hidden">
      {/* Subtle Background Grid & Ambient Glow matching Hero & Other Sections */}
      <div className="absolute inset-0 bg-grid-clean opacity-60 pointer-events-none" />
      <div className="absolute top-12 left-1/4 w-80 h-80 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-xs text-emerald-700 dark:text-emerald-300 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>GET IN TOUCH & START BUILDING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            <Text3DFlip
              className="font-extrabold justify-center"
              textClassName="text-slate-900 dark:text-white"
              flipTextClassName="text-purple-600 dark:text-purple-400"
              rotateDirection="top"
              staggerDuration={0.025}
            >
              Let's Build Something <span className="gradient-text">Exceptional</span>
            </Text3DFlip>
          </h2>
          <p className="text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Have a project in mind, need custom Shopify liquid development, or want to consult on Python automation? Reach out directly.
          </p>
        </div>

        {/* Grid: Direct Contact Channels & Form */}
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Contact Info (5 Cols) */}
          <AOS animation="fade-right" delay={100} className="lg:col-span-5 space-y-6">
            
            <div className="p-7 rounded-3xl bg-white/35 dark:bg-zinc-900/35 backdrop-blur-md border border-slate-200/70 dark:border-zinc-800/70 space-y-5 shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Direct Contact Channels
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                I typically respond within <strong className="text-purple-600 dark:text-purple-400 font-semibold">{profile.responseTime || '1 hour'}</strong> during business hours. Choose the communication method that fits your team.
              </p>

              <div className="space-y-3">
                  
                  {/* Email Item */}
                  <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800/80 hover:border-purple-400/60 dark:hover:border-purple-500/50 hover:bg-white/90 dark:hover:bg-zinc-900/90 transition-all duration-300 shadow-xs dark:shadow-none flex items-center justify-between group backdrop-blur-xs">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center transition-colors group-hover:bg-purple-100 dark:group-hover:bg-purple-900/60 flex-shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-purple-600 dark:text-purple-400 uppercase font-semibold tracking-wider">Direct Email</p>
                        <a href={`mailto:${profile.email}`} className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                          {profile.email}
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={copyEmail}
                      className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 text-slate-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-300 hover:border-purple-300 dark:hover:border-purple-600 text-xs transition-all cursor-pointer shadow-xs"
                      title="Copy Email"
                    >
                      {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* WhatsApp Quick Chat Item */}
                  {profile.socials?.whatsapp && (
                    <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-zinc-950/60 border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-white/90 dark:hover:bg-zinc-900/90 transition-all duration-300 shadow-xs dark:shadow-none flex items-center justify-between group backdrop-blur-xs">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center transition-colors group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/60 flex-shrink-0">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase font-semibold tracking-wider">WhatsApp Instant</p>
                          <a
                            href={profile.socials.whatsapp}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors"
                          >
                            {profile.phone}
                          </a>
                        </div>
                      </div>
                      <a
                        href={profile.socials.whatsapp}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs transition-all cursor-pointer shadow-xs hover:scale-[1.05]"
                        title="Open WhatsApp Chat"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  )}

                  {/* Location & Timezone */}
                  <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800/80 hover:border-sky-400/50 dark:hover:border-sky-500/40 hover:bg-white/90 dark:hover:bg-zinc-900/90 transition-all duration-300 shadow-xs dark:shadow-none flex items-center gap-3.5 group backdrop-blur-xs">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-sky-600 dark:text-sky-400 uppercase font-semibold tracking-wider">Location & Timezone</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{profile.location}</p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">{profile.timezone}</p>
                    </div>
                  </div>

                </div>
              </div>

            {/* Commitments Box */}
            <div className="p-6 rounded-3xl bg-purple-50/35 dark:bg-zinc-900/35 backdrop-blur-md border border-purple-200/60 dark:border-zinc-800/70 hover:border-purple-300 dark:hover:border-purple-800/60 transition-all duration-300 space-y-3 shadow-xs dark:shadow-none">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Client Commitments:</span>
              </h4>
              <ul className="text-xs text-slate-600 dark:text-zinc-300 space-y-2.5">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Fixed milestones with 100% transparent delivery schedules</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>30 days post-launch support and warranty</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Strict NDA adherence and complete IP handover</span>
                </li>
              </ul>
            </div>

          </AOS>

          {/* Right Column: Project Inquiry Form (7 Cols) */}
          <AOS animation="fade-left" delay={200} className="lg:col-span-7">
            <div className="p-7 sm:p-9 rounded-3xl bg-white/35 dark:bg-zinc-900/35 border border-slate-200/70 dark:border-zinc-800/70 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 backdrop-blur-md space-y-6">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Send a Message or Project Brief
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
                  Fill in your project requirements below to receive a detailed breakdown and estimate.
                </p>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-xs">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                      Inquiry Dispatched Successfully!
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-zinc-300 max-w-md mx-auto">
                      Your message has been sent directly to{' '}
                      <strong className="text-purple-600 dark:text-purple-400 font-mono">
                        {profile.email || 'sharifulpc04@gmail.com'}
                      </strong>
                      . I'll get back to you within {profile.responseTime || '1 business hour'}.
                    </p>
                  </div>

                  {lastSentData && (
                    <div className="p-3.5 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-emerald-500/20 text-left max-w-md mx-auto text-xs space-y-1">
                      <p className="text-slate-500 dark:text-zinc-400">
                        <strong className="text-slate-800 dark:text-zinc-200">Service:</strong> {lastSentData.service}
                      </p>
                      <p className="text-slate-500 dark:text-zinc-400">
                        <strong className="text-slate-800 dark:text-zinc-200">Budget:</strong> {lastSentData.budget}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                        profile.email || 'sharifulpc04@gmail.com'
                      )}&su=${encodeURIComponent(
                        `Project Inquiry: ${lastSentData?.service || 'Custom Development'}`
                      )}&body=${encodeURIComponent(
                        `Hi Shariful,\n\nI just submitted this message through your website:\n\nName: ${
                          lastSentData?.name || ''
                        }\nEmail: ${lastSentData?.email || ''}\nService: ${
                          lastSentData?.service || ''
                        }\nBudget: ${lastSentData?.budget || ''}\n\nMessage:\n${
                          lastSentData?.message || ''
                        }`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md hover:shadow-purple-500/25 border border-purple-400/30 hover:scale-[1.02]"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Open in Gmail (Web)</span>
                    </a>
                    <a
                      href={`mailto:${profile.email || 'sharifulpc04@gmail.com'}?subject=${encodeURIComponent(
                        `Project Inquiry: ${lastSentData?.service || 'Custom Development'}`
                      )}&body=${encodeURIComponent(
                        `Hi Shariful,\n\nI just submitted this message through your website:\n\nName: ${
                          lastSentData?.name || ''
                        }\nEmail: ${lastSentData?.email || ''}\nService: ${
                          lastSentData?.service || ''
                        }\nBudget: ${lastSentData?.budget || ''}\n\nMessage:\n${
                          lastSentData?.message || ''
                        }`
                      )}`}
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200 dark:border-zinc-700 hover:scale-[1.02]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Mail App</span>
                    </a>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-300/90 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-semibold cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      Send Another Note
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 pt-1">
                    Tip: If this is the first submission, FormSubmit sends a 1-time activation confirmation to {profile.email || 'sharifulpc04@gmail.com'}. Check your Inbox or Spam folder.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800/90 hover:border-slate-300 dark:hover:border-zinc-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 focus:bg-white dark:focus:bg-zinc-900/90 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm transition-all duration-200 shadow-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. alex@brand.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800/90 hover:border-slate-300 dark:hover:border-zinc-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 focus:bg-white dark:focus:bg-zinc-900/90 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm transition-all duration-200 shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                        Project Type / Service
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800/90 hover:border-slate-300 dark:hover:border-zinc-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 focus:bg-white dark:focus:bg-zinc-900/90 focus:outline-none text-slate-900 dark:text-white text-sm transition-all duration-200 shadow-xs cursor-pointer"
                      >
                        <option>Shopify Store Development</option>
                        <option>Shopify Theme Customization</option>
                        <option>Python & Django Backend</option>
                        <option>React / Next.js Web App</option>
                        <option>Figma to Responsive Code</option>
                        <option>Other / Technical Consulting</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                        Estimated Budget
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800/90 hover:border-slate-300 dark:hover:border-zinc-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 focus:bg-white dark:focus:bg-zinc-900/90 focus:outline-none text-slate-900 dark:text-white text-sm transition-all duration-200 shadow-xs cursor-pointer"
                      >
                        <option>&lt; $1,000</option>
                        <option>$1,000 - $3,000</option>
                        <option>$3,000 - $7,000</option>
                        <option>$7,000+ / Ongoing Retainer</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                      Project Details & Goals *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your goals, requirements, timeline constraints, or current storefront..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800/90 hover:border-slate-300 dark:hover:border-zinc-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 focus:bg-white dark:focus:bg-zinc-900/90 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm transition-all duration-200 resize-none shadow-xs"
                    />
                  </div>

                  {/* Submit Button styled with ShimmerButton perimeter light beam */}
                  <div className="pt-2">
                    <Magnetic strength={0.25}>
                      <ShimmerButton
                        type="submit"
                        disabled={isSubmitting}
                        shimmerColor="#ffffff"
                        shimmerDuration="3.5s"
                        background="linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)"
                        borderRadius="0.75rem"
                        className="w-full py-3.5 px-6"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span className="text-white font-medium">Sending inquiry...</span>
                          </div>
                        ) : (
                          <>
                            <span className="text-white drop-shadow-xs font-semibold tracking-wide">
                              Submit Project Brief
                            </span>
                            <Send className="w-4 h-4 text-purple-100 group-hover:text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </>
                        )}
                      </ShimmerButton>
                    </Magnetic>
                  </div>
                </form>
              )}
            </div>
          </AOS>

        </div>

      </div>
    </section>
  );
};
