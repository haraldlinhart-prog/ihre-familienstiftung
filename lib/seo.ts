import type { Metadata } from 'next';
import type { FaqItem } from './content/types';
import { CONTACT_EMAIL, SITE_NAME, SITE_URL, absoluteUrl } from './site';

export const organizationId = `${SITE_URL}/#organization`;
export const websiteId = `${SITE_URL}/#website`;

export function plainText(input: string): string {
  return input.replace(/\[([^\]]+)\]\((?:\/[^)\s]+|https:\/\/[^)\s]+)\)/g, '$1');
}

export function pageMetadata(options: {
  title: string;
  description: string;
  path: string;
  kind?: 'website' | 'article';
}): Metadata {
  const url = absoluteUrl(options.path);
  const documentTitle = options.path === '/' ? options.title : `${options.title} | ${SITE_NAME}`;
  return {
    title: options.path === '/' ? { absolute: documentTitle } : options.title,
    description: options.description,
    alternates: { canonical: url, languages: { de: url } },
    robots: { index: true, follow: true },
    openGraph: {
      title: documentTitle,
      description: options.description,
      url,
      siteName: SITE_NAME,
      locale: 'de_DE',
      type: options.kind === 'article' ? 'article' : 'website',
    },
    twitter: {
      card: 'summary',
      title: documentTitle,
      description: options.description,
    },
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: SITE_NAME,
    url: SITE_URL,
    email: CONTACT_EMAIL,
    description:
      'Informationsangebot von PAN21 (Harald Linhart) zu Familienstiftung, Lighthouse Trust, Wyoming-LLC und Family Office.',
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: 'de',
    description:
      'Sachliche Informationen darüber, wie sich Ziele einer Familienstiftung mit einem Lighthouse Trust und einer Wyoming-LLC abbilden lassen.',
    publisher: { '@id': organizationId },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd(options: {
  title: string;
  description: string;
  path: string;
  updated: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.title,
    description: options.description,
    inLanguage: 'de',
    datePublished: options.updated,
    dateModified: options.updated,
    mainEntityOfPage: absoluteUrl(options.path),
    author: { '@id': organizationId },
    publisher: { '@id': organizationId },
  };
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'de',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: plainText(item.answer) },
    })),
  };
}
