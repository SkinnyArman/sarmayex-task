/** @type {import('tailwindcss').Config} */
export default {
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
      backgroundColor: {
        dark: "#1b1b1b",
      },
      colors: {
        text: {
          white: "#fff",
          gray: "#838485",
          red: "#f65454"
        },
      },
    },
  },
  plugins: [],
};
