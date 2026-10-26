import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Portfolio, Project } from "@/types/portfolio";

// Each card steps further right than the one above it.
const OFFSETS = ["ml-0", "ml-[6%]", "ml-[12%]", "ml-[18%]", "ml-[24%]"];

function StepCard({ project, index }: { project: Project; index: number }) {
  const className = `step-card grid grid-cols-[120px_1fr_auto] items-center gap-[24px] rounded-[16px] border border-line bg-panel p-[28px] ${OFFSETS[index] ?? OFFSETS[OFFSETS.length - 1]}`;
  const content = (
    <>
      <span className="step-number font-mono text-[40px] font-semibold text-line transition-colors">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <h3 className="text-[20px] font-bold">{project.title}</h3>
        <p className="text-[14px] text-muted">{project.description}</p>
      </div>
      <span className="whitespace-nowrap rounded-full border border-line px-[10px] py-[4px] font-mono text-[12px] text-muted">
        {project.role}
      </span>
    </>
  );

  return project.href ? (
    <a href={project.href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
}

export function Work({ work }: { work: Portfolio["work"] }) {
  return (
    <section id="work" className="border-t border-line py-[110px]">
      <Container>
        <SectionHeading eyebrow={work.eyebrow} title={work.title} />
        <div className="flex flex-col gap-[18px]">
          {work.projects.map((project, i) => (
            <StepCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
