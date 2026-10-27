import "server-only";

import { cacheLife } from "next/cache";

/**
 * When the latest commit landed on a public repo's default branch, or null if GitHub
 * can't be reached or rate-limits us (unauthenticated: 60 requests an hour per IP, which
 * shared CI runners often exhaust). Cached for an hour, so the static page refreshes it
 * in the background on the server rather than on each visit. An optional GITHUB_TOKEN in
 * the runtime environment lifts the limit; never pass it as a Docker build arg.
 */
export async function getLastCommit(repo: string): Promise<string | null> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "quannh.xyz",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
    });
    if (!res.ok) return null;
    const [latest] = (await res.json()) as { commit?: { committer?: { date?: string } } }[];
    return latest?.commit?.committer?.date ?? null;
  } catch {
    return null;
  }
}
