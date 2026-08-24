/**
 * Réglages (table Airtable « Paramètres », colonnes Key/Value) avec cache
 * mémoire pour économiser les appels API. Sert au contenu éditable + webhook.
 * Serveur uniquement. Sans Airtable configuré, tout retombe proprement sur
 * les valeurs par défaut (le site fonctionne quand même).
 */

import { TABLES, findFirst, listRecords, createRecord, updateRecord, escapeFormulaValue } from "./airtable";

interface SettingFields {
  Key?: string;
  Value?: string;
}

/** Clé du JSON de contenu éditable (textes, images, vidéos des animations). */
export const CONTENT_KEY = "content";
/** Webhook déclenché à chaque intérêt B2B. */
export const INTEREST_WEBHOOK_KEY = "interest_webhook";

const TTL = 45_000;
let cache: { at: number; map: Record<string, string> } | null = null;

export function invalidateSettingsCache(): void {
  cache = null;
}

export async function getAllSettings(opts?: { force?: boolean }): Promise<Record<string, string>> {
  if (!opts?.force && cache && Date.now() - cache.at < TTL) return cache.map;
  try {
    const recs = await listRecords<SettingFields>(TABLES.settings());
    const out: Record<string, string> = {};
    for (const r of recs) if (r.fields.Key) out[r.fields.Key] = r.fields.Value ?? "";
    cache = { at: Date.now(), map: out };
    return out;
  } catch {
    if (cache) return cache.map; // Airtable KO : on ressert le dernier cache
    return {};
  }
}

export async function getSetting(key: string): Promise<string | null> {
  const map = await getAllSettings();
  const v = map[key];
  return v === undefined ? null : v;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const existing = await findFirst<SettingFields>(TABLES.settings(), `{Key} = ${escapeFormulaValue(key)}`);
  if (existing) await updateRecord<SettingFields>(TABLES.settings(), existing.id, { Value: value });
  else await createRecord<SettingFields>(TABLES.settings(), { Key: key, Value: value });
  if (cache) cache.map[key] = value;
}
