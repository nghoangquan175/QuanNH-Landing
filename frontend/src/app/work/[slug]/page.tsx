import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Container } from "@/components/ui/Container";
import { ProjectShots } from "@/components/ui/ProjectShots";
import { ProjectTitle } from "@/components/ui/ProjectTitle";
import { SiteLinks } from "@/components/ui/SiteLinks";
import { getPortfolio } from "@/lib/api/portfolio";
import type { Portfolio } from "@/types/portfolio";

/** Selected Work projects that have a write-up, in the order the home page lists them. */
function caseStudies(data: Portfolio) {
  return data.work.projects.filter((project) => project.caseStudy);
}

async function findCase(slug: string) {
  const data = await getPortfolio();
  const all = caseStudies(data);
  const index = all.findIndex((project) => project.caseStudy?.slug === slug);
  if (index === -1) return null;
  return { data, project: all[index], next: all[(index + 1) % all.length] };
}

export async function generateStaticParams() {
  return caseStudies(await getPortfolio()).map((project) => ({ slug: project.caseStudy!.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const found = await findCase((await params).slug);
  if (!found) return {};
  return {
    title: `${found.project.title} — Case study · Nguyen Hoang Quan`,
    description: found.project.summary,
  };
}

function Part({ index, label, children }: { index: number; label: string; children: React.ReactNode }) {
  return (
    <section className="scroll-reveal grid gap-[10px] border-t border-line py-[28px] 768:grid-cols-[180px_1fr] 768:gap-[24px] 768:py-[36px]">
      <h2 className="font-mono text-[12px] tracking-[0.08em] text-muted">
        {String(index).padStart(2, "0")} / {label}
      </h2>
      <div className="text-[16px] leading-[1.7] 768:text-[17px]">{children}</div>
    </section>
  );
}

function Points({ items }: { items: string[] }) {
  return (
    <ul className="ml-[18px] list-disc space-y-[8px] marker:text-muted">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const found = await findCase((await params).slug);
  if (!found) notFound();
  const { data, project, next } = found;
  const study = project.caseStudy!;

  return (
    <>
      <Nav site={data.site} contact={data.contact} base="/" />
      <main>
        <Container className="pb-[72px] pt-[40px] 768:pb-[96px] 768:pt-[56px]">
          <article className="mx-auto max-w-[880px]">
            <Link
              href="/#work"
              className="inline-flex items-center gap-[6px] font-mono text-[12px] text-muted transition-colors hover:text-accent"
            >
              <ArrowLeft className="size-[13px]" aria-hidden="true" />
              All work
            </Link>

            <p className="mt-[36px] font-mono text-[12px] tracking-[0.1em] text-accent 768:mt-[48px]">
              CASE STUDY · {project.period}
            </p>
            <ProjectTitle project={project}>
              <h1 className="mt-[12px] w-fit text-[36px] font-bold leading-[1.05] tracking-[-0.03em] 768:text-[56px]">
                {project.title}
              </h1>
            </ProjectTitle>
            <p className="mt-[18px] max-w-[640px] text-[16px] text-muted 768:text-[18px]">{project.summary}</p>

            <dl className="mt-[28px] grid gap-[10px] font-mono text-[12px] 768:grid-cols-[180px_1fr] 768:gap-x-[24px]">
              <dt className="tracking-[0.08em] text-muted">ROLE</dt>
              <dd>{project.role}</dd>
              <dt className="tracking-[0.08em] text-muted">STACK</dt>
              <dd>{project.tags}</dd>
              <dt className="tracking-[0.08em] text-muted">LIVE</dt>
              <dd className="flex flex-wrap gap-x-[16px] gap-y-[4px]">
                <SiteLinks links={project.links} empty="pre-launch" />
              </dd>
            </dl>

            {project.screenshots && (
              <div className="mt-[40px]">
                <ProjectShots shots={project.screenshots} eager />
              </div>
            )}

            <div className="mt-[24px]">
              <Part index={1} label="CONTEXT">
                <p>{study.context}</p>
              </Part>
              <Part index={2} label="THE PROBLEM">
                <p>{study.problem}</p>
              </Part>
              <Part index={3} label="WHAT I DID">
                <Points items={study.approach} />
              </Part>
              <Part index={4} label="OUTCOME">
                <Points items={study.results} />
              </Part>
            </div>

            {next !== project && (
              <Link
                href={`/work/${next.caseStudy!.slug}`}
                className="group mt-[16px] flex items-center justify-between gap-[16px] border-t border-line pt-[28px]"
              >
                <span>
                  <span className="block font-mono text-[12px] tracking-[0.08em] text-muted">NEXT CASE STUDY</span>
                  <span className="mt-[6px] block text-[22px] font-bold tracking-[-0.02em] transition-colors group-hover:text-accent 768:text-[28px]">
                    {next.title}
                  </span>
                </span>
                <ArrowRight className="size-[22px] shrink-0 text-muted transition-colors group-hover:text-accent" aria-hidden="true" />
              </Link>
            )}
          </article>
        </Container>
      </main>
      <Footer footer={data.footer} site={data.site} contact={data.contact} base="/" />
    </>
  );
}
