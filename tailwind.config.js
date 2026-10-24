/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        forest: {
          50: '#F4F7F4',
          100: '#E5EDE5',
          200: '#DDE8D7',
          300: '#B8D1B0',
          500: '#547659',
          600: '#47634B',
          700: '#39513C',
          800: '#303B34',
          900: '#232D27',
        },
        sage: {
          pill: '#DDE8D7',
          dot: '#47634B',
          text: '#47634B',
        },
        peach: {
          50: '#FDF7F3',
          100: '#FBEFE7',
          200: '#F4D8C7',
          300: '#EBBFA6',
          400: '#E0A686',
        },
        warm: {
          bg1: '#FFF8F1',
          bg2: '#F7F1E8',
          card: '#FFFEFA',
          muted: '#7C8076',
          dark: '#303B34',
        },
      },
    },
  },
  plugins: [],
};
