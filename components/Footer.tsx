import Link from 'next/link';
import { footerNav } from '@/lib/nav';
import { CONTACT_EMAIL } from '@/lib/site';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="footer-name">Ihre Familienstiftung</p>
          <p>
            Allgemeine Informationen für Family Offices, vermögende Familien und Unternehmer.
            Betrieben von PAN21 (Harald Linhart). Anschrift und Register stehen noch aus und sind
            im <Link href="/impressum">Impressum</Link> markiert.
          </p>
        </div>
        <div>
          <p className="footer-label">Seiten</p>
          <ul>
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="footer-label">Kontakt</p>
          <p>
            Formular auf der Seite <Link href="/kontakt">Kontakt</Link>. Nachrichten gehen an{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
          <p>Keine Rechts- und keine Steuerberatung. Keine Zusagen zu Steuern oder Gläubigerschutz.</p>
        </div>
      </div>
      <div className="wrap footer-base">
        <p>© {new Date().getFullYear()} PAN21. Alle Rechte vorbehalten.</p>
      </div>
    </footer>
  );
}
