import type { MetadataRoute } from 'next';
import { topicPages } from '@/lib/content';
import { CONTENT_UPDATED, absoluteUrl } from '@/lib/site';

const extras: { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/faq', priority: 0.7 },
  { path: '/kontakt', priority: 0.6 },
  { path: '/impressum', priority: 0.2 },
  { path: '/datenschutz', priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${CONTENT_UPDATED}T00:00:00Z`);
  const topics = topicPages.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));
  return [
    ...extras.map((item) => ({
      url: absoluteUrl(item.path),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: item.priority,
    })),
    ...topics,
  ];
}
