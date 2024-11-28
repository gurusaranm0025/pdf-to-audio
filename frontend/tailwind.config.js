/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dusk-ame': '#581EB1',
        'lilac-gray': '#BDB7C4',
        'light-slate': '#76828F',
        'dusty-indigo': '#68679A',
        'mauve': '#9C829C',
      }
    },
  },
  plugins: [],
}

