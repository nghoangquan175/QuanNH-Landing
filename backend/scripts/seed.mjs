// Fills the CMS from the frontend's fallback content, so the two start out identical.
//
//     STRAPI_URL=http://127.0.0.1:1337 STRAPI_TOKEN=<full-access token> node scripts/seed.mjs
//
// Safe to run again: single types are overwritten, projects are matched by slug and
// updated, and projects whose slug is no longer in the JSON are deleted. It overwrites
// whatever an editor changed in the admin, so run it to set a CMS up, not to sync one.

import { readFile } from "node:fs/promises";

const url = (process.env.STRAPI_URL ?? "http://127.0.0.1:1337").replace(/\/$/, "");
const token = process.env.STRAPI_TOKEN;
if (!token) throw new Error("Set STRAPI_TOKEN to a full-access API token.");

const source = new URL("../../frontend/src/data/portfolio.json", import.meta.url);
const data = JSON.parse(await readFile(source, "utf8"));

async function api(method, path, body) {
  const res = await fetch(`${url}/api${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify({ data: body }) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

const points = (list = []) => list.map((text) => ({ text }));
const link = ({ label, href }) => ({ label, href });

const caseStudy = (study) =>
  study && {
    context: study.context,
    problem: study.problem,
    approach: points(study.approach),
    chapters: (study.chapters ?? []).map((chapter) => ({
      title: chapter.title,
      problem: chapter.problem,
      why: chapter.why ?? null,
      fix: points(chapter.fix),
      result: chapter.result,
    })),
    results: points(study.results),
    open: points(study.open),
  };

const heading = ({ eyebrow, title }) => ({ eyebrow, title });

await api("PUT", "/site", {
  logo: data.site.logo,
  logoAccent: data.site.logoAccent,
  nav: data.site.nav.map(link),
  navCta: link(data.site.navCta),
  footerName: data.footer.name,
  footerTagline: data.footer.tagline,
  footerLocation: data.footer.location,
});
console.log("site");

const { hero, skills, experience, language, contact } = data;
await api("PUT", "/home", {
  hero: {
    tag: hero.tag,
    titleLine1: hero.titleLines[0],
    titleLine2: hero.titleLines[1],
    description: hero.description,
    primaryCta: link(hero.primaryCta),
    secondaryCta: link(hero.secondaryCta),
    stats: hero.stats.map(({ value, label, timeZone }) => ({ value, label, timeZone: timeZone ?? null })),
  },
  work: heading(data.work),
  personal: heading(data.personal),
  skills: { ...heading(skills), groups: skills.groups.map(({ title, items }) => ({ title, items })) },
  experience: {
    ...heading(experience),
    jobs: experience.jobs.map((job) => ({ period: job.period, title: job.title, tag: job.tag ?? null, points: points(job.points) })),
  },
  language: {
    ...heading(language),
    text: language.text,
    certificate: { ...language.certificate },
    uses: language.uses.map(({ label, text }) => ({ label, text })),
  },
  contact: {
    ...heading(contact),
    text: contact.text,
    email: contact.email,
    links: contact.links.map(({ label, value, href }) => ({ label, value, href })),
    location: contact.location,
    timeZone: contact.timeZone,
  },
});
console.log("home");

async function syncProjects(path, projects, extra) {
  const existing = (await api("GET", `${path}?fields[0]=slug&pagination[pageSize]=100`)).data;
  const bySlug = new Map(existing.map((entry) => [entry.slug, entry.documentId]));

  for (const [order, project] of projects.entries()) {
    const body = {
      title: project.title,
      slug: project.slug,
      order,
      period: project.period,
      summary: project.summary,
      tags: project.tags,
      details: points(project.details),
      links: project.links.map(link),
      caseStudy: caseStudy(project.caseStudy) ?? null,
      ...extra(project),
    };
    const id = bySlug.get(project.slug);
    await (id ? api("PUT", `${path}/${id}`, body) : api("POST", path, body));
    bySlug.delete(project.slug);
    console.log(`${path.slice(1)}: ${project.slug} ${id ? "updated" : "created"}`);
  }

  for (const [slug, id] of bySlug) {
    await api("DELETE", `${path}/${id}`);
    console.log(`${path.slice(1)}: ${slug} deleted`);
  }
}

await syncProjects("/client-projects", data.work.projects, (project) => ({
  role: project.role,
  company: project.company ?? null,
}));
await syncProjects("/personal-projects", data.personal.projects, (project) => ({
  status: project.status ?? null,
  repo: project.repo ?? null,
}));
