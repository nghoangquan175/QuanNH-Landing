import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SiteLinks } from "@/components/ui/SiteLinks";
import { Timeline } from "@/components/ui/Timeline";
import type { Portfolio, Project } from "@/types/portfolio";

function ProjectCard({ project }: { project: Project }) {
  // A div, not a link: some projects have two live sites, so each site gets its own link.
  return (
    <div className="step-card rounded-[16px] border border-line bg-panel p-[20px] 768:p-[24px]">
      <div className="flex flex-wrap items-start justify-between gap-x-[16px] gap-y-[8px]">
        <h3 className="text-[18px] font-bold 768:text-[20px]">{project.title}</h3>
        <span className="whitespace-nowrap rounded-full border border-line px-[10px] py-[4px] font-mono text-[12px] text-muted">
          {project.role}
        </span>
      </div>
      <p className="mt-[6px] text-[14px] text-muted">{project.description}</p>
      <div className="mt-[10px] flex flex-wrap gap-x-[16px] gap-y-[4px]">
        <SiteLinks links={project.links} empty="pre-launch" />
      </div>
    </div>
  );
}

export function Work({ work }: { work: Portfolio["work"] }) {
  return (
    <section id="work" className="border-t border-line py-[64px] 768:py-[88px] 1024:py-[110px]">
      <Container>
        <SectionHeading eyebrow={work.eyebrow} title={work.title} />
        <Timeline
          items={work.projects.map((project) => ({
            key: project.title,
            period: project.period,
            content: <ProjectCard project={project} />,
          }))}
        />
      </Container>
    </section>
  );
}
