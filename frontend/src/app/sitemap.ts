import type { MetadataRoute } from "next";
import { getPortfolio } from "@/lib/api/portfolio";
import { caseStudies } from "@/lib/cases";
import { SITE_URL } from "@/lib/site";

/**
 * Home plus every case study page, from the same list generateStaticParams uses, so it
 * never advertises a page that 404s. No lastModified: there is no reliable date per page,
 * and a build date on every entry would claim the whole site changed on every deploy.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getPortfolio();
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...caseStudies(data)
      .filter((project) => !project.seo?.noIndex)
      .map((project) => ({ url: `${SITE_URL}/work/${project.slug}`, changeFrequency: "yearly" as const, priority: 0.7 })),
  ];
}
