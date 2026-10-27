import { Container } from "@/components/ui/Container";
import { ExpandGroup, Expandable } from "@/components/ui/Expandable";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SiteLinks } from "@/components/ui/SiteLinks";
import type { Portfolio } from "@/types/portfolio";

/**
 * Accordion rows in the same spec-sheet style as the Stack section; all start closed.
 * Links sit under the header, always visible, as on the Selected Work cards.
 */
export function Personal({ personal }: { personal: Portfolio["personal"] }) {
  return (
    <section id="personal" className="py-[48px] 768:py-[64px] 1024:py-[72px]">
      <Container>
        <SectionHeading eyebrow={personal.eyebrow} title={personal.title} />
        <ExpandGroup>
          <ul className="border-t border-line">
            {personal.projects.map((project) => (
              <li key={project.title} className="scroll-reveal border-b border-line">
                <Expandable
                  label={project.title}
                  headerClassName="pt-[20px] 768:pt-[26px]"
                  header={
                    <span className="grid gap-y-[4px] 768:grid-cols-[150px_1fr] 768:gap-x-[24px]">
                      <span className="font-mono text-[12px] tracking-[0.06em] text-muted 768:mt-[10px]">{project.period}</span>
                      <span className="min-w-0">
                        <span className="block text-[22px] font-bold leading-[1.2] transition-colors duration-300 group-hover:text-accent 768:text-[28px]">
                          {project.title}
                        </span>
                        <span className="mt-[6px] block text-[15px] text-muted">{project.summary}</span>
                        <span className="mt-[6px] block font-mono text-[12px] text-muted opacity-80">{project.tags}</span>
                      </span>
                    </span>
                  }
                  panelClassName="pt-[14px] 768:ml-[174px] 768:max-w-[680px]"
                  footer={
                    <div className="mt-[10px] flex flex-wrap gap-x-[16px] gap-y-[4px] pb-[20px] 768:ml-[174px] 768:pb-[26px]">
                      <SiteLinks links={project.links} empty="private repo" />
                    </div>
                  }
                >
                  <ul className="ml-[18px] list-disc space-y-[6px] text-[15px] text-text marker:text-muted">
                    {project.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </Expandable>
              </li>
            ))}
          </ul>
        </ExpandGroup>
      </Container>
    </section>
  );
}
