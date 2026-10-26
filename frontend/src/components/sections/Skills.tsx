import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Portfolio } from "@/types/portfolio";

// From 1024 up the layers widen as they go down — the narrow top is what users touch,
// the wide base is what everything runs on. Full widths on smaller screens.
const WIDTHS = ["1024:w-[64%]", "1024:w-[73%]", "1024:w-[82%]", "1024:w-[91%]", "1024:w-full"];

export function Skills({ skills }: { skills: Portfolio["skills"] }) {
  return (
    <section id="skills" className="border-t border-line py-[64px] 768:py-[88px] 1024:py-[110px]">
      <Container>
        <SectionHeading eyebrow={skills.eyebrow} title={skills.title} />
        <p className="-mt-[16px] mb-[36px] max-w-[520px] text-[15px] text-muted 768:-mt-[24px]">{skills.caption}</p>

        {/* `stack-flow` draws the centre line and the pulse travelling down it. */}
        <div className="stack-flow relative flex flex-col items-center gap-[16px] 768:gap-[18px]">
          {skills.groups.map((group, i) => (
            <div
              key={group.title}
              className={`stack-layer relative z-[1] flex w-full flex-col gap-[12px] rounded-[14px] border border-line bg-panel px-[18px] py-[16px] 768:flex-row 768:items-center 768:gap-[24px] 768:px-[24px] ${WIDTHS[i] ?? "1024:w-full"}`}
            >
              <div className="flex shrink-0 items-baseline gap-[10px] 768:w-[190px]">
                <span className="font-mono text-[11px] text-muted">L{i + 1}</span>
                <h4 className="font-mono text-[13px] tracking-[0.04em] text-accent">{group.title}</h4>
              </div>
              <ul className="flex flex-wrap gap-[8px]">
                {group.items.split(",").map((tech) => (
                  <li
                    key={tech}
                    className="stack-pill rounded-full border border-line px-[12px] py-[5px] text-[13px] text-text"
                  >
                    {tech.trim()}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
