import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

const aiAgents = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Amazonbot',
  'Bytespider',
  'cohere-ai',
  'Meta-ExternalAgent',
  'YouBot',
  'Diffbot',
];

export default function robots(): MetadataRoute.Robots {
  const content = { allow: '/', disallow: ['/api/'] };
  return {
    rules: [{ userAgent: '*', ...content }, ...aiAgents.map((userAgent) => ({ userAgent, ...content }))],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
