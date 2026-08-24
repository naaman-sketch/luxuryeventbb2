/**
 * Client Airtable minimal (REST, sans dépendance externe).
 *
 * Toutes les clés/identifiants viennent de variables d'environnement —
 * jamais en dur. Utilisé uniquement côté serveur (routes API).
 *
 * Variables requises :
 *   AIRTABLE_API_KEY          Personal Access Token Airtable
 *   AIRTABLE_BASE_ID          ID de la base (appXXXXXXXX)
 *   AIRTABLE_AFFILIATES_TABLE Nom (ou ID) de la table Affiliés
 *   AIRTABLE_SALES_TABLE      Nom (ou ID) de la table Ventes
 *   AIRTABLE_PAYMENTS_TABLE   Nom (ou ID) de la table Paiements
 *   AIRTABLE_SETTINGS_TABLE   Nom (ou ID) de la table Paramètres
 *   AIRTABLE_WEBHOOKS_TABLE   Nom (ou ID) de la table Webhooks
 */

const API = "https://api.airtable.com/v0";

export interface AirtableRecord<T = Record<string, unknown>> {
  id: string;
  fields: T;
  createdTime?: string;
}

function cfg() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!apiKey || !baseId) {
    throw new Error("Airtable non configuré (AIRTABLE_API_KEY / AIRTABLE_BASE_ID manquants).");
  }
  return { apiKey, baseId };
}

/** Noms de tables (configurables, avec valeurs par défaut). */
export const TABLES = {
  affiliates: () => process.env.AIRTABLE_AFFILIATES_TABLE ?? "Affiliés",
  sales: () => process.env.AIRTABLE_SALES_TABLE ?? "Ventes",
  payments: () => process.env.AIRTABLE_PAYMENTS_TABLE ?? "Paiements",
  settings: () => process.env.AIRTABLE_SETTINGS_TABLE ?? "Paramètres",
  webhooks: () => process.env.AIRTABLE_WEBHOOKS_TABLE ?? "Webhooks",
};

function url(table: string, suffix = "", query?: Record<string, string>) {
  const { baseId } = cfg();
  const u = new URL(`${API}/${baseId}/${encodeURIComponent(table)}${suffix}`);
  if (query) for (const [k, v] of Object.entries(query)) u.searchParams.set(k, v);
  return u.toString();
}

async function request<T>(method: string, fullUrl: string, body?: unknown): Promise<T> {
  const { apiKey } = cfg();
  const res = await fetch(fullUrl, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Airtable ${method} ${res.status} : ${text.slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

/**
 * Liste des enregistrements (avec filtre/formule optionnel).
 * Suit la pagination Airtable (`offset`) : au-delà de 100 enregistrements,
 * toutes les pages sont récupérées (sinon le dashboard serait tronqué).
 */
export async function listRecords<T>(
  table: string,
  opts?: { filterByFormula?: string; maxRecords?: number; sort?: string },
): Promise<AirtableRecord<T>[]> {
  const records: AirtableRecord<T>[] = [];
  let offset: string | undefined;
  do {
    const query: Record<string, string> = {};
    if (opts?.filterByFormula) query.filterByFormula = opts.filterByFormula;
    if (opts?.maxRecords) query.maxRecords = String(opts.maxRecords);
    if (offset) query.offset = offset;
    const data = await request<{ records: AirtableRecord<T>[]; offset?: string }>(
      "GET",
      url(table, "", query),
    );
    records.push(...data.records);
    offset = data.offset;
    if (opts?.maxRecords && records.length >= opts.maxRecords) break;
  } while (offset);
  return records;
}

/** Premier enregistrement correspondant à une formule (ou null). */
export async function findFirst<T>(
  table: string,
  filterByFormula: string,
): Promise<AirtableRecord<T> | null> {
  const records = await listRecords<T>(table, { filterByFormula, maxRecords: 1 });
  return records[0] ?? null;
}

/** Récupère un enregistrement par son id. */
export async function getRecord<T>(table: string, id: string): Promise<AirtableRecord<T>> {
  return request<AirtableRecord<T>>("GET", url(table, `/${id}`));
}

export async function createRecord<T>(table: string, fields: Partial<T>): Promise<AirtableRecord<T>> {
  return request<AirtableRecord<T>>("POST", url(table), { fields, typecast: true });
}

export async function updateRecord<T>(
  table: string,
  id: string,
  fields: Partial<T>,
): Promise<AirtableRecord<T>> {
  return request<AirtableRecord<T>>("PATCH", url(table, `/${id}`), { fields, typecast: true });
}

/**
 * Ajoute une pièce jointe (contenu base64) à un champ Attachment d'un
 * enregistrement, via l'API « content » d'Airtable (jusqu'à 5 Mo/fichier).
 * Le champ doit exister et être de type « Attachment ».
 */
export async function uploadAttachment(
  recordId: string,
  fieldNameOrId: string,
  file: { filename: string; contentType: string; base64: string },
): Promise<void> {
  const { apiKey, baseId } = cfg();
  const res = await fetch(
    `https://content.airtable.com/v0/${baseId}/${recordId}/${encodeURIComponent(fieldNameOrId)}/uploadAttachment`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ contentType: file.contentType, file: file.base64, filename: file.filename }),
    },
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Airtable upload ${res.status} : ${text.slice(0, 200)}`);
  }
}

/** Supprime définitivement un enregistrement. */
export async function deleteRecord(table: string, id: string): Promise<void> {
  await request("DELETE", url(table, `/${id}`));
}

/** Échappe une valeur pour une formule Airtable (chaîne entre guillemets). */
export function escapeFormulaValue(value: string): string {
  return `"${value.replace(/"/g, '\\"')}"`;
}
