/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7c3aed',
          hover: '#6d28d9',
          light: '#7c3aed20',
          border: '#7c3aed40',
        },
        surface: {
          DEFAULT: '#18181b',
          hover: '#1f1f23',
        },
        border: '#27272a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}