import type { Schema, Struct } from '@strapi/strapi';

export interface CaseCaseStudy extends Struct.ComponentSchema {
  collectionName: 'components_case_case_studys';
  info: {
    displayName: 'Case study';
    icon: 'book';
  };
  attributes: {
    approach: Schema.Attribute.Component<'shared.point', true>;
    chapters: Schema.Attribute.Component<'case.chapter', true>;
    context: Schema.Attribute.Text & Schema.Attribute.Required;
    open: Schema.Attribute.Component<'shared.point', true>;
    problem: Schema.Attribute.Text & Schema.Attribute.Required;
    results: Schema.Attribute.Component<'shared.point', true>;
  };
}

export interface CaseChapter extends Struct.ComponentSchema {
  collectionName: 'components_case_chapters';
  info: {
    displayName: 'Chapter';
    icon: 'puzzle';
  };
  attributes: {
    fix: Schema.Attribute.Component<'shared.point', true>;
    problem: Schema.Attribute.Text & Schema.Attribute.Required;
    result: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    why: Schema.Attribute.Text;
  };
}

export interface HomeCertificate extends Struct.ComponentSchema {
  collectionName: 'components_home_certificates';
  info: {
    displayName: 'Certificate';
    icon: 'medal';
  };
  attributes: {
    cefr: Schema.Attribute.String & Schema.Attribute.Required;
    date: Schema.Attribute.String & Schema.Attribute.Required;
    imageAlt: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    overall: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeContact extends Struct.ComponentSchema {
  collectionName: 'components_home_contacts';
  info: {
    displayName: 'Contact';
    icon: 'envelop';
  };
  attributes: {
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    eyebrow: Schema.Attribute.String & Schema.Attribute.Required;
    links: Schema.Attribute.Component<'shared.contact-link', true>;
    location: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
    timeZone: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeExperience extends Struct.ComponentSchema {
  collectionName: 'components_home_experiences';
  info: {
    displayName: 'Experience';
    icon: 'briefcase';
  };
  attributes: {
    eyebrow: Schema.Attribute.String & Schema.Attribute.Required;
    jobs: Schema.Attribute.Component<'home.job', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeHero extends Struct.ComponentSchema {
  collectionName: 'components_home_heros';
  info: {
    displayName: 'Hero';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    primaryCta: Schema.Attribute.Component<'shared.link', false> &
      Schema.Attribute.Required;
    secondaryCta: Schema.Attribute.Component<'shared.link', false> &
      Schema.Attribute.Required;
    stats: Schema.Attribute.Component<'shared.stat', true>;
    tag: Schema.Attribute.String & Schema.Attribute.Required;
    titleLine1: Schema.Attribute.String & Schema.Attribute.Required;
    titleLine2: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeJob extends Struct.ComponentSchema {
  collectionName: 'components_home_jobs';
  info: {
    displayName: 'Job';
    icon: 'briefcase';
  };
  attributes: {
    period: Schema.Attribute.String & Schema.Attribute.Required;
    points: Schema.Attribute.Component<'shared.point', true>;
    tag: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeLanguage extends Struct.ComponentSchema {
  collectionName: 'components_home_languages';
  info: {
    displayName: 'Language';
    icon: 'globe';
  };
  attributes: {
    certificate: Schema.Attribute.Component<'home.certificate', false> &
      Schema.Attribute.Required;
    eyebrow: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    uses: Schema.Attribute.Component<'home.language-use', true>;
  };
}

export interface HomeLanguageUse extends Struct.ComponentSchema {
  collectionName: 'components_home_language_uses';
  info: {
    displayName: 'Language use';
    icon: 'bulletList';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface HomeSectionHeading extends Struct.ComponentSchema {
  collectionName: 'components_home_section_headings';
  info: {
    displayName: 'Section heading';
    icon: 'layout';
  };
  attributes: {
    eyebrow: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeSkillGroup extends Struct.ComponentSchema {
  collectionName: 'components_home_skill_groups';
  info: {
    displayName: 'Skill group';
    icon: 'bulletList';
  };
  attributes: {
    items: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeSkills extends Struct.ComponentSchema {
  collectionName: 'components_home_skillss';
  info: {
    displayName: 'Skills';
    icon: 'code';
  };
  attributes: {
    eyebrow: Schema.Attribute.String & Schema.Attribute.Required;
    groups: Schema.Attribute.Component<'home.skill-group', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedContactLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_contact_links';
  info: {
    displayName: 'Contact link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedPoint extends Struct.ComponentSchema {
  collectionName: 'components_shared_points';
  info: {
    displayName: 'Point';
    icon: 'bulletList';
  };
  attributes: {
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: "Leave empty to use the page's own title and summary.";
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    noIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface SharedStat extends Struct.ComponentSchema {
  collectionName: 'components_shared_stats';
  info: {
    displayName: 'Stat';
    icon: 'chartBubble';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    timeZone: Schema.Attribute.String;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'case.case-study': CaseCaseStudy;
      'case.chapter': CaseChapter;
      'home.certificate': HomeCertificate;
      'home.contact': HomeContact;
      'home.experience': HomeExperience;
      'home.hero': HomeHero;
      'home.job': HomeJob;
      'home.language': HomeLanguage;
      'home.language-use': HomeLanguageUse;
      'home.section-heading': HomeSectionHeading;
      'home.skill-group': HomeSkillGroup;
      'home.skills': HomeSkills;
      'shared.contact-link': SharedContactLink;
      'shared.link': SharedLink;
      'shared.point': SharedPoint;
      'shared.seo': SharedSeo;
      'shared.stat': SharedStat;
    }
  }
}
