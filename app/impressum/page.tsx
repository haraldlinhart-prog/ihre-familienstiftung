import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Impressum',
  description:
    'Anbieterkennzeichnung für ihre-familienstiftung.de. Die Pflichtangaben von PAN21 werden noch eingetragen.',
  path: '/impressum',
});

const crumbs = [
  { name: 'Start', path: '/' },
  { name: 'Impressum', path: '/impressum' },
];

export default function ImpressumPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <article className="article">
        <div className="wrap narrow">
          <Breadcrumbs items={crumbs} />
          <header className="article-head">
            <p className="eyebrow">Anbieterkennzeichnung</p>
            <h1>Impressum</h1>
            <p className="lead">
              Dieses Informationsangebot wird von PAN21 (Harald Linhart) betrieben. Die gesetzliche
              Anbieterkennzeichnung ist noch nicht vollständig.
            </p>
          </header>
          <div className="todo">
            <p>
              <strong>TODO für Harald Linhart.</strong> Die folgenden Angaben sind bewusst leer. Hier
              keine erfundene Anschrift, keine Telefonnummer und keine Registernummer einsetzen,
              sondern die echten Daten von PAN21.
            </p>
            <ul>
              <li>Vollständiger Name und Rechtsform des Anbieters</li>
              <li>Ladungsfähige Anschrift</li>
              <li>Vertretungsberechtigte Personen</li>
              <li>Telefonnummer</li>
              <li>Registergericht und Registernummer, falls vorhanden</li>
              <li>Umsatzsteuer-Identifikationsnummer, falls vorhanden</li>
              <li>Inhaltlich Verantwortliche nach § 18 Abs. 2 MStV</li>
            </ul>
          </div>
          <h2>Was bereits feststeht</h2>
          <p>
            Anfragen über das Formular dieser Website werden an {CONTACT_EMAIL} gesendet. Das ist die
            Funktionsadresse des Vorhabens, nicht der Ersatz für eine ladungsfähige Anschrift.
          </p>
          <p>
            Die Seiten erklären allgemeine Zusammenhänge zu Familienstiftung, Trust und Wyoming-LLC.
            Sie sind kein Angebot einer konkreten Gesellschaft und keine Beratung.
          </p>
        </div>
      </article>
    </>
  );
}
