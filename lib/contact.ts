import { createHmac, timingSafeEqual } from 'node:crypto';
import { CONTACT_TOPICS, type ContactTopic } from './contact-topics';
import { detectSpam, escapeHtml, type SpamReason } from './spam';
import { DEFAULT_CONTACT_FROM, DEFAULT_CONTACT_TO } from './site';

export const MIN_FILL_MS = 3000;
export const MAX_FILL_MS = 4 * 60 * 60 * 1000;
export const RATE_LIMIT_MAX = 3;
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export { CONTACT_TOPICS };
export type { ContactTopic };

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
  topic: string;
  website: string;
  challenge: string;
  consent: boolean;
};

export type OutgoingMail = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
};

export type SilentReason = SpamReason | 'honeypot' | 'too-fast' | 'challenge';

export type ProcessResult =
  | { type: 'send'; mail: OutgoingMail }
  | { type: 'silent'; reason: SilentReason }
  | { type: 'error'; status: number; error: string };

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u;
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PHONE_RE = /^[0-9+\s()/.-]+$/;

export function signChallenge(secret: string, now = Date.now()): string {
  const issued = String(now);
  const sig = createHmac('sha256', secret).update(issued).digest('hex');
  return `${issued}.${sig}`;
}

export function verifyChallenge(
  token: string,
  secret: string,
  now = Date.now(),
): 'ok' | 'too-fast' | 'expired' | 'invalid' {
  if (!secret || !token) return 'invalid';
  const dot = token.indexOf('.');
  if (dot <= 0) return 'invalid';
  const issuedRaw = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^\d+$/.test(issuedRaw) || !/^[a-f0-9]+$/i.test(sig)) return 'invalid';
  const expected = createHmac('sha256', secret).update(issuedRaw).digest('hex');
  const left = Buffer.from(sig, 'utf8');
  const right = Buffer.from(expected, 'utf8');
  if (left.length !== right.length || !timingSafeEqual(left, right)) return 'invalid';
  const issued = Number(issuedRaw);
  if (!Number.isFinite(issued)) return 'invalid';
  if (issued > now + 30_000) return 'invalid';
  const age = now - issued;
  if (age < MIN_FILL_MS) return 'too-fast';
  if (age > MAX_FILL_MS) return 'expired';
  return 'ok';
}

export function createRateLimiter(max = RATE_LIMIT_MAX, windowMs = RATE_LIMIT_WINDOW_MS) {
  const hits = new Map<string, number[]>();
  return {
    allow(ip: string, now = Date.now()) {
      const key = (ip || 'unknown').slice(0, 80);
      const recent = (hits.get(key) ?? []).filter((stamp) => now - stamp < windowMs);
      if (recent.length >= max) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);
      if (hits.size > 5000) {
        hits.clear();
        hits.set(key, recent);
      }
      return true;
    },
  };
}

export const contactRateLimiter = createRateLimiter();

export function clientIp(forwardedFor: string | null, realIp: string | null): string {
  const real = realIp?.split(',')[0]?.trim();
  if (real) return real.slice(0, 80);
  const first = forwardedFor?.split(',')[0]?.trim();
  return (first || 'unknown').slice(0, 80);
}

export function parseContactBody(value: unknown): ContactInput | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  return {
    name: typeof record.name === 'string' ? record.name : '',
    email: typeof record.email === 'string' ? record.email : '',
    phone: typeof record.phone === 'string' ? record.phone : '',
    message: typeof record.message === 'string' ? record.message : '',
    topic: typeof record.topic === 'string' ? record.topic : '',
    website: typeof record.website === 'string' ? record.website : '',
    challenge: typeof record.challenge === 'string' ? record.challenge : '',
    consent: record.consent === true,
  };
}

export function safeTopic(topic: string): ContactTopic | null {
  return (CONTACT_TOPICS as readonly string[]).includes(topic) ? (topic as ContactTopic) : null;
}

export function mailIdentity(env: NodeJS.ProcessEnv = process.env): { from: string; to: string } {
  const from = env.CONTACT_FROM?.trim() || DEFAULT_CONTACT_FROM;
  const to = env.CONTACT_TO?.trim() || DEFAULT_CONTACT_TO;
  return { from, to };
}

