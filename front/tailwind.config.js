/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        "hot-berry": "var(--custom1-hot-berry)",
        "raspberry-plum": "var(--custom1-raspberry-plum)",
        mint: "var(--custom1-mint)",
        emerald: "var(--custom1-emerald)",
        midnight: "var(--custom1-midnight)",
        "hunter-green": "var(--custom1-hunter-green)",
        "muted-olive": "var(--custom1-muted-olive)",
        "charcoal-green": "var(--custom1-charcoal-green)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
}
