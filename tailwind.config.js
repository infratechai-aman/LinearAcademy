/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'luxury-black': '#050505', // Darker black for futuristic look
        'luxury-gold': '#d4af37',
        'luxury-gold-hover': '#b4941f',
        'luxury-cream': '#f8f8f8', // Whiter cream for cleaner look
        'luxury-charcoal': '#121212',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'marble-pattern': "url('https://images.unsplash.com/photo-1618588507085-c79565432917?q=80&w=3270&auto=format&fit=crop')",
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [],
}
