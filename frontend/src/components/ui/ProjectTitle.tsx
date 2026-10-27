import { ViewTransition } from "react";
import type { CaseStudy } from "@/types/portfolio";

/**
 * The title, named so it morphs into the case study's heading (and back) on navigation.
 * Only projects with a case study get a name.
 */
export function ProjectTitle({ project, children }: { project: { slug: string; caseStudy?: CaseStudy }; children: React.ReactNode }) {
  if (!project.caseStudy) return children;
  return (
    <ViewTransition name={`case-${project.slug}`} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
