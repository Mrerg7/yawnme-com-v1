export const SITE_URL = 'https://yawnme.com';
export const SITE_NAME = 'yawnme';
export const SITE_DOMAIN = 'yawnme.com';

/** Canonical URL for a pathname (trailing slash, apex HTTPS). */
export function getCanonicalUrl(pathname: string): string {
  let path = pathname || '/';
  if (path.endsWith('/index.html')) {
    path = path.slice(0, -'index.html'.length) || '/';
  }
  if (path !== '/' && !path.endsWith('/')) {
    path = `${path}/`;
  }
  return new URL(path, SITE_URL).href;
}

export const ACQUISITION_EMAIL = 'sales@desertrich.com';

/** Cloudflare Images CDN — hero / OG */
export const HERO_IMAGE_URL =
  'https://imagedelivery.net/-sPAUAWeA405NiWJ0SNIQA/f6b4de14-6d41-4287-846d-a8578030f700/public';

/** Cloudflare Images CDN — secondary visual */
export const SECONDARY_IMAGE_URL =
  'https://imagedelivery.net/-sPAUAWeA405NiWJ0SNIQA/1a01b8cd-a59a-42f2-43ae-1e09bfb1c600/public';

export const DISCLAIMER =
  'This website is for demonstration and informational purposes only. It does not constitute an offer of services, a commitment to deploy, or a guarantee of outcomes. All statistics, projections, and references to specific technologies are based on publicly available information as of the date shown and are subject to change.';

export function acquisitionMailto(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  params.set(
    'subject',
    subject ?? `Domain acquisition inquiry: ${SITE_DOMAIN}`,
  );
  if (body) params.set('body', body);
  return `mailto:${ACQUISITION_EMAIL}?${params.toString()}`;
}
