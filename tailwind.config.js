/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontSize: {
        body1: "12px",
      },
      fontFamily: ["Vazir"],
      backgroundColor: {
        dark: "#1b1b1b",
        light: "#f8f8f8"
      },
      colors: {
        white: {
          light: "#fff",
          dark: "#1e2329",
        },
        gray: "#838485",
        red: "#f65454",
        main: "#fe4723",
        success: "#01bc8d",
      },
    },
  },
  plugins: [],
};
