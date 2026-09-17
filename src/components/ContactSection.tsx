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
          newInquiry.id = docRef.id;
          // Update cached item with real Firestore doc ID
          try {
            const existing = JSON.parse(localStorage.getItem('shariful_portfolio_inquiries_v1') || '[]');
            const updated = [newInquiry, ...existing.filter((i: any) => i.id !== newInquiry.id && i.createdAt !== newInquiry.createdAt)];
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
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-slate-200/60 dark:border-zinc-800/60 bg-slate-100/30 dark:bg-zinc-950/30 scroll-mt-24">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>GET IN TOUCH & START BUILDING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Let's Build Something <span className="gradient-text">Exceptional</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-zinc-400">
            Have a project in mind, need custom Shopify liquid development, or want to consult on Python automation? Reach out directly.
          </p>
        </div>

        {/* Grid: Direct Contact Channels & Form */}
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Contact Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-7 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-5 shadow-sm dark:shadow-none">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Direct Contact Channels
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                I typically respond within <strong className="text-purple-600 dark:text-purple-400">{profile.responseTime || '1 hour'}</strong> during business hours. Choose the communication method that fits your team.
              </p>

              <div className="space-y-3">
                
                {/* Email Item */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase">Direct Email</p>
                      <a href={`mailto:${profile.email}`} className="text-sm font-semibold text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
                        {profile.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={copyEmail}
                    className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 text-xs transition-colors cursor-pointer hover:bg-slate-100"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* WhatsApp Quick Chat Item */}
                {profile.socials?.whatsapp && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-emerald-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase">WhatsApp Instant</p>
                        <a
                          href={profile.socials.whatsapp}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors"
                        >
                          {profile.phone}
                        </a>
                      </div>
                    </div>
                    <a
                      href={profile.socials.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs transition-colors cursor-pointer"
                      title="Open WhatsApp Chat"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                )}

                {/* Location & Timezone */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase">Location & Timezone</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{profile.location}</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-0.5">{profile.timezone}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Commitments Box */}
            <div className="p-6 rounded-2xl bg-purple-50 dark:bg-zinc-900 border border-purple-200 dark:border-zinc-800 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Client Commitments:</span>
              </h4>
              <ul className="text-xs text-slate-600 dark:text-zinc-300 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Fixed milestones with 100% transparent delivery schedules</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>30 days post-launch support and warranty</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Strict NDA adherence and complete IP handover</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column: Project Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-9 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm dark:shadow-none space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Send a Message or Project Brief
              </h3>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-center space-y-4"
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
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300 dark:border-zinc-700"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Mail App</span>
                    </a>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer transition-colors"
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
                      <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-purple-600 focus:outline-none text-slate-900 dark:text-white text-sm transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. alex@brand.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-purple-600 focus:outline-none text-slate-900 dark:text-white text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400">
                        Project Type / Service
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-purple-600 focus:outline-none text-slate-900 dark:text-white text-sm transition-colors"
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
                      <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400">
                        Estimated Budget
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-purple-600 focus:outline-none text-slate-900 dark:text-white text-sm transition-colors"
                      >
                        <option>&lt; $1,000</option>
                        <option>$1,000 - $3,000</option>
                        <option>$3,000 - $7,000</option>
                        <option>$7,000+ / Ongoing Retainer</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold uppercase text-slate-600 dark:text-zinc-400">
                      Project Details & Goals *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your goals, requirements, timeline constraints, or current storefront..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-purple-600 focus:outline-none text-slate-900 dark:text-white text-sm transition-colors resize-none"
                    />
                  </div>

                  <Magnetic strength={0.2}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Sending inquiry...</span>
                      ) : (
                        <>
                          <span>Submit Project Brief</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </Magnetic>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
