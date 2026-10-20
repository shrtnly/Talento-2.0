import React, { useState } from 'react';
import { Mail, Check, Loader } from 'lucide-react';
import { DatabaseService } from '../services/database';

interface NewsletterSectionProps {
  className?: string;
}

export function NewsletterSection({ className = 'my-14 sm:my-16' }: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const trimmed = email.trim();
    if (!trimmed || !/^\S+@\S+\.\S+$/.test(trimmed)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await DatabaseService.subscribeNewsletter(trimmed);
      if (res.success) {
        setIsSuccess(true);
        setEmail('');
      } else {
        setErrorMsg(res.error || 'Unable to subscribe. Please try again.');
      }
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="newsletter-heading" className={className}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0E223D] via-[#0A1A2E] to-[#06101E] text-white p-8 sm:p-12 lg:p-14 border border-[#C2A163]/30 shadow-xl">
          {/* Ambient subtle glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-[#C2A163]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 bg-[#1B3047]/60 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] bg-[#C2A163]/20 text-[#C2A163] border border-[#C2A163]/30 mb-4">
              <Mail className="w-3.5 h-3.5" /> Monthly Executive Briefing
            </span>
            <h2 id="newsletter-heading" className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight text-white">
              Stay ahead of executive hiring and market shifts
            </h2>
            <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-[#B9C2CE]">
              Join CEOs, founders, and people leaders across Asia-Pacific receiving our curated monthly digest of market benchmarks, labour updates, and headhunting perspectives.
            </p>

            {isSuccess ? (
              <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-[#C2A163]/15 border border-[#C2A163]/40 flex items-center justify-center gap-3 text-sm text-[#F7F4EC] animate-in fade-in">
                <span className="w-8 h-8 rounded-full bg-[#C2A163] text-[#08162A] flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 font-bold" />
                </span>
                <div className="text-left">
                  <p className="font-semibold text-white">You're subscribed!</p>
                  <p className="text-xs text-[#B9C2CE]">Thank you for joining. Look out for the next monthly edition in your inbox.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 max-w-lg mx-auto">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email..."
                      aria-label="Email address"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 dark:bg-[#08162A]/80 border border-[#B9C2CE]/30 text-white placeholder-[#718096] text-sm focus:outline-none focus:border-[#C2A163] focus:ring-1 focus:ring-[#C2A163] transition-colors"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-[#C2A163] hover:bg-[#A8874F] active:scale-95 text-[#08162A] font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      'Subscribe Free'
                    )}
                  </button>
                </div>
                {errorMsg && (
                  <p className="mt-2 text-xs text-[#F87171] text-left">{errorMsg}</p>
                )}
                <p className="mt-3 text-[11px] text-[#718096] flex items-center justify-center gap-1.5">
                  <span>✦ Delivered once a month</span>
                  <span>·</span>
                  <span>Strictly confidential</span>
                  <span>·</span>
                  <span>One-click unsubscribe</span>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
