const raw = process.env.NEXT_PUBLIC_SITE_URL;
if (!raw) console.warn("NEXT_PUBLIC_SITE_URL is not set; canonicals and the sitemap fall back to localhost.");

/** Absolute origin, no trailing slash. Baked in at build (Docker build arg). */
export const SITE_URL = (raw || "http://localhost:3000").replace(/\/$/, "");

/** Only the literal value `production` opens indexing; staging and local stay hidden. */
export const IS_INDEXABLE = process.env.NEXT_PUBLIC_SITE_ENV === "production";

export const SITE_NAME = "Nguyen Hoang Quan";
export const SITE_TITLE = "Nguyen Hoang Quan — Full-stack Developer";
export const SITE_DESCRIPTION =
  "Portfolio of Nguyen Hoang Quan, a full-stack developer in Hanoi building and looking after production websites for international clients.";
