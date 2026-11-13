'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { CONTACT_TOPICS } from '@/lib/contact-topics';

type Status = { type: 'idle' | 'ok' | 'error'; text: string };

export function ContactForm() {
  const [challenge, setChallenge] = useState('');
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<Status>({ type: 'idle', text: '' });

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    async function loadChallenge() {
      try {
        const response = await fetch('/api/contact/challenge', {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!response.ok) {
          setStatus({ type: 'error', text: 'Das Formular ist derzeit nicht verfügbar.' });
          return;
        }
        const data = (await response.json()) as { token?: string };
        if (!data.token) {
          setStatus({ type: 'error', text: 'Das Formular ist derzeit nicht verfügbar.' });
          return;
        }
        setChallenge(data.token);
        timer = setTimeout(() => setReady(true), 3000);
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        setStatus({ type: 'error', text: 'Das Formular konnte nicht geladen werden.' });
      }
    }
    void loadChallenge();
    return () => {
      controller.abort();
      if (timer) clearTimeout(timer);
    };
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || pending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setPending(true);
    setStatus({ type: 'idle', text: '' });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone'),
          topic: data.get('topic'),
          message: data.get('message'),
          website: data.get('website'),
          consent: data.get('consent') === 'on',
          challenge,
        }),
      });
      const body = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!response.ok || !body.ok) {
        setStatus({ type: 'error', text: body.error || 'Die Nachricht konnte nicht gesendet werden.' });
        return;
      }
      form.reset();
      setStatus({
        type: 'ok',
        text: 'Danke. Ihre Nachricht wurde übermittelt. Wenn eine Antwort nötig ist, schreiben wir an die angegebene Adresse.',
      });
    } catch {
      setStatus({ type: 'error', text: 'Die Nachricht konnte nicht gesendet werden.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>
        Name
        <input name="name" autoComplete="name" required minLength={2} maxLength={80} />
      </label>
      <label>
        E-Mail
        <input name="email" type="email" autoComplete="email" required maxLength={120} />
      </label>
      <label>
        <span>
          Telefon <span className="optional">optional</span>
        </span>
        <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
      </label>
      <label>
        Interesse
        <select name="topic" defaultValue="Familienstiftung" required>
          {CONTACT_TOPICS.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
      </label>
      <label>
        Nachricht
        <textarea name="message" required minLength={20} maxLength={4000} rows={7} />
      </label>
      <label className="check">
        <input name="consent" type="checkbox" required />
        <span>
          Ich habe die <Link href="/datenschutz">Datenschutzerklärung</Link> gelesen und willige ein,
          dass meine Angaben zur Beantwortung der Anfrage verarbeitet werden. Die Nachricht wird per
          E-Mail über den Dienstleister Resend übermittelt.
        </span>
      </label>
      <div className="hp" aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      {!ready && status.type !== 'error' ? (
        <p className="hint">Einen Moment, das Formular wird vorbereitet.</p>
      ) : null}
      {status.text ? (
        <p className={`form-status ${status.type}`} role="status">
          {status.text}
        </p>
      ) : null}
      <button className="button" type="submit" disabled={!ready || pending}>
        {pending ? 'Wird gesendet …' : 'Nachricht senden'}
      </button>
    </form>
  );
}
