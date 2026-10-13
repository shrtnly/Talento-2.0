import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  Save, 
  ArrowLeft, 
  Loader, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Settings,
  ChevronDown,
  Bell,
  Shield,
  CreditCard,
  Download,
  Upload,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  Target,
  TrendingUp,
  Users,
  MessageSquare,
  Star,
  Edit3,
  Plus,
  ExternalLink,
  Activity
} from 'lucide-react';
import { DatabaseService } from '../services/database';
import type { UserProfile, AuthUser } from '../lib/supabase';
import ThemeToggle from '../components/ThemeToggle';

interface DashboardPageProps {
  user: AuthUser;
  onBack: () => void;
  onSignOut: () => void;
}

interface ProfileCompletionItem {
  id: string;
  label: string;
  completed: boolean;
  weight: number;
}

export function DashboardPage({ user, onBack, onSignOut }: DashboardPageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration
  const [profileData, setProfileData] = useState({
    phone: '',
    location: '',
    bio: '',
    company: '',
    position: '',
    experience: '',
    skills: [] as string[],
    education: '',
    certifications: [] as string[],
    linkedin: '',
    website: ''
  });

  const [stats] = useState({
    profileViews: 0,
    applications: 0,
    interviews: 0,
    offers: 0
  });

  const [recentActivity] = useState([
    { id: 1, type: 'profile_view', message: 'Your profile was viewed by Tech Corp', time: '2 hours ago' },
    { id: 2, type: 'application', message: 'Application submitted to StartupXYZ', time: '1 day ago' },
    { id: 3, type: 'interview', message: 'Interview scheduled with InnovateCo', time: '2 days ago' },
    { id: 4, type: 'message', message: 'New message from recruiter', time: '3 days ago' }
  ]);

  const [notifications] = useState([
    { id: 1, title: 'Profile Update', message: 'Complete your profile to increase visibility', type: 'info', unread: true },
    { id: 2, title: 'New Opportunity', message: 'Senior Developer position matches your skills', type: 'success', unread: true },
    { id: 3, title: 'Interview Reminder', message: 'Interview with TechCorp tomorrow at 2 PM', type: 'warning', unread: false }
  ]);

  useEffect(() => {
    loadProfile();
  }, [user.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const result = await DatabaseService.getProfile(user.id);
      if (result.success && result.data) {
        setProfile(result.data);
      } else {
        const createResult = await DatabaseService.createProfile(user.id, user.email?.split('@')[0] || 'User');
        if (createResult.success) {
          const newResult = await DatabaseService.getProfile(user.id);
          if (newResult.success && newResult.data) {
            setProfile(newResult.data);
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const calculateProfileCompletion = (): { percentage: number; items: ProfileCompletionItem[] } => {
    const items: ProfileCompletionItem[] = [
      { id: 'photo', label: 'Profile Photo', completed: !!profile?.profile_photo_url, weight: 15 },
      { id: 'name', label: 'Full Name', completed: !!profile?.full_name, weight: 10 },
      { id: 'phone', label: 'Phone Number', completed: !!profileData.phone, weight: 10 },
      { id: 'location', label: 'Location', completed: !!profileData.location, weight: 10 },
      { id: 'bio', label: 'Bio/Summary', completed: !!profileData.bio, weight: 15 },
      { id: 'experience', label: 'Work Experience', completed: !!profileData.experience, weight: 20 },
      { id: 'education', label: 'Education', completed: !!profileData.education, weight: 10 },
      { id: 'skills', label: 'Skills', completed: profileData.skills.length > 0, weight: 10 }
    ];

    const completedWeight = items.filter(item => item.completed).reduce((sum, item) => sum + item.weight, 0);
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const percentage = Math.round((completedWeight / totalWeight) * 100);

    return { percentage, items };
  };

  const handleProfileUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUpdatingProfile(true);
    setProfileError('');
    setProfileSuccess('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const fullName = formData.get('fullName') as string;

    try {
      const result = await DatabaseService.updateProfile(user.id, { full_name: fullName });
      if (result.success) {
        setProfile(prev => prev ? { ...prev, full_name: fullName } : null);
        setProfileSuccess('Profile updated successfully!');
        setTimeout(() => setProfileSuccess(''), 3000);
      } else {
        setProfileError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileError('An unexpected error occurred');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUpdatingPassword(true);
    setPasswordError('');
    setPasswordSuccess('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      setIsUpdatingPassword(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      setIsUpdatingPassword(false);
      return;
    }

    try {
      const result = await DatabaseService.updateUserPassword(newPassword);
      if (result.success) {
        setPasswordSuccess('Password updated successfully!');
        form.reset();
        setTimeout(() => setPasswordSuccess(''), 3000);
      } else {
        setPasswordError(result.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError('An unexpected error occurred');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileError('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setProfileError('Image must be smaller than 2MB');
      return;
    }

    setIsUploadingPhoto(true);
    setProfileError('');

    try {
      const result = await DatabaseService.uploadProfilePhoto(file, user.id);
      if (result.success && result.photoUrl) {
        setProfile(prev => prev ? { ...prev, profile_photo_url: result.photoUrl } : null);
        setProfileSuccess('Profile photo updated successfully!');
        setTimeout(() => setProfileSuccess(''), 3000);
      } else {
        setProfileError(result.error || 'Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setProfileError('An unexpected error occurred while uploading photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await DatabaseService.signOut();
      onSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const { percentage: completionPercentage, items: completionItems } = calculateProfileCompletion();

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-[#F7F4EC] dark:bg-[#0A1A30] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#C2A26B] mx-auto mb-4" />
          <p className="text-[#4A5568] dark:text-[#B9C2CE]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-[#0A1A30] border border-[#C2A26B]/30 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-3xl font-bold font-heading mb-2 text-[#C2A26B]">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-[#B9C2CE] text-lg">Ready to take the next step in your career?</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-[#C2A26B]/50 flex items-center justify-center overflow-hidden">
              {profile?.profile_photo_url ? (
                <img
                  src={profile.profile_photo_url}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-12 h-12 text-[#C2A26B]" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#1C2B44] rounded-xl p-6 shadow-sm border border-[#B9C2CE]/30 dark:border-[#B9C2CE]/15">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#4A5568] dark:text-[#B9C2CE]">Profile Views</p>
              <p className="text-2xl font-bold font-mono tracking-tight text-[#0A1A30] dark:text-white">{stats.profileViews}</p>
            </div>
            <div className="w-12 h-12 bg-[#C2A26B]/15 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-[#7A5F2E] dark:text-[#C2A26B]" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-[#2F6B4F] mr-1" />
            <span className="text-[#2F6B4F] font-mono text-xs">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C2B44] rounded-xl p-6 shadow-sm border border-[#B9C2CE]/30 dark:border-[#B9C2CE]/15">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#4A5568] dark:text-[#B9C2CE]">Applications</p>
              <p className="text-2xl font-bold font-mono tracking-tight text-[#0A1A30] dark:text-white">{stats.applications}</p>
            </div>
            <div className="w-12 h-12 bg-[#C2A26B]/15 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#7A5F2E] dark:text-[#C2A26B]" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-[#2F6B4F] mr-1" />
            <span className="text-[#2F6B4F] font-mono text-xs">+3 this week</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C2B44] rounded-xl p-6 shadow-sm border border-[#B9C2CE]/30 dark:border-[#B9C2CE]/15">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#4A5568] dark:text-[#B9C2CE]">Interviews</p>
              <p className="text-2xl font-bold font-mono tracking-tight text-[#0A1A30] dark:text-white">{stats.interviews}</p>
            </div>
            <div className="w-12 h-12 bg-[#2F6B4F]/15 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#2F6B4F]" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Calendar className="w-4 h-4 text-[#7A5F2E] dark:text-[#C2A26B] mr-1" />
            <span className="text-[#7A5F2E] dark:text-[#C2A26B] font-mono text-xs">1 scheduled</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C2B44] rounded-xl p-6 shadow-sm border border-[#B9C2CE]/30 dark:border-[#B9C2CE]/15">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#4A5568] dark:text-[#B9C2CE]">Offers</p>
              <p className="text-2xl font-bold font-mono tracking-tight text-[#0A1A30] dark:text-white">{stats.offers}</p>
            </div>
            <div className="w-12 h-12 bg-[#C2A26B]/15 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-[#7A5F2E] dark:text-[#C2A26B]" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Star className="w-4 h-4 text-[#7A5F2E] dark:text-[#C2A26B] mr-1" />
            <span className="text-[#7A5F2E] dark:text-[#C2A26B] text-xs">Pending review</span>
          </div>
        </div>
      </div>

      {/* Profile Completion & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Completion */}
        <div className="bg-white dark:bg-[#1C2B44] rounded-2xl p-8 shadow-sm border border-[#B9C2CE]/30 dark:border-[#B9C2CE]/15">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold font-heading text-[#0A1A30] dark:text-white">Profile Completion</h3>
            <span className="text-2xl font-bold font-mono tracking-tight text-[#7A5F2E] dark:text-[#C2A26B]">{completionPercentage}%</span>
          </div>
          
          <div className="mb-6">
            <div className="w-full bg-[#F7F4EC] dark:bg-[#0A1A30] border border-[#B9C2CE]/20 rounded-full h-3">
              <div 
                className="bg-[#C2A26B] h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            {completionItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  {item.completed ? (
                    <CheckCircle className="w-5 h-5 text-[#2F6B4F] mr-3" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-[#B9C2CE] rounded-full mr-3"></div>
                  )}
                  <span className={`text-sm ${item.completed ? 'text-[#0A1A30] dark:text-white' : 'text-[#4A5568]/70 dark:text-[#9AA5B4]'}`}>
                    {item.label}
                  </span>
                </div>
                {!item.completed && (
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="text-xs text-[#7A5F2E] dark:text-[#C2A26B] hover:underline font-semibold"
                  >
                    Complete
                  </button>
                )}
              </div>
            ))}
          </div>

          {completionPercentage < 100 && (
            <div className="mt-6 p-4 bg-[#F7F4EC] dark:bg-[#0A1A30] rounded-lg border border-[#B9C2CE]/20">
              <p className="text-sm text-[#4A5568] dark:text-[#B9C2CE]">
                <strong className="text-[#0A1A30] dark:text-white">Tip:</strong> Complete your profile to increase visibility by up to 40%!
              </p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-[#1C2B44] rounded-2xl p-8 shadow-sm border border-[#B9C2CE]/30 dark:border-[#B9C2CE]/15">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold font-heading text-[#0A1A30] dark:text-white">Recent Activity</h3>
            <button className="text-sm text-[#7A5F2E] dark:text-[#C2A26B] hover:text-[#0A1A30] dark:hover:text-white font-semibold">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#C2A26B]/15 rounded-full flex items-center justify-center flex-shrink-0">
                  {activity.type === 'profile_view' && <Eye className="w-4 h-4 text-[#7A5F2E] dark:text-[#C2A26B]" />}
                  {activity.type === 'application' && <FileText className="w-4 h-4 text-[#7A5F2E] dark:text-[#C2A26B]" />}
                  {activity.type === 'interview' && <Calendar className="w-4 h-4 text-[#7A5F2E] dark:text-[#C2A26B]" />}
                  {activity.type === 'message' && <MessageSquare className="w-4 h-4 text-[#7A5F2E] dark:text-[#C2A26B]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#0A1A30] dark:text-white">{activity.message}</p>
                  <p className="text-xs text-[#4A5568]/80 dark:text-[#9AA5B4] mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-[#1C2B44] rounded-2xl p-8 shadow-sm border border-[#B9C2CE]/30 dark:border-[#B9C2CE]/15">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold font-heading text-[#0A1A30] dark:text-white">Profile Information</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[#4A5568] dark:text-[#B9C2CE]">Completion:</span>
            <span className="text-sm font-semibold font-mono text-[#7A5F2E] dark:text-[#C2A26B]">{completionPercentage}%</span>
          </div>
        </div>
        
        {/* Profile Photo Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full bg-[#F7F4EC] dark:bg-[#0A1A30] border-2 border-[#C2A26B]/50 flex items-center justify-center overflow-hidden ring-4 ring-white dark:ring-[#1C2B44] shadow-md">
              {profile?.profile_photo_url ? (
                <img
                  src={profile.profile_photo_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-[#7A5F2E] dark:text-[#C2A26B]" />
              )}
            </div>
            <label
              htmlFor="photo-upload"
              className="absolute bottom-2 right-2 bg-[#C2A26B] text-[#0A1A30] p-3 rounded-full cursor-pointer hover:bg-[#A8874F] transition-colors shadow-md hover:shadow-lg"
            >
              {isUploadingPhoto ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Camera className="w-5 h-5" />
              )}
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={isUploadingPhoto}
            />
          </div>
          <p className="text-sm text-[#4A5568]/80 dark:text-[#9AA5B4] mt-3">Click the camera icon to update your photo</p>
        </div>

        {/* Basic Information Form */}
        <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-[#0A1A30] dark:text-[#B9C2CE] mb-2">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-[#7A5F2E] dark:text-[#C2A26B]" />
              </div>
              <input
                id="fullName"
                name="fullName"
                type="text"
                defaultValue={profile?.full_name || ''}
                required
                className="block w-full pl-10 pr-3 py-3 border border-[#B9C2CE]/40 dark:border-[#B9C2CE]/20 rounded-xl focus:ring-2 focus:ring-[#C2A26B] focus:border-transparent transition-all duration-200 bg-[#F7F4EC] dark:bg-[#0A1A30] text-[#0A1A30] dark:text-white focus:bg-white dark:focus:bg-[#0A1A30]"
                placeholder="Your full name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#0A1A30] dark:text-[#B9C2CE] mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[#B9C2CE]" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={user.email || ''}
                disabled
                className="block w-full pl-10 pr-3 py-3 border border-[#B9C2CE]/20 dark:border-[#B9C2CE]/10 rounded-xl bg-[#F7F4EC]/60 dark:bg-[#0A1A30]/60 text-[#4A5568]/60 dark:text-[#B9C2CE]/50 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[#0A1A30] dark:text-[#B9C2CE] mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-[#7A5F2E] dark:text-[#C2A26B]" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                className="block w-full pl-10 pr-3 py-3 border border-[#B9C2CE]/40 dark:border-[#B9C2CE]/20 rounded-xl focus:ring-2 focus:ring-[#C2A26B] focus:border-transparent transition-all duration-200 bg-[#F7F4EC] dark:bg-[#0A1A30] text-[#0A1A30] dark:text-white focus:bg-white dark:focus:bg-[#0A1A30]"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-[#0A1A30] dark:text-[#B9C2CE] mb-2">
              Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-[#7A5F2E] dark:text-[#C2A26B]" />
              </div>
              <input
                id="location"
                name="location"
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                className="block w-full pl-10 pr-3 py-3 border border-[#B9C2CE]/40 dark:border-[#B9C2CE]/20 rounded-xl focus:ring-2 focus:ring-[#C2A26B] focus:border-transparent transition-all duration-200 bg-[#F7F4EC] dark:bg-[#0A1A30] text-[#0A1A30] dark:text-white focus:bg-white dark:focus:bg-[#0A1A30]"
                placeholder="City, Country"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="bio" className="block text-sm font-medium text-[#0A1A30] dark:text-[#B9C2CE] mb-2">
              Professional Summary
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              className="block w-full px-3 py-3 border border-[#B9C2CE]/40 dark:border-[#B9C2CE]/20 rounded-xl focus:ring-2 focus:ring-[#C2A26B] focus:border-transparent transition-all duration-200 bg-[#F7F4EC] dark:bg-[#0A1A30] text-[#0A1A30] dark:text-white focus:bg-white dark:focus:bg-[#0A1A30] resize-none"
              placeholder="Write a brief summary about your professional background and career goals..."
            />
          </div>

          {profileError && (
            <div className="md:col-span-2 bg-[#A23B3B]/10 border border-[#A23B3B]/30 rounded-xl p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-[#A23B3B] mr-2 flex-shrink-0" />
                <p className="text-[#A23B3B] text-sm font-medium">{profileError}</p>
              </div>
            </div>
          )}

          {profileSuccess && (
            <div className="md:col-span-2 bg-[#2F6B4F]/10 border border-[#2F6B4F]/30 rounded-xl p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-[#2F6B4F] mr-2 flex-shrink-0" />
                <p className="text-[#2F6B4F] text-sm font-medium">{profileSuccess}</p>
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="bg-[#C2A26B] text-[#0A1A30] px-6 py-3 rounded-xl font-semibold tracking-wide hover:bg-[#A8874F] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm hover:shadow"
            >
              {isUpdatingProfile ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Professional Information */}
      <div className="bg-white dark:bg-[#1C2B44] rounded-2xl p-8 shadow-sm border border-[#B9C2CE]/30 dark:border-[#B9C2CE]/15">
        <h3 className="text-xl font-semibold font-heading text-[#0A1A30] dark:text-white mb-6">Professional Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-[#0A1A30] dark:text-[#B9C2CE] mb-2">
              Current Company
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-[#7A5F2E] dark:text-[#C2A26B]" />
              </div>
              <input
                id="company"
                name="company"
                type="text"
                value={profileData.company}
                onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                className="block w-full pl-10 pr-3 py-3 border border-[#B9C2CE]/40 dark:border-[#B9C2CE]/20 rounded-xl focus:ring-2 focus:ring-[#C2A26B] focus:border-transparent transition-all duration-200 bg-[#F7F4EC] dark:bg-[#0A1A30] text-[#0A1A30] dark:text-white focus:bg-white dark:focus:bg-[#0A1A30]"
                placeholder="Company name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-[#0A1A30] dark:text-[#B9C2CE] mb-2">
              Current Position
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Target className="h-5 w-5 text-[#7A5F2E] dark:text-[#C2A26B]" />
              </div>
              <input
                id="position"
                name="position"
                type="text"
                value={profileData.position}
                onChange={(e) => setProfileData(prev => ({ ...prev, position: e.target.value }))}
                className="block w-full pl-10 pr-3 py-3 border border-[#B9C2CE]/40 dark:border-[#B9C2CE]/20 rounded-xl focus:ring-2 focus:ring-[#C2A26B] focus:border-transparent transition-all duration-200 bg-[#F7F4EC] dark:bg-[#0A1A30] text-[#0A1A30] dark:text-white focus:bg-white dark:focus:bg-[#0A1A30]"
                placeholder="Job title"
              />
            </div>
          </div>

          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-[#0A1A30] dark:text-[#B9C2CE] mb-2">
              Years of Experience
            </label>
            <select
              id="experience"
              name="experience"
              value={profileData.experience}
              onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
              className="block w-full px-3 py-3 border border-[#B9C2CE]/40 dark:border-[#B9C2CE]/20 rounded-xl focus:ring-2 focus:ring-[#C2A26B] focus:border-transparent transition-all duration-200 bg-[#F7F4EC] dark:bg-[#0A1A30] text-[#0A1A30] dark:text-white focus:bg-white dark:focus:bg-[#0A1A30]"
            >
              <option value="">Select experience level</option>
              <option value="0-1">0-1 years</option>
              <option value="2-3">2-3 years</option>
              <option value="4-6">4-6 years</option>
              <option value="7-10">7-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>

          <div>
            <label htmlFor="education" className="block text-sm font-medium text-[#0A1A30] dark:text-[#B9C2CE] mb-2">
              Education
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GraduationCap className="h-5 w-5 text-[#7A5F2E] dark:text-[#C2A26B]" />
              </div>
              <input
                id="education"
                name="education"
                type="text"
                value={profileData.education}
                onChange={(e) => setProfileData(prev => ({ ...prev, education: e.target.value }))}
                className="block w-full pl-10 pr-3 py-3 border border-[#B9C2CE]/40 dark:border-[#B9C2CE]/20 rounded-xl focus:ring-2 focus:ring-[#C2A26B] focus:border-transparent transition-all duration-200 bg-[#F7F4EC] dark:bg-[#0A1A30] text-[#0A1A30] dark:text-white focus:bg-white dark:focus:bg-[#0A1A30]"
                placeholder="Degree, University"
              />
            </div>
          </div>

          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-[#0A1A30] dark:text-[#B9C2CE] mb-2">
              LinkedIn Profile
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ExternalLink className="h-5 w-5 text-[#7A5F2E] dark:text-[#C2A26B]" />
              </div>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                value={profileData.linkedin}
                onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                className="block w-full pl-10 pr-3 py-3 border border-[#B9C2CE]/40 dark:border-[#B9C2CE]/20 rounded-xl focus:ring-2 focus:ring-[#C2A26B] focus:border-transparent transition-all duration-200 bg-[#F7F4EC] dark:bg-[#0A1A30] text-[#0A1A30] dark:text-white focus:bg-white dark:focus:bg-[#0A1A30]"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-[#0A1A30] dark:text-[#B9C2CE] mb-2">
              Personal Website
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ExternalLink className="h-5 w-5 text-[#7A5F2E] dark:text-[#C2A26B]" />
              </div>
              <input
                id="website"
                name="website"
                type="url"
                value={profileData.website}
                onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                className="block w-full pl-10 pr-3 py-3 border border-[#B9C2CE]/40 dark:border-[#B9C2CE]/20 rounded-xl focus:ring-2 focus:ring-[#C2A26B] focus:border-transparent transition-all duration-200 bg-[#F7F4EC] dark:bg-[#0A1A30] text-[#0A1A30] dark:text-white focus:bg-white dark:focus:bg-[#0A1A30]"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-8">
      {/* Change Password */}
      <div className="bg-white dark:bg-[#1C2B44] rounded-2xl p-8 shadow-sm border border-[#B9C2CE]/30 dark:border-[#B9C2CE]/15">
        <div className="flex items-center mb-6">
          <Shield className="w-6 h-6 text-[#7A5F2E] dark:text-[#C2A26B] mr-3" />
          <h2 className="text-2xl font-semibold font-heading text-[#0A1A30] dark:text-white">Security Settings</h2>
        </div>
        
        <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-md">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-[#0A1A30] dark:text-[#B9C2CE] mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#B9C2CE]" />
              </div>
              <input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                required
                className="block w-full pl-10 pr-10 py-3 border border-[#B9C2CE]/40 dark:border-[#B9C2CE]/20 rounded-xl focus:ring-2 focus:ring-[#C2A26B] focus:border-transparent transition-all duration-200 bg-[#F7F4EC] dark:bg-[#0A1A30] text-[#0A1A30] dark:text-white focus:bg-white dark:focus:bg-[#0A1A30]"
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-[#B9C2CE] hover:text-[#0A1A30] dark:hover:text-white transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-[#B9C2CE] hover:text-[#0A1A30] dark:hover:text-white transition-colors" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#0A1A30] dark:text-[#B9C2CE] mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#B9C2CE]" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="block w-full pl-10 pr-10 py-3 border border-[#B9C2CE]/40 dark:border-[#B9C2CE]/20 rounded-xl focus:ring-2 focus:ring-[#C2A26B] focus:border-transparent transition-all duration-200 bg-[#F7F4EC] dark:bg-[#0A1A30] text-[#0A1A30] dark:text-white focus:bg-white dark:focus:bg-[#0A1A30]"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-[#B9C2CE] hover:text-[#0A1A30] dark:hover:text-white transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-[#B9C2CE] hover:text-[#0A1A30] dark:hover:text-white transition-colors" />
                )}
              </button>
            </div>
          </div>

          {passwordError && (
            <div className="bg-[#A23B3B]/10 border border-[#A23B3B]/30 rounded-xl p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-[#A23B3B] mr-2 flex-shrink-0" />
                <p className="text-[#A23B3B] text-sm font-medium">{passwordError}</p>
              </div>
            </div>
          )}

          {passwordSuccess && (
            <div className="bg-[#2F6B4F]/10 border border-[#2F6B4F]/30 rounded-xl p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-[#2F6B4F] mr-2 flex-shrink-0" />
                <p className="text-[#2F6B4F] text-sm font-medium">{passwordSuccess}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isUpdatingPassword}
            className="bg-[#C2A26B] text-[#0A1A30] px-6 py-3 rounded-xl font-semibold tracking-wide hover:bg-[#A8874F] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm hover:shadow"
          >
            {isUpdatingPassword ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Updating Password...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Update Password
              </>
            )}
          </button>
        </form>
      </div>

      {/* Account Security Info */}
      <div className="bg-white dark:bg-[#1C2B44] rounded-2xl p-8 shadow-sm border border-[#B9C2CE]/30 dark:border-[#B9C2CE]/15">
        <h3 className="text-xl font-semibold font-heading text-[#0A1A30] dark:text-white mb-6">Account Security</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#2F6B4F]/10 dark:bg-[#2F6B4F]/20 rounded-lg border border-[#2F6B4F]/30">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-[#2F6B4F] mr-3" />
              <div>
                <p className="text-sm font-semibold text-[#2F6B4F]">Email Verified</p>
                <p className="text-xs text-[#2F6B4F]/80">Your email address has been verified</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#F7F4EC] dark:bg-[#0A1A30] rounded-lg border border-[#B9C2CE]/30 dark:border-[#B9C2CE]/15">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-[#7A5F2E] dark:text-[#C2A26B] mr-3" />
              <div>
                <p className="text-sm font-semibold text-[#0A1A30] dark:text-white">Secure Password</p>
                <p className="text-xs text-[#4A5568] dark:text-[#B9C2CE]">Your password meets security requirements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F4EC] dark:bg-[#0A1A30] text-[#4A5568] dark:text-[#B9C2CE] transition-colors duration-200">
      {/* Header */}
      <div className="bg-[#F7F4EC]/95 dark:bg-[#0A1A30]/95 shadow-sm border-b border-[#B9C2CE]/20 dark:border-[#B9C2CE]/10 backdrop-blur-sm sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="inline-flex items-center text-[#7A5F2E] dark:text-[#C2A26B] hover:text-[#0A1A30] dark:hover:text-[#F7F4EC] transition-colors mr-6 font-semibold"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </button>
              <img src="/logo.png" alt="TALENTO" className="h-10 w-auto rounded-lg shadow-sm dark:shadow-none" />
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-[#4A5568] hover:text-[#0A1A30] dark:text-[#B9C2CE] dark:hover:text-white transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {notifications.some(n => n.unread) && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#A23B3B] rounded-full"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1C2B44] rounded-xl shadow-xl border border-[#B9C2CE]/30 dark:border-[#B9C2CE]/15 py-2 z-50 max-h-96 overflow-y-auto">
                    <div className="px-4 py-2 border-b border-[#B9C2CE]/20 dark:border-[#B9C2CE]/15">
                      <h3 className="text-sm font-semibold font-heading text-[#0A1A30] dark:text-white">Notifications</h3>
                    </div>
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`px-4 py-3 hover:bg-[#F7F4EC] dark:hover:bg-[#0A1A30]/60 transition-colors ${notification.unread ? 'bg-[#F7F4EC]/70 dark:bg-[#0A1A30]/80' : ''}`}>
                        <div className="flex items-start">
                          <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                            notification.type === 'success' ? 'bg-[#2F6B4F]' :
                            notification.type === 'warning' ? 'bg-[#C2A26B]' : 'bg-[#7A5F2E]'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#0A1A30] dark:text-white">{notification.title}</p>
                            <p className="text-xs text-[#4A5568] dark:text-[#B9C2CE] mt-1">{notification.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-[#F7F4EC] dark:hover:bg-[#1C2B44] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-[#F7F4EC] dark:bg-[#0A1A30] flex items-center justify-center overflow-hidden ring-2 ring-[#C2A26B]/50">
                    {profile?.profile_photo_url ? (
                      <img
                        src={profile.profile_photo_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-[#7A5F2E] dark:text-[#C2A26B]" />
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-[#0A1A30] dark:text-white">
                      {profile?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-[#4A5568]/80 dark:text-[#9AA5B4]">{user.email}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#B9C2CE] transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1C2B44] rounded-xl shadow-xl border border-[#B9C2CE]/30 dark:border-[#B9C2CE]/15 py-2 z-50">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-[#0A1A30] dark:text-[#B9C2CE] hover:bg-[#F7F4EC] dark:hover:bg-[#0A1A30] transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3 text-[#7A5F2E] dark:text-[#C2A26B]" />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('security');
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-[#0A1A30] dark:text-[#B9C2CE] hover:bg-[#F7F4EC] dark:hover:bg-[#0A1A30] transition-colors"
                    >
                      <Shield className="w-4 h-4 mr-3 text-[#7A5F2E] dark:text-[#C2A26B]" />
                      Security
                    </button>
                    <hr className="my-1 border-[#B9C2CE]/20 dark:border-[#B9C2CE]/15" />
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
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#C2A26B] text-[#7A5F2E] dark:text-[#C2A26B] font-semibold'
                  : 'border-transparent text-[#4A5568] dark:text-[#B9C2CE] hover:text-[#0A1A30] dark:hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'profile'
                  ? 'border-[#C2A26B] text-[#7A5F2E] dark:text-[#C2A26B] font-semibold'
                  : 'border-transparent text-[#4A5568] dark:text-[#B9C2CE] hover:text-[#0A1A30] dark:hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Profile
              </div>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'security'
                  ? 'border-[#C2A26B] text-[#7A5F2E] dark:text-[#C2A26B] font-semibold'
                  : 'border-transparent text-[#4A5568] dark:text-[#B9C2CE] hover:text-[#0A1A30] dark:hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'security' && renderSecurityTab()}
      </div>
    </div>
  );
}