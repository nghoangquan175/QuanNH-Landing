import "server-only";

import fallback from "@/data/portfolio.json";
import type { Portfolio } from "@/types/portfolio";

/**
 * Single entry point for page content. Today it returns the bundled JSON fallback;
 * when the Strapi content types exist, fetch them here (with STRAPI_API_TOKEN) and keep
 * the JSON as the fallback for builds where the CMS is unreachable.
 */
export async function getPortfolio(): Promise<Portfolio> {
  return fallback as Portfolio;
}
