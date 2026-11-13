'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  CONSENT_STORAGE_KEY,
  OPEN_CONSENT_EVENT,
  clearGaCookies,
  consentUpdate,
  type ConsentChoice,
} from '@/lib/consent';

function applyChoice(choice: ConsentChoice) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    /* Private mode can block storage. The consent signal is still updated. */
  }
  const payload = consentUpdate(choice);
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', payload);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(['consent', 'update', payload]);
  }
  if (choice === 'denied') clearGaCookies();
}

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let stored = '';
    try {
      stored = localStorage.getItem(CONSENT_STORAGE_KEY) ?? '';
    } catch {
      stored = '';
    }
    setOpen(stored !== 'granted' && stored !== 'denied');
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
  }, []);

  if (!open) return null;

  return (
    <div className="cookie-banner" role="region" aria-label="Cookie-Einstellungen">
      <div className="wrap cookie-bar">
        <p>
          Google Analytics bleibt ohne Einwilligung ohne Analyse-Cookies. Die Entscheidung liegt in
          diesem Browser und lässt sich später ändern.{' '}
          <Link href="/datenschutz">Datenschutz</Link>
        </p>
        <div className="cookie-actions">
          <button type="button" className="button button-ghost" onClick={() => { applyChoice('denied'); setOpen(false); }}>
            Ablehnen
          </button>
          <button type="button" className="button" onClick={() => { applyChoice('granted'); setOpen(false); }}>
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
