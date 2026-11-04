/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',

  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      colors: {
        mylightBg: '#F9FAFB',
        mydarkBg: '#020817',

        mytitlelight: '#0F172A',
        mytitledark: '#E8EAF0',

        myborderdark: '#2B4C9F',
        myborderlight: '#E2E8F0', // ❗ نحيت ;

        mystatuslight: '#FFF',
        mystatusdark: '#0A1128',

        mysubtitlelight: '#64748B',
        mysubtitledark: '#94A3B8',

        newtitlelight: '#0F172A',
        newtitledark: '#E8EAF0',

        newholderlight: '#64748B',
        newholderdark: '#94A3B8',

        newinputbgdark: '#020817',
        newinputborderdark: '#0F1629',

        newvalidatbg: '#1E293B',
        newbordertop: '#2B4C9F',

        cardLight: '#FFFFFF',
        cardDark: '#141a23',

        textLight: '#0F172A',
        textDark: '#E2E8F0',
      },
    },
  },

  plugins: [],
};
