/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fifa: {
          blue: '#1D3557',
          gold: '#F4A261',
          green: '#10B981',
          dark: '#0F172A',
          card: '#1E293B'
        }
      }
    },
  },
  plugins: [],
}
