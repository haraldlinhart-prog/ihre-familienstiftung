import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Manrope, Newsreader } from 'next/font/google';
import { CookieBanner } from '@/components/CookieBanner';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { JsonLd } from '@/components/JsonLd';
import { consentBootstrapScript } from '@/lib/consent';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

const display = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const sans = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Familienstiftung, Lighthouse Trust und Wyoming-LLC | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Sachliche Informationen für Family Offices und vermögende Familien: Familienstiftung, Lighthouse Trust und Wyoming-LLC. Keine Steuer- oder Rechtsberatung.',
  applicationName: SITE_NAME,
  authors: [{ name: 'PAN21', url: `${SITE_URL}/impressum` }],
  creator: 'PAN21',
  alternates: { canonical: SITE_URL, languages: { de: SITE_URL } },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  twitter: { card: 'summary' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#1e2f28',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" className={`${display.variable} ${sans.variable}`}>
      <head>
        <script id="ga-consent" dangerouslySetInnerHTML={{ __html: consentBootstrapScript() }} />
      </head>
      <body>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <a className="skip" href="#inhalt">
          Zum Inhalt
        </a>
        <Header />
        <main id="inhalt">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
