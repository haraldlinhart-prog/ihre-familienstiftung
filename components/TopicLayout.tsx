import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ComparisonTable } from '@/components/ComparisonTable';
import { Disclaimer } from '@/components/Disclaimer';
import { JsonLd } from '@/components/JsonLd';
import { RichText } from '@/components/RichText';
import type { TopicPage } from '@/lib/content';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { CONTENT_UPDATED, formatGermanDate } from '@/lib/site';

export function TopicLayout({ page }: { page: TopicPage }) {
  const crumbs = [
    { name: 'Start', path: '/' },
    { name: page.label, path: page.path },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={articleJsonLd({
          title: page.title,
          description: page.description,
          path: page.path,
          updated: CONTENT_UPDATED,
        })}
      />
      <article className="article">
        <div className="wrap narrow">
          <Breadcrumbs items={crumbs} />
          <header className="article-head">
            <p className="eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p className="lead">{page.lead}</p>
            <p className="meta">Stand: {formatGermanDate(CONTENT_UPDATED)}</p>
          </header>
          <Disclaimer />
          {page.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`}>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>
                  <RichText text={paragraph} />
                </p>
              ))}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>
                      <RichText text={bullet} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
          {page.showComparison ? <ComparisonTable /> : null}
          {page.sources && page.sources.length > 0 ? (
            <section id="quellen" aria-labelledby="quellen-title">
              <h2 id="quellen-title">Quellen</h2>
              <p>Die verlinkten Texte können sich ändern. Maßgeblich ist die jeweils geltende Fassung.</p>
              <ul>
                {page.sources.map((source) => (
                  <li key={source.href}>
                    <a href={source.href} rel="noopener noreferrer">
                      {source.label}
                      <span className="external"> (extern)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <aside className="related" aria-labelledby="related-title">
            <h2 id="related-title">Weiterlesen</h2>
            <ul>
              {page.related.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.title}</Link>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </article>
    </>
  );
}
