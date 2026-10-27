import { CaseStudyLink } from "@/components/ui/CaseStudyLink";
import { Container } from "@/components/ui/Container";
import { ExpandGroup, Expandable } from "@/components/ui/Expandable";
import { ProjectShots } from "@/components/ui/ProjectShots";
import { ProjectTitle } from "@/components/ui/ProjectTitle";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SiteLinks } from "@/components/ui/SiteLinks";
import { Tag } from "@/components/ui/Tag";
import { Timeline } from "@/components/ui/Timeline";
import type { Portfolio, Project } from "@/types/portfolio";

function ProjectCard({ project }: { project: Project }) {
  return (
    <Expandable
      label={project.title}
      className="step-card rounded-[16px] border border-line bg-panel p-[20px] 768:p-[24px]"
      header={
        <>
          <span className="flex flex-wrap items-center gap-x-[12px] gap-y-[6px]">
            <ProjectTitle project={project}>
              <span className="text-[18px] font-bold transition-colors duration-300 group-hover:text-accent 768:text-[20px]">
                {project.title}
              </span>
            </ProjectTitle>
            <Tag>{project.role}</Tag>
            {project.company && <Tag>{project.company}</Tag>}
          </span>
          <span className="mt-[6px] block text-[14px] text-muted">{project.summary}</span>
          <span className="mt-[8px] block font-mono text-[12px] text-muted opacity-80">{project.tags}</span>
        </>
      }
      panelClassName="pt-[14px]"
      footer={
        <div className="mt-[12px] flex flex-wrap gap-x-[16px] gap-y-[4px]">
          <SiteLinks links={project.links} empty="pre-launch" />
          <CaseStudyLink slug={project.slug} study={project.caseStudy} />
        </div>
      }
    >
      <ProjectShots slug={project.slug} />
      <ul className="ml-[18px] list-disc space-y-[6px] text-[14px] text-text marker:text-muted">
        {project.details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>
    </Expandable>
  );
}

export function Work({ work }: { work: Portfolio["work"] }) {
  return (
    <section id="work" className="border-t border-line pb-[48px] pt-[64px] 768:pb-[64px] 768:pt-[88px] 1024:pb-[72px] 1024:pt-[110px]">
      <Container>
        <SectionHeading eyebrow={work.eyebrow} title={work.title} />
        <ExpandGroup>
          <Timeline
            items={work.projects.map((project) => ({
              key: project.slug,
              period: project.period,
              content: <ProjectCard project={project} />,
            }))}
          />
        </ExpandGroup>
      </Container>
    </section>
  );
}
