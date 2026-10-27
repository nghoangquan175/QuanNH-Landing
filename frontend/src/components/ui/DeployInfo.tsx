import { TimeAgo } from "@/components/ui/TimeAgo";

// Baked in by the Docker build (see deploy.yml); absent in local dev, where nothing renders.
const BUILT_AT = process.env.NEXT_PUBLIC_BUILD_TIME;

/** "Updated 2 minutes ago", from the time the site was built. */
export function DeployInfo() {
  if (!BUILT_AT) return null;
  return (
    <p>
      Updated <TimeAgo iso={BUILT_AT} />
    </p>
  );
}
