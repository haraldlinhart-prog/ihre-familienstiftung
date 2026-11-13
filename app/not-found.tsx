import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Seite nicht gefunden',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="wrap narrow page-block">
      <p className="eyebrow">404</p>
      <h1>Diese Seite gibt es nicht</h1>
      <p className="lead">Der Inhalt ist unter einem anderen Pfad erreichbar oder der Link ist veraltet.</p>
      <p>
        <Link className="button" href="/">
          Zur Startseite
        </Link>
      </p>
    </div>
  );
}
