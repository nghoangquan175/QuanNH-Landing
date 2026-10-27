import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { CaseStudy } from "@/types/portfolio";

/** "Read case study →" under a card, next to its site links. */
export function CaseStudyLink({ slug, study }: { slug: string; study?: CaseStudy }) {
  if (!study) return null;
  return (
    <Link
      href={`/work/${slug}`}
      className="inline-flex items-center gap-[3px] font-mono text-[12px] text-text underline-offset-[3px] hover:text-accent hover:underline"
    >
      Read case study
      <ArrowRight className="size-[13px]" aria-hidden="true" />
    </Link>
  );
}
