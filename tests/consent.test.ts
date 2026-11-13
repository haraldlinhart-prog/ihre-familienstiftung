import assert from 'node:assert/strict';
import test from 'node:test';
import {
  GA_MEASUREMENT_ID,
  consentBootstrapScript,
  consentUpdate,
  gaCookieClearDirectives,
  isGaCookieName,
} from '../lib/consent';

test('Consent Mode startet mit denied für alle vier Speicherarten', () => {
  const script = consentBootstrapScript();
  assert.match(script, /gtag\('consent','default'/);
  for (const key of ['analytics_storage', 'ad_storage', 'ad_user_data', 'ad_personalization'] as const) {
    assert.equal(consentUpdate('denied')[key], 'denied');
    assert.match(script, new RegExp(`"${key}":"denied"`));
  }
  const defaultAt = script.indexOf("gtag('consent','default'");
  const updateAt = script.indexOf("gtag('consent','update'");
  const loadAt = script.indexOf('document.head.appendChild');
  assert.ok(defaultAt >= 0 && updateAt > defaultAt && loadAt > updateAt);
  assert.match(script, new RegExp(GA_MEASUREMENT_ID));
  assert.match(script, /googletagmanager\.com\/gtag\/js/);
});

test('Ablehnen löscht nur _ga-Cookies, auf Host und Domain', () => {
  assert.equal(isGaCookieName('_ga'), true);
  assert.equal(isGaCookieName('_ga_GN3HXD8XL1'), true);
  assert.equal(isGaCookieName('_gid'), false);
  assert.equal(isGaCookieName('session'), false);
  const directives = gaCookieClearDirectives(
    '_ga=1; session=abc; _ga_GN3HXD8XL1=2',
    'www.ihre-familienstiftung.de',
  );
  assert.ok(directives.some((line) => line.startsWith('_ga=; Max-Age=0; path=/;')));
  assert.ok(directives.some((line) => line.includes('domain=.ihre-familienstiftung.de')));
  assert.ok(directives.some((line) => line.startsWith('_ga_GN3HXD8XL1=')));
  assert.equal(directives.some((line) => line.startsWith('session=')), false);
});
