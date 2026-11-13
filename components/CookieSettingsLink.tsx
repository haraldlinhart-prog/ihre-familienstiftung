'use client';

import { OPEN_CONSENT_EVENT } from '@/lib/consent';

export function CookieSettingsLink() {
  return (
    <button
      type="button"
      className="footer-cookie"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
    >
      Cookie-Einstellungen
    </button>
  );
}
