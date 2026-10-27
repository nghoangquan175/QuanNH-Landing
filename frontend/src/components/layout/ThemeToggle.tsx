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

/**
 * Swaps the theme. With a starting element the new theme spreads out from its centre;
 * without one (or with reduced motion, or no View Transitions) it just switches.
 */
export function switchTheme(from?: Element | null) {
  const root = document.documentElement;
  const next = root.dataset.theme === "light" ? "dark" : "light";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!from || !document.startViewTransition || reduceMotion) {
    applyTheme(next);
    return;
  }

  // The new theme spreads out as a soft-edged circle from the centre of `from`
  // (see _theme.scss), wide enough at the end to cover the farthest corner.
  const rect = from.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const reach = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root.style.setProperty("--theme-x", `${x}px`);
  root.style.setProperty("--theme-y", `${y}px`);
  root.style.setProperty("--theme-reach", `${reach}px`);

  // The whole page swaps as one snapshot, so the per-element colour transitions are
  // switched off until it finishes — otherwise they would keep fading underneath.
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
      onClick={(event) => switchTheme(event.currentTarget)}
      data-theme-toggle
      aria-label="Toggle light and dark mode"
      className="glow-ring grid size-[40px] place-items-center rounded-full border border-line text-text transition-shadow"
    >
      <Moon className="theme-icon-moon size-[18px]" aria-hidden="true" />
      <Sun className="theme-icon-sun size-[18px]" aria-hidden="true" />
    </button>
  );
}
