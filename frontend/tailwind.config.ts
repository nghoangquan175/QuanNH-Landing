import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      // Numeric breakpoint aliases (`768:pl-[20px]`); Tailwind's own sm/md stay intact.
      screens: {
        "768": "768px",
        "1024": "1024px",
        "1280": "1280px",
      },
      // Theme tokens live as CSS variables in styles/includes/_theme.scss so light and
      // dark switch without touching class names.
      colors: {
        bg: "var(--bg)",
        panel: "var(--panel)",
        line: "var(--line)",
        text: "var(--text)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        "on-accent": "var(--on-accent)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [forms],
};

export default config;
