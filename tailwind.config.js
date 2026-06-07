/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep': '#050510',
        'card': '#0d0d1a',
        'sidebar': '#080818',
        'gold-1': '#f59e0b',
        'gold-2': '#fbbf24',
        'cyan-1': '#06b6d4',
        'cyan-2': '#22d3ee',
        'background': '#050510',
        'foreground': '#ffffff',
        'muted': '#1a1a2e',
        'border': '#1a2332',
      },
      backgroundColor: {
        'background': '#050510',
        'card': '#0d0d1a',
      },
      textColor: {
        'foreground': '#ffffff',
        'muted-foreground': '#a0aec0',
      },
      borderColor: {
        'border': '#1a2332',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
