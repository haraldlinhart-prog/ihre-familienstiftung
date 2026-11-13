import type { ReactNode } from 'react';

const TOKEN = /\[([^\]]+)\]\((\/[^)\s]+|https:\/\/[^)\s]+)\)/g;

export function RichText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));
    const label = match[1];
    const href = match[2];
    const external = href.startsWith('https://');
    nodes.push(
      <a key={`${href}-${index}`} href={href} {...(external ? { rel: 'noopener noreferrer' } : {})}>
        {label}
        {external ? <span className="external"> (extern)</span> : null}
      </a>,
    );
    last = index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}
