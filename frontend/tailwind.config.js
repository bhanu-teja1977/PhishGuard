/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a0f1c',
          800: '#111827',
          700: '#1f2937',
        },
        cyber: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          accent: '#0ea5e9',
        }
      }
    },
  },
  plugins: [],
}
