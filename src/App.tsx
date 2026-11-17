import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  User,
  Building,
  Briefcase,
  Upload,
  FileText,
  Loader,
  AlertCircle,
  Settings,
  LogOut,
  Search,
  ChevronDown,
  Check,
  Sparkles,
  Target,
  Award,
  Clock,
  Scale
} from 'lucide-react';
import { DatabaseService } from './services/database';
import { AuthForm } from './components/AuthForm';
import { ForgotPassword } from './components/ForgotPassword';
import { DashboardPage } from './pages/DashboardPage';
import { CareersPage } from './pages/CareersPage';
import { InsightsPage } from './pages/InsightsPage';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { NewsletterSection } from './components/NewsletterSection';
import ThemeToggle from './components/ThemeToggle'; // Fixed import
import HeroVisual from './components/HeroVisual';
import type { CandidateApplication, ContactForm, AuthUser, UserProfile } from './lib/supabase';

const HOME_FAQS = [
  {
    q: 'What differentiates TALENTO from traditional recruitment agencies?',
    a: 'Unlike high-volume transactional recruitment agencies that rely on passive resume databases and automated keyword matching, TALENTO operates as a bespoke executive search boutique. We engage exclusively in confidential, research-driven headhunting for C-suite, board-level, and mission-critical leadership appointments. Every engagement is led directly by seasoned partners, utilizing discreet direct outreach, proprietary industry mapping, and rigorous behavioral and leadership benchmark assessments.'
  },
  {
    q: 'How does TALENTO handle confidentiality for high-profile executive searches?',
    a: 'Confidentiality is the cornerstone of our practice. Sensitive leadership transitions, confidential replacements, and competitive market expansions are executed under strict Non-Disclosure Agreements (NDAs). Neither client identities nor sensitive strategic mandates are disclosed until a prospective executive has been thoroughly vetted and mutually cleared for discreet briefing. All search intelligence and candidate files are stored within encrypted, access-restricted repositories.'
  },
  {
    q: 'What engagement models do you provide for employers?',
    a: 'TALENTO delivers a bespoke, fully integrated ecosystem of engagement models engineered to orchestrate workforce scalability with surgical precision, strategic agility, and end-to-end regulatory compliance. From orchestrating high-impact C-suite acquisitions via Executive Search, and deploying rapid-response niche talent through On-Demand Talent Acquisition, to de-risking your global expansion as your fully compliant Employer of Record (EOR) and PEO entity in Bangladesh—unified with localized and global Payroll Integration—we serve as the ultimate bridge between local infrastructure and global corporate strategy. We drive operational excellence through scalable HR-as-a-Service (HRaaS) and Turnkey Operations, featuring OKR-aligned lifecycle management, optimized BPO delivery, and Tier-1 Managed Operations & Infrastructure Support. Crucially, every mandate is fortified by our Primary Source Background Verification framework, ensuring uncompromising due diligence, proactive risk mitigation, and ironclad regulatory alignment across your entire human capital supply chain.'
  },
  {
    q: 'Does TALENTO provide cross-border and international recruitment capabilities?',
    a: 'Yes. TALENTO delivers global executive search and cross-border talent acquisition across North America (USA, Canada), the United Kingdom, the European Union, Australia, the Middle East (UAE/Dubai), and key Asia-Pacific markets (including Singapore, Vietnam, Thailand, Malaysia, India, China, and Bangladesh). We partner with multinationals, regional headquarters, and VC/PE-backed scale-ups to source top diaspora talent, appoint expatriate leadership, and assemble high-performing, locally compliant executive teams worldwide.'
  }
];

type ViewType = 'home' | 'auth' | 'forgot-password' | 'dashboard' | 'careers' | 'insights';
const isInsightsPath = (p: string) => /^\/insights(\/|$)/i.test(p);
const slugFromPath = (p: string) => {
  const m = p.match(/^\/insights\/([^/]+)/i);
  return m ? decodeURIComponent(m[1]) : null;
};
function App() {
const [currentView, setCurrentView] = useState<ViewType>(() =>
  typeof window !== 'undefined' && isInsightsPath(window.location.pathname) ? 'insights' : 'home'
);
const [insightSlug, setInsightSlug] = useState<string | null>(() =>
  typeof window !== 'undefined' ? slugFromPath(window.location.pathname) : null
);

const navigateInsights = (path: string) => {
  window.history.pushState({}, '', path);
  setInsightSlug(slugFromPath(path));
  setCurrentView('insights');
  setIsMenuOpen(false);
  window.scrollTo({ top: 0 });
};

useEffect(() => {
  const onPop = () => {
    const p = window.location.pathname;
    if (isInsightsPath(p)) {
      setInsightSlug(slugFromPath(p));
      setCurrentView('insights');
    } else {
      setCurrentView((v) => (v === 'insights' ? 'home' : v));
    }
  };
  window.addEventListener('popstate', onPop);
  return () => window.removeEventListener('popstate', onPop);
}, []);
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [user, setUser] = useState<AuthUser | null>(null);
const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
const [showProfileDropdown, setShowProfileDropdown] = useState(false);
const [initialDashboardEditMode, setInitialDashboardEditMode] = useState(false);
const [isCheckingAuth, setIsCheckingAuth] = useState(true);

// Contact form state
const [contactForm, setContactForm] = useState<ContactForm>({
full_name: '',
email: '',
company: '',
message: ''
});
const [isSubmittingContact, setIsSubmittingContact] = useState(false);
const [contactSuccess, setContactSuccess] = useState(false);
const [contactError, setContactError] = useState('');

// Candidate application state
const [candidateForm, setCandidateForm] = useState<CandidateApplication>({
full_name: '',
citizenship: '',
phone: '',
email: '',
main_role: '',
business_sector: '',
job_title: '',
current_employer: '',
linkedin_url: ''
});
const [cvFile, setCvFile] = useState<File | null>(null);
const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
const [applicationSuccess, setApplicationSuccess] = useState(false);
const [applicationError, setApplicationError] = useState('');
const [openFaq, setOpenFaq] = useState<number | null>(null);

useEffect(() => {
checkUser();
}, []);

useEffect(() => {
const handleClickOutside = (event: MouseEvent) => {
const target = event.target as Element;
if (!target.closest('[data-profile-dropdown]')) {
setShowProfileDropdown(false);
}
};
document.addEventListener('mousedown', handleClickOutside);
return () => {
document.removeEventListener('mousedown', handleClickOutside);
};
}, []);

const checkUser = async () => {
setIsCheckingAuth(true);
try {
const result = await DatabaseService.getCurrentUser();
if (result.success && result.user) {
setUser(result.user);
// Load user profile
const profileResult = await DatabaseService.getProfile(result.user.id);
if (profileResult.success && profileResult.data) {
setUserProfile(profileResult.data);
}
}
} catch (error) {
// Silently handle auth check errors
} finally {
setIsCheckingAuth(false);
}
};


const handleBackFromCareers = () => {
setCurrentView('home');
};

const handleAuthSuccess = () => {
checkUser();
setCurrentView('dashboard');
};

const handleSignOut = () => {
setUser(null);
setUserProfile(null);
setCurrentView('home');
setShowProfileDropdown(false);
};

const handleContactSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setIsSubmittingContact(true);
setContactError('');
try {
const result = await DatabaseService.submitContactForm(contactForm);
if (result.success) {
setContactSuccess(true);
setContactForm({ full_name: '', email: '', company: '', message: '' });
setTimeout(() => setContactSuccess(false), 5000);
} else {
setContactError(result.error || 'Failed to submit contact form');
}
} catch (error) {
setContactError('An unexpected error occurred');
} finally {
setIsSubmittingContact(false);
}
};

const handleCandidateSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setIsSubmittingApplication(true);
setApplicationError('');
try {
let cvData = {};

if (cvFile) {
const uploadResult = await DatabaseService.uploadCV(cvFile, candidateForm.email);
if (uploadResult.success) {
cvData = {
cv_file_path: uploadResult.filePath,
cv_file_name: uploadResult.fileName,
cv_file_size: uploadResult.fileSize,
cv_file_type: uploadResult.fileType
};
} else {
setApplicationError(uploadResult.error || 'Failed to upload CV');
setIsSubmittingApplication(false);
return;
}
}
const applicationData = { ...candidateForm, ...cvData };
const result = await DatabaseService.submitCandidateApplication(applicationData);

if (result.success) {
setApplicationSuccess(true);
setCandidateForm({
full_name: '',
citizenship: '',
phone: '',
email: '',
main_role: '',
business_sector: '',
job_title: '',
current_employer: '',
linkedin_url: ''
});
setCvFile(null);
setTimeout(() => setApplicationSuccess(false), 5000);
} else {
setApplicationError(result.error || 'Failed to submit application');
}
} catch (error) {
setApplicationError('An unexpected error occurred');
} finally {
setIsSubmittingApplication(false);
}
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (file) {
// Validate file type
const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
if (!allowedTypes.includes(file.type)) {
setApplicationError('Please upload a PDF or Word document');
return;
}

// Validate file size (5MB)
if (file.size > 5 * 1024 * 1024) {
setApplicationError('File size must be less than 5MB');
return;
}

setCvFile(file);
setApplicationError('');
}
};

if (isCheckingAuth) {
return (
<div className="min-h-screen bg-[#F7F4EC] dark:bg-[#0A1A30] flex items-center justify-center">
<div className="text-center">
<Loader className="w-8 h-8 animate-spin text-[#C2A26B] mx-auto mb-4" />
<p className="text-[#4A5568] dark:text-[#B9C2CE]">Loading...</p>
</div>
</div>
);
}

if (currentView === 'auth') {
return (
<AuthForm
onSuccess={handleAuthSuccess}
onSwitchToForgotPassword={() => setCurrentView('forgot-password')}
onBack={() => setCurrentView('home')}
/>
);
}

if (currentView === 'forgot-password') {
return (
<ForgotPassword
onBack={() => setCurrentView('auth')}
onBackToHome={() => setCurrentView('home')}
/>
);
}

if (currentView === 'careers') {
return (
<CareersPage onBack={handleBackFromCareers} />
);
}

if (currentView === 'dashboard' && user) {
return (
<DashboardPage
user={user}
initialEditMode={initialDashboardEditMode}
onBack={() => setCurrentView('home')}
onSignOut={handleSignOut}
onProfileUpdate={(updatedProfile: React.SetStateAction<UserProfile | null>) => setUserProfile(updatedProfile)}
/>
);
}

