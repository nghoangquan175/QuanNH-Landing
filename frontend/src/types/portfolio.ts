export type Link = { label: string; href: string };

export type Stat = { value: string; label: string };

export type Project = {
  title: string;
  period: string;
  /** One line shown while collapsed. */
  summary: string;
  role: string;
  tags: string;
  /** What I did, shown when expanded. */
  details: string[];
  /** Live sites; empty while a project is pre-launch. */
  links: Link[];
  /** Home-page captures shown when expanded; `image` is a key in ProjectShots. */
  screenshots?: { image: string; alt: string }[];
};

export type PersonalProject = {
  title: string;
  period: string;
  /** One line shown while collapsed. */
  summary: string;
  tags: string;
  /** Shown when expanded. */
  details: string[];
  /** Public links only; a private repo gets none. */
  links: Link[];
  /** "owner/name" of a public repo; shows when it was last committed to. */
  repo?: string;
};

export type SkillGroup = { title: string; items: string };

export type Job = {
  period: string;
  title: string;
  /** Optional label on the card, e.g. EDUCATION. */
  tag?: string;
  points: string[];
};

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
  personal: SectionHeading & { projects: PersonalProject[] };
  skills: SectionHeading & { groups: SkillGroup[] };
  experience: SectionHeading & { jobs: Job[] };
  language: SectionHeading & {
    text: string;
    certificate: {
      name: string;
      date: string;
      overall: string;
      cefr: string;
      imageAlt: string;
    };
    uses: { label: string; text: string }[];
  };
  contact: SectionHeading & {
    text: string;
    email: string;
    links: (Link & { value: string })[];
    location: string;
    /** IANA zone for the live local-time readout. */
    timeZone: string;
  };
  footer: { name: string; tagline: string; location: string };
};
