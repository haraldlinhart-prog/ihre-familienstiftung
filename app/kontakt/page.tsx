import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ContactForm } from '@/components/ContactForm';
import { Disclaimer } from '@/components/Disclaimer';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Kontakt',
  description:
    'Erstes Gespräch zu Familienstiftung, Lighthouse Trust, Wyoming-LLC oder Family Office anfragen. Das Formular geht an familienstiftung@pan21.com.',
  path: '/kontakt',
});

const crumbs = [
  { name: 'Start', path: '/' },
  { name: 'Kontakt', path: '/kontakt' },
];

export default function KontaktPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <article className="article">
        <div className="wrap narrow">
          <Breadcrumbs items={crumbs} />
          <header className="article-head">
            <p className="eyebrow">PAN21</p>
            <h1>Kontakt</h1>
            <p className="lead">
              Schreiben Sie, welches Ziel Sie prüfen möchten. Die Nachricht geht an {CONTACT_EMAIL}.
              Eine Antwort ist ein Gespräch über den Rahmen, keine Beratung und kein Mandat.
            </p>
          </header>
          <Disclaimer />
          <h2>Was in die erste Nachricht gehört</h2>
          <ul>
            <li>Ihr Name und eine E-Mail-Adresse, unter der Sie erreichbar sind.</li>
            <li>Das Thema: Familienstiftung, Lighthouse Trust, Wyoming-LLC, Family Office oder Sonstiges.</li>
            <li>In wenigen Sätzen, was geordnet werden soll. Ohne Kontonummern, Steuer-IDs und Verträge.</li>
          </ul>
          <ContactForm />
        </div>
      </article>
    </>
  );
}
