import assert from 'node:assert/strict';
import test from 'node:test';
import { mailIdentity, processContact, signChallenge } from '../lib/contact';

const secret = 'test-secret-bitte-nicht-produktiv';
const now = 1_700_000_000_000;

function input(overrides: Record<string, unknown> = {}) {
  return {
    name: 'Anna Berger',
    email: 'anna.berger@example.com',
    phone: '',
    topic: 'Lighthouse Trust',
    message: 'Wir möchten verstehen, wie ein Trust und eine Wyoming-LLC unsere Nachfolge abbilden könnten.',
    website: '',
    challenge: signChallenge(secret, now - 10_000),
    consent: true,
    ...overrides,
  };
}

function run(overrides: Record<string, unknown> = {}, at = now) {
  return processContact(input(overrides), {
    now: at,
    secret,
    ip: '203.0.113.10',
    allowIp: () => true,
    identity: { from: 'Ihre Familienstiftung <kontakt@pan21.com>', to: 'familienstiftung@pan21.com' },
  });
}

test('Honeypot liefert stillen Erfolg', () => {
  const result = run({ website: 'https://spam.example' });
  assert.equal(result.type, 'silent');
  if (result.type === 'silent') assert.equal(result.reason, 'honeypot');
});

test('zu schnelles Absenden liefert stillen Erfolg', () => {
  const result = run({ challenge: signChallenge(secret, now - 500) });
  assert.equal(result.type, 'silent');
  if (result.type === 'silent') assert.equal(result.reason, 'too-fast');
});

test('Spam-Stichwort liefert stillen Erfolg und keine Mail', () => {
  const result = run({
    message: 'Tolles online casino und SEO Dienst für Ihre neue Seite mit vielen Backlinks sofort.',
  });
  assert.equal(result.type, 'silent');
});

test('gültige Anfrage baut eine Mail mit Reply-To der absendenden Person', () => {
  const result = run();
  assert.equal(result.type, 'send');
  if (result.type !== 'send') return;
  assert.equal(result.mail.replyTo, 'anna.berger@example.com');
  assert.equal(result.mail.to, 'familienstiftung@pan21.com');
  assert.match(result.mail.subject, /Lighthouse Trust/);
  assert.match(result.mail.text, /Telefon: —/);
});

test('abgelaufenes Formular bleibt ein echter Fehler', () => {
  const result = run({ challenge: signChallenge(secret, now - 5 * 60 * 60 * 1000) });
  assert.equal(result.type, 'error');
  if (result.type === 'error') assert.equal(result.status, 400);
});

test('fehlende Einwilligung bleibt ein echter Fehler', () => {
  const result = run({ consent: false });
  assert.equal(result.type, 'error');
});

test('Rate-Limit antwortet mit 429', () => {
  const result = processContact(input(), {
    now,
    secret,
    ip: '203.0.113.11',
    allowIp: () => false,
    identity: { from: 'Absender <kontakt@pan21.com>', to: 'familienstiftung@pan21.com' },
  });
  assert.equal(result.type, 'error');
  if (result.type === 'error') assert.equal(result.status, 429);
});

test('Defaults für Absender und Empfänger', () => {
  const identity = mailIdentity({} as NodeJS.ProcessEnv);
  assert.equal(identity.from, 'Ihre Familienstiftung <kontakt@pan21.com>');
  assert.equal(identity.to, 'familienstiftung@pan21.com');
});
