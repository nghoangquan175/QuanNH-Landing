"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { Link } from "@/types/portfolio";

/**
 * The nav's section links. The one whose section is under a line 40% down the viewport
 * reads in full text colour, the rest stay muted; above the first section none is lit.
 */
export function NavLinks({ items }: { items: Link[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    // A zero-height band at 40%: at most one section crosses it at a time.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
          else if (entry.boundingClientRect.top > 0 && sections[0] === entry.target) setActive(null);
        }
      },
      { rootMargin: "-40% 0px -60% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <ul className="hidden gap-[18px] text-[13px] text-muted 768:flex 1024:gap-[28px] 1024:text-[14px]">
      {items.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            aria-current={active === item.href ? "location" : undefined}
            className={cn("transition-colors hover:text-text", active === item.href && "text-text")}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
