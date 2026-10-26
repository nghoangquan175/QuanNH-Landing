import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// The one real cross-origin resource the browser loads directly: uploaded media.
// `??` is not enough here: an unpassed Docker ARG becomes an empty string, not
// undefined, and the header would ship with no CMS origin at all.
const rawCmsOrigin = process.env.STRAPI_API_URL?.trim();
const cmsOrigin = (rawCmsOrigin && rawCmsOrigin !== "" ? rawCmsOrigin : "http://127.0.0.1:1337")
  .replace(/\/$/, "");

// Both names for the loopback machine, dev only — they are different origins to a browser.
const devCmsOrigins = !isDev
  ? ""
  : cmsOrigin.includes("://127.0.0.1")
    ? ` ${cmsOrigin.replace("://127.0.0.1", "://localhost")}`
    : cmsOrigin.includes("://localhost")
      ? ` ${cmsOrigin.replace("://localhost", "://127.0.0.1")}`
      : "";

// Static headers rather than a nonce-based CSP: nonces force every page dynamic.
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: ${cmsOrigin}${devCmsOrigins};
  media-src 'self' blob: ${cmsOrigin}${devCmsOrigins};
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  ${isDev ? "" : "upgrade-insecure-requests;"}
`.replace(/\s{2,}/g, " ").trim();

const nextConfig: NextConfig = {
  output: "standalone", // the Dockerfile copies .next/standalone
  cacheComponents: true,
  partialPrefetching: true,

  images: {
    // An unlisted host is a 400 from /_next/image — this list is the difference
    // between images and none.
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "1337" },
      { protocol: "http", hostname: "127.0.0.1", port: "1337" },
      { protocol: "https", hostname: "cms.quannh.xyz" },
    ],
    dangerouslyAllowSVG: false,
    dangerouslyAllowLocalIP: isDev,
  },

  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "Content-Security-Policy", value: cspHeader },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ...(process.env.NEXT_PUBLIC_SITE_ENV === "production"
          ? []
          : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
      ],
    }];
  },
};

export default nextConfig;
