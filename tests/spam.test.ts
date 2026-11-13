import assert from 'node:assert/strict';
import test from 'node:test';
import { countLinks, detectSpam, hasSpamKeyword } from '../lib/spam';

const clean = {
  name: 'Anna Berger',
  email: 'anna.berger@example.com',
  phone: '+49 30 123456',
  message:
    'Wir prüfen für unsere Familie, ob eine Familienstiftung oder ein Trust mit Wyoming-LLC zu unserer Nachfolge passt. Bitte um ein erstes Gespräch.',
};

test('lässt eine normale deutsche Anfrage durch', () => {
  assert.equal(detectSpam(clean), null);
});

test('erkennt Casino-, SEO- und Krypto-Investment-Spam auch verschleiert', () => {
  assert.equal(hasSpamKeyword('Beste online c a s i n o Angebote'), true);
  assert.equal(hasSpamKeyword('Wir bieten SEO Dienst leistungen an'), true);
  assert.equal(hasSpamKeyword('Investition in Bitc0in sofort'), true);
  assert.equal(
    detectSpam({ ...clean, message: 'Kaufen Sie Backlinks für Ihre Seite und werden Sie sichtbar im Netz heute.' }),
    'keyword',
  );
});

test('blockiert mehr als zwei Links, einen einzelnen Link nicht', () => {
  assert.equal(countLinks('Siehe https://example.com und www.example.org sowie stiftung.de bitte.'), 3);
  assert.equal(
    detectSpam({
      ...clean,
      message: 'Bitte sehen Sie https://example.com, https://example.org und stiftung.de zur Einordnung an.',
    }),
    'links',
  );
  assert.equal(
    detectSpam({
      ...clean,
      message: 'Unsere Familie steht hinter https://example.com und wir möchten den Rahmen verstehen lernen.',
    }),
    null,
  );
});

test('blockiert einen Link im Namen', () => {
  assert.equal(detectSpam({ ...clean, name: 'Anna example.com' }), 'name-link');
});
