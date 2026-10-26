import type { SectionHeading as Heading } from "@/types/portfolio";

export function SectionHeading({ eyebrow, title }: Heading) {
  return (
    <>
      <p className="mb-[12px] font-mono text-[13px] text-accent">{eyebrow}</p>
      <h2 className="mb-[40px] text-[48px] font-bold leading-[1.1] tracking-[-0.03em]">{title}</h2>
    </>
  );
}
