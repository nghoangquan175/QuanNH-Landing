import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Timeline } from "@/components/ui/Timeline";
import type { Portfolio } from "@/types/portfolio";

export function Experience({ experience }: { experience: Portfolio["experience"] }) {
  return (
    <section id="experience" className="py-[48px] 768:py-[64px] 1024:py-[72px]">
      <Container>
        <SectionHeading eyebrow={experience.eyebrow} title={experience.title} />
        <Timeline
          alternate
          items={experience.jobs.map((job) => ({
            key: job.title,
            period: job.period,
            content: (
              <div className="step-card rounded-[16px] border border-line bg-panel p-[20px] 768:p-[24px]">
                <h3 className="mb-[10px] text-[18px] font-bold">{job.title}</h3>
                <ul className="ml-[18px] list-disc text-[14px] text-muted">
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ),
          }))}
        />
      </Container>
    </section>
  );
}
