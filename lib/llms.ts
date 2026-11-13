import { comparisonRows, faqItems, topicPages } from './content';
import { plainText } from './seo';
import { CONTENT_UPDATED, SITE_URL, formatGermanDate } from './site';

function linkLine(label: string, path: string, description: string): string {
  return `- [${label}](${SITE_URL}${path}): ${description}`;
}

export function buildLlmsTxt(): string {
  const lines = [
    '# Ihre Familienstiftung',
    '',
    '> Sachliche Informationen von PAN21 (Harald Linhart) für Family Offices, vermögende Familien und Unternehmer. Die Ziele einer Familienstiftung, nämlich Vermögensschutz, Nachfolge, Zusammenhalt des Familienvermögens und Governance, lassen sich mit einem Lighthouse Trust und einer Wyoming-LLC abbilden. Keine Rechts- oder Steuerberatung, kein Angebot zur Steuervermeidung oder Steuerhinterziehung.',
    '',
    `Kanonische Adresse: ${SITE_URL}`,
    'Sprache: Deutsch',
    `Stand: ${formatGermanDate(CONTENT_UPDATED)}`,
    '',
    '## Seiten',
    ...topicPages.map((page) => linkLine(page.label, page.path, page.description)),
    linkLine('Häufige Fragen', '/faq', 'Ausführliche Antworten zu Stiftung, Trust, Wyoming-LLC, Kosten, Schutz und Beratung.'),
    linkLine('Kontakt', '/kontakt', 'Formular an familienstiftung@pan21.com. Keine Unterlagen in der ersten Nachricht.'),
    linkLine('Impressum', '/impressum', 'Platzhalter. Pflichtangaben von PAN21 sind noch einzutragen.'),
    linkLine(
      'Datenschutz',
      '/datenschutz',
      'Platzhalter zum Kontaktformular und zu Google Analytics 4 mit Consent Mode. Verantwortlicher und Fristen sind noch einzutragen.',
    ),
    '',
    'Ausführliche Fassung: /llms-full.txt',
    '',
  ];
  return lines.join('\n');
}

export function buildLlmsFullTxt(): string {
  const lines = [
    '# Ihre Familienstiftung, ausführliche Fassung',
    '',
    'Allgemeine Information, Stand siehe jeweils die Seite. Sie ersetzt keine Beratung durch zugelassene Fachleute. Es werden keine Steuervorteile versprochen.',
    '',
    ...topicPages.flatMap((page) => [
      `# ${page.title}`,
      '',
      `URL: ${SITE_URL}${page.path}`,
      '',
      plainText(page.lead),
      '',
      ...page.sections.flatMap((section) => [
        `## ${section.heading}`,
        '',
        ...section.paragraphs.map((paragraph) => plainText(paragraph)),
        '',
        ...(section.bullets ? [...section.bullets.map((bullet) => `- ${plainText(bullet)}`), ''] : []),
      ]),
      ...(page.showComparison
        ? [
            '## Tabelle',
            '',
            ...comparisonRows.map(
              (row) => `- ${row.criterion}. Familienstiftung: ${row.foundation} Trust und Wyoming-LLC: ${row.structure}`,
            ),
            '',
          ]
        : []),
    ]),
    '# Häufige Fragen',
    '',
    ...faqItems.flatMap((item) => [`## ${item.question}`, '', plainText(item.answer), '']),
  ];
  return `${lines.join('\n').trim()}\n`;
}
