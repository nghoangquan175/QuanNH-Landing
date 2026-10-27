import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Language } from "@/components/sections/Language";
import { Personal } from "@/components/sections/Personal";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { getPortfolio } from "@/lib/api/portfolio";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolio();
  return pageMetadata("/", { title: SITE_TITLE, description: SITE_DESCRIPTION, absolute: true }, data.seo);
}

export default async function Home() {
  const data = await getPortfolio();

  // Who the site is about, for search engines: name, role, place, and the profiles that
  // are the same person.
  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: SITE_NAME,
    jobTitle: "Full-stack Developer",
    url: SITE_URL,
    email: `mailto:${data.contact.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Hanoi", addressCountry: "VN" },
    sameAs: data.contact.links.map((link) => link.href),
    knowsLanguage: ["en", "vi"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@graph": [person, { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, publisher: { "@id": `${SITE_URL}/#person` } }],
        })}
      />
      <Nav site={data.site} contact={data.contact} />
      <main>
        <Hero hero={data.hero} />
        <Work work={data.work} />
        <Personal personal={data.personal} />
        <Skills skills={data.skills} />
        <Experience experience={data.experience} />
        <Language language={data.language} />
        <Contact contact={data.contact} />
      </main>
      <Footer footer={data.footer} site={data.site} contact={data.contact} />
    </>
  );
}
