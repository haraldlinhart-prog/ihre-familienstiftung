import type { Metadata } from 'next';
import { TopicLayout } from '@/components/TopicLayout';
import { requireTopic } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

const page = requireTopic('ablauf');

export const metadata: Metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
  kind: 'article',
});

export default function AblaufPage() {
  return <TopicLayout page={page} />;
}
