import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { PORTFOLIO_TAG } from "@/lib/api/portfolio";

/**
 * Called by Strapi after any content change (backend/src/index.ts) and by the deploy
 * workflow once the new containers are up, since CI builds without CMS access. Marks the
 * cached content stale; the next visit gets the current page and refreshes it behind.
 */
export async function POST(request: Request) {
  const secret = Buffer.from(process.env.REVALIDATE_SECRET ?? "");
  const given = Buffer.from(request.headers.get("x-revalidate-secret") ?? "");
  if (secret.length === 0 || given.length !== secret.length || !timingSafeEqual(given, secret)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  revalidateTag(PORTFOLIO_TAG, "max");
  return Response.json({ revalidated: true });
}
