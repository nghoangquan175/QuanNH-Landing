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
import type { CaseStudy, Portfolio, PersonalProject, Project } from "@/types/portfolio";

type Entry = (Project | PersonalProject) & { caseStudy: CaseStudy };

/** Client then personal projects that have a write-up, in the order the home page lists them. */
function caseStudies(data: Portfolio): Entry[] {
  return [...data.work.projects, ...data.personal.projects].filter((project): project is Entry => !!project.caseStudy);
}

async function findCase(slug: string) {
  const data = await getPortfolio();
  const all = caseStudies(data);
  const index = all.findIndex((project) => project.caseStudy.slug === slug);
  if (index === -1) return null;
  return { data, project: all[index], next: all[(index + 1) % all.length] };
}

export async function generateStaticParams() {
  return caseStudies(await getPortfolio()).map((project) => ({ slug: project.caseStudy.slug }));
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

/** One thing that broke: what was seen, why, what changed, and what it gave. */
function Chapter({ chapter }: { chapter: NonNullable<CaseStudy["chapters"]>[number] }) {
  const rows: [string, React.ReactNode][] = [
    ["PROBLEM", chapter.problem],
    ...(chapter.why ? [["WHY", chapter.why] as [string, React.ReactNode]] : []),
    ["FIX", chapter.fix.length === 1 ? chapter.fix[0] : <Points items={chapter.fix} />],
    ["RESULT", chapter.result],
  ];
  return (
    <div className="scroll-reveal">
      <h3 className="text-[19px] font-bold tracking-[-0.01em] 768:text-[21px]">{chapter.title}</h3>
      <dl className="mt-[12px] grid gap-x-[16px] gap-y-[10px] 768:grid-cols-[72px_1fr]">
        {rows.map(([label, body]) => (
          <div key={label} className="contents">
            <dt className="pt-[5px] font-mono text-[11px] tracking-[0.08em] text-muted">{label}</dt>
            <dd className={label === "RESULT" ? "text-accent" : undefined}>{body}</dd>
          </div>
        ))}
      </dl>
    </div>
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
  const study = project.caseStudy;
  const role = "role" in project ? project.role : "Personal project";
  // Numbered in order, so optional parts don't leave gaps.
  const parts: { label: string; body: React.ReactNode }[] = [
    { label: "CONTEXT", body: <p>{study.context}</p> },
    { label: "THE PROBLEM", body: <p>{study.problem}</p> },
    { label: "WHAT I DID", body: <Points items={study.approach} /> },
    ...(study.chapters
      ? [
          {
            label: "WHAT BROKE UNDER LOAD",
            body: (
              <div className="space-y-[32px]">
                {study.chapters.map((chapter) => (
                  <Chapter key={chapter.title} chapter={chapter} />
                ))}
              </div>
            ),
          },
        ]
      : []),
    { label: "OUTCOME", body: <Points items={study.results} /> },
    ...(study.open ? [{ label: "STILL OPEN", body: <Points items={study.open} /> }] : []),
  ];

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
              <dd>{role}</dd>
              <dt className="tracking-[0.08em] text-muted">STACK</dt>
              <dd>{project.tags}</dd>
              <dt className="tracking-[0.08em] text-muted">LIVE</dt>
              <dd className="flex flex-wrap gap-x-[16px] gap-y-[4px]">
                <SiteLinks links={project.links} empty={"role" in project ? "pre-launch" : "private repo"} />
              </dd>
            </dl>

            {"screenshots" in project && project.screenshots && (
              <div className="mt-[40px]">
                <ProjectShots shots={project.screenshots} eager />
              </div>
            )}

            <div className="mt-[24px]">
              {parts.map((part, i) => (
                <Part key={part.label} index={i + 1} label={part.label}>
                  {part.body}
                </Part>
              ))}
            </div>

            {next !== project && (
              <Link
                href={`/work/${next.caseStudy.slug}`}
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
