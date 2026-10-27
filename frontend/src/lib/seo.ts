import type { Metadata } from "next";
import type { Seo } from "@/types/portfolio";

/**
 * Metadata for one page. `path` is required: a canonical that can be left off will be.
 * The CMS's SEO fields win; the page's own title and summary fill anything left empty.
 * `absolute` skips the layout's "· Nguyen Hoang Quan" suffix (the home page).
 */
export function pageMetadata(
  path: string,
  fallback: { title: string; description: string; absolute?: boolean },
  seo?: Seo,
): Metadata {
  const title = seo?.metaTitle?.trim() || fallback.title;
  const description = seo?.metaDescription?.trim() || fallback.description;
  return {
    title: fallback.absolute && !seo?.metaTitle?.trim() ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    ...(seo?.noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: { title, description, url: path },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** A JSON-LD payload, with `<` escaped so CMS text can't close the script tag. */
export function jsonLd(data: object) {
  return { __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\u003c") };
}
