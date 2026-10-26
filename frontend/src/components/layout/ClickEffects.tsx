"use client";

import { useEffect } from "react";

const PARTICLES = 6;
const LIFETIME_MS = 900;

/**
 * A short effect wherever the visitor clicks. The markup is the same in both themes;
 * styles/includes/_click.scss turns it into a pixel burst (dark) or a watercolour bloom
 * (light).
 */
export function ClickEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onPointerDown = (event: PointerEvent) => {
      if (document.documentElement.dataset.intro === "play") return;

      const fx = document.createElement("span");
      fx.className = "click-fx";
      fx.setAttribute("aria-hidden", "true");
      fx.style.left = `${event.clientX}px`;
      fx.style.top = `${event.clientY}px`;

      const ring = document.createElement("i");
      ring.className = "click-fx__ring";
      const ring2 = document.createElement("i");
      ring2.className = "click-fx__ring click-fx__ring--outer";
      fx.append(ring, ring2);

      for (let i = 0; i < PARTICLES; i++) {
        const particle = document.createElement("i");
        particle.className = "click-fx__particle";
        const angle = (360 / PARTICLES) * i + (Math.random() * 24 - 12);
        particle.style.setProperty("--angle", `${angle}deg`);
        fx.append(particle);
      }

      document.body.append(fx);
      window.setTimeout(() => fx.remove(), LIFETIME_MS);
    };

    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return null;
}
