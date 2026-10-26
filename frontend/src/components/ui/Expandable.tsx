"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  /** Always visible; the whole area toggles the panel. */
  header: React.ReactNode;
  /** Revealed when open. */
  children: React.ReactNode;
  /** Rendered after the panel, outside the toggle — for links, which can't nest in a button. */
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  panelClassName?: string;
  defaultOpen?: boolean;
  label: string;
};

/**
 * Header + collapsible panel. Height animates via grid-template-rows 0fr → 1fr
 * (styles/includes/_expand.scss), so nothing is measured in JS. The "+" turns into "×".
 */
export function Expandable({
  header,
  children,
  footer,
  className,
  headerClassName,
  panelClassName,
  defaultOpen = false,
  label,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={cn("expandable", open && "is-open", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn("group grid w-full grid-cols-[1fr_auto] items-start gap-x-[16px] text-left", headerClassName)}
      >
        <span className="min-w-0">{header}</span>
        <span className="expand-toggle relative mt-[6px] size-[18px] shrink-0 text-muted transition-colors group-hover:text-accent" aria-hidden="true" />
      </button>
      <div id={panelId} role="region" aria-label={label} className="expand-panel grid">
        <div className="min-h-0 overflow-hidden">
          <div className={panelClassName}>{children}</div>
        </div>
      </div>
      {footer}
    </div>
  );
}
