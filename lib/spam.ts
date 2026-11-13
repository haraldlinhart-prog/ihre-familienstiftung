/** Known spam senders. Gmail dots and plus-tags are normalized before the lookup. */
export const BLOCKED_EMAILS = new Set<string>([]);

const LEET: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '@': 'a',
  $: 's',
};

/** Unsolicited-ad phrases. Matching is case-insensitive and runs on a deobfuscated copy. */
const SPAM_PATTERNS: RegExp[] = [
  /\bviagra\b/,
  /\bcialis\b/,
  /\blevitra\b/,
  /\bkamagra\b/,
  /\bcasino\b/,
  /\bcasinos\b/,
  /\bonlinecasino\b/,
  /\bonline\s+casino\b/,
  /\bpoker\s+bonus\b/,
  /\bporn\b/,
  /\bporno\b/,
  /\bpornografie\b/,
  /\bxxx\b/,
  /\bonlyfans\b/,
  /\bbacklinks?\b/,
  /\blinkbuilding\b/,
  /\blink\s+building\b/,
  /\bseo\s+services?\b/,
  /\bseoservices?\b/,
  /\bseo\s+dienst/,
  /\bseodienst/,
  /\bguest\s+posts?\b/,
  /\bgastbeitr[aä]ge?\s+kaufen\b/,
  /\bbitcoininvest/,
  /\bbitcoin\s+invest/,
  /\bcryptoinvest/,
  /\bcrypto\s+invest/,
  /\bkryptoinvest/,
  /\bkrypto\s+invest/,
  /\binvest(?:ment|ition|ieren|mentangebot)?\s+in\s+(?:bitcoin|crypto|krypto)/,
  /\bforex\s+(?:signal|robot|invest)/,
  /\bpayday\s+loans?\b/,
  /\binstant\s+loans?\b/,
  /\bcash\s+loans?\b/,
  /\bloan\s+offer\b/,
  /\bprivate\s+lender\b/,
  /\bschnellkredit\b/,
  /\bkredit\s+ohne\s+schufa\b/,
  /\bbinary\s+options?\b/,
  /\bbinaere?\s+optionen\b/,
  /\bbuy\s+followers\b/,
];

const EMAIL_SOURCE = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}';
const URL_SOURCE =
  '\\b(?:(?:https?|hxxps?):\\/\\/|www\\.)[^\\s<>"\']+|\\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+(?:com|net|org|info|biz|ru|cn|xyz|top|online|shop|click|link|io|co|me|us|uk|de|at|ch|eu)\\b';

const VOWELS = 'aeiouyAEIOUYäöüÄÖÜàáâãåèéêëìíîïòóôõùúûýÀÁÂÃÅÈÉÊËÌÍÎÏÒÓÔÕÙÚÛÝ';

export const MAX_MESSAGE_LINKS = 2;

export type SpamReason = 'keyword' | 'links' | 'name-link' | 'gibberish' | 'script' | 'email';

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function looksHuman(text: string): boolean {
  const noSpaces = text.replace(/\s/g, '');
  return !(noSpaces.length > 60 && noSpaces.length === text.length);
}

export function normalizeEmail(email: string): string {
  const value = (email || '').trim().toLowerCase();
  const at = value.indexOf('@');
  if (at === -1) return value;
  let local = value.slice(0, at);
  const domain = value.slice(at + 1);
  local = local.split('+')[0] ?? local;
  const gmail = domain === 'gmail.com' || domain === 'googlemail.com';
  if (gmail) local = local.replace(/\./g, '');
  return `${local}@${gmail ? 'gmail.com' : domain}`;
}

export function isBlockedEmail(email: string): boolean {
  return BLOCKED_EMAILS.has(normalizeEmail(email));
}

function leetToken(token: string): string {
  const hasLetter = /[a-z]/.test(token);
  const hasDigitOrSymbol = /[0-9@$]/.test(token);
  if (!(hasLetter && hasDigitOrSymbol)) {
    return token.replace(/[@$]/g, (ch) => LEET[ch] ?? ch);
  }
  return token.replace(/[013457@$]/g, (ch) => LEET[ch] ?? ch);
}

