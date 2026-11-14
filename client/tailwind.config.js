export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF1FE',
          100: '#DDE2FD',
          200: '#BFC8FB',
          300: '#97A4F8',
          400: '#6F80F5',
          500: '#4D5DF0',
          600: '#3B4EE8',
          700: '#2F3FC4',
          800: '#27339B',
          900: '#222C7B',
        },
        ink: {
          900: '#1B1D28',
          700: '#3C4055',
          500: '#6B7084',
          400: '#9398A8',
          300: '#C3C7D4',
        },
        canvas: '#F1F2F7',
        danger: {
          50: '#FDECEC',
          100: '#FBD9D9',
          500: '#EF6A6A',
          600: '#E04A4A',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 6px 24px -12px rgba(27, 29, 40, 0.18)',
        sheet: '0 -12px 40px -16px rgba(27, 29, 40, 0.35)',
        fab: '0 10px 24px -8px rgba(77, 93, 240, 0.7)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        'sheet-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'sheet-up': 'sheet-up 260ms cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-in': 'fade-in 180ms ease-out',
        'pop-in': 'pop-in 200ms cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
