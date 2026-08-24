/**
 * Petit helper de traduction « 6 langues » pour les pages autonomes
 * (Giveaway, Collaborations, Roue, Suivi, Aide photo) qui n'utilisent pas le
 * LanguageProvider du configurateur principal.
 *
 * - COUCHE A : la structure (boutons, labels…) est traduite via des maps T6.
 * - COUCHE B : le contenu saisi par l'admin est stocké par langue et résolu
 *   avec repli automatique sur le français (voir resolveByLang).
 */

export type Lang = "fr" | "nl" | "en" | "de" | "es" | "it";
export const L6: Lang[] = ["fr", "nl", "en", "de", "es", "it"];

export type T6 = { fr: string; nl?: string; en?: string; de?: string; es?: string; it?: string };

/** Traduit une map T6 : langue demandée → anglais → français. */
export function t6(m: T6, lang: string): string {
  const l = lang as Lang;
  return m[l] ?? m.en ?? m.fr;
}

/** Libellés drapeaux pour les onglets de langue de l'admin. */
export const LANG_LABELS: Record<Lang, string> = {
  fr: "🇫🇷 FR",
  nl: "🇳🇱 NL",
  en: "🇬🇧 EN",
  de: "🇩🇪 DE",
  es: "🇪🇸 ES",
  it: "🇮🇹 IT",
};

/** Normalise un paramètre en langue supportée (repli fr). */
export function pickLang(param?: string | null): Lang {
  if (param && (L6 as string[]).includes(param)) return param as Lang;
  return "fr";
}

/**
 * COUCHE B — résout une valeur par langue avec repli sur le français.
 * `base` = valeur FR ; `i18n` = { [lang]: valeur }. Vide → repli FR.
 */
export function resolveByLang(base: string, i18n: Record<string, string> | undefined, lang: string): string {
  const v = i18n?.[lang];
  return v && v.trim() ? v : base;
}
