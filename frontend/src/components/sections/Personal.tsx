import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SiteLinks } from "@/components/ui/SiteLinks";
import type { Portfolio } from "@/types/portfolio";

export function Personal({ personal }: { personal: Portfolio["personal"] }) {
  return (
    <section id="personal" className="border-t border-line py-[64px] 768:py-[88px] 1024:py-[110px]">
      <Container>
        <SectionHeading eyebrow={personal.eyebrow} title={personal.title} />
        <div className="grid grid-cols-1 gap-[14px] 768:grid-cols-2 768:gap-[18px]">
          {personal.projects.map((project) => (
            <article
              key={project.title}
              className="step-card flex flex-col rounded-[16px] border border-line bg-panel p-[20px] 768:p-[26px]"
            >
              <p className="font-mono text-[12px] tracking-[0.06em] text-muted">{project.period}</p>
              <h3 className="mt-[6px] text-[20px] font-bold 768:text-[22px]">{project.title}</h3>
              <p className="mt-[8px] text-[14px] text-muted">{project.description}</p>
              <p className="mt-[14px] font-mono text-[12px] text-accent">{project.tags}</p>
              <div className="mt-auto flex flex-wrap gap-x-[16px] gap-y-[4px] pt-[14px]">
                <SiteLinks links={project.links} empty="private repo" />
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
