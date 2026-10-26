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
    },
  },
  plugins: [forms],
};

export default config;
