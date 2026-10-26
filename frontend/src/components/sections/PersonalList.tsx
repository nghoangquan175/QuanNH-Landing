"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { SiteLinks } from "@/components/ui/SiteLinks";
import type { PersonalProject } from "@/types/portfolio";

/**
 * Accordion rows in the same spec-sheet style as the Stack section. Each row toggles on
 * its own; the first starts open so it is obvious the rows expand. Height animates via
 * grid-template-rows 0fr → 1fr (no measuring).
 */
export function PersonalList({ projects }: { projects: PersonalProject[] }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const baseId = useId();

  const toggle = (i: number) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <ul className="border-t border-line">
      {projects.map((project, i) => {
        const isOpen = open.has(i);
        const panelId = `${baseId}-panel-${i}`;
        return (
          <li key={project.title} className={cn("personal-row relative border-b border-line", isOpen && "is-open")}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(i)}
              className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-[16px] gap-y-[4px] py-[20px] text-left 768:grid-cols-[150px_1fr_auto] 768:gap-x-[24px] 768:py-[26px]"
            >
              <span className="col-span-2 font-mono text-[12px] tracking-[0.06em] text-muted 768:col-span-1">
                {project.period}
              </span>
              <span className="min-w-0">
                <span className="block text-[22px] font-bold leading-[1.2] transition-colors duration-300 group-hover:text-accent 768:text-[28px]">
                  {project.title}
                </span>
                <span className="mt-[4px] block font-mono text-[12px] text-muted">{project.tags}</span>
              </span>
              <span className="personal-toggle relative size-[18px] shrink-0 text-muted transition-colors group-hover:text-accent" aria-hidden="true" />
            </button>

            <div id={panelId} role="region" aria-label={project.title} className="personal-panel grid">
              <div className="min-h-0 overflow-hidden">
                <div className="pb-[24px] 768:ml-[174px] 768:max-w-[620px] 768:pb-[30px]">
                  <p className="text-[15px] text-muted 768:text-[16px]">{project.description}</p>
                  <div className="mt-[12px] flex flex-wrap gap-x-[16px] gap-y-[4px]">
                    <SiteLinks links={project.links} empty="private repo" />
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
