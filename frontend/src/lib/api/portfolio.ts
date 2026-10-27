import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import fallback from "@/data/portfolio.json";
import type { CaseStudy, Link, PersonalProject, Portfolio, Project } from "@/types/portfolio";

/** Every cached CMS read carries this tag; /api/revalidate drops them all at once. */
export const PORTFOLIO_TAG = "portfolio";

const FALLBACK = fallback as Portfolio;

// ---- Strapi's shapes, as far as the mapping below reads them -------------------------

type Point = { text: string };
type StrapiLink = { label: string; href: string };
type StrapiCaseStudy = {
  context: string;
  problem: string;
  approach: Point[];
  chapters: { title: string; problem: string; why: string | null; fix: Point[]; result: string }[];
  results: Point[];
  open: Point[];
};
type StrapiProject = {
  title: string;
  slug: string;
  period: string;
  summary: string;
  tags: string;
  details: Point[];
  links: StrapiLink[];
  caseStudy: StrapiCaseStudy | null;
};

// ---- Reads ---------------------------------------------------------------------------

type Populate = { [field: string]: true | { populate: Populate } };

/** Strapi's nested query syntax (`populate[a][populate][b]=true`) without a qs dependency. */
function query(params: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(params).flatMap(([key, value]) => {
    const name = prefix ? `${prefix}[${key}]` : key;
    return value !== null && typeof value === "object"
      ? query(value as Record<string, unknown>, name)
      : [`${encodeURIComponent(name)}=${encodeURIComponent(String(value))}`];
  });
}

/**
 * One REST read, or null when the CMS can't be used: not configured, unreachable, or
 * answering with an error (a 404 here means a single type nobody has filled in yet).
 * The reason is logged, so a fallback page never hides a broken read silently.
 */
async function read<T>(path: string, params: Record<string, unknown>): Promise<T | null> {
  const base = process.env.STRAPI_API_URL;
  const token = process.env.STRAPI_API_TOKEN;
  if (!base || !token) return null;

  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api${path}?${query(params).join("&")}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.warn(`CMS ${path} answered ${res.status}; using the bundled content.`);
      return null;
    }
    return ((await res.json()) as { data: T }).data;
  } catch (error) {
    console.warn(`CMS ${path} unreachable (${(error as Error).message}); using the bundled content.`);
    return null;
  }
}

const PROJECT_POPULATE: Populate = {
  details: true,
  links: true,
  caseStudy: { populate: { approach: true, results: true, open: true, chapters: { populate: { fix: true } } } },
};

// ---- Mapping, field by field so a half-filled entry degrades one field at a time ------

const texts = (points: Point[] | null | undefined) => (points ?? []).map((point) => point.text);
const link = (value: StrapiLink | null | undefined, fb: Link): Link => ({ label: value?.label ?? fb.label, href: value?.href ?? fb.href });

function caseStudy(study: StrapiCaseStudy | null): CaseStudy | undefined {
  if (!study) return undefined;
  const chapters = (study.chapters ?? []).map((chapter) => ({
    title: chapter.title,
    problem: chapter.problem,
    ...(chapter.why ? { why: chapter.why } : {}),
    fix: texts(chapter.fix),
    result: chapter.result,
  }));
  const open = texts(study.open);
  return {
    context: study.context,
    problem: study.problem,
    approach: texts(study.approach),
    ...(chapters.length ? { chapters } : {}),
    results: texts(study.results),
    ...(open.length ? { open } : {}),
  };
}

function project(entry: StrapiProject) {
  const study = caseStudy(entry.caseStudy);
  return {
    title: entry.title,
    slug: entry.slug,
    period: entry.period,
    summary: entry.summary,
    tags: entry.tags,
    details: texts(entry.details),
    links: (entry.links ?? []).map((value) => ({ label: value.label, href: value.href })),
    ...(study ? { caseStudy: study } : {}),
  };
}

async function getSite(): Promise<Pick<Portfolio, "site" | "footer">> {
  type Site = {
    logo: string;
    logoAccent: string;
    nav: StrapiLink[];
    navCta: StrapiLink | null;
    footerName: string;
    footerTagline: string;
    footerLocation: string;
  };
  const site = await read<Site>("/site", { populate: { nav: true, navCta: true } });
  if (!site) return { site: FALLBACK.site, footer: FALLBACK.footer };
  return {
    site: {
      logo: site.logo,
      logoAccent: site.logoAccent,
      nav: site.nav?.length ? site.nav.map((value) => ({ label: value.label, href: value.href })) : FALLBACK.site.nav,
      navCta: link(site.navCta, FALLBACK.site.navCta),
    },
    footer: { name: site.footerName, tagline: site.footerTagline, location: site.footerLocation },
  };
}

