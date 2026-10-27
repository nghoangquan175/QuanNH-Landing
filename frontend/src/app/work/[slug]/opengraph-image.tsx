import { notFound } from "next/navigation";
import { getPortfolio } from "@/lib/api/portfolio";
import { caseStudies, findCase } from "@/lib/cases";
import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Case study by Nguyen Hoang Quan";
export const size = OG_SIZE;
export const contentType = "image/png";

// Rendered at build for each case study, like the pages themselves.
export async function generateStaticParams() {
  return caseStudies(await getPortfolio()).map((project) => ({ slug: project.slug }));
}

// Set in this segment too: a page that sets openGraph doesn't inherit the root image.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const found = findCase(await getPortfolio(), (await params).slug);
  if (!found) notFound();
  const { project } = found;
  return ogImage({ eyebrow: `CASE STUDY · ${project.period}`, title: project.title, text: project.summary });
}
