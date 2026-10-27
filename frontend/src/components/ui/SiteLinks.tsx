import { ArrowUpRight } from "lucide-react";
import type { Link } from "@/types/portfolio";

/** Outbound site links shown under a card; `empty` is what to say when there are none. */
export function SiteLinks({ links, empty }: { links: Link[]; empty: string }) {
  if (links.length === 0) {
    return <span className="font-mono text-[12px] text-muted">{empty}</span>;
  }

  return (
    <>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-[3px] font-mono text-[12px] text-accent underline-offset-[3px] hover:underline"
        >
          {link.label}
          <ArrowUpRight className="size-[13px]" aria-hidden="true" />
        </a>
      ))}
    </>
  );
}
