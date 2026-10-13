import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    // Check for saved theme preference or default to dark mode
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    // Apply theme to document element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save theme preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const handleThemeSwitch = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={handleThemeSwitch}
      className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-[#1C2B44] border border-[#B9C2CE]/40 dark:border-[#B9C2CE]/20 text-[#0A1A30] dark:text-[#C2A26B] shadow-sm hover:shadow hover:bg-[#F7F4EC] dark:hover:bg-[#0A1A30] active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2A26B]"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Sun icon: visible in dark mode, smoothly rotates & expands */}
      <Sun
        className={`w-[18px] h-[18px] text-[#C2A26B] transition-all duration-300 ease-out absolute ${
          isDark
            ? 'rotate-0 scale-100 opacity-100'
            : 'rotate-90 scale-0 opacity-0 pointer-events-none'
        }`}
        strokeWidth={1.75}
      />

      {/* Moon icon: visible in light mode, smoothly rotates & expands */}
      <Moon
        className={`w-[18px] h-[18px] text-[#0A1A30] dark:text-[#B9C2CE] transition-all duration-300 ease-out absolute ${
          isDark
            ? '-rotate-90 scale-0 opacity-0 pointer-events-none'
            : 'rotate-0 scale-100 opacity-100'
        }`}
        strokeWidth={1.75}
      />
    </button>
  );
};

export default ThemeToggle;