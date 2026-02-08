/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#03f8bd',
          secondary: '#8869b4',
          tertiary: '#634c82',
        },
      },
    },
  },
  plugins: [],
}
