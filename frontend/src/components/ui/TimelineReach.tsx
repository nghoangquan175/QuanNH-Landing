"use client";

import { useEffect, useRef } from "react";

/** Fired on an entry's <li> when the rail pulls back above its dot again. */
export const UNREACHED_EVENT = "timeline:unreached";

/**
 * The timeline's <ol>. Marks each entry `data-reached` once the scroll-drawn rail
 * (styles/includes/_scroll.scss) has come down past its dot — the same line, 12% up from
 * the bottom of the viewport — and clears it when the rail pulls back. Entries without
 * it don't light their dot on hover and can't be expanded. Where the rail isn't animated
 * (no scroll-driven animations, or reduced motion) every entry counts as reached.
 */
export function TimelineReach({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const entries = Array.from(list.children) as HTMLElement[];

    const animated =
      CSS.supports("animation-timeline: view()") && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    if (!animated) {
      entries.forEach((entry) => entry.setAttribute("data-reached", ""));
      return;
    }

    // The root's bottom edge is pulled up to the rail's line; a dot is reached once it is
    // entirely above that edge (or scrolled off the top).
    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          const entry = record.target.parentElement;
          if (!entry || !record.rootBounds) continue;
          if (record.boundingClientRect.bottom <= record.rootBounds.bottom) {
            entry.setAttribute("data-reached", "");
          } else if (entry.hasAttribute("data-reached")) {
            entry.removeAttribute("data-reached");
            entry.dispatchEvent(new Event(UNREACHED_EVENT));
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: [0, 1] },
    );
    entries.forEach((entry) => {
      const dot = entry.querySelector(".timeline-dot");
      if (dot) observer.observe(dot);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  );
}
