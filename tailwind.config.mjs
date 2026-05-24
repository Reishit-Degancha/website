/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8b3a2b',
          hover: '#6e2d22',
        },
        background: {
          DEFAULT: '#f3ece0',
          alt: '#ece2cf',
        },
        surface: '#faf6ee',
        text: {
          DEFAULT: '#2a2118',
          muted: '#4a3f33',
          light: '#786755',
        },
        border: {
          DEFAULT: '#d8c8a8',
          light: '#e3d5b8',
        },
        footer: '#2a2118',
      },
      fontFamily: {
        serif: ['"Frank Ruhl Libre"', 'serif'],
      },
    },
  },
  plugins: [],
};
