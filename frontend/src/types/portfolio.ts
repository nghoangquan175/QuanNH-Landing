export type Link = { label: string; href: string };

export type Stat = { value: string; label: string };

export type Project = {
  title: string;
  description: string;
  role: string;
  href: string | null;
};

export type SkillGroup = { title: string; items: string };

export type Job = { period: string; title: string; points: string[] };

export type SectionHeading = { eyebrow: string; title: string };

export type Portfolio = {
  site: { logo: string; logoAccent: string; nav: Link[]; navCta: Link };
  hero: {
    tag: string;
    titleLines: [string, string];
    description: string;
    primaryCta: Link;
    secondaryCta: Link;
    stats: Stat[];
  };
  work: SectionHeading & { projects: Project[] };
  skills: SectionHeading & { groups: SkillGroup[] };
  experience: SectionHeading & { jobs: Job[] };
  contact: SectionHeading & { links: (Link & { primary: boolean })[] };
  footer: string;
};
