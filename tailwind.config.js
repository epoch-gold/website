/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'xs': '480px',  // Extra small devices
      'sm': '640px',  // Small devices
      'md': '768px',  // Medium devices
      'lg': '1024px', // Large devices
      'xl': '1280px', // Extra large devices
      '2xl': '1536px', // 2X large devices
      '3xl': '2304px', // 3X large devices
    },
    extend: {},
  },
  plugins: [],
};