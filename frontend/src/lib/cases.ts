import type { CaseStudy, PersonalProject, Portfolio, Project } from "@/types/portfolio";

export type CaseEntry = (Project | PersonalProject) & { caseStudy: CaseStudy };

/**
 * Client then personal projects that have a write-up, in the order the home page lists
 * them. The case pages, their static params and the sitemap all read this one list.
 */
export function caseStudies(data: Portfolio): CaseEntry[] {
  return [...data.work.projects, ...data.personal.projects].filter((project): project is CaseEntry => !!project.caseStudy);
}

export function findCase(data: Portfolio, slug: string) {
  const all = caseStudies(data);
  const index = all.findIndex((project) => project.slug === slug);
  if (index === -1) return null;
  return { project: all[index], next: all[(index + 1) % all.length] };
}
