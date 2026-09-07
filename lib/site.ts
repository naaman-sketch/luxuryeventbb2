/**
 * URL publique du site, robuste : ajoute https:// si absent, retire le slash
 * final, et retombe sur une valeur valide si NEXT_PUBLIC_SITE_URL est vide ou
 * mal formée (sinon `new URL()` planterait le build sur Vercel).
 */
const FALLBACK = "https://luxuryevent.example";

export function normalizeSiteUrl(raw: string | undefined | null): string {
  let s = (raw ?? "").trim();
  if (!s) return FALLBACK;
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
  s = s.replace(/\/+$/, "");
  try {
    // Valide l'URL ; en cas d'échec, on retombe sur le fallback.
    new URL(s);
    return s;
  } catch {
    return FALLBACK;
  }
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
