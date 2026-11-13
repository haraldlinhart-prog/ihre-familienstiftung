import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { clientIp, contactRateLimiter, mailIdentity, parseContactBody, processContact } from '@/lib/contact';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const noStore = { 'Cache-Control': 'no-store' };

function json(body: { ok?: boolean; error?: string }, status = 200) {
  return NextResponse.json(body, { status, headers: noStore });
}

export async function POST(request: Request) {
  const secret = process.env.CONTACT_FORM_SECRET?.trim();
  if (!secret) return json({ error: 'Das Formular ist derzeit nicht verfügbar.' }, 503);

  let raw = '';
  try {
    raw = await request.text();
  } catch {
    return json({ error: 'Die Anfrage konnte nicht gelesen werden.' }, 400);
  }
  if (raw.length > 30_000) return json({ error: 'Die Nachricht ist zu lang.' }, 413);

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return json({ error: 'Die Anfrage konnte nicht gelesen werden.' }, 400);
  }
  const input = parseContactBody(parsed);
  if (!input) return json({ error: 'Die Anfrage konnte nicht gelesen werden.' }, 400);

  const ip = clientIp(
    request.headers.get('x-forwarded-for'),
    request.headers.get('x-real-ip') ?? request.headers.get('x-vercel-forwarded-for'),
  );

  const result = processContact(input, {
    now: Date.now(),
    secret,
    ip,
    allowIp: (value) => contactRateLimiter.allow(value),
    identity: mailIdentity(),
  });

  if (result.type === 'silent') return json({ ok: true });
  if (result.type === 'error') return json({ error: result.error }, result.status);

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return json(
      { error: 'Das Formular ist derzeit nicht eingerichtet. Bitte versuchen Sie es später erneut.' },
      503,
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: result.mail.from,
      to: result.mail.to,
      replyTo: result.mail.replyTo,
      subject: result.mail.subject,
      html: result.mail.html,
      text: result.mail.text,
    });
    if (error) {
      console.error('Resend error', error.name, error.message);
      return json(
        { error: 'Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.' },
        502,
      );
    }
  } catch (error) {
    console.error('Contact route error', error instanceof Error ? error.message : 'unknown');
    return json(
      { error: 'Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.' },
      502,
    );
  }

  return json({ ok: true });
}
