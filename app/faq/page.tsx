import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Disclaimer } from '@/components/Disclaimer';
import { JsonLd } from '@/components/JsonLd';
import { RichText } from '@/components/RichText';
import { faqItems } from '@/lib/content';
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Häufige Fragen',
  description:
    'Antworten zu Familienstiftung, Lighthouse Trust, Wyoming-LLC, Kosten, Gläubigerschutz, Erbersatzsteuer und dem Kontaktformular. Keine Beratung.',
  path: '/faq',
});

const crumbs = [
  { name: 'Start', path: '/' },
  { name: 'FAQ', path: '/faq' },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(faqItems)} />
      <article className="article">
        <div className="wrap narrow">
          <Breadcrumbs items={crumbs} />
          <header className="article-head">
            <p className="eyebrow">Kurz gefasst</p>
            <h1>Häufige Fragen</h1>
            <p className="lead">
              Die Antworten sind allgemein. Sie ersetzen nicht die Prüfung eines konkreten Vermögens
              durch zugelassene Fachleute.
            </p>
          </header>
          <Disclaimer />
          <div className="faq">
            {faqItems.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>
                  <RichText text={item.answer} />
                </p>
              </details>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
