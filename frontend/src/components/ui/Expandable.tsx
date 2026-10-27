"use client";

import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { UNREACHED_EVENT } from "@/components/ui/TimelineReach";
import { cn } from "@/lib/cn";

/** Wrap a list in this and only one of its Expandables can be open at a time. */
const GroupContext = createContext<{
  openId: string | null;
  setOpenId: React.Dispatch<React.SetStateAction<string | null>>;
} | null>(null);

export function ExpandGroup({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return <GroupContext.Provider value={{ openId, setOpenId }}>{children}</GroupContext.Provider>;
}

type Props = {
  /** Always visible. */
  header: React.ReactNode;
  /** Revealed when open. */
  children: React.ReactNode;
  /** Rendered after the panel; always visible. */
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  panelClassName?: string;
  label: string;
};

/**
 * Header + collapsible panel. The WHOLE block toggles — header, open panel, padding —
 * except links (they open in a new tab) and clicks that end a text selection. The
 * header is still a real button so keyboards and screen readers get aria-expanded.
 * Height animates via grid-template-rows 0fr → 1fr (styles/includes/_expand.scss).
 *
 * Inside a timeline entry the rail gates it (TimelineReach): a pointer can't open it
 * before the rail has reached the entry, and it closes itself when the rail pulls back
 * above it. Keyboard activation is never blocked.
 */
export function Expandable({ header, children, footer, className, headerClassName, panelClassName, label }: Props) {
  const id = useId();
  const group = useContext(GroupContext);
  const [localOpen, setLocalOpen] = useState(false);
  const open = group ? group.openId === id : localOpen;
  const rootRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (group) group.setOpenId(open ? null : id);
    else setLocalOpen((v) => !v);
  };

  useEffect(() => {
    const entry = rootRef.current?.closest(".timeline > li");
    if (!entry) return;
    const onUnreached = () => {
      if (group) group.setOpenId((current) => (current === id ? null : current));
      else setLocalOpen(false);
    };
    entry.addEventListener(UNREACHED_EVENT, onUnreached);
    return () => entry.removeEventListener(UNREACHED_EVENT, onUnreached);
  }, [group, id]);

  const onClick = (event: React.MouseEvent) => {
    if ((event.target as Element).closest("a")) return;
    if (window.getSelection()?.toString()) return;
    // detail is 0 for a click synthesised from the keyboard (Enter/Space on the button).
    const entry = event.currentTarget.closest(".timeline > li");
    if (entry && !entry.hasAttribute("data-reached") && event.detail !== 0) return;
    toggle();
  };

  return (
    // The button inside carries the keyboard/AT semantics; this handler only widens the
    // pointer target to the whole block, so it is not a second control.
    <div ref={rootRef} className={cn("expandable group cursor-pointer", open && "is-open", className)} onClick={onClick}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        className={cn("grid w-full grid-cols-[1fr_auto] items-start gap-x-[16px] text-left", headerClassName)}
      >
        <span className="min-w-0">{header}</span>
        <Plus className="expand-toggle mt-[3px] size-[20px] shrink-0 text-muted group-hover:text-accent" strokeWidth={1.75} aria-hidden="true" />
      </button>
      <div id={`${id}-panel`} role="region" aria-label={label} className="expand-panel grid">
        <div className="min-h-0 overflow-hidden">
          <div className={panelClassName}>{children}</div>
        </div>
      </div>
      {footer}
    </div>
  );
}
