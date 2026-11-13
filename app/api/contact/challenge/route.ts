import { NextResponse } from 'next/server';
import { signChallenge } from '@/lib/contact';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export function GET() {
  const secret = process.env.CONTACT_FORM_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: 'Das Formular ist derzeit nicht verfügbar.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
  return NextResponse.json(
    { token: signChallenge(secret) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