return (
<div
onClick={(e) => {
if (currentView !== 'insights') return;
const h = (e.target as HTMLElement).closest('a')?.getAttribute('href');
if (h && h.startsWith('#')) {
e.preventDefault();
window.history.pushState({}, '', '/' + h);
setCurrentView('home');
setIsMenuOpen(false);
setTimeout(() => document.querySelector(h)?.scrollIntoView(), 50);
}
}}
className="min-h-screen bg-[#F7F4EC] dark:bg-[#08162A] text-[#4A5568] dark:text-[#A9B8CC] transition-colors duration-200">
{/* Navigation */}
<nav className="bg-[#F7F4EC]/95 dark:bg-[#08162A]/90 backdrop-blur-md shadow-sm fixed w-full z-50 transition-colors duration-200 border-b border-[#B9C2CE]/30 dark:border-[#1B3047]">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex justify-between items-center h-20 lg:h-22">
<div className="flex items-center">
<a href="#home" className="inline-block transition-transform hover:scale-[1.02] active:scale-[0.98]">
<img
  src="/logo.png?v=2"
  alt="TALENTO"
  className="h-[62px] sm:h-14 md:h-16 lg:h-16 w-auto object-contain rounded-lg shadow-sm dark:shadow-none transition-all duration-200"
/>
</a>
</div>

{/* Desktop Navigation */}
<div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
<a href="#home" className="text-[#0A1A2E] dark:text-[#A9B8CC] hover:text-[#7A5F2E] dark:hover:text-[#C2A163] hover:bg-[#EFE9D9]/60 dark:hover:bg-[#0E223D]/60 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200">Home</a>
<a href="#services" className="text-[#0A1A2E] dark:text-[#A9B8CC] hover:text-[#7A5F2E] dark:hover:text-[#C2A163] hover:bg-[#EFE9D9]/60 dark:hover:bg-[#0E223D]/60 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200">Services</a>
<a href="#industries" className="text-[#0A1A2E] dark:text-[#A9B8CC] hover:text-[#7A5F2E] dark:hover:text-[#C2A26B] hover:bg-[#EFE9D9]/60 dark:hover:bg-[#0E223D]/60 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200">Industries</a>
<a href="#about" className="text-[#0A1A2E] dark:text-[#A9B8CC] hover:text-[#7A5F2E] dark:hover:text-[#C2A26B] hover:bg-[#EFE9D9]/60 dark:hover:bg-[#0E223D]/60 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200">About</a>
<button
onClick={() => window.open('https://job.talento-glb.com/', '_blank')}
className="text-[#0A1A2E] dark:text-[#A9B8CC] hover:text-[#7A5F2E] dark:hover:text-[#C2A26B] hover:bg-[#EFE9D9]/60 dark:hover:bg-[#0E223D]/60 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
>
Careers
</button>
<a href="/insights" onClick={(e) => { e.preventDefault(); navigateInsights('/insights'); }} className="text-[#0A1A2E] dark:text-[#A9B8CC] hover:text-[#7A5F2E] dark:hover:text-[#C2A26B] hover:bg-[#EFE9D9]/60 dark:hover:bg-[#0E223D]/60 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200">Insights</a>
<a href="#faq" className="text-[#0A1A2E] dark:text-[#A9B8CC] hover:text-[#7A5F2E] dark:hover:text-[#C2A26B] hover:bg-[#EFE9D9]/60 dark:hover:bg-[#0E223D]/60 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200">FAQ</a>
<a href="#contact" className="text-[#0A1A2E] dark:text-[#A9B8CC] hover:text-[#7A5F2E] dark:hover:text-[#C2A26B] hover:bg-[#EFE9D9]/60 dark:hover:bg-[#0E223D]/60 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200">Contact</a>
<a href="#apply" className="text-[#0A1A2E] dark:text-[#A9B8CC] hover:text-[#7A5F2E] dark:hover:text-[#C2A26B] hover:bg-[#EFE9D9]/60 dark:hover:bg-[#0E223D]/60 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200">Apply</a>
</div>

{/* Desktop Actions */}
<div className="hidden lg:flex items-center space-x-3">
{user ? (
<div className="relative" data-profile-dropdown>
<button
onClick={() => setShowProfileDropdown(!showProfileDropdown)}
className="flex items-center space-x-3 p-2 rounded-xl hover:bg-[#EFE9D9]/60 dark:hover:bg-[#0E223D] transition-colors"
>
<div className="w-10 h-10 rounded-full bg-[#B9C2CE]/40 dark:bg-[#0E223D] flex items-center justify-center overflow-hidden ring-2 ring-[#C2A163]/50">
{userProfile?.profile_photo_url ? (
<img
src={userProfile.profile_photo_url}
alt="Profile"
className="w-full h-full object-cover"
/>
) : (
<User className="w-6 h-6 text-[#4A5568] dark:text-[#A9B8CC]" />
)}
</div>
<ChevronDown className={`w-4 h-4 text-[#4A5568] dark:text-[#A9B8CC] transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
</button>
{/* Dropdown Menu */}
{showProfileDropdown && (
<div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#0E223D] rounded-xl shadow-lg border border-[#B9C2CE]/30 dark:border-[#1B3047] py-2 z-50">
<button
onClick={() => {
setCurrentView('dashboard');
setInitialDashboardEditMode(false);
setShowProfileDropdown(false);
}}
className="flex items-center w-full px-4 py-2 text-sm text-[#0A1A2E] dark:text-[#A9B8CC] hover:bg-[#F7F4EC] dark:hover:bg-[#08162A] transition-colors"
>
<User className="w-4 h-4 mr-3 text-[#C2A163]" />
Dashboard
</button>
<button
onClick={() => {
setCurrentView('dashboard');
setInitialDashboardEditMode(true);
setShowProfileDropdown(false);
}}
className="flex items-center w-full px-4 py-2 text-sm text-[#0A1A2E] dark:text-[#A9B8CC] hover:bg-[#F7F4EC] dark:hover:bg-[#08162A] transition-colors"
>
<Settings className="w-4 h-4 mr-3 text-[#C2A163]" />
Edit Profile
</button>
<hr className="my-1 border-[#B9C2CE]/20 dark:border-[#1B3047]" />
<button
onClick={handleSignOut}
className="flex items-center w-full px-4 py-2 text-sm text-[#A23B3B] hover:bg-[#A23B3B]/10 transition-colors"
>
<LogOut className="w-4 h-4 mr-3" />
Sign Out
</button>
</div>
)}
</div>
) : (
<button
onClick={() => setCurrentView('auth')}
className="bg-[#C2A163] hover:bg-[#A8874F] active:scale-95 text-[#08162A] px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow transition-all duration-200"
>
Sign In
</button>
)}
<div className="h-4 w-px bg-[#B9C2CE]/40 dark:bg-[#1B3047] mx-0.5"></div>
<ThemeToggle />
</div>

{/* Mobile menu button */}
<div className="lg:hidden flex items-center space-x-2">
<ThemeToggle />
<button
onClick={() => setIsMenuOpen(!isMenuOpen)}
className="p-2 rounded-lg text-[#0A1A2E] dark:text-[#A9B8CC] hover:text-[#7A5F2E] dark:hover:text-[#C2A163] hover:bg-[#EFE9D9] dark:hover:bg-[#0E223D] active:scale-95 transition-all"
aria-label="Toggle menu"
>
{isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
</button>
</div>
</div>
</div>

{/* Mobile Navigation */}
{isMenuOpen && (
<div className="lg:hidden">
<div className="px-3 pt-2 pb-4 space-y-1 bg-[#F7F4EC]/98 dark:bg-[#0E223D]/98 backdrop-blur-md border-t border-[#B9C2CE]/30 dark:border-[#1B3047] shadow-xl transition-all">
<a
href="#home"
onClick={() => setIsMenuOpen(false)}
className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#0A1A2E] dark:text-[#A9B8CC] hover:bg-[#EFE9D9]/80 dark:hover:bg-[#08162A]/80 hover:text-[#7A5F2E] dark:hover:text-[#C2A163] transition-colors"
>
Home
</a>
<a
href="#services"
onClick={() => setIsMenuOpen(false)}
className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#0A1A2E] dark:text-[#A9B8CC] hover:bg-[#EFE9D9]/80 dark:hover:bg-[#08162A]/80 hover:text-[#7A5F2E] dark:hover:text-[#C2A163] transition-colors"
>
Services
</a>
<a
href="#industries"
onClick={() => setIsMenuOpen(false)}
className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#0A1A2E] dark:text-[#A9B8CC] hover:bg-[#EFE9D9]/80 dark:hover:bg-[#08162A]/80 hover:text-[#7A5F2E] dark:hover:text-[#C2A163] transition-colors"
>
Industries
</a>
<a
href="#about"
onClick={() => setIsMenuOpen(false)}
className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#0A1A2E] dark:text-[#A9B8CC] hover:bg-[#EFE9D9]/80 dark:hover:bg-[#08162A]/80 hover:text-[#7A5F2E] dark:hover:text-[#C2A163] transition-colors"
>
About
</a>
<button
onClick={() => {
setIsMenuOpen(false);
window.open('https://job.talento-glb.com/', '_blank');
}}
className="flex items-center w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#0A1A2E] dark:text-[#A9B8CC] hover:bg-[#EFE9D9]/80 dark:hover:bg-[#08162A]/80 hover:text-[#7A5F2E] dark:hover:text-[#C2A163] transition-colors"
>
Careers
</button>
<a
href="/insights"
onClick={(e) => { e.preventDefault(); navigateInsights('/insights'); }}
className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#0A1A2E] dark:text-[#A9B8CC] hover:bg-[#EFE9D9]/80 dark:hover:bg-[#08162A]/80 hover:text-[#7A5F2E] dark:hover:text-[#C2A163] transition-colors"
>
Insights
</a>
<a
href="#faq"
onClick={() => setIsMenuOpen(false)}
className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#0A1A2E] dark:text-[#A9B8CC] hover:bg-[#EFE9D9]/80 dark:hover:bg-[#08162A]/80 hover:text-[#7A5F2E] dark:hover:text-[#C2A163] transition-colors"
>
FAQ
</a>
<a
href="#contact"
onClick={() => setIsMenuOpen(false)}
className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#0A1A2E] dark:text-[#A9B8CC] hover:bg-[#EFE9D9]/80 dark:hover:bg-[#08162A]/80 hover:text-[#7A5F2E] dark:hover:text-[#C2A163] transition-colors"
>
Contact
</a>
<a
href="#apply"
onClick={() => setIsMenuOpen(false)}
className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#0A1A2E] dark:text-[#A9B8CC] hover:bg-[#EFE9D9]/80 dark:hover:bg-[#08162A]/80 hover:text-[#7A5F2E] dark:hover:text-[#C2A163] transition-colors"
>
Apply
</a>
{user ? (
<div className="border-t border-[#B9C2CE]/30 dark:border-[#0A1A30] pt-2 mt-2">
<div className="flex items-center px-3.5 py-2 mb-2">
<div className="w-10 h-10 rounded-full bg-[#B9C2CE]/40 dark:bg-[#0A1A30] flex items-center justify-center overflow-hidden ring-2 ring-[#C2A26B]/50 mr-3">
{userProfile?.profile_photo_url ? (
<img
src={userProfile.profile_photo_url}
alt="Profile"
className="w-full h-full object-cover"
/>
) : (
<User className="w-6 h-6 text-[#4A5568] dark:text-[#B9C2CE]" />
)}
</div>
<div>
<p className="text-sm font-semibold text-[#0A1A30] dark:text-white">
{userProfile?.full_name || 'User'}
</p>
<p className="text-xs text-[#4A5568] dark:text-[#9AA5B4]">{user.email}</p>
</div>
</div>
<button
onClick={() => {
setCurrentView('dashboard');
setInitialDashboardEditMode(false);
setIsMenuOpen(false);
}}
className="flex items-center w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#0A1A30] dark:text-[#B9C2CE] hover:bg-[#EFE9D9]/80 dark:hover:bg-[#0A1A30]/80 transition-colors"
>
<User className="w-4 h-4 mr-3" />
Dashboard
</button>
<button
onClick={() => {
setCurrentView('dashboard');
setInitialDashboardEditMode(true);
setIsMenuOpen(false);
}}
className="flex items-center w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#0A1A30] dark:text-[#B9C2CE] hover:bg-[#EFE9D9]/80 dark:hover:bg-[#0A1A30]/80 transition-colors"
>
<Settings className="w-4 h-4 mr-3" />
Edit Profile
</button>
<button
onClick={() => {
handleSignOut();
setIsMenuOpen(false);
}}
className="flex items-center w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#A23B3B] hover:bg-[#A23B3B]/10 transition-colors"
>
<LogOut className="w-4 h-4 mr-3" />
Sign Out
</button>
</div>
) : (
<div className="pt-2 px-1">
<button
onClick={() => {
setCurrentView('auth');
setIsMenuOpen(false);
}}
className="w-full py-2.5 px-4 rounded-xl bg-[#C2A26B] hover:bg-[#A8874F] active:scale-95 text-[#0A1A30] text-sm font-semibold text-center shadow-sm hover:shadow transition-all"
>
Sign In
</button>
</div>
)}
</div>
</div>
)}
</nav>


{currentView === 'insights' ? (
<InsightsPage slug={insightSlug} onNavigate={navigateInsights} />
) : (
<>
<section
id="home"
className="relative bg-[#F7F4EC] dark:bg-[#08162A] text-[#0A1A2E] dark:text-white pt-24 pb-16 md:pt-32 md:pb-12 lg:py-24 lg:min-h-screen overflow-hidden transition-colors duration-200 flex items-center"
>
{/* Ambient subtle glow pattern */}
<div className="absolute inset-0 opacity-25 pointer-events-none">
<div className="absolute top-0 left-0 w-96 h-96 bg-[#C2A163]/12 rounded-full filter blur-3xl animate-light-slow"></div>
<div className="absolute bottom-0 right-0 w-96 h-96 bg-[#B9C2CE]/30 dark:bg-[#112640]/80 rounded-full filter blur-3xl animate-light-slow" style={{ animationDelay: '7s' }}></div>
</div>

{/* Animated connection lines - hidden on mobile for performance */}
<div className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none">
<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stopColor="#C2A163" stopOpacity="0.3" />
<stop offset="100%" stopColor="#C2A163" stopOpacity="0.04" />
</linearGradient>
</defs>
<path d="M100,200 Q400,100 700,200" stroke="url(#gradient)" strokeWidth="1.5" fill="none" className="animate-draw" />
<path d="M100,300 Q400,400 700,300" stroke="url(#gradient)" strokeWidth="1.5" fill="none" className="animate-draw" style={{ animationDelay: '1s' }} />
</svg>
</div>

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
<div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">

{/* Left Content */}
<div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left mb-6 lg:mb-0">
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-serif font-bold text-[#0A1A2E] dark:text-white mt-4 sm:mt-6 lg:mt-8 mb-4 sm:mb-6 tracking-tight leading-[1.12]">
  Scale your team with{' '}
  <span className="text-[#7A5F2E] dark:text-[#C2A163] italic font-normal">high quality, vetted</span>{' '}
  professionals
</h1>

<p className="text-base sm:text-lg text-[#4A5568] dark:text-[#A9B8CC] mb-8 sm:mb-10 max-w-2xl lg:max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans font-normal">
  From dynamic start-ups to multinational enterprises, exceptional leadership is the catalyst for enduring growth.{' '}
  <strong className="font-semibold text-[#7A5F2E] dark:text-[#C2A163]">TALENTO</strong> delivers rigorous, confidential talent acquisition tailored to executive demand.
</p>

<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 lg:mb-10 w-full sm:w-auto">
<button
onClick={() => window.open('https://job.talento-glb.com/', '_blank')}
className="group relative overflow-hidden bg-[#C2A163] hover:bg-[#A8874F] active:scale-95 text-[#08162A] px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl font-sans"
>
<span className="relative z-10 flex items-center font-medium">
<Search className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
Explore Careers
</span>
</button>
<a
href="https://calendly.com/talentoagency2/30min"
target="_blank"
rel="noopener noreferrer"
className="group relative overflow-hidden border-2 border-[#7A5F2E] dark:border-[#C2A163] hover:bg-[#C2A163]/10 active:scale-95 text-[#7A5F2E] dark:text-[#C2A163] px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-sm font-sans"
>
<span className="relative z-10 flex items-center font-medium">
Schedule a Consultation
<svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
</svg>
</span>
</a>
</div>

{/* Stats bar - responsive with PDF editorial numbers */}
<div className="grid grid-cols-3 gap-2 sm:gap-6 max-w-md mx-auto lg:mx-0 pt-6 border-t border-[#B9C2CE]/40 dark:border-[#1B3047]">
<div className="text-center lg:text-left">
<div className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif tracking-tight text-[#7A5F2E] dark:text-[#C2A163]">100+</div>
<div className="text-xs sm:text-sm text-[#4A5568] dark:text-[#A9B8CC] font-sans mt-0.5">Placements</div>
</div>
<div className="text-center lg:text-left border-x border-[#B9C2CE]/40 dark:border-[#1B3047] px-2 sm:px-4">
<div className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif tracking-tight text-[#7A5F2E] dark:text-[#C2A163]">95%</div>
<div className="text-xs sm:text-sm text-[#4A5568] dark:text-[#A9B8CC] font-sans mt-0.5">Success Rate</div>
</div>
<div className="text-center lg:text-left">
<div className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif tracking-tight text-[#7A5F2E] dark:text-[#C2A163]">15+</div>
<div className="text-xs sm:text-sm text-[#4A5568] dark:text-[#A9B8CC] font-sans mt-0.5">Industries</div>
</div>
</div>
</div>

{/* Right Visual - layered, animated composition (see components/HeroVisual.tsx) */}
<div className="relative w-full lg:w-1/2 flex justify-center lg:justify-end items-center">
<HeroVisual />
</div>
</div>
</div>
</section>

{/* Services Section */}
<section id="services" className="py-20 sm:py-24 bg-[#F7F4EC] dark:bg-[#08162A] transition-colors duration-200">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
{/* Section Header with PDF Diamond Eyebrow */}
<div className="text-center mb-14 sm:mb-16">
<div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#7A5F2E] dark:text-[#C2A163] uppercase mb-3">
  <span>◆</span>
  <span>Specialized Practice Areas</span>
  <span>◆</span>
</div>
<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0A1A2E] dark:text-white mb-4 tracking-tight">
  Our Specialized Services
</h2>
<div className="w-16 h-0.5 bg-[#C2A163] mx-auto mb-4"></div>
<p className="text-base sm:text-lg text-[#4A5568] dark:text-[#A9B8CC] max-w-2xl mx-auto leading-relaxed font-sans">
  Comprehensive talent acquisition solutions tailored to your organization's unique strategic needs.
</p>
</div>

{/* Service Cards Grid - PDF Editorial Styling */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
{/* Card 1: C-Suite Talent Hunt */}
<div className="bg-white dark:bg-[#0E223D] p-7 sm:p-8 rounded-2xl shadow-sm hover:shadow-xl border border-[#B9C2CE]/30 dark:border-[#1B3047] hover:border-[#C2A163]/50 transition-all duration-300 relative group flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-6">
<div className="w-12 h-12 rounded-xl bg-[#C2A163]/10 dark:bg-[#C2A163]/10 border border-[#C2A163]/25 flex items-center justify-center text-[#C2A163] group-hover:scale-105 transition-transform">
<Building className="w-6 h-6" />
</div>
<span className="font-serif text-sm font-semibold text-[#C2A163]/50 group-hover:text-[#C2A163] tracking-widest transition-colors">01</span>
</div>
<h3 className="text-xl font-serif font-bold text-[#0A1A2E] dark:text-white mb-3 group-hover:text-[#7A5F2E] dark:group-hover:text-[#C2A163] transition-colors">
C-Suite Talent Hunt
</h3>
<p className="text-[#4A5568] dark:text-[#A9B8CC] text-sm leading-relaxed mb-6 font-sans">
Executive leadership recruitment for board directors, chief officers, and country heads who shape enterprise strategy.
</p>
</div>
<div className="pt-4 border-t border-[#B9C2CE]/20 dark:border-[#1B3047] flex items-center justify-between text-xs text-[#7A5F2E] dark:text-[#C2A163] font-medium">
  <span>C-Level & Board</span>
  <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">Inquire →</span>
</div>
</div>

{/* Card 2: Premium Executive Search */}
<div className="bg-white dark:bg-[#0E223D] p-7 sm:p-8 rounded-2xl shadow-sm hover:shadow-xl border border-[#B9C2CE]/30 dark:border-[#1B3047] hover:border-[#C2A26B]/50 transition-all duration-300 relative group flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-6">
<div className="w-12 h-12 rounded-xl bg-[#C2A163]/10 dark:bg-[#C2A163]/10 border border-[#C2A163]/25 flex items-center justify-center text-[#C2A163] group-hover:scale-105 transition-transform">
<Target className="w-6 h-6" />
</div>
<span className="font-serif text-sm font-semibold text-[#C2A163]/50 group-hover:text-[#C2A163] tracking-widest transition-colors">02</span>
</div>
<h3 className="text-xl font-serif font-bold text-[#0A1A2E] dark:text-white mb-3 group-hover:text-[#7A5F2E] dark:group-hover:text-[#C2A163] transition-colors">
Premium Executive Search
</h3>
<p className="text-[#4A5568] dark:text-[#A9B8CC] text-sm leading-relaxed mb-6 font-sans">
Comprehensive search solutions for VP, General Manager, and Senior Director roles requiring cultural alignment and proven operational pedigree.
</p>
</div>
<div className="pt-4 border-t border-[#B9C2CE]/20 dark:border-[#1B3047] flex items-center justify-between text-xs text-[#7A5F2E] dark:text-[#C2A163] font-medium">
  <span>Senior Management</span>
  <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">Inquire →</span>
</div>
</div>

{/* Card 3: Interim & Impact Recruitment */}
<div className="bg-white dark:bg-[#0E223D] p-7 sm:p-8 rounded-2xl shadow-sm hover:shadow-xl border border-[#B9C2CE]/30 dark:border-[#1B3047] hover:border-[#C2A26B]/50 transition-all duration-300 relative group flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-6">
<div className="w-12 h-12 rounded-xl bg-[#C2A163]/10 dark:bg-[#C2A163]/10 border border-[#C2A163]/25 flex items-center justify-center text-[#C2A163] group-hover:scale-105 transition-transform">
<Briefcase className="w-6 h-6" />
</div>
<span className="font-serif text-sm font-semibold text-[#C2A163]/50 group-hover:text-[#C2A163] tracking-widest transition-colors">03</span>
</div>
<h3 className="text-xl font-serif font-bold text-[#0A1A2E] dark:text-white mb-3 group-hover:text-[#7A5F2E] dark:group-hover:text-[#C2A163] transition-colors">
Interim Permanent Impact Recruitment
</h3>
<p className="text-[#4A5568] dark:text-[#A9B8CC] text-sm leading-relaxed mb-6 font-sans">
Strategic interim leadership deployments and permanent key impact hires engineered to resolve operational turning points.
</p>
</div>
<div className="pt-4 border-t border-[#B9C2CE]/20 dark:border-[#1B3047] flex items-center justify-between text-xs text-[#7A5F2E] dark:text-[#C2A163] font-medium">
  <span>Turnaround & Growth</span>
  <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">Inquire →</span>
</div>
</div>

{/* Card 4: Business Critical & Niche Discovery */}
<div className="bg-white dark:bg-[#0E223D] p-7 sm:p-8 rounded-2xl shadow-sm hover:shadow-xl border border-[#B9C2CE]/30 dark:border-[#1B3047] hover:border-[#C2A26B]/50 transition-all duration-300 relative group flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-6">
<div className="w-12 h-12 rounded-xl bg-[#C2A163]/10 dark:bg-[#C2A163]/10 border border-[#C2A163]/25 flex items-center justify-center text-[#C2A163] group-hover:scale-105 transition-transform">
<Sparkles className="w-6 h-6" />
</div>
<span className="font-serif text-sm font-semibold text-[#C2A163]/50 group-hover:text-[#C2A163] tracking-widest transition-colors">04</span>
</div>
<h3 className="text-xl font-serif font-bold text-[#0A1A2E] dark:text-white mb-3 group-hover:text-[#7A5F2E] dark:group-hover:text-[#C2A163] transition-colors">
Business Critical & Niche Discovery
</h3>
<p className="text-[#4A5568] dark:text-[#A9B8CC] text-sm leading-relaxed mb-6 font-sans">
Confidential headhunting for hard-to-fill positions, frontier technical domains, and mission-critical leadership gaps.
</p>
</div>
<div className="pt-4 border-t border-[#B9C2CE]/20 dark:border-[#1B3047] flex items-center justify-between text-xs text-[#7A5F2E] dark:text-[#C2A163] font-medium">
  <span>Confidential Search</span>
  <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">Inquire →</span>
</div>
</div>

{/* Card 5: Specialist Talent Sourcing */}
<div className="bg-white dark:bg-[#0E223D] p-7 sm:p-8 rounded-2xl shadow-sm hover:shadow-xl border border-[#B9C2CE]/30 dark:border-[#1B3047] hover:border-[#C2A26B]/50 transition-all duration-300 relative group flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-6">
<div className="w-12 h-12 rounded-xl bg-[#C2A163]/10 dark:bg-[#C2A163]/10 border border-[#C2A163]/25 flex items-center justify-center text-[#C2A163] group-hover:scale-105 transition-transform">
<Award className="w-6 h-6" />
</div>
<span className="font-serif text-sm font-semibold text-[#C2A163]/50 group-hover:text-[#C2A163] tracking-widest transition-colors">05</span>
</div>
<h3 className="text-xl font-serif font-bold text-[#0A1A2E] dark:text-white mb-3 group-hover:text-[#7A5F2E] dark:group-hover:text-[#C2A163] transition-colors">
Specialist Talent Sourcing
</h3>
<p className="text-[#4A5568] dark:text-[#A9B8CC] text-sm leading-relaxed mb-6 font-sans">
Deep talent mapping across specialized engineering, product, finance, clinical, and data disciplines.
</p>
</div>
<div className="pt-4 border-t border-[#B9C2CE]/20 dark:border-[#1B3047] flex items-center justify-between text-xs text-[#7A5F2E] dark:text-[#C2A163] font-medium">
  <span>Technical & Functional</span>
  <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">Inquire →</span>
</div>
</div>

{/* Card 6: On-Demand Talent Solutions */}
<div className="bg-white dark:bg-[#0E223D] p-7 sm:p-8 rounded-2xl shadow-sm hover:shadow-xl border border-[#B9C2CE]/30 dark:border-[#1B3047] hover:border-[#C2A26B]/50 transition-all duration-300 relative group flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-6">
<div className="w-12 h-12 rounded-xl bg-[#C2A163]/10 dark:bg-[#C2A163]/10 border border-[#C2A163]/25 flex items-center justify-center text-[#C2A163] group-hover:scale-105 transition-transform">
<Clock className="w-6 h-6" />
</div>
<span className="font-serif text-sm font-semibold text-[#C2A163]/50 group-hover:text-[#C2A163] tracking-widest transition-colors">06</span>
</div>
<h3 className="text-xl font-serif font-bold text-[#0A1A2E] dark:text-white mb-3 group-hover:text-[#7A5F2E] dark:group-hover:text-[#C2A163] transition-colors">
On-Demand Advisory Search
</h3>
<p className="text-[#4A5568] dark:text-[#A9B8CC] text-sm leading-relaxed mb-6 font-sans">
Flexible talent solutions and expert recruitment consulting designed for rapid team scaling and project engagements.
</p>
</div>
<div className="pt-4 border-t border-[#B9C2CE]/20 dark:border-[#1B3047] flex items-center justify-between text-xs text-[#7A5F2E] dark:text-[#C2A163] font-medium">
  <span>Agile Delivery</span>
  <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">Inquire →</span>
</div>
</div>
</div>
</div>
</section>

{/* Industries Section */}
<section id="industries" className="py-20 sm:py-24 bg-[#F7F4EC] dark:bg-[#08162A] border-t border-[#B9C2CE]/20 dark:border-[#1B3047] transition-colors duration-200">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="text-center mb-14 sm:mb-16">
<div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#7A5F2E] dark:text-[#C2A163] uppercase mb-3">
  <span>◆</span>
  <span>Sector Expertise</span>
  <span>◆</span>
</div>
<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0A1A2E] dark:text-white mb-4 tracking-tight">
  Industries We Serve
</h2>
<div className="w-16 h-0.5 bg-[#C2A163] mx-auto mb-4"></div>
<p className="text-xl font-serif italic text-[#7A5F2E] dark:text-[#C2A163] mb-2">Your Industry. Our Network.</p>
<p className="text-base sm:text-lg text-[#4A5568] dark:text-[#A9B8CC] max-w-2xl mx-auto leading-relaxed font-sans">
  We operate across dynamic global sectors, deploying high-caliber executive leadership into transformative organizations.
</p>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
{/* Sector 1 */}
<div className="bg-white dark:bg-[#0E223D] border border-[#B9C2CE]/30 dark:border-[#1B3047] p-6 rounded-2xl hover:border-[#C2A163]/60 dark:hover:border-[#C2A163]/50 hover:shadow-[0_8px_25px_rgba(194,161,99,0.08)] transition-all group flex flex-col justify-between">
<div>
<div className="w-12 h-12 rounded-xl bg-[#C2A163]/10 border border-[#C2A163]/20 flex items-center justify-center text-[#7A5F2E] dark:text-[#C2A163] mb-4 group-hover:scale-105 transition-transform">
<Building className="w-6 h-6" />
</div>
<h3 className="font-serif text-lg font-bold text-[#0A1A2E] dark:text-white group-hover:text-[#7A5F2E] dark:group-hover:text-[#C2A163] transition-colors mb-2">
Tech & High-Growth Startups
</h3>
<p className="text-xs text-[#4A5568] dark:text-[#A9B8CC] leading-relaxed">
Founding engineers, VP Engineering, Product heads, and venture-backed scale leaders.
</p>
</div>
<div className="mt-4 pt-3 border-t border-[#B9C2CE]/20 dark:border-[#1B3047] flex items-center justify-between text-[11px] text-[#7A5F2E] dark:text-[#C2A163]">
  <span>Executive Search</span>
  <span>→</span>
</div>
</div>

{/* Sector 2 */}
<div className="bg-white dark:bg-[#0E223D] border border-[#B9C2CE]/30 dark:border-[#1B3047] p-6 rounded-2xl hover:border-[#C2A163]/60 dark:hover:border-[#C2A163]/50 hover:shadow-[0_8px_25px_rgba(194,161,99,0.08)] transition-all group flex flex-col justify-between">
<div>
<div className="w-12 h-12 rounded-xl bg-[#C2A163]/10 border border-[#C2A163]/20 flex items-center justify-center text-[#7A5F2E] dark:text-[#C2A163] mb-4 group-hover:scale-105 transition-transform">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
<path d="M3 6h18"></path>
<path d="M16 10a4 4 0 0 1-8 0"></path>
</svg>
</div>
<h3 className="font-serif text-lg font-bold text-[#0A1A2E] dark:text-white group-hover:text-[#7A5F2E] dark:group-hover:text-[#C2A163] transition-colors mb-2">
Apparel & Global Textiles
</h3>
<p className="text-xs text-[#4A5568] dark:text-[#A9B8CC] leading-relaxed">
Supply chain executives, country directors, merchandising leadership, and sustainability heads.
</p>
</div>
<div className="mt-4 pt-3 border-t border-[#B9C2CE]/20 dark:border-[#1B3047] flex items-center justify-between text-[11px] text-[#7A5F2E] dark:text-[#C2A163]">
  <span>Executive Search</span>
  <span>→</span>
</div>
</div>

{/* Sector 3 */}
<div className="bg-white dark:bg-[#0E223D] border border-[#B9C2CE]/30 dark:border-[#1B3047] p-6 rounded-2xl hover:border-[#C2A163]/60 dark:hover:border-[#C2A163]/50 hover:shadow-[0_8px_25px_rgba(194,161,99,0.08)] transition-all group flex flex-col justify-between">
<div>
<div className="w-12 h-12 rounded-xl bg-[#C2A163]/10 border border-[#C2A163]/20 flex items-center justify-center text-[#7A5F2E] dark:text-[#C2A163] mb-4 group-hover:scale-105 transition-transform">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
<path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
<circle cx="20" cy="10" r="2"></circle>
</svg>
</div>
<h3 className="font-serif text-lg font-bold text-[#0A1A2E] dark:text-white group-hover:text-[#7A5F2E] dark:group-hover:text-[#C2A163] transition-colors mb-2">
Healthcare & Life Sciences
</h3>
<p className="text-xs text-[#4A5568] dark:text-[#A9B8CC] leading-relaxed">
Hospital administrators, pharmaceutical executives, clinical operational leads, and health-tech pioneers.
</p>
</div>
<div className="mt-4 pt-3 border-t border-[#B9C2CE]/20 dark:border-[#1B3047] flex items-center justify-between text-[11px] text-[#7A5F2E] dark:text-[#C2A163]">
  <span>Executive Search</span>
  <span>→</span>
</div>
</div>

{/* Sector 4 */}
<div className="bg-white dark:bg-[#0E223D] border border-[#B9C2CE]/30 dark:border-[#1B3047] p-6 rounded-2xl hover:border-[#C2A163]/60 dark:hover:border-[#C2A163]/50 hover:shadow-[0_8px_25px_rgba(194,161,99,0.08)] transition-all group flex flex-col justify-between">
<div>
<div className="w-12 h-12 rounded-xl bg-[#C2A163]/10 border border-[#C2A163]/20 flex items-center justify-center text-[#7A5F2E] dark:text-[#C2A163] mb-4 group-hover:scale-105 transition-transform">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
<polyline points="16 7 22 7 22 13"></polyline>
</svg>
</div>
<h3 className="font-serif text-lg font-bold text-[#0A1A2E] dark:text-white group-hover:text-[#7A5F2E] dark:group-hover:text-[#C2A163] transition-colors mb-2">
FMCG & Digital Marketplaces
</h3>
<p className="text-xs text-[#4A5568] dark:text-[#A9B8CC] leading-relaxed">
Chief Commercial Officers, growth marketing leaders, brand custodians, and omnichannel operations heads.
</p>
</div>
<div className="mt-4 pt-3 border-t border-[#B9C2CE]/20 dark:border-[#1B3047] flex items-center justify-between text-[11px] text-[#7A5F2E] dark:text-[#C2A163]">
  <span>Executive Search</span>
  <span>→</span>
</div>
</div>

{/* Sector 5 */}
<div className="bg-white dark:bg-[#0E223D] border border-[#B9C2CE]/30 dark:border-[#1B3047] p-6 rounded-2xl hover:border-[#C2A163]/60 dark:hover:border-[#C2A163]/50 hover:shadow-[0_8px_25px_rgba(194,161,99,0.08)] transition-all group flex flex-col justify-between">
<div>
<div className="w-12 h-12 rounded-xl bg-[#C2A163]/10 border border-[#C2A163]/20 flex items-center justify-center text-[#7A5F2E] dark:text-[#C2A163] mb-4 group-hover:scale-105 transition-transform">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
<path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
<path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
<line x1="6" x2="6" y1="2" y2="4"></line>
<line x1="10" x2="10" y1="2" y2="4"></line>
<line x1="14" x2="14" y1="2" y2="4"></line>
</svg>
</div>
<h3 className="font-serif text-lg font-bold text-[#0A1A2E] dark:text-white group-hover:text-[#7A5F2E] dark:group-hover:text-[#C2A163] transition-colors mb-2">
Hospitality & Real Estate
</h3>
<p className="text-xs text-[#4A5568] dark:text-[#A9B8CC] leading-relaxed">
General Managers, development directors, asset managers, and luxury brand operational executives.
</p>
</div>
<div className="mt-4 pt-3 border-t border-[#B9C2CE]/20 dark:border-[#1B3047] flex items-center justify-between text-[11px] text-[#7A5F2E] dark:text-[#C2A163]">
  <span>Executive Search</span>
  <span>→</span>
</div>
</div>

{/* Sector 6 */}
<div className="bg-white dark:bg-[#0E223D] border border-[#B9C2CE]/30 dark:border-[#1B3047] p-6 rounded-2xl hover:border-[#C2A163]/60 dark:hover:border-[#C2A163]/50 hover:shadow-[0_8px_25px_rgba(194,161,99,0.08)] transition-all group flex flex-col justify-between">
<div>
<div className="w-12 h-12 rounded-xl bg-[#C2A163]/10 border border-[#C2A163]/20 flex items-center justify-center text-[#7A5F2E] dark:text-[#C2A163] mb-4 group-hover:scale-105 transition-transform">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
</svg>
</div>
<h3 className="font-serif text-lg font-bold text-[#0A1A2E] dark:text-white group-hover:text-[#7A5F2E] dark:group-hover:text-[#C2A163] transition-colors mb-2">
NGOs & Multilateral Bodies
</h3>
<p className="text-xs text-[#4A5568] dark:text-[#A9B8CC] leading-relaxed">
Country representatives, chief of party, development economists, and international governance experts.
</p>
</div>
<div className="mt-4 pt-3 border-t border-[#B9C2CE]/20 dark:border-[#1B3047] flex items-center justify-between text-[11px] text-[#7A5F2E] dark:text-[#C2A163]">
  <span>Executive Search</span>
  <span>→</span>
</div>
</div>

{/* Sector 7 */}
<div className="bg-white dark:bg-[#0E223D] border border-[#B9C2CE]/30 dark:border-[#1B3047] p-6 rounded-2xl hover:border-[#C2A26B]/60 dark:hover:border-[#C2A26B]/50 hover:shadow-[0_8px_25px_rgba(194,161,99,0.08)] transition-all group flex flex-col justify-between">
<div>
<div className="w-12 h-12 rounded-xl bg-[#C2A163]/10 border border-[#C2A163]/20 flex items-center justify-center text-[#7A5F2E] dark:text-[#C2A163] mb-4 group-hover:scale-105 transition-transform">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
<path d="M7 20h10"></path>
<path d="M10 20c5.5-2.5.8-6.4 3-10"></path>
<path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"></path>
<path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"></path>
</svg>
</div>
<h3 className="font-serif text-lg font-bold text-[#0A1A2E] dark:text-white group-hover:text-[#7A5F2E] dark:group-hover:text-[#C2A163] transition-colors mb-2">
Agri-Business & Food Tech
</h3>
<p className="text-xs text-[#4A5568] dark:text-[#A9B8CC] leading-relaxed">
Agronomy leaders, processing plant heads, cold-chain directors, and agro-commodity trading principals.
</p>
</div>
<div className="mt-4 pt-3 border-t border-[#B9C2CE]/20 dark:border-[#1B3047] flex items-center justify-between text-[11px] text-[#7A5F2E] dark:text-[#C2A163]">
  <span>Executive Search</span>
  <span>→</span>
</div>
</div>

{/* Sector 8 */}
<div className="bg-white dark:bg-[#0E223D] border border-[#B9C2CE]/30 dark:border-[#1B3047] p-6 rounded-2xl hover:border-[#C2A163]/60 dark:hover:border-[#C2A163]/50 hover:shadow-[0_8px_25px_rgba(194,161,99,0.08)] transition-all group flex flex-col justify-between">
<div>
<div className="w-12 h-12 rounded-xl bg-[#C2A163]/10 border border-[#C2A163]/20 flex items-center justify-center text-[#7A5F2E] dark:text-[#C2A163] mb-4 group-hover:scale-105 transition-transform">
<Scale className="w-6 h-6" />
</div>
<h3 className="font-serif text-lg font-bold text-[#0A1A2E] dark:text-white group-hover:text-[#7A5F2E] dark:group-hover:text-[#C2A163] transition-colors mb-2">
Financial Services & FinTech
</h3>
<p className="text-xs text-[#4A5568] dark:text-[#A9B8CC] leading-relaxed">
Chief Risk Officers, investment bankers, compliance heads, digital banking leaders, and CFOs.
</p>
</div>
<div className="mt-4 pt-3 border-t border-[#B9C2CE]/20 dark:border-[#1B3047] flex items-center justify-between text-[11px] text-[#7A5F2E] dark:text-[#C2A163]">
  <span>Executive Search</span>
  <span>→</span>
</div>
</div>
</div>
</div>
</section>

{/* About Section */}
<section id="about" className="py-20 sm:py-24 bg-[#F7F4EC] dark:bg-[#08162A] border-t border-[#B9C2CE]/20 dark:border-[#1B3047] transition-colors duration-200">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
<div>
<div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#7A5F2E] dark:text-[#C2A163] uppercase mb-3">
  <span>◆</span>
  <span>The Boutique Advantage</span>
</div>
<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0A1A2E] dark:text-white mb-6 tracking-tight">
Why Choose TALENTO?
</h2>
<p className="text-base sm:text-lg text-[#4A5568] dark:text-[#A9B8CC] mb-8 leading-relaxed font-sans">
As a bespoke executive boutique, we deliver high-touch discretion and precision sourcing that voluminous agencies cannot duplicate. Every search is managed directly by seasoned principals committed to your enterprise horizon.
</p>

<div className="space-y-5">
<div className="flex items-start">
<div className="w-7 h-7 rounded-full bg-[#C2A163]/15 flex items-center justify-center text-[#7A5F2E] dark:text-[#C2A163] mt-1 mr-3 flex-shrink-0 border border-[#C2A163]/30">
  <Check className="w-4 h-4" />
</div>
<div>
<h4 className="font-serif text-base sm:text-lg font-bold text-[#0A1A2E] dark:text-white">Rigorous Multi-Stage Vetting</h4>
<p className="text-xs sm:text-sm text-[#4A5568] dark:text-[#A9B8CC] mt-0.5 leading-relaxed font-sans">Behavioral leadership diagnostics, verifiable track-record auditing, and cultural alignment assessment.</p>
</div>
</div>

<div className="flex items-start">
<div className="w-7 h-7 rounded-full bg-[#C2A163]/15 flex items-center justify-center text-[#7A5F2E] dark:text-[#C2A163] mt-1 mr-3 flex-shrink-0 border border-[#C2A163]/30">
  <Check className="w-4 h-4" />
</div>
<div>
<h4 className="font-serif text-base sm:text-lg font-bold text-[#0A1A2E] dark:text-white">Confidential C-Suite Discretion</h4>
<p className="text-xs sm:text-sm text-[#4A5568] dark:text-[#A9B8CC] mt-0.5 leading-relaxed font-sans">Strict non-disclosure protocols protecting market positioning, strategic moves, and sensitive succession planning.</p>
</div>
</div>

<div className="flex items-start">
<div className="w-7 h-7 rounded-full bg-[#C2A163]/15 flex items-center justify-center text-[#7A5F2E] dark:text-[#C2A163] mt-1 mr-3 flex-shrink-0 border border-[#C2A163]/30">
  <Check className="w-4 h-4" />
</div>
<div>
<h4 className="font-serif text-base sm:text-lg font-bold text-[#0A1A2E] dark:text-white">Guaranteed Delivery Timelines</h4>
<p className="text-xs sm:text-sm text-[#4A5568] dark:text-[#A9B8CC] mt-0.5 leading-relaxed font-sans">Calibrated 15-day candidate shortlists and generous 45-day evaluation windows that adapt to hiring cycles.</p>
</div>
</div>

<div className="flex items-start">
<div className="w-7 h-7 rounded-full bg-[#C2A163]/15 flex items-center justify-center text-[#7A5F2E] dark:text-[#C2A163] mt-1 mr-3 flex-shrink-0 border border-[#C2A163]/30">
  <Check className="w-4 h-4" />
</div>
<div>
<h4 className="font-serif text-base sm:text-lg font-bold text-[#0A1A2E] dark:text-white">Enduring Client-First Partnership</h4>
<p className="text-xs sm:text-sm text-[#4A5568] dark:text-[#A9B8CC] mt-0.5 leading-relaxed font-sans">Onboarding integration follow-up and 30-day replacement guarantee backed by full re-hire discretion.</p>
</div>
</div>
</div>
</div>

{/* Right Track Record Card - PDF Obsidian Navy styling */}
<div className="relative">
<div className="bg-white dark:bg-[#0E223D] rounded-2xl p-7 sm:p-9 text-[#0A1A2E] dark:text-white border border-[#B9C2CE]/40 dark:border-[#C2A163]/30 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors">
<div className="absolute top-0 right-0 w-48 h-48 bg-[#C2A163]/10 rounded-full blur-2xl pointer-events-none"></div>

<div className="flex items-center justify-between mb-8">
  <h3 className="text-2xl font-serif font-bold text-[#0A1A2E] dark:text-white flex items-center">
    <span className="w-2.5 h-2.5 rounded-full bg-[#7A5F2E] dark:bg-[#C2A163] mr-3 animate-pulse"></span>
    Our Track Record
  </h3>
  <span className="text-xs font-mono uppercase text-[#7A5F2E] dark:text-[#C2A163] tracking-widest px-3 py-1 rounded-full bg-[#F7F4EC] dark:bg-[#08162A] border border-[#B9C2CE]/40 dark:border-[#1B3047]">
    Bespoke Metric
  </span>
</div>

<div className="grid grid-cols-2 gap-4 sm:gap-6">
<div className="text-center p-4 sm:p-5 rounded-xl bg-[#F7F4EC] dark:bg-[#08162A] border border-[#B9C2CE]/40 dark:border-[#1B3047] hover:border-[#C2A163]/60 dark:hover:border-[#C2A163]/40 transition-colors">
<div className="text-3xl sm:text-4xl font-bold font-serif tracking-tight mb-1 text-[#7A5F2E] dark:text-[#C2A163]">100+</div>
<div className="text-xs sm:text-sm text-[#4A5568] dark:text-[#A9B8CC] font-sans">Executive Placements</div>
</div>
<div className="text-center p-4 sm:p-5 rounded-xl bg-[#F7F4EC] dark:bg-[#08162A] border border-[#B9C2CE]/40 dark:border-[#1B3047] hover:border-[#C2A163]/60 dark:hover:border-[#C2A163]/40 transition-colors">
<div className="text-3xl sm:text-4xl font-bold font-serif tracking-tight mb-1 text-[#7A5F2E] dark:text-[#C2A163]">95%</div>
<div className="text-xs sm:text-sm text-[#4A5568] dark:text-[#A9B8CC] font-sans">Retention & Satisfaction</div>
</div>
<div className="text-center p-4 sm:p-5 rounded-xl bg-[#F7F4EC] dark:bg-[#08162A] border border-[#B9C2CE]/40 dark:border-[#1B3047] hover:border-[#C2A163]/60 dark:hover:border-[#C2A163]/40 transition-colors">
<div className="text-3xl sm:text-4xl font-bold font-serif tracking-tight mb-1 text-[#7A5F2E] dark:text-[#C2A163]">10+</div>
<div className="text-xs sm:text-sm text-[#4A5568] dark:text-[#A9B8CC] font-sans">Corporate Partners</div>
</div>
<div className="text-center p-4 sm:p-5 rounded-xl bg-[#F7F4EC] dark:bg-[#08162A] border border-[#B9C2CE]/40 dark:border-[#1B3047] hover:border-[#C2A163]/60 dark:hover:border-[#C2A163]/40 transition-colors">
<div className="text-3xl sm:text-4xl font-bold font-serif tracking-tight mb-1 text-[#7A5F2E] dark:text-[#C2A163]">15+</div>
<div className="text-xs sm:text-sm text-[#4A5568] dark:text-[#A9B8CC] font-sans">Core Industry Sectors</div>
</div>
</div>

<div className="mt-8 pt-6 border-t border-[#B9C2CE]/40 dark:border-[#1B3047] flex items-center justify-between text-xs text-[#718096] dark:text-[#A9B8CC]">
  <span>Executive Search & Leadership Advisory</span>
  <span className="text-[#7A5F2E] dark:text-[#C2A163] font-serif font-semibold">TALENTO · Global</span>
</div>
</div>
</div>
</div>
</div>
</section>

{/* Contact Section */}
<section id="contact" className="py-20 sm:py-24 bg-[#F7F4EC] dark:bg-[#08162A] border-t border-[#B9C2CE]/20 dark:border-[#1B3047] transition-colors duration-200">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="text-center mb-14 sm:mb-16">
<div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#7A5F2E] dark:text-[#C2A163] uppercase mb-3">
  <span>◆</span>
  <span>Connect With Our Principals</span>
  <span>◆</span>
</div>
<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0A1A2E] dark:text-white mb-4 tracking-tight">
Let's Discuss Your Hiring Needs
</h2>
<div className="w-16 h-0.5 bg-[#C2A163] mx-auto mb-4"></div>
<p className="text-base sm:text-lg text-[#4A5568] dark:text-[#A9B8CC] max-w-2xl mx-auto leading-relaxed font-sans">
Ready to secure transformational leaders? Initiate a confidential consultation with our managing team.
</p>
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
<div>
<h3 className="text-2xl font-serif font-bold text-[#0A1A2E] dark:text-white mb-6">Confidential Inquiries</h3>
<p className="text-sm sm:text-base text-[#4A5568] dark:text-[#A9B8CC] mb-8 leading-relaxed font-sans">
Whether mandating a new C-level recruitment, evaluating talent advisory, or reviewing commercial agreements, our managing principals respond within 24 hours.
</p>

<div className="space-y-6">
<div className="flex items-start">
<div className="w-10 h-10 rounded-xl bg-[#C2A163]/10 border border-[#C2A163]/25 flex items-center justify-center text-[#7A5F2E] dark:text-[#C2A163] mr-4 flex-shrink-0">
  <Mail className="h-5 w-5" />
</div>
<div>
<h4 className="font-serif font-bold text-[#0A1A2E] dark:text-white text-base">Executive Email</h4>
<p className="text-sm text-[#4A5568] dark:text-[#A9B8CC]">info@talento-glb.com</p>
<p className="text-sm text-[#4A5568] dark:text-[#A9B8CC]">rubz@talento-glb.com</p>
</div>
</div>

<div className="flex items-start">
<div className="w-10 h-10 rounded-xl bg-[#C2A163]/10 border border-[#C2A163]/25 flex items-center justify-center text-[#7A5F2E] dark:text-[#C2A163] mr-4 flex-shrink-0">
  <Phone className="h-5 w-5" />
</div>
<div>
<h4 className="font-serif font-bold text-[#0A1A2E] dark:text-white text-base">Direct Line</h4>
<p className="text-sm text-[#4A5568] dark:text-[#A9B8CC]">+880 1973 591514</p>
</div>
</div>

<div className="flex items-start">
<div className="w-10 h-10 rounded-xl bg-[#C2A163]/10 border border-[#C2A163]/25 flex items-center justify-center text-[#7A5F2E] dark:text-[#C2A163] mr-4 flex-shrink-0">
  <MapPin className="h-5 w-5" />
</div>
<div>
<h4 className="font-serif font-bold text-[#0A1A2E] dark:text-white text-base">Headquarters</h4>
<p className="text-sm text-[#4A5568] dark:text-[#A9B8CC]">Plot 37, Floor 3, Road 11, Block H, Banani, Dhaka-1213, Bangladesh</p>
</div>
</div>

<div className="flex items-start">
<div className="w-10 h-10 rounded-xl bg-[#C2A163]/10 border border-[#C2A163]/25 flex items-center justify-center text-[#7A5F2E] dark:text-[#C2A163] mr-4 flex-shrink-0">
  <Linkedin className="h-5 w-5" />
</div>
<div>
<h4 className="font-serif font-bold text-[#0A1A2E] dark:text-white text-base">LinkedIn Network</h4>
<a
href="https://www.linkedin.com/company/talento-bespoke-premium-headhunting/"
target="_blank"
rel="noopener noreferrer"
className="text-sm text-[#7A5F2E] dark:text-[#C2A163] hover:underline transition"
>
linkedin.com/company/talento-bespoke-premium-headhunting/
</a>
</div>
</div>
</div>
</div>

{/* Form Card */}
<div className="bg-white dark:bg-[#0E223D] p-6 sm:p-8 rounded-2xl border border-[#B9C2CE]/30 dark:border-[#1B3047] shadow-sm transition-colors duration-200">
<form onSubmit={handleContactSubmit} className="space-y-5 sm:space-y-6">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
<div>
<label htmlFor="contact-name" className="block text-xs font-semibold tracking-wider uppercase text-[#0A1A2E] dark:text-[#A9B8CC] mb-2">
Full Name *
</label>
<input
type="text"
id="contact-name"
required
value={contactForm.full_name}
onChange={(e) => setContactForm({...contactForm, full_name: e.target.value})}
className="w-full px-4 py-3 border border-[#B9C2CE]/50 dark:border-[#1B3047] bg-[#F7F4EC]/40 dark:bg-[#08162A] text-[#0A1A2E] dark:text-white rounded-xl focus:ring-2 focus:ring-[#C2A163] focus:border-transparent transition-colors text-sm"
placeholder="Jane Doe"
/>
</div>

<div>
<label htmlFor="contact-email" className="block text-xs font-semibold tracking-wider uppercase text-[#0A1A2E] dark:text-[#A9B8CC] mb-2">
Corporate Email *
</label>
<input
type="email"
id="contact-email"
required
value={contactForm.email}
onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
className="w-full px-4 py-3 border border-[#B9C2CE]/50 dark:border-[#1B3047] bg-[#F7F4EC]/40 dark:bg-[#08162A] text-[#0A1A2E] dark:text-white rounded-xl focus:ring-2 focus:ring-[#C2A163] focus:border-transparent transition-colors text-sm"
placeholder="jane.doe@enterprise.com"
/>
</div>
</div>

<div>
<label htmlFor="contact-company" className="block text-xs font-semibold tracking-wider uppercase text-[#0A1A2E] dark:text-[#A9B8CC] mb-2">
Company / Organization
</label>
<input
type="text"
id="contact-company"
value={contactForm.company}
onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
className="w-full px-4 py-3 border border-[#B9C2CE]/50 dark:border-[#1B3047] bg-[#F7F4EC]/40 dark:bg-[#08162A] text-[#0A1A2E] dark:text-white rounded-xl focus:ring-2 focus:ring-[#C2A163] focus:border-transparent transition-colors text-sm"
placeholder="Acme Global Corporation"
/>
</div>

<div>
<label htmlFor="contact-message" className="block text-xs font-semibold tracking-wider uppercase text-[#0A1A2E] dark:text-[#A9B8CC] mb-2">
Mandate Brief / Message *
</label>
<textarea
id="contact-message"
rows={4}
required
value={contactForm.message}
onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
className="w-full px-4 py-3 border border-[#B9C2CE]/50 dark:border-[#1B3047] bg-[#F7F4EC]/40 dark:bg-[#08162A] text-[#0A1A2E] dark:text-white rounded-xl focus:ring-2 focus:ring-[#C2A163] focus:border-transparent transition-colors resize-none text-sm"
placeholder="Share role requirements, leadership challenges, or desired timeline..."
/>
</div>

{contactError && (
<div className="bg-[#A23B3B]/10 border border-[#A23B3B] rounded-xl p-4">
<div className="flex items-center">
<AlertCircle className="w-5 h-5 text-[#A23B3B] mr-2 flex-shrink-0" />
<p className="text-[#A23B3B] text-sm font-medium">{contactError}</p>
</div>
</div>
)}
{contactSuccess && (
<div className="bg-[#2F6B4F]/10 border border-[#2F6B4F] rounded-xl p-4">
<div className="flex items-center">
<CheckCircle className="w-5 h-5 text-[#2F6B4F] mr-2 flex-shrink-0" />
<p className="text-[#2F6B4F] text-sm font-medium">Thank you. Your consultation request has been received; a principal will respond shortly.</p>
</div>
</div>
)}

<button
type="submit"
disabled={isSubmittingContact}
className="w-full bg-[#C2A163] text-[#08162A] px-6 py-3.5 rounded-xl font-semibold hover:bg-[#A8874F] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow font-sans text-sm tracking-wide"
>
{isSubmittingContact ? (
<>
<Loader className="w-4 h-4 mr-2 animate-spin" />
Transmitting...
</>
) : (
'Submit Confidential Inquiry'
)}
</button>
</form>
</div>
</div>
</div>
</section>

{/* Candidate Application Section */}
<section id="apply" className="py-20 sm:py-24 bg-[#F7F4EC] dark:bg-[#08162A] border-t border-[#B9C2CE]/20 dark:border-[#1B3047] transition-colors duration-200">
<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="text-center mb-14 sm:mb-16">
<div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#7A5F2E] dark:text-[#C2A163] uppercase mb-3">
  <span>◆</span>
  <span>Executive Candidacy</span>
  <span>◆</span>
</div>
<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0A1A2E] dark:text-white mb-4 tracking-tight">
Join Our Talent Network
</h2>
<div className="w-16 h-0.5 bg-[#C2A163] mx-auto mb-4"></div>
<p className="text-base sm:text-lg text-[#4A5568] dark:text-[#A9B8CC] max-w-2xl mx-auto leading-relaxed font-sans">
Are you an exceptional leader seeking your next career milestone? Register confidentially to be matched with exclusive board and executive positions.
</p>
</div>

<div className="bg-white dark:bg-[#0E223D] rounded-2xl shadow-xl p-6 sm:p-10 border border-[#B9C2CE]/30 dark:border-[#1B3047] transition-colors duration-200">
<form onSubmit={handleCandidateSubmit} className="space-y-6">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
<div>
<label htmlFor="candidate-name" className="block text-xs font-semibold tracking-wider uppercase text-[#0A1A2E] dark:text-[#A9B8CC] mb-2">
<User className="inline w-3.5 h-3.5 mr-1 text-[#7A5F2E] dark:text-[#C2A163]" />
Full Name *
</label>
<input
type="text"
id="candidate-name"
required
value={candidateForm.full_name}
onChange={(e) => setCandidateForm({...candidateForm, full_name: e.target.value})}
className="w-full px-4 py-3 border border-[#B9C2CE]/50 dark:border-[#1B3047] bg-[#F7F4EC]/40 dark:bg-[#08162A] text-[#0A1A2E] dark:text-white rounded-xl focus:ring-2 focus:ring-[#C2A163] focus:border-transparent transition-colors text-sm"
placeholder="Jane Doe"
/>
</div>

<div>
<label htmlFor="candidate-citizenship" className="block text-xs font-semibold tracking-wider uppercase text-[#0A1A2E] dark:text-[#A9B8CC] mb-2">
<MapPin className="inline w-3.5 h-3.5 mr-1 text-[#7A5F2E] dark:text-[#C2A163]" />
Citizenship *
</label>
<input
type="text"
id="candidate-citizenship"
required
value={candidateForm.citizenship}
onChange={(e) => setCandidateForm({...candidateForm, citizenship: e.target.value})}
className="w-full px-4 py-3 border border-[#B9C2CE]/50 dark:border-[#1B3047] bg-[#F7F4EC]/40 dark:bg-[#08162A] text-[#0A1A2E] dark:text-white rounded-xl focus:ring-2 focus:ring-[#C2A163] focus:border-transparent transition-colors text-sm"
placeholder="e.g. Bangladeshi / British"
/>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
<div>
<label htmlFor="candidate-phone" className="block text-xs font-semibold tracking-wider uppercase text-[#0A1A2E] dark:text-[#A9B8CC] mb-2">
<Phone className="inline w-3.5 h-3.5 mr-1 text-[#7A5F2E] dark:text-[#C2A163]" />
Phone Number *
</label>
<input
type="tel"
id="candidate-phone"
required
value={candidateForm.phone}
onChange={(e) => setCandidateForm({...candidateForm, phone: e.target.value})}
className="w-full px-4 py-3 border border-[#B9C2CE]/50 dark:border-[#1B3047] bg-[#F7F4EC]/40 dark:bg-[#08162A] text-[#0A1A2E] dark:text-white rounded-xl focus:ring-2 focus:ring-[#C2A163] focus:border-transparent transition-colors text-sm"
placeholder="+880 1973 000000"
/>
</div>

<div>
<label htmlFor="candidate-email" className="block text-xs font-semibold tracking-wider uppercase text-[#0A1A2E] dark:text-[#A9B8CC] mb-2">
<Mail className="inline w-3.5 h-3.5 mr-1 text-[#7A5F2E] dark:text-[#C2A163]" />
Email Address *
</label>
<input
type="email"
id="candidate-email"
required
value={candidateForm.email}
onChange={(e) => setCandidateForm({...candidateForm, email: e.target.value})}
className="w-full px-4 py-3 border border-[#B9C2CE]/50 dark:border-[#1B3047] bg-[#F7F4EC]/40 dark:bg-[#08162A] text-[#0A1A2E] dark:text-white rounded-xl focus:ring-2 focus:ring-[#C2A163] focus:border-transparent transition-colors text-sm"
placeholder="jane.doe@executive.com"
/>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
<div>
<label htmlFor="candidate-role" className="block text-xs font-semibold tracking-wider uppercase text-[#0A1A2E] dark:text-[#A9B8CC] mb-2">
<Briefcase className="inline w-3.5 h-3.5 mr-1 text-[#7A5F2E] dark:text-[#C2A163]" />
Primary Seniority Level *
</label>
<select
id="candidate-role"
required
value={candidateForm.main_role}
onChange={(e) => setCandidateForm({...candidateForm, main_role: e.target.value})}
className="w-full px-4 py-3 border border-[#B9C2CE]/50 dark:border-[#1B3047] bg-[#F7F4EC]/40 dark:bg-[#08162A] text-[#0A1A2E] dark:text-white rounded-xl focus:ring-2 focus:ring-[#C2A163] focus:border-transparent transition-colors text-sm"
>
<option value="">Select your seniority tier</option>
<option value="Executive/C-Suite">Executive / C-Suite (CEO, CFO, CTO, CMO, COO)</option>
<option value="Senior Management">Senior Management (VP, Director, General Manager)</option>
<option value="Middle Management">Middle Management (Department Head, Lead)</option>
<option value="Technical Lead">Technical Principal / Architect</option>
<option value="Specialist">Subject Matter Specialist</option>
<option value="Other">Other</option>
</select>
</div>

<div>
<label htmlFor="candidate-sector" className="block text-xs font-semibold tracking-wider uppercase text-[#0A1A2E] dark:text-[#A9B8CC] mb-2">
<Building className="inline w-3.5 h-3.5 mr-1 text-[#7A5F2E] dark:text-[#C2A163]" />
Core Sector *
</label>
<select
id="candidate-sector"
required
value={candidateForm.business_sector}
onChange={(e) => setCandidateForm({...candidateForm, business_sector: e.target.value})}
className="w-full px-4 py-3 border border-[#B9C2CE]/50 dark:border-[#1B3047] bg-[#F7F4EC]/40 dark:bg-[#08162A] text-[#0A1A2E] dark:text-white rounded-xl focus:ring-2 focus:ring-[#C2A163] focus:border-transparent transition-colors text-sm"
>
<option value="">Select primary sector</option>
<option value="Technology">Technology & Software</option>
<option value="Healthcare">Healthcare & Life Sciences</option>
<option value="FMCG">FMCG & Consumer Goods</option>
<option value="Financial Services">Financial Services & FinTech</option>
<option value="Apparel">Apparel & Global Sourcing</option>
<option value="Manufacturing">Manufacturing & Engineering</option>
<option value="Consulting">Consulting & Strategy</option>
<option value="Hospitality">Hospitality & Real Estate</option>
<option value="Other">Other</option>
</select>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
<div>
<label htmlFor="candidate-title" className="block text-xs font-semibold tracking-wider uppercase text-[#0A1A2E] dark:text-[#A9B8CC] mb-2">
Current Job Title *
</label>
<input
type="text"
id="candidate-title"
required
value={candidateForm.job_title}
onChange={(e) => setCandidateForm({...candidateForm, job_title: e.target.value})}
className="w-full px-4 py-3 border border-[#B9C2CE]/50 dark:border-[#1B3047] bg-[#F7F4EC]/40 dark:bg-[#08162A] text-[#0A1A2E] dark:text-white rounded-xl focus:ring-2 focus:ring-[#C2A163] focus:border-transparent transition-colors text-sm"
placeholder="e.g. Chief Operating Officer"
/>
</div>

<div>
<label htmlFor="candidate-employer" className="block text-xs font-semibold tracking-wider uppercase text-[#0A1A2E] dark:text-[#A9B8CC] mb-2">
Current Employer *
</label>
<input
type="text"
id="candidate-employer"
required
value={candidateForm.current_employer}
onChange={(e) => setCandidateForm({...candidateForm, current_employer: e.target.value})}
className="w-full px-4 py-3 border border-[#B9C2CE]/50 dark:border-[#1B3047] bg-[#F7F4EC]/40 dark:bg-[#08162A] text-[#0A1A2E] dark:text-white rounded-xl focus:ring-2 focus:ring-[#C2A163] focus:border-transparent transition-colors text-sm"
placeholder="e.g. Global Holdings Ltd"
/>
</div>
</div>

<div>
<label htmlFor="candidate-linkedin" className="block text-xs font-semibold tracking-wider uppercase text-[#0A1A2E] dark:text-[#A9B8CC] mb-2">
<Linkedin className="inline w-3.5 h-3.5 mr-1 text-[#7A5F2E] dark:text-[#C2A163]" />
LinkedIn Profile URL *
</label>
<input
type="url"
id="candidate-linkedin"
required
value={candidateForm.linkedin_url}
onChange={(e) => setCandidateForm({...candidateForm, linkedin_url: e.target.value})}
className="w-full px-4 py-3 border border-[#B9C2CE]/50 dark:border-[#1B3047] bg-[#F7F4EC]/40 dark:bg-[#08162A] text-[#0A1A2E] dark:text-white rounded-xl focus:ring-2 focus:ring-[#C2A163] focus:border-transparent transition-colors text-sm"
placeholder="https://linkedin.com/in/yourprofile"
/>
</div>

<div>
<label htmlFor="candidate-cv" className="block text-xs font-semibold tracking-wider uppercase text-[#0A1A2E] dark:text-[#A9B8CC] mb-2">
<FileText className="inline w-3.5 h-3.5 mr-1 text-[#7A5F2E] dark:text-[#C2A163]" />
Confidential CV / Executive Bio (Optional)
</label>
<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#B9C2CE]/50 dark:border-[#1B3047] border-dashed rounded-xl bg-[#F7F4EC]/30 dark:bg-[#08162A]/60 hover:border-[#C2A163] transition-colors">
<div className="space-y-2 text-center">
<Upload className="mx-auto h-10 w-10 text-[#C2A163]" />
<div className="flex text-sm text-[#4A5568] dark:text-[#A9B8CC]">
<label
htmlFor="candidate-cv"
className="relative cursor-pointer bg-white dark:bg-[#0E223D] px-2.5 py-1 rounded-md font-semibold text-[#7A5F2E] dark:text-[#C2A163] hover:underline focus-within:outline-none border border-[#B9C2CE]/30 dark:border-[#1B3047]"
>
<span>Select file</span>
<input
id="candidate-cv"
name="candidate-cv"
type="file"
className="sr-only"
accept=".pdf,.doc,.docx"
onChange={handleFileChange}
/>
</label>
<p className="pl-2 self-center">or drag and drop</p>
</div>
<p className="text-xs text-[#A9B8CC]">PDF, DOC, DOCX up to 5MB</p>
{cvFile && (
<p className="text-xs text-[#7A5F2E] dark:text-[#C2A163] font-semibold bg-[#C2A163]/10 py-1 px-2 rounded">{cvFile.name}</p>
)}
</div>
</div>
</div>

{applicationError && (
<div className="bg-[#A23B3B]/10 border border-[#A23B3B] rounded-xl p-4">
<div className="flex items-center">
<AlertCircle className="w-5 h-5 text-[#A23B3B] mr-2 flex-shrink-0" />
<p className="text-[#A23B3B] text-sm font-medium">{applicationError}</p>
</div>
</div>
)}
{applicationSuccess && (
<div className="bg-[#2F6B4F]/10 border border-[#2F6B4F] rounded-xl p-4">
<div className="flex items-center">
<CheckCircle className="w-5 h-5 text-[#2F6B4F] mr-2 flex-shrink-0" />
<p className="text-[#2F6B4F] text-sm font-medium">
Application registered confidentially. Our leadership search panel will review your credentials against active and confidential mandates.
</p>
</div>
</div>
)}

<button
type="submit"
disabled={isSubmittingApplication}
className="w-full bg-[#C2A163] text-[#08162A] px-6 py-4 rounded-xl font-semibold hover:bg-[#A8874F] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-base shadow-md font-sans tracking-wide"
>
{isSubmittingApplication ? (
<>
<Loader className="w-5 h-5 mr-2 animate-spin" />
Registering Candidacy...
</>
) : (
'Register Executive Candidacy'
)}
</button>
</form>
</div>
</div>
</section>

{/* Got Questions? Frequently Asked Questions Section */}
<section id="faq" className="py-20 sm:py-24 bg-[#EFE9D9]/50 dark:bg-[#071322] border-t border-[#B9C2CE]/30 dark:border-[#1B3047] transition-colors duration-200">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12 sm:mb-16">
      <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#7A5F2E] dark:text-[#C2A163] uppercase mb-3">
        <span>◆</span>
        <span>Got Questions?</span>
        <span>◆</span>
      </div>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0A1A2E] dark:text-white mb-4 tracking-tight">
        Frequently Asked Questions
      </h2>
      <div className="w-16 h-0.5 bg-[#C2A163] mx-auto mb-4"></div>
      <p className="text-base sm:text-lg text-[#4A5568] dark:text-[#A9B8CC] max-w-2xl mx-auto leading-relaxed font-sans">
        Common questions from founders, CEOs, and HR leaders regarding our executive search practice.
      </p>
    </div>

    <div className="space-y-4">
      {HOME_FAQS.map((faq, idx) => {
        const isOpen = openFaq === idx;
        return (
          <div
            key={idx}
            className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
              isOpen
                ? 'bg-white dark:bg-[#0E223D] border-[#C2A163]/60 shadow-lg'
                : 'bg-white/80 dark:bg-[#0E223D]/60 hover:bg-white dark:hover:bg-[#0E223D] border-[#B9C2CE]/30 dark:border-[#1B3047]'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenFaq(isOpen ? null : idx)}
              className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none transition-colors"
              aria-expanded={isOpen}
            >
              <span className="font-serif text-base sm:text-lg font-semibold text-[#0A1A2E] dark:text-white leading-snug">
                {faq.q}
              </span>
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                  isOpen
                    ? 'bg-[#C2A163] text-[#08162A] rotate-180'
                    : 'bg-[#B9C2CE]/20 dark:bg-[#1B3047] text-[#7A5F2E] dark:text-[#C2A163]'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </span>
            </button>
            {isOpen && (
              <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-[#4A5568] dark:text-[#A9B8CC] leading-relaxed border-t border-[#B9C2CE]/20 dark:border-[#1B3047]/60">
                <p>{faq.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
</section>

{/* Monthly Executive Briefing (Newsletter) */}
<NewsletterSection className="py-16 sm:py-20 bg-[#F7F4EC] dark:bg-[#08162A] border-t border-[#B9C2CE]/20 dark:border-[#1B3047] transition-colors duration-200" />
</>
)}

{/* Footer: Obsidian Navy with champagne rule & diamond motif */}
<footer className="bg-[#EFE9D9]/80 dark:bg-[#06101E] text-[#4A5568] dark:text-[#A9B8CC] py-14 border-t border-[#C2A163]/40 dark:border-[#C2A163]/30 transition-colors duration-200">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
<div className="col-span-1 md:col-span-2">
<img src="/logo.png?v=2" alt="TALENTO" className="h-14 sm:h-16 md:h-18 w-auto object-contain rounded-lg mb-5" />
<p className="text-[#4A5568] dark:text-[#A9B8CC] leading-relaxed max-w-md text-sm font-sans mb-4">
TALENTO is a premier boutique headhunting firm specializing in executive search, board advisory, and leadership talent acquisition across Asia-Pacific and global frontiers.
</p>
<div className="flex items-center gap-2 text-xs text-[#7A5F2E] dark:text-[#C2A163]">
  <span>◆</span>
  <span>Discretion</span>
  <span>·</span>
  <span>Precision</span>
  <span>·</span>
  <span>Partnership</span>
</div>
</div>

<div>
<h3 className="text-base font-serif font-bold mb-4 text-[#0A1A2E] dark:text-white uppercase tracking-wider">Practice Areas</h3>
<ul className="space-y-2.5 text-sm text-[#4A5568] dark:text-[#A9B8CC] font-sans">
<li><a href="#services" className="hover:text-[#7A5F2E] dark:hover:text-[#C2A163] transition-colors">C-Suite Talent Hunt</a></li>
<li><a href="#services" className="hover:text-[#7A5F2E] dark:hover:text-[#C2A163] transition-colors">Executive Search</a></li>
<li><a href="#services" className="hover:text-[#7A5F2E] dark:hover:text-[#C2A163] transition-colors">Interim Leadership</a></li>
<li><a href="#industries" className="hover:text-[#7A5F2E] dark:hover:text-[#C2A163] transition-colors">Sector Coverage</a></li>
<li><a href="#faq" className="hover:text-[#7A5F2E] dark:hover:text-[#C2A163] transition-colors">Frequently Asked Questions</a></li>
</ul>
</div>

<div>
<h3 className="text-base font-serif font-bold mb-4 text-[#0A1A2E] dark:text-white uppercase tracking-wider">Contact & Inquiries</h3>
<ul className="space-y-2.5 text-sm text-[#4A5568] dark:text-[#A9B8CC] font-sans">
<li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#7A5F2E] dark:text-[#C2A163]" /> info@talento-glb.com</li>
<li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#7A5F2E] dark:text-[#C2A163]" /> +880 1973 591514</li>
<li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[#7A5F2E] dark:text-[#C2A163] mt-0.5 flex-shrink-0" /> Plot 37, Floor 3, Road 11, Block H, Banani, Dhaka-1213</li>
</ul>
</div>
</div>

<div className="border-t border-[#B9C2CE]/40 dark:border-[#1B3047] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#718096] dark:text-[#A9B8CC]/80 gap-4">
<p>&copy; 2026 TALENTO. All rights reserved. Boutique Executive Search & Leadership Recruitment.</p>
<div className="flex items-center gap-4">
  <a href="#home" className="hover:text-[#7A5F2E] dark:hover:text-[#C2A163] transition-colors">Back to Top ↑</a>
</div>
</div>
</div>
</footer>
<WhatsAppWidget />
</div>
);
}

export default App;
