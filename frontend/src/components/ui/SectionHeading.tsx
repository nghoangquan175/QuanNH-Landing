import type { SectionHeading as Heading } from "@/types/portfolio";

export function SectionHeading({ eyebrow, title }: Heading) {
  return (
    <>
      <p className="scroll-reveal mb-[12px] font-mono text-[13px] text-accent">{eyebrow}</p>
      <h2 className="scroll-reveal mb-[28px] text-[30px] font-bold leading-[1.1] tracking-[-0.03em] 768:mb-[40px] 768:text-[40px] 1024:text-[48px]">
        {title}
      </h2>
    </>
  );
}
