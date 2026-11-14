import Link from 'next/link';
import { primaryNav } from '@/lib/nav';
import SuchmaschinenBlogLink from './SuchmaschinenBlogLink';

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-bar">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            IF
          </span>
          <span>
            <span className="brand-name">Ihre Familienstiftung</span>
            <span className="brand-sub">Ein Informationsangebot von PAN21</span>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Hauptnavigation">
          <ul>
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <Link className="button button-small" href="/kontakt">
            Gespräch anfragen
          </Link>
          {/* suchmaschinen.pro:blog-link */}
          <SuchmaschinenBlogLink />
        </nav>
        <details className="mobile-nav">
          <summary>Menü</summary>
          <nav aria-label="Mobilnavigation">
            <ul>
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/kontakt">Gespräch anfragen</Link>
              </li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
