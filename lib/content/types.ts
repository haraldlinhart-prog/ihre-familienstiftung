export type Section = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type SourceLink = {
  href: string;
  label: string;
};

export type RelatedLink = {
  href: string;
  title: string;
  text: string;
};

export type TopicPage = {
  slug: string;
  path: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  lead: string;
  sections: Section[];
  sources?: SourceLink[];
  related: RelatedLink[];
  showComparison?: boolean;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ComparisonRow = {
  criterion: string;
  foundation: string;
  structure: string;
};
