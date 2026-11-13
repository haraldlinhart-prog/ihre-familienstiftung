declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-GN3HXD8XL1';
export const CONSENT_STORAGE_KEY = 'ifs-consent';
export const OPEN_CONSENT_EVENT = 'ifs-open-consent';

export type ConsentChoice = 'granted' | 'denied';

const CONSENT_FIELDS = ['analytics_storage', 'ad_storage', 'ad_user_data', 'ad_personalization'] as const;

export function consentUpdate(choice: ConsentChoice): Record<(typeof CONSENT_FIELDS)[number], ConsentChoice> {
  return {
    analytics_storage: choice,
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
  };
}

export function isGaCookieName(name: string): boolean {
  return name === '_ga' || name.startsWith('_ga_');
}

/** Set-Cookie strings that expire every _ga cookie on the host and its registrable domain. */
export function gaCookieClearDirectives(cookieHeader: string, hostname: string): string[] {
  const names = cookieHeader
    .split(';')
    .map((part) => part.split('=')[0]?.trim() ?? '')
    .filter(isGaCookieName);
  const domains = new Set<string>(['']);
  const labels = hostname.split('.').filter(Boolean);
  if (hostname) domains.add(hostname);
  if (labels.length >= 2) {
    const registrable = labels.slice(-2).join('.');
    domains.add(registrable);
    domains.add(`.${registrable}`);
  }
  const directives: string[] = [];
  for (const name of names) {
    for (const domain of domains) {
      const domainAttr = domain ? `; domain=${domain}` : '';
      directives.push(`${name}=; Max-Age=0; path=/${domainAttr}`);
    }
  }
  return directives;
}

export function clearGaCookies(): void {
  if (typeof document === 'undefined') return;
  const hostname = typeof location === 'undefined' ? '' : location.hostname;
  for (const directive of gaCookieClearDirectives(document.cookie, hostname)) {
    document.cookie = directive;
  }
}

export function consentBootstrapScript(): string {
  const denied = JSON.stringify({ ...consentUpdate('denied'), wait_for_update: 500 });
  const granted = JSON.stringify(consentUpdate('granted'));
  const src = JSON.stringify(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',${denied});gtag('set','ads_data_redaction',true);try{if(localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)})==='granted'){gtag('consent','update',${granted});}}catch(e){}gtag('js',new Date());gtag('config',${JSON.stringify(GA_MEASUREMENT_ID)});var s=document.createElement('script');s.async=true;s.src=${src};document.head.appendChild(s);`;
}
