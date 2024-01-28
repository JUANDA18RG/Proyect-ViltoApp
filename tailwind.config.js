/** @type {import('tailwindcss').Config} */
export default {
  mode : 'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        
    },
  },
},
corePlugins: {
  aspectRatio: false,
},
  plugins: [
    
  ],
}