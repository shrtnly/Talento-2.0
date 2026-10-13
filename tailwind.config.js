module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // This is important for the dark mode to work
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Manrope', 'Inter', 'sans-serif'],
        display: ['Manrope', 'Inter', 'sans-serif'],
        mono: ['Consolas', 'Courier New', 'monospace'],
        inter: ['Inter', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
        consolas: ['Consolas', 'Courier New', 'monospace'],
      },
      colors: {
        // Neutral palette tuned to user requested dark mode specification:
        // Background: #131413 | Card/Box: #181A19
        gray: {
          50: '#f7f8f7',
          100: '#eff1ef',
          200: '#dde0dd',
          300: '#bdc2bd',
          400: '#8c948c',
          500: '#5f665f',
          600: '#333733',
          700: '#252927', // borders & subtle divider lines for dark mode
          800: '#181a19', // EXACT CARD / BOX COLOR (#181A19)
          900: '#131413', // EXACT BACKGROUND COLOR (#131413)
          950: '#0d0e0d', // deepest base layer
        },
        dark: {
          base: '#131413',     // exact requested background color
          surface: '#181a19',  // exact requested card/box color
          elevated: '#212422', // elevated card/modal state
          border: '#282b29',   // card border
          hover: '#222523',    // card hover state
          muted: '#8c948c',    // secondary text
          text: '#eff1ef',     // primary text
        },
        // Dedicated Navy palette anchored on #0a1a30 logo background
        navy: {
          50: '#f0f4f9',
          100: '#dee7f3',
          200: '#bccde5',
          300: '#90acd2',
          400: '#5f87bc',
          500: '#3967a2',
          600: '#254e83',
          700: '#173763',
          800: '#0e223d',
          900: '#0a1a30', // exact logo navy
          950: '#06101e',
        },
        // Talento Brand Palette - Prestige Champagne Gold anchored on #c2a26b logo emblem
        talento: {
          50: '#faf6ee',
          100: '#f6ecd8',
          200: '#eedbb6',
          300: '#e0c797',
          400: '#d2b47c',
          500: '#c2a26b', // exact logo gold
          600: '#9e7d47', // rich executive gold for high contrast
          700: '#7e6030', // deep bronze gold
          800: '#5f4720',
          900: '#3f2e12',
          950: '#241a0a',
        },
        // Gold alias for design flexibility
        gold: {
          50: '#faf6ee',
          100: '#f6ecd8',
          200: '#eedbb6',
          300: '#e0c797',
          400: '#d2b47c',
          500: '#c2a26b',
          600: '#9e7d47',
          700: '#7e6030',
          800: '#5f4720',
          900: '#3f2e12',
          950: '#241a0a',
        }
      }
    },
  },
  plugins: [],
}