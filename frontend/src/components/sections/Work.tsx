import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Portfolio, Project } from "@/types/portfolio";

// Each card steps further right than the one above it — a gentle step on tablets, the
// full staircase on desktop, none on phones where the width is needed for text.
const OFFSETS = [
  "ml-0",
  "768:ml-[3%] 1024:ml-[5%]",
  "768:ml-[6%] 1024:ml-[10%]",
  "768:ml-[9%] 1024:ml-[15%]",
  "768:ml-[12%] 1024:ml-[20%]",
  "768:ml-[15%] 1024:ml-[25%]",
];

function SiteLinks({ project }: { project: Project }) {
  if (project.links.length === 0) {
    return <span className="font-mono text-[12px] text-muted">pre-launch</span>;
  }

  return (
    <>
      {project.links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[12px] text-accent underline-offset-[3px] hover:underline"
        >
          {link.label} ↗
        </a>
      ))}
    </>
  );
}

function StepCard({ project, index }: { project: Project; index: number }) {
  // A div, not a link: some projects have two live sites, so each site gets its own link.
  return (
    <div
      className={`step-card grid grid-cols-[auto_1fr] items-start gap-x-[16px] gap-y-[12px] rounded-[16px] border border-line bg-panel p-[20px] 768:grid-cols-[80px_1fr_auto] 768:items-center 768:gap-[24px] 768:p-[28px] 1024:grid-cols-[120px_1fr_auto] ${OFFSETS[index] ?? OFFSETS[OFFSETS.length - 1]}`}
    >
      <span className="step-number font-mono text-[24px] font-semibold leading-[1.2] text-line transition-colors 768:text-[32px] 1024:text-[40px]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <h3 className="text-[18px] font-bold 768:text-[20px]">{project.title}</h3>
        <p className="text-[14px] text-muted">{project.description}</p>
        <div className="mt-[8px] flex flex-wrap gap-x-[16px] gap-y-[4px]">
          <SiteLinks project={project} />
        </div>
      </div>
      <span className="col-start-2 justify-self-start whitespace-nowrap rounded-full border border-line px-[10px] py-[4px] font-mono text-[12px] text-muted 768:col-start-auto">
        {project.role}
      </span>
    </div>
  );
}

export function Work({ work }: { work: Portfolio["work"] }) {
  return (
    <section id="work" className="border-t border-line py-[64px] 768:py-[88px] 1024:py-[110px]">
      <Container>
        <SectionHeading eyebrow={work.eyebrow} title={work.title} />
        <div className="flex flex-col gap-[14px] 768:gap-[18px]">
          {work.projects.map((project, i) => (
            <StepCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
