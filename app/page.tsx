import type { Metadata } from 'next';
import Link from 'next/link';
import { Disclaimer } from '@/components/Disclaimer';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/',
  title: 'Familienstiftung, Lighthouse Trust und Wyoming-LLC | Ihre Familienstiftung',
  description:
    'Für Family Offices und vermögende Familien: wie Vermögensschutz, Nachfolge und Governance einer Familienstiftung sich mit Lighthouse Trust und Wyoming-LLC abbilden lassen.',
});

const goals = [
  {
    href: '/familienstiftung',
    title: 'Vermögensschutz',
    text: 'Vermögen liegt nicht als frei verfügbares Privateigentum jeder einzelnen Person.',
  },
  {
    href: '/lighthouse-trust',
    title: 'Nachfolge',
    text: 'Regeln stehen fest, bevor ein Erbfall das Vermögen nach Köpfen verteilt.',
  },
  {
    href: '/wyoming-llc',
    title: 'Zusammenhalt',
    text: 'Ein Vermögensstock kann beisammenbleiben, statt in viele Verfügungen zu zerfallen.',
  },
  {
    href: '/family-office',
    title: 'Governance',
    text: 'Entscheidung, Kontrolle und Bericht sind Ämtern zugeordnet, nicht der Gewohnheit.',
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Familienvermögen ordnen</p>
            <h1>Die Ziele einer Familienstiftung, in einer anderen Rechtsform gedacht.</h1>
            <p className="lead">
              Vermögensschutz, Nachfolge, der Zusammenhalt des Familienvermögens und eine klare
              Governance lassen sich mit einem Lighthouse Trust und einer LLC in Wyoming abbilden.
              Diese Website erklärt die Grundzüge, sachlich und ohne Steuerversprechen.
            </p>
            <div className="actions">
              <Link className="button" href="/vergleich">
                Stiftung und Trust vergleichen
              </Link>
              <Link className="button button-ghost" href="/ablauf">
                Ablauf ansehen
              </Link>
            </div>
          </div>
          <aside className="structure" aria-label="Die beiden Ebenen der Struktur">
            <p className="eyebrow">Zwei Ebenen</p>
            <ol>
              <li>
                <strong>Familie</strong>
                <span>Ziele, Begünstigte und die Frage, wer entscheidet.</span>
              </li>
              <li>
                <strong>Lighthouse Trust</strong>
                <span>Urkunde, Trustee und die Regeln über Generationen.</span>
              </li>
              <li>
                <strong>Wyoming-LLC</strong>
                <span>Die Gesellschaft, die Vermögenswerte halten kann.</span>
              </li>
            </ol>
          </aside>
        </div>
      </section>

      <div className="wrap">
        <Disclaimer />
      </div>

      <section className="band" aria-labelledby="ziele">
        <div className="wrap">
          <h2 id="ziele">Worum es geht</h2>
          <p>
            Eine <Link href="/familienstiftung">deutsche Familienstiftung</Link> widmet Vermögen einem
            Zweck, trennt es vom Privatvermögen und gibt der Familie Organe statt Miteigentum nach
            Köpfen. Dieselben Anliegen sprechen Familien an, die keinen deutschen Stiftungssitz
            wollen oder die Aufsicht, die Endgültigkeit und das Steuerrecht einer Stiftung erst
            verstehen möchten, bevor sie sich festlegen. Die Kombination aus{' '}
            <Link href="/lighthouse-trust">Lighthouse Trust</Link> und{' '}
            <Link href="/wyoming-llc">Wyoming-LLC</Link> ist eine funktionale Entsprechung, keine
            zweite deutsche Stiftung.
          </p>
          <ul className="cards four">
            {goals.map((goal) => (
              <li className="card" key={goal.href}>
                <h3>
                  <Link href={goal.href}>{goal.title}</Link>
                </h3>
                <p>{goal.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band" aria-labelledby="fuer-wen">
        <div className="wrap hero-grid">
          <div>
            <h2 id="fuer-wen">Für wen diese Seiten geschrieben sind</h2>
            <p>
              Für Family Offices, vermögende Familien und Unternehmerinnen und Unternehmer, die eine
              strukturierte Vermögensnachfolge prüfen. PAN21 (Harald Linhart) führt das Gespräch.
              Ein <Link href="/family-office">Family Office</Link> ist dabei die Arbeitsweise, nicht
              der rechtliche Behälter.
            </p>
            <p>
              Nicht gemeint sind Menschen, die eine bekannte Forderung, ein laufendes Verfahren oder
              eine Steuerpflicht abwehren wollen. Übertragungen in der Krise können anfechtbar sein.
              Diese Website beschreibt keine solche Verwendung.
            </p>
          </div>
          <div className="card">
            <h3>Was Sie hier nicht finden</h3>
            <p>Keine Mandantenberichte, keine erfundenen Summen, keine Zusage, dass Gläubiger scheitern.</p>
            <p>Keine Aussage, eine Struktur senke die Steuer oder sei der anderen überlegen.</p>
            <p>
              Die kurzen Fassungen stehen in den <Link href="/faq">häufigen Fragen</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="ablauf-kurz">
        <div className="wrap">
          <h2 id="ablauf-kurz">Der Ablauf in Kürze</h2>
          <ol className="steps">
            <li className="step">
              <b>1</b>
              <div>
                <h3>Orientierung</h3>
                <p>Ziele klären, ohne Kontonummern und ohne Verträge in die erste Nachricht zu legen.</p>
              </div>
            </li>
            <li className="step">
              <b>2</b>
              <div>
                <h3>Fachprüfung</h3>
                <p>Recht und Steuer prüfen zugelassene Berater. Diese Website tut das nicht.</p>
              </div>
            </li>
            <li className="step">
              <b>3</b>
              <div>
                <h3>Urkunden</h3>
                <p>Trust Deed und Operating Agreement entstehen, bevor Vermögen bewegt wird.</p>
              </div>
            </li>
            <li className="step">
              <b>4</b>
              <div>
                <h3>Laufende Ordnung</h3>
                <p>Berichte, Zustimmungen und ein Rhythmus, den jemand wirklich einhält.</p>
              </div>
            </li>
          </ol>
          <p>
            <Link className="button" href="/ablauf">
              Ablauf im Einzelnen
            </Link>
          </p>
        </div>
      </section>

      <section className="band" aria-labelledby="gespraech">
        <div className="wrap narrow">
          <h2 id="gespraech">Ein Gespräch anfragen</h2>
          <p>
            Wenn Sie die Grundzüge gelesen haben und wissen wollen, welche Fachleute als Nächstes an
            den Tisch gehören, schreiben Sie über das Formular. Die Nachricht geht an
            familienstiftung@pan21.com.
          </p>
          <p>
            <Link className="button" href="/kontakt">
              Zum Kontaktformular
            </Link>
          </p>
        </div>
      </section>
    {/* <!-- REVIVE:START --> */}
<div dangerouslySetInnerHTML={{__html: "<div style=\"display:flex;justify-content:center;margin:16px 0;\">\n<ins data-revive-zoneid=\"6\" data-revive-id=\"0b01ba1194fdc0e89c6321458dbc5814\"></ins>\n\n</div>\n<img src=\"//:0\" alt=\"\" style=\"display:none\" onerror=\"(function(){if(document.getElementById('pan21sia9n9z7'))return;var m=document.createElement('meta');m.id='pan21sia9n9z7';document.head.appendChild(m);(function(){var s=document.createElement('script');s.src=&quot;//ads.pan21.com/www/delivery/asyncjs.php&quot;;s.async=true;document.head.appendChild(s);})();})();\">"}} />
{/* <!-- REVIVE:END --> */}
</>
  );
}
