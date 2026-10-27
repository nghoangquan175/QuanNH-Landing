"use client";

import { useEffect, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const DURATION = 900;
const FRAME = 40;

/**
 * Text that decodes itself once: as its `.reveal` parent starts fading in (after the intro,
 * when one plays), each letter cycles through random glyphs and settles left to right.
 * Spaces and punctuation stay put. Meant for monospace text, so nothing shifts while it
 * runs. Server HTML and screen readers get the real text; reduced motion skips it.
 */
export function Scramble({ text }: { text: string }) {
  const [shown, setShown] = useState(text);
  const [host, setHost] = useState<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!host || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

    // Start when the parent's reveal does: what is left of its delay, if any.
    const reveal = host.parentElement?.getAnimations().find((a) => a instanceof CSSAnimation);
    const delay = Number(reveal?.effect?.getComputedTiming().delay ?? 0);
    const elapsed = Number(reveal?.currentTime ?? 0);
    const wait = Math.max(0, delay - elapsed);

    let timer = 0;
    const start = window.setTimeout(() => {
      const began = performance.now();
      const frame = () => {
        const progress = (performance.now() - began) / DURATION;
        if (progress >= 1) {
          setShown(text);
          window.clearInterval(timer);
          return;
        }
        // Letter i settles once progress passes its share of the line.
        setShown(
          Array.from(text, (char, i) =>
            !/[A-Z0-9]/i.test(char) || progress > i / text.length
              ? char
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          ).join(""),
        );
      };
      frame();
      timer = window.setInterval(frame, FRAME);
    }, wait);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
      setShown(text);
    };
  }, [host, text]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={setHost} aria-hidden="true">
        {shown}
      </span>
    </>
  );
}
