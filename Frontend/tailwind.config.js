/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // TAGZILLA color palette
        tagzilla: {
          cream: '#F5DFBB',     // Main cream/beige color
          teal: '#0E9594',      // Main teal color  
          dark: '#127475',      // Dark teal color
        },
        primary: {
          50: '#f0fdfc',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#0E9594',       // Main teal
          600: '#0d7377',
          700: '#0f5f63',
          800: '#115e59',
          900: '#127475',       // Dark teal
          950: '#042f2e',
        },
        secondary: {
          50: '#fefdf9',
          100: '#fefbf0',
          200: '#fdf6e1',
          300: '#fbefc4',
          400: '#f8e397',
          500: '#F5DFBB',       // Main cream
          600: '#ebc77a',
          700: '#d4a548',
          800: '#b0853c',
          900: '#8f6d34',
          950: '#513a1a',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
