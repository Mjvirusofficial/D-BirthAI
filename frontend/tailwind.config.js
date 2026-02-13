/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#1A1A1A', // Main text color
                    gray: '#757575', // Subtitle text color
                    teal: '#68B2A0', // Primary button color (Teal/Greenish)
                    'teal-dark': '#559283', // Hover state
                    blue: '#E3F2FD', // Light blue background
                    pink: '#FCE4EC', // Light pink background
                    yellow: '#FFF9C4', // Highlight yellow
                    red: '#FFCDD2', // Red accent
                },
                pastel: {
                    green: '#E0F2F1', // List item green
                    blue: '#E1F5FE', // List item blue
                    pink: '#FCE4EC', // List item pink
                    peach: '#FFECB3', // List item peach
                }
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
