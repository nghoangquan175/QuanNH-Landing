import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PersonalList } from "@/components/sections/PersonalList";
import type { Portfolio } from "@/types/portfolio";

export function Personal({ personal }: { personal: Portfolio["personal"] }) {
  return (
    <section id="personal" className="border-t border-line py-[64px] 768:py-[88px] 1024:py-[110px]">
      <Container>
        <SectionHeading eyebrow={personal.eyebrow} title={personal.title} />
        <PersonalList projects={personal.projects} />
      </Container>
    </section>
  );
}
