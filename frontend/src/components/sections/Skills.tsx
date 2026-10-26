import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Portfolio } from "@/types/portfolio";

export function Skills({ skills }: { skills: Portfolio["skills"] }) {
  return (
    <section id="skills" className="border-t border-line py-[64px] 768:py-[88px] 1024:py-[110px]">
      <Container>
        <SectionHeading eyebrow={skills.eyebrow} title={skills.title} />
        <div className="grid grid-cols-2 gap-[12px] 768:gap-[16px] 1024:grid-cols-4">
          {skills.groups.map((group) => (
            <div key={group.title} className="rounded-[14px] border border-line bg-panel p-[18px] 768:p-[22px]">
              <h4 className="mb-[10px] font-mono text-[13px] text-accent">{group.title}</h4>
              <p className="text-[14px] text-muted">{group.items}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
