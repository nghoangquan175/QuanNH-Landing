import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Portfolio } from "@/types/portfolio";

export function Skills({ skills }: { skills: Portfolio["skills"] }) {
  return (
    <section id="skills" className="border-t border-line py-[110px]">
      <Container>
        <SectionHeading eyebrow={skills.eyebrow} title={skills.title} />
        <div className="grid grid-cols-4 gap-[16px]">
          {skills.groups.map((group) => (
            <div key={group.title} className="rounded-[14px] border border-line bg-panel p-[22px]">
              <h4 className="mb-[10px] font-mono text-[13px] text-accent">{group.title}</h4>
              <p className="text-[14px] text-muted">{group.items}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
