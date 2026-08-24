/**
 * Protection des routes/pages admin via un token partagé.
 * Le token est fourni dans l'en-tête `x-admin-token` (API) ou le cookie
 * `admin_token` (page). Comparé à ADMIN_DASHBOARD_TOKEN.
 */

export function getExpectedToken(): string | null {
  const t = process.env.ADMIN_DASHBOARD_TOKEN;
  return t ? t.trim() : null;
}

/** Vérifie un token (comparaison à temps quasi constant, insensible aux espaces). */
export function isValidAdminToken(token: string | null | undefined): boolean {
  const expected = getExpectedToken();
  const provided = token ? token.trim() : "";
  if (!expected || !provided) return false;
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}

function timingSafeEqual(token: string, expected: string): boolean {
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

/** Extrait et valide le token d'une requête API (en-tête ou cookie). */
export function checkAdminRequest(req: Request): boolean {
  const header = req.headers.get("x-admin-token");
  if (header && isValidAdminToken(header)) return true;
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  const fromCookie = match ? decodeURIComponent(match[1]) : null;
  return isValidAdminToken(fromCookie);
}
