"use client";

import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "theme";

function applyTheme(next: string) {
  const root = document.documentElement;
  root.dataset.theme = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Storage blocked (private mode) — the choice just won't persist.
  }
}

function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === "light" ? "dark" : "light";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!document.startViewTransition || reduceMotion) {
    applyTheme(next);
    return;
  }

  // The whole page swaps as one snapshot wiped top to bottom (see _theme.scss), so the
  // per-element colour transitions are switched off until it finishes — otherwise they
  // would keep fading underneath the wipe.
  root.classList.add("theme-switching");
  const transition = document.startViewTransition(() => applyTheme(next));
  transition.finished.finally(() => root.classList.remove("theme-switching"));
}

/**
 * Runs before first paint (see layout.tsx). A stored choice wins; otherwise each visit
 * starts in a random theme so people get to see both.
 */
export const themeInitScript = `(function(){var d=document.documentElement,t;try{t=localStorage.getItem("${STORAGE_KEY}")}catch(e){}d.dataset.theme=t==="light"||t==="dark"?t:Math.random()<.5?"light":"dark"})()`;

export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light and dark mode"
      className="glow-ring grid size-[40px] place-items-center rounded-full border border-line text-text transition-shadow"
    >
      <Moon className="theme-icon-moon size-[18px]" aria-hidden="true" />
      <Sun className="theme-icon-sun size-[18px]" aria-hidden="true" />
    </button>
  );
}