function stripHeader(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

export function buildContactMail(
  input: { name: string; email: string; phone: string; message: string; topic: ContactTopic },
  identity: { from: string; to: string },
): OutgoingMail {
  const name = stripHeader(input.name);
  const email = stripHeader(input.email);
  const phone = stripHeader(input.phone);
  const topic = input.topic;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || '—');
  const safeMessage = escapeHtml(input.message).replace(/\r\n|\n|\r/g, '<br>');
  const topicHtml = escapeHtml(topic);
  const subject = `Kontakt ihre-familienstiftung.de – ${topic}`;
  const html = `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;">
  <div style="background:#1e2f28;padding:20px;">
    <p style="color:#f7f3ec;font-size:18px;margin:0;">Ihre Familienstiftung</p>
    <p style="color:rgba(247,243,236,0.8);margin:6px 0 0;font-size:13px;">Neue Kontaktanfrage</p>
  </div>
  <div style="padding:24px;background:#f7f3ec;border:1px solid #e4dccf;">
    <p style="margin:0 0 12px;"><strong>Interesse:</strong> ${topicHtml}</p>
    <p style="margin:0 0 8px;"><strong>Name:</strong> ${safeName}</p>
    <p style="margin:0 0 8px;"><strong>E-Mail:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
    <p style="margin:0 0 8px;"><strong>Telefon:</strong> ${safePhone}</p>
    <hr style="border:none;border-top:1px solid #e4dccf;margin:18px 0;">
    <p style="margin:0 0 8px;"><strong>Nachricht:</strong></p>
    <p style="line-height:1.6;margin:0;">${safeMessage}</p>
  </div>
</div>`;
  const text = [
    `Interesse: ${topic}`,
    `Name: ${name}`,
    `E-Mail: ${email}`,
    `Telefon: ${phone || '—'}`,
    '',
    input.message.replace(/\r\n/g, '\n'),
  ].join('\n');
  return { from: identity.from, to: identity.to, replyTo: email, subject, html, text };
}

function fieldError(input: ContactInput): string | null {
  const name = input.name.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  const message = input.message.trim();
  if (!input.consent) return 'Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.';
  if (name.length < 2 || name.length > 80 || !NAME_RE.test(name)) {
    return 'Bitte geben Sie Ihren Namen an (2 bis 80 Zeichen).';
  }
  if (email.length > 120 || !EMAIL_RE.test(email)) return 'Bitte geben Sie eine gültige E-Mail-Adresse an.';
  if (phone) {
    const digits = phone.replace(/\D/g, '').length;
    if (phone.length > 40 || digits < 5 || !PHONE_RE.test(phone)) {
      return 'Bitte geben Sie eine gültige Telefonnummer an oder lassen Sie das Feld leer.';
    }
  }
  if (!safeTopic(input.topic)) return 'Bitte wählen Sie ein Interesse aus.';
  if (message.length < 20 || message.length > 4000) {
    return 'Bitte beschreiben Sie Ihr Anliegen in 20 bis 4000 Zeichen.';
  }
  return null;
}

export function processContact(
  input: ContactInput,
  ctx: {
    now: number;
    secret: string;
    allowIp: (ip: string) => boolean;
    ip: string;
    identity?: { from: string; to: string };
  },
): ProcessResult {
  const noteSpam = () => {
    ctx.allowIp(ctx.ip);
  };

  if (input.website.trim()) {
    noteSpam();
    return { type: 'silent', reason: 'honeypot' };
  }

  if (!input.challenge.trim()) {
    noteSpam();
    return { type: 'silent', reason: 'challenge' };
  }

  const challenge = verifyChallenge(input.challenge, ctx.secret, ctx.now);
  if (challenge === 'too-fast' || challenge === 'invalid') {
    noteSpam();
    return { type: 'silent', reason: challenge === 'too-fast' ? 'too-fast' : 'challenge' };
  }
  if (challenge === 'expired') {
    return {
      type: 'error',
      status: 400,
      error: 'Das Formular ist abgelaufen. Bitte laden Sie die Seite neu.',
    };
  }

  const spam = detectSpam(input);
  if (spam) {
    noteSpam();
    return { type: 'silent', reason: spam };
  }

  const fields = fieldError(input);
  if (fields) return { type: 'error', status: 400, error: fields };

  if (!ctx.allowIp(ctx.ip)) {
    return {
      type: 'error',
      status: 429,
      error: 'Zu viele Nachrichten. Bitte versuchen Sie es später erneut.',
    };
  }

  const topic = safeTopic(input.topic);
  if (!topic) return { type: 'error', status: 400, error: 'Bitte wählen Sie ein Interesse aus.' };

  return {
    type: 'send',
    mail: buildContactMail(
      {
        name: input.name.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
        message: input.message.trim(),
        topic,
      },
      ctx.identity ?? mailIdentity(),
    ),
  };
}
