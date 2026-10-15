module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // This is important for the dark mode to work
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        heading: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        garamond: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['Consolas', 'Courier New', 'monospace'],
        inter: ['Inter', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
        consolas: ['Consolas', 'Courier New', 'monospace'],
      },
      colors: {
        // 1. Core brand palette
        navy: {
          DEFAULT: '#0A1A30', // Midnight Navy (Primary: main background, headers, footer, primary text on light)
          primary: '#0A1A30',
          slate: '#1C2B44',   // Navy Slate (Deep surface: cards, panels, hover on navy)
          deep: '#06101E',
          50: '#F0F4F9',
          100: '#DEE7F3',
          200: '#BCCDE5',
          300: '#90ACD2',
          400: '#5F87BC',
          500: '#3967A2',
          600: '#254E83',
          700: '#1C2B44',     // Navy Slate
          800: '#122035',
          900: '#0A1A30',     // Midnight Navy
          950: '#06101E',
        },
        champagne: {
          DEFAULT: '#C2A26B', // Champagne Gold (Signature accent: logo, headlines on dark, buttons, icons, dividers)
          hover: '#A8874F',   // Button hover state
          50: '#FAF6EE',
          100: '#F6ECD8',
          200: '#EEDB86',
          300: '#E0C797',
          400: '#D2B47C',
          500: '#C2A26B',     // Signature accent
          600: '#A8874F',     // Darkened hover
          700: '#7A5F2E',     // Deep Bronze
          800: '#5F4720',
          900: '#3F2E12',
        },
        platinum: {
          DEFAULT: '#B9C2CE', // Platinum (Secondary: taglines, secondary text & borders on dark)
          light: '#D3DAE3',
          dark: '#9AA5B4',    // Steel
        },

        // 2. Supporting palette
        ivory: {
          DEFAULT: '#F7F4EC', // Ivory (Light background instead of pure white)
          50: '#FCFBF7',
          100: '#F7F4EC',
          200: '#EFE9D9',
          300: '#E3DCBF',
        },
        graphite: {
          DEFAULT: '#4A5568', // Graphite (Body text on ivory or white)
          light: '#718096',
          dark: '#2D3748',
        },
        steel: {
          DEFAULT: '#9AA5B4', // Steel (Muted text / captions / small print on navy)
          light: '#B4BDC9',
          dark: '#7D8A9A',
        },
        bronze: {
          DEFAULT: '#7A5F2E', // Deep Bronze (Gold text and links on ivory or white)
          hover: '#634C24',
        },
        alert: {
          green: '#2F6B4F',   // Muted deep green for functional alerts
          red: '#A23B3B',     // Muted red for functional alerts
        },

        // Dark mode semantic tokens anchored on Midnight Navy #0A1A30 & Navy Slate #1C2B44
        dark: {
          base: '#0A1A30',     // Midnight Navy
          surface: '#1C2B44',  // Navy Slate
          elevated: '#243553', // Elevated card / modal
          border: '#2B3D5C',   // Subtle border on navy
          hover: '#243553',    // Hover on navy slate
          muted: '#9AA5B4',    // Steel
          text: '#F7F4EC',     // Ivory on dark
        },

        // Neutral gray mapped to brand shades (Midnight Navy dark mode)
        gray: {
          50: '#FAF9F5',
          100: '#F7F4EC',     // Ivory
          200: '#E2E6EA',
          300: '#B9C2CE',     // Platinum
          400: '#9AA5B4',     // Steel
          500: '#718096',
          600: '#4A5568',     // Graphite
          700: '#2B3D5C',     // Navy border
          800: '#1C2B44',     // Navy Slate card
          900: '#0A1A30',     // Midnight Navy base
          950: '#06101E',     // Deepest navy
        },

        // Aliases for backwards-compatibility with existing templates
        talento: {
          50: '#FAF6EE',
          100: '#F6ECD8',
          200: '#EEDB86',
          300: '#E0C797',
          400: '#D2B47C',
          500: '#C2A26B',
          600: '#A8874F',
          700: '#7A5F2E',     // Deep Bronze
          800: '#5F4720',
          900: '#0A1A30',
          950: '#06101E',
        },
        gold: {
          DEFAULT: '#C2A26B',
          hover: '#A8874F',
          500: '#C2A26B',
          600: '#A8874F',
          700: '#7A5F2E',
        }
      }
    },
  },
  plugins: [],
}