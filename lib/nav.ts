export const primaryNav = [
  { href: '/familienstiftung', label: 'Familienstiftung' },
  { href: '/lighthouse-trust', label: 'Lighthouse Trust' },
  { href: '/wyoming-llc', label: 'Wyoming LLC' },
  { href: '/family-office', label: 'Family Office' },
  { href: '/vergleich', label: 'Vergleich' },
  { href: '/ablauf', label: 'Ablauf' },
  { href: '/faq', label: 'FAQ' },
] as const;

export const footerNav = [
  ...primaryNav,
  { href: '/kontakt', label: 'Kontakt' },
  { href: '/impressum', label: 'Impressum' },
  { href: '/datenschutz', label: 'Datenschutz' },
] as const;