/** Lowercase, strip accents, decode leet, and join letters that were spaced or dotted out. */
export function deobfuscate(input: string): string {
  const cleaned = input
    .toLowerCase()
    .replace(/[\u200b-\u200d\ufeff]/g, '')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '');
  const raw = cleaned.split(/\s+/).filter(Boolean);
  const words: string[] = [];
  let singles: string[] = [];

  const flush = () => {
    if (singles.length >= 4) words.push(singles.join(''));
    else words.push(...singles);
    singles = [];
  };

  for (const token of raw) {
    const core = token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
    const stripped = core.replace(/[._*\-[\]()]+/g, '');
    const mapped = leetToken(stripped);
    if (!mapped) continue;
    if (mapped.length === 1 && /\p{L}/u.test(mapped)) singles.push(mapped);
    else {
      flush();
      words.push(mapped);
    }
  }
  flush();
  return words.join(' ');
}

export function hasSpamKeyword(text: string): boolean {
  const normalized = deobfuscate(text);
  return SPAM_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function isGibberish(str: string): boolean {
  const trimmed = (str || '').trim();
  if (!trimmed) return false;

  if (
    /^[a-zA-ZäöüÄÖÜß]{10,40}$/.test(trimmed) &&
    /[a-zäöüß]/.test(trimmed) &&
    /[A-ZÄÖÜ]/.test(trimmed)
  ) {
    return true;
  }

  if (/^[a-z0-9]{12,}$/i.test(trimmed) && (trimmed.match(/\d/g)?.length ?? 0) >= 2) {
    return true;
  }

  const words = trimmed.split(/\s+/).filter((word) => word.length >= 6);
  for (const word of words) {
    const letters = word.replace(/[^a-zA-ZäöüÄÖÜßàáâãåèéêëìíîïòóôõùúûýÀÁÂÃÅÈÉÊËÌÍÎÏÒÓÔÕÙÚÛÝ]/g, '');
    if (letters.length < 6) continue;
    let vowels = 0;
    for (const ch of letters) if (VOWELS.includes(ch)) vowels++;
    const vowelRatio = vowels / letters.length;
    let transitions = 0;
    for (let i = 1; i < letters.length; i++) {
      const prevUpper = letters[i - 1] === letters[i - 1].toUpperCase() && letters[i - 1] !== letters[i - 1].toLowerCase();
      const curUpper = letters[i] === letters[i].toUpperCase() && letters[i] !== letters[i].toLowerCase();
      if (prevUpper !== curUpper) transitions++;
    }
    const transitionRatio = transitions / (letters.length - 1);
    const vowelThreshold = letters.length >= 14 ? 0.28 : letters.length >= 11 ? 0.22 : 0.16;
    if (vowelRatio < vowelThreshold && transitionRatio > 0.3) return true;
  }

  if (/\S{61,}/.test(trimmed)) return true;
  return !looksHuman(trimmed);
}

export function isForeignScriptSpam(text: string): boolean {
  const cyrillic = text.match(/[\u0400-\u04FF]/g)?.length ?? 0;
  const cjk = text.match(/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\uac00-\ud7af]/g)?.length ?? 0;
  const latin = text.match(/[A-Za-zÄÖÜäöüß]/g)?.length ?? 0;
  const foreign = cyrillic + cjk;
  const total = foreign + latin;
  if (foreign >= 12 && latin <= 2) return true;
  if (total >= 20 && foreign / total >= 0.45) return true;
  return false;
}

export function countLinks(text: string): number {
  const prepared = text
    .replace(/[\u200b-\u200d\ufeff]/g, '')
    .replace(/hxxps?/gi, 'http')
    .replace(/\[\.\]|\(\.\)|\{dot\}/gi, '.')
    .replace(new RegExp(EMAIL_SOURCE, 'gi'), ' ');
  return prepared.match(new RegExp(URL_SOURCE, 'gi'))?.length ?? 0;
}

export function detectSpam(input: {
  name: string;
  email: string;
  message: string;
  phone?: string;
}): SpamReason | null {
  if (isBlockedEmail(input.email)) return 'email';
  if (countLinks(input.name) > 0) return 'name-link';
  if (countLinks(input.message) > MAX_MESSAGE_LINKS) return 'links';
  const combined = `${input.name}\n${input.email}\n${input.phone ?? ''}\n${input.message}`;
  if (hasSpamKeyword(combined)) return 'keyword';
  if (isForeignScriptSpam(combined)) return 'script';
  if (isGibberish(input.name) || isGibberish(input.message)) return 'gibberish';
  return null;
}
