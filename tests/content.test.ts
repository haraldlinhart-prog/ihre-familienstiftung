import assert from 'node:assert/strict';
import test from 'node:test';
import { faqItems, topicPages } from '../lib/content';
import { buildLlmsFullTxt, buildLlmsTxt } from '../lib/llms';

const paths = ['/', '/faq', '/kontakt', '/impressum', '/datenschutz', ...topicPages.map((page) => page.path)];

test('jede Themenseite hat Titel, Beschreibung und Texte', () => {
  const seen = new Set<string>();
  for (const page of topicPages) {
    assert.equal(seen.has(page.path), false);
    seen.add(page.path);
    assert.ok(page.title.length > 8);
    assert.ok(page.description.length > 40);
    assert.ok(page.sections.length >= 2);
    assert.ok(page.sections.every((section) => section.heading.startsWith(section.heading.trim())));
  }
});

test('FAQ ist ausführlich und verspricht keine Steuerfreiheit', () => {
  assert.ok(faqItems.length >= 12);
  const blob = [...topicPages.flatMap((page) => [page.lead, ...page.sections.flatMap((section) => section.paragraphs)]), ...faqItems.map((item) => item.answer)].join('\n');
  assert.equal(/steuerfrei/i.test(blob), false);
  assert.equal(/garantierte[rn]? schutz/i.test(blob), false);
  assert.match(blob, /Steuerhinterziehung/);
});

test('llms.txt nennt die kanonische Domain und die Themenseiten', () => {
  const brief = buildLlmsTxt();
  const full = buildLlmsFullTxt();
  assert.match(brief, /https:\/\/www\.ihre-familienstiftung\.de/);
  for (const path of paths.filter((path) => path !== '/')) {
    assert.match(brief, new RegExp(path.replace('/', '\\/')));
  }
  assert.match(full, /Charging Order/);
  assert.match(full, /Erbersatzsteuer/);
});
