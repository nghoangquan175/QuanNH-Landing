import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Portfolio } from "@/types/portfolio";

/**
 * A plain spec sheet, one row per group. Hovering a row only recolours its group name
 * (styles/includes/_stack.scss) — no lines, no glow.
 */
export function Skills({ skills }: { skills: Portfolio["skills"] }) {
  return (
    <section id="skills" className="py-[48px] 768:py-[64px] 1024:py-[72px]">
      <Container>
        <SectionHeading eyebrow={skills.eyebrow} title={skills.title} />
        <dl className="stack-list border-t border-line">
          {skills.groups.map((group) => (
            <div
              key={group.title}
              className="scroll-reveal stack-row group grid grid-cols-1 gap-[6px] border-b border-line py-[18px] 768:grid-cols-[220px_1fr] 768:items-baseline 768:gap-[24px] 768:py-[22px]"
            >
              <dt className="font-mono text-[12px] tracking-[0.08em] text-muted group-hover:text-accent">
                {group.title}
              </dt>
              {/* Wrap between tools, never inside a name like "GitHub Actions". */}
              <dd className="flex min-w-0 flex-wrap items-baseline gap-x-[22px] gap-y-[4px] text-[16px] 768:text-[18px]">
                {group.items.split(",").map((tech) => (
                  <span key={tech} className="whitespace-nowrap">
                    {tech.trim()}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
