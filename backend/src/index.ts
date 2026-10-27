import type { Core } from '@strapi/strapi';

// Everything the site renders. A change to any of them refreshes the cached pages.
const CONTENT = ['api::site.site', 'api::home.home', 'api::client-project.client-project', 'api::personal-project.personal-project'];

export default {
  register() {},

  /**
   * Tells the frontend to drop its cached copy whenever content changes, so a save in the
   * admin shows on the site within seconds rather than at the next hourly refresh.
   * REVALIDATE_URL and REVALIDATE_SECRET come from the server's env; without them (local
   * dev with no frontend running) nothing is sent.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const url = process.env.REVALIDATE_URL;
    const secret = process.env.REVALIDATE_SECRET;
    if (!url || !secret) return;

    // A seed or a bulk edit fires many events at once; one request after they settle is enough.
    let timer: NodeJS.Timeout | undefined;
    const revalidate = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fetch(url, { method: 'POST', headers: { 'x-revalidate-secret': secret } })
          .then((res) => {
            if (!res.ok) strapi.log.warn(`Revalidate answered ${res.status}`);
          })
          .catch((error) => strapi.log.warn(`Revalidate failed: ${error.message}`));
      }, 1500);
    };

    strapi.db.lifecycles.subscribe({
      models: CONTENT,
      afterCreate: revalidate,
      afterUpdate: revalidate,
      afterDelete: revalidate,
    });
  },
};
