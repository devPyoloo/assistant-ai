/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: {
        mutedBlack: "#131212",
        lightBlack: "#19181A",
        offBlack: "#1E1E1E",
      },
      fontFamily: {
        'russo': ['Russo One', 'sans'],
        'lora': ['Lora', 'serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'jockey': ['Jockey One', 'sans-serif'],
      }, 
    },
  },
  plugins: [],
}

