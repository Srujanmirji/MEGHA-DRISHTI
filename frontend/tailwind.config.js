/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#060B18',
          light: '#F8FAFC',
        },
        panel: {
          DEFAULT: '#0B1426',
          light: '#FFFFFF',
          secondary: '#101C36',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-light': 'rgba(15, 23, 42, 0.08)',
        },
        brand: {
          navy: '#1F3864',
          blue: '#0070C0',
          'blue-light': '#38BDF8',
          accent: '#F28C28',
          'accent-glow': 'rgba(242, 140, 40, 0.35)',
        },
        severity: {
          yellow: '#FFD966',
          orange: '#F4B183',
          red: '#C00000',
          maroon: '#7F0000',
        },
        status: {
          success: '#2E7D32',
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 25px -5px rgba(242, 140, 40, 0.4)',
        'glow-blue': '0 0 25px -5px rgba(0, 112, 192, 0.4)',
        'glow-cyan': '0 0 20px -5px rgba(56, 189, 248, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at 50% 50%, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
