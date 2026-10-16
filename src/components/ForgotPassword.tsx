import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { DatabaseService } from '../services/database';
import ThemeToggle from './ThemeToggle';

interface ForgotPasswordProps {
  onBack: () => void;
  onBackToHome: () => void;
}

export function ForgotPassword({ onBack, onBackToHome }: ForgotPasswordProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get('email') as string;

    try {
      const result = await DatabaseService.resetPasswordForEmail(email);
      if (result.success) {
        setSuccess('Password reset email sent! Please check your inbox and follow the instructions.');
        form.reset();
      } else {
        setError(result.error || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EC] dark:bg-[#0A1A30] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img src="/logo.png?v=2" alt="TALENTO" className="mx-auto h-20 sm:h-24 w-auto object-contain rounded-xl shadow-md" />
          <h2 className="mt-6 text-3xl font-bold font-heading text-[#0A1A30] dark:text-white">Reset your password</h2>
          <p className="mt-2 text-sm text-[#4A5568] dark:text-[#B9C2CE]">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1C2B44] rounded-2xl shadow-xl border border-[#B9C2CE]/30 dark:border-[#B9C2CE]/10 p-8 transition-colors">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0A1A30] dark:text-[#B9C2CE] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#9AA5B4]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-[#B9C2CE]/50 dark:border-[#2B3D5C] rounded-xl focus:ring-2 focus:ring-[#C2A26B] focus:border-transparent transition-all duration-200 bg-[#F7F4EC]/40 dark:bg-[#0A1A30] text-[#0A1A30] dark:text-white"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {error && (
              <div className="bg-[#A23B3B]/10 border border-[#A23B3B] rounded-xl p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-[#A23B3B] mr-2 flex-shrink-0" />
                  <p className="text-[#A23B3B] text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-[#2F6B4F]/10 border border-[#2F6B4F] rounded-xl p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#2F6B4F] mr-2 flex-shrink-0" />
                  <p className="text-[#2F6B4F] text-sm font-medium">{success}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 text-sm font-semibold rounded-xl text-[#0A1A30] bg-[#C2A26B] hover:bg-[#A8874F] focus:outline-none focus:ring-2 focus:ring-[#C2A26B] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Sending reset email...
                  </>
                ) : (
                  'Send reset email'
                )}
              </button>

              <button
                type="button"
                onClick={onBack}
                className="group relative w-full flex justify-center py-3 px-4 border border-[#B9C2CE]/50 dark:border-[#2B3D5C] text-sm font-semibold rounded-xl text-[#0A1A30] dark:text-[#B9C2CE] bg-white dark:bg-[#1C2B44] hover:bg-[#F7F4EC] dark:hover:bg-[#0A1A30] focus:outline-none transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to sign in
              </button>

              <button
                type="button"
                onClick={onBackToHome}
                className="group relative w-full flex justify-center py-3 px-4 border border-[#B9C2CE]/50 dark:border-[#2B3D5C] text-sm font-semibold rounded-xl text-[#0A1A30] dark:text-[#B9C2CE] bg-white dark:bg-[#1C2B44] hover:bg-[#F7F4EC] dark:hover:bg-[#0A1A30] focus:outline-none transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}