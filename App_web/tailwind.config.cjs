/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {},
   },
   plugins: [require("daisyui")],
   daisyui: {
      themes: [
         {
           mytheme: {
             "primary": "#4b6584",
             "secondary": "#f6d860",
             "accent": "#d1d8e0",
             "neutral": "#131f30",
             "base-100": "#ffffff",
           },
         },
         
       ],
   },
};
