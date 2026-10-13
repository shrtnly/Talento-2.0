import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

interface BookingPageProps {
  onBack: () => void;
}

export function BookingPage({ onBack }: BookingPageProps) {
  useEffect(() => {
    // Load Calendly widget script if not already loaded
    if (!window.Calendly) {
      const script = document.createElement('script');
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Initialize Calendly inline widget
    if (window.Calendly) {
      window.Calendly.initInlineWidget({
        url: 'https://calendly.com/your-username/30min',
        parentElement: document.getElementById('calendly-container'),
        prefill: {},
        utm: {}
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F4EC] dark:bg-[#0A1A30] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center text-[#7A5F2E] dark:text-[#C2A26B] hover:underline transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <ThemeToggle />
        </div>
        
        <div className="bg-white dark:bg-[#1C2B44] border border-[#B9C2CE]/30 dark:border-[#B9C2CE]/10 rounded-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold font-heading text-[#0A1A30] dark:text-white mb-6">Schedule a Consultation</h1>
          <div id="calendly-container" style={{ minHeight: '700px' }}></div>
        </div>
      </div>
    </div>
  );
}