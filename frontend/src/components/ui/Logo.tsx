import { cn } from "@/lib/cn";

/**
 * The site mark: a geometric lowercase "q" (for Quan) whose descender breaks into two
 * steps — the staircase that runs through the site. Same shape in both themes; the
 * letter follows the text colour and the steps the accent. src/app/icon.svg is the
 * favicon version of this shape.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      strokeWidth="3.4"
      strokeLinecap="square"
      aria-hidden="true"
      className={cn("size-[28px]", className)}
    >
      <path d="M20 13a7 7 0 1 0-7 7h7V6" stroke="currentColor" />
      <path d="M20 20v4h4v4h4" stroke="var(--accent)" />
    </svg>
  );
}
