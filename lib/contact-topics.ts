export const CONTACT_TOPICS = [
  'Familienstiftung',
  'Lighthouse Trust',
  'Wyoming LLC',
  'Family Office',
  'Sonstiges',
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];
