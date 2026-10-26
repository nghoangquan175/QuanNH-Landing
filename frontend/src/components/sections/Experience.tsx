import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Portfolio } from "@/types/portfolio";

export function Experience({ experience }: { experience: Portfolio["experience"] }) {
  return (
    <section id="experience" className="border-t border-line py-[64px] 768:py-[88px] 1024:py-[110px]">
      <Container>
        <SectionHeading eyebrow={experience.eyebrow} title={experience.title} />
        <div className="grid grid-cols-1 gap-[12px] 768:grid-cols-2 768:gap-[16px]">
          {experience.jobs.map((job) => (
            <div key={job.title} className="rounded-[14px] border border-line bg-panel p-[20px] 768:p-[26px]">
              <p className="font-mono text-[12px] text-muted">{job.period}</p>
              <h3 className="mb-[10px] mt-[6px] text-[18px] font-bold">{job.title}</h3>
              <ul className="ml-[18px] list-disc text-[14px] text-muted">
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
