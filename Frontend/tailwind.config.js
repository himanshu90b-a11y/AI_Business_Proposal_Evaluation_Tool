/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { ink: "#172033", purple: { DEFAULT: "#6657e8", dark: "#5142d6" } },
      fontFamily: { display: ["Manrope", "sans-serif"], body: ["DM Sans", "sans-serif"] }
    }
  },
  plugins: []
};
