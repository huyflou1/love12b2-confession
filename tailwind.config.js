/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Quicksand', 'Nunito', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        candy: '0 10px 30px -8px rgba(168, 85, 247, 0.35)',
        love: '0 8px 24px -6px rgba(236, 72, 153, 0.35)',
        sky: '0 8px 24px -6px rgba(56, 189, 248, 0.35)',
        glass: '0 10px 30px -10px rgba(147, 102, 232, 0.35)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(4deg)' },
        },
        heartPop: {
          '0%': { transform: 'scale(1)' },
          '35%': { transform: 'scale(1.45)' },
          '60%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        floaty: 'floaty 8s ease-in-out infinite',
        floatySlow: 'floaty 12s ease-in-out infinite',
        heartPop: 'heartPop 0.45s ease-in-out',
        fadeInUp: 'fadeInUp 0.35s ease both',
        popIn: 'popIn 0.2s ease both',
      },
    },
  },
  plugins: [],
};
