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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center text-talento-600 dark:text-talento-400 hover:text-talento-700 dark:hover:text-talento-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <ThemeToggle />
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold font-heading text-gray-900 dark:text-white mb-6">Schedule a Consultation</h1>
          <div id="calendly-container" style={{ minHeight: '700px' }}></div>
        </div>
      </div>
    </div>
  );
}