import { cn } from "@/lib/cn";

/**
 * The site mark: a rounded frame with a staircase climbing to a dot — "one step further".
 * Same shape in both themes; the frame follows the text colour and the steps the accent,
 * so the theme tokens recolour it. src/app/icon.svg is the favicon version of this shape.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn("size-[30px]", className)}>
      <rect x="3.5" y="3.5" width="25" height="25" rx="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9 23h4.5v-4.5h4.5v-4.5h4.5"
        stroke="var(--accent)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22.5" cy="9.5" r="2" fill="var(--accent)" />
    </svg>
  );
}
