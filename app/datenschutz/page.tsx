import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { GA_MEASUREMENT_ID } from '@/lib/consent';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Datenschutz',
  description:
    'Hinweise zum Kontaktformular und zu Google Analytics 4. Verantwortlicher, Fristen und Rechtsgrundlagen werden noch ergänzt.',
  path: '/datenschutz',
});

const crumbs = [
  { name: 'Start', path: '/' },
  { name: 'Datenschutz', path: '/datenschutz' },
];

export default function DatenschutzPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <article className="article">
        <div className="wrap narrow">
          <Breadcrumbs items={crumbs} />
          <header className="article-head">
            <p className="eyebrow">Datenschutz</p>
            <h1>Datenschutzerklärung</h1>
            <p className="lead">
              Diese Erklärung beschreibt, was die Website heute technisch tut. Sie ist noch keine
              vollständige Datenschutzerklärung, weil die Angaben des Verantwortlichen fehlen.
            </p>
          </header>
          <div className="todo">
            <p>
              <strong>TODO für Harald Linhart.</strong> Vor dem öffentlichen Betrieb eintragen, ohne
              erfundene Adressen oder erfundene Fristen:
            </p>
            <ul>
              <li>Name und Anschrift des Verantwortlichen</li>
              <li>Kontaktdaten und, falls benannt, die oder der Datenschutzbeauftragte</li>
              <li>Rechtsgrundlage der Verarbeitung je Zweck</li>
              <li>Speicherdauer der E-Mails und der Postfach-Protokolle</li>
              <li>Empfänger und Auftragsverarbeiter, einschließlich Resend, Vercel und Google Analytics 4</li>
              <li>Speicherdauer der Analysedaten und Hinweis auf einen Drittlandtransfer, samt Garantien</li>
              <li>Rechte der betroffenen Personen und das Beschwerderecht bei einer Aufsichtsbehörde</li>
            </ul>
          </div>
          <h2>Welche Seiten welche Daten sehen</h2>
          <p>
            Beim Aufruf verarbeitet der Hoster die üblichen Verbindungsdaten, die ein Webserver
            braucht, um die Seite auszuliefern. Ein Analysewerkzeug läuft zusätzlich, wie der
            folgende Abschnitt beschreibt. Analyse-Cookies setzt es erst nach Einwilligung.
          </p>
          <h2>Google Analytics 4</h2>
          <p>
            Auf allen Seiten ist Google Analytics 4 eingebunden, Mess-ID {GA_MEASUREMENT_ID}. Das
            Tag von Google, gtag.js, steht im Kopf jeder Seite. Bevor Sie wählen, und solange Sie
            ablehnen, gilt Google Consent Mode in der Version 2. Dabei stehen analytics_storage,
            ad_storage, ad_user_data und ad_personalization auf denied.
          </p>
          <p>
            Am unteren Rand können Sie „Ablehnen“ oder „Akzeptieren“ wählen. Die Entscheidung wird
            in diesem Browser im localStorage gespeichert, nicht in einem eigenen Cookie. Über den
            Link „Cookie-Einstellungen“ im Fuß der Seite können Sie sie später ändern.
          </p>
          <p>
            Akzeptieren setzt die vier Speicherarten auf granted. Ablehnen setzt sie auf denied und
            löscht vorhandene Cookies, deren Name _ga ist oder mit _ga_ beginnt.
          </p>
          <p>
            Consent Mode kann auch ohne Cookies eingeschränkte Nutzungsdaten an Google übermitteln.
            Dass das Tag geladen wird, ist deshalb keine Zusage, dass vor der Einwilligung keine
            Verbindung zu Google entsteht. Rechtsgrundlage, Speicherdauer, der Vertrag zur
            Auftragsverarbeitung und ein etwaiger Transfer in Drittländer sind noch einzutragen.
          </p>
          <p>
            Google beschreibt den Dienst in der{' '}
            <a href="https://policies.google.com/privacy?hl=de" rel="noopener noreferrer">
              Datenschutzerklärung von Google
              <span className="external"> (extern)</span>
            </a>{' '}
            und Consent Mode in der{' '}
            <a
              href="https://developers.google.com/tag-platform/security/guides/consent?hl=de"
              rel="noopener noreferrer"
            >
              Entwicklerdokumentation
              <span className="external"> (extern)</span>
            </a>
            .
          </p>
          <h2>Kontaktformular</h2>
          <p>
            Wenn Sie das <Link href="/kontakt">Formular</Link> senden, werden Name, E-Mail-Adresse,
            eine optionale Telefonnummer, das gewählte Interesse und der Nachrichtentext serverseitig
            geprüft. Bei einer echten Anfrage geht eine E-Mail über den Dienst Resend an{' '}
            {CONTACT_EMAIL}. Die Antwortadresse ist die von Ihnen angegebene E-Mail-Adresse.
          </p>
          <p>
            Zur Abwehr von Missbrauch speichert die laufende Serverinstanz für begrenzte Zeit die
            Zahl der Anfragen einer IP-Adresse im Arbeitsspeicher. Das ist kein dauerhaftes
            Verzeichnis und keine Datenbank. Erkannter Spam wird nicht zugestellt. Das Formular
            antwortet darauf dennoch neutral, damit Absender die Prüfung nicht auslesen können.
          </p>
          <p>
            Die Einwilligung im Formular bezieht sich auf diese Übermittlung zur Beantwortung der
            Anfrage. Ohne die Angaben kann die Nachricht nicht zugeordnet werden. Eine weitergehende
            Verwendung ist hier nicht beschrieben und findet nach dem aktuellen Stand des Programms
            nicht statt.
          </p>
          <h2>Pflicht zur Ergänzung</h2>
          <p>
            Solange Verantwortlicher, Fristen und Garantien fehlen, ist dieser Text ein Platzhalter
            für die technische Wahrheit der Website, nicht das fertige Dokument für den
            Produktivbetrieb.
          </p>
        </div>
      </article>
    </>
  );
}
