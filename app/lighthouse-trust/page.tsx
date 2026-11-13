import type { Metadata } from 'next';
import { TopicLayout } from '@/components/TopicLayout';
import { requireTopic } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

const page = requireTopic('lighthouse-trust');

export const metadata: Metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
  kind: 'article',
});

export default function LighthouseTrustPage() {
  return <TopicLayout page={page} />;
}