type Heading = { eyebrow: string; title: string };
type Home = {
  hero: {
    tag: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    primaryCta: StrapiLink | null;
    secondaryCta: StrapiLink | null;
    stats: { value: string; label: string; timeZone: string | null }[];
  } | null;
  work: Heading | null;
  personal: Heading | null;
  skills: (Heading & { groups: { title: string; items: string }[] }) | null;
  experience: (Heading & { jobs: { period: string; title: string; tag: string | null; points: Point[] }[] }) | null;
  language:
    | (Heading & {
        text: string;
        certificate: Portfolio["language"]["certificate"] | null;
        uses: { label: string; text: string }[];
      })
    | null;
  contact:
    | (Heading & {
        text: string;
        email: string;
        links: { label: string; value: string; href: string }[];
        location: string;
        timeZone: string;
      })
    | null;
};

const heading = (value: Heading): Heading => ({ eyebrow: value.eyebrow, title: value.title });

async function getHome() {
  const home = await read<Home>("/home", {
    populate: {
      hero: { populate: { primaryCta: true, secondaryCta: true, stats: true } },
      work: true,
      personal: true,
      skills: { populate: { groups: true } },
      experience: { populate: { jobs: { populate: { points: true } } } },
      language: { populate: { certificate: true, uses: true } },
      contact: { populate: { links: true } },
    } satisfies Populate,
  });
  const { hero, skills, experience, language, contact } = home ?? {};

  return {
    hero: hero
      ? {
          tag: hero.tag,
          titleLines: [hero.titleLine1, hero.titleLine2] as [string, string],
          description: hero.description,
          primaryCta: link(hero.primaryCta, FALLBACK.hero.primaryCta),
          secondaryCta: link(hero.secondaryCta, FALLBACK.hero.secondaryCta),
          stats: (hero.stats ?? []).map((stat) => ({
            value: stat.value,
            label: stat.label,
            ...(stat.timeZone ? { timeZone: stat.timeZone } : {}),
          })),
        }
      : FALLBACK.hero,
    work: home?.work ? heading(home.work) : heading(FALLBACK.work),
    personal: home?.personal ? heading(home.personal) : heading(FALLBACK.personal),
    skills: skills
      ? { ...heading(skills), groups: (skills.groups ?? []).map((group) => ({ title: group.title, items: group.items })) }
      : FALLBACK.skills,
    experience: experience
      ? {
          ...heading(experience),
          jobs: (experience.jobs ?? []).map((job) => ({
            period: job.period,
            title: job.title,
            ...(job.tag ? { tag: job.tag } : {}),
            points: texts(job.points),
          })),
        }
      : FALLBACK.experience,
    language: language
      ? {
          ...heading(language),
          text: language.text,
          certificate: language.certificate
            ? {
                name: language.certificate.name,
                date: language.certificate.date,
                overall: language.certificate.overall,
                cefr: language.certificate.cefr,
                imageAlt: language.certificate.imageAlt,
              }
            : FALLBACK.language.certificate,
          uses: (language.uses ?? []).map((use) => ({ label: use.label, text: use.text })),
        }
      : FALLBACK.language,
    contact: contact
      ? {
          ...heading(contact),
          text: contact.text,
          email: contact.email,
          links: (contact.links ?? []).map((value) => ({ label: value.label, value: value.value, href: value.href })),
          location: contact.location,
          timeZone: contact.timeZone,
        }
      : FALLBACK.contact,
  };
}

/** A collection in its stated order; null (→ fallback) when the read fails or nothing is in it. */
async function getProjects<T extends StrapiProject>(path: string) {
  const entries = await read<T[]>(path, {
    populate: PROJECT_POPULATE,
    sort: ["order:asc", "title:asc"],
    pagination: { pageSize: 100 },
  });
  return entries?.length ? entries : null;
}

/**
 * Single entry point for page content: the CMS when it answers, the bundled JSON
 * (src/data/portfolio.json, which also seeds the CMS) for any part it can't supply.
 * Cached for an hour and tagged, so Strapi's save hook refreshes it straight away.
 */
export async function getPortfolio(): Promise<Portfolio> {
  "use cache";
  cacheLife("hours");
  cacheTag(PORTFOLIO_TAG);

  const [site, home, clients, personals] = await Promise.all([
    getSite(),
    getHome(),
    getProjects<StrapiProject & { role: string; company: string | null }>("/client-projects"),
    getProjects<StrapiProject & { status: string | null; repo: string | null }>("/personal-projects"),
  ]);

  const work: Project[] = clients
    ? clients.map((entry) => ({ ...project(entry), role: entry.role, ...(entry.company ? { company: entry.company } : {}) }))
    : FALLBACK.work.projects;
  const personal: PersonalProject[] = personals
    ? personals.map((entry) => ({
        ...project(entry),
        ...(entry.status ? { status: entry.status } : {}),
        ...(entry.repo ? { repo: entry.repo } : {}),
      }))
    : FALLBACK.personal.projects;

  return {
    ...site,
    ...home,
    work: { ...home.work, projects: work },
    personal: { ...home.personal, projects: personal },
  };
}
