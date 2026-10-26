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

export default async function Home() {
  const data = await getPortfolio();

  return (
    <>
      <Nav site={data.site} />
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
