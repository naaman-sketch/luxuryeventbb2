/**
 * Leads B2B (« Ça m'intéresse ») + tracking visiteurs.
 * Stockés dans la table Airtable « Webhooks » (EventType « lead » / « visit »).
 * Serveur uniquement. Sans Airtable, tout retombe proprement (best-effort).
 */

import { TABLES, listRecords, createRecord, getRecord, updateRecord } from "./airtable";

export type LeadStatus = "nouveau" | "contacte" | "devis" | "signe";
export const LEAD_STATUSES: { id: LeadStatus; label: string }[] = [
  { id: "nouveau", label: "Nouveau" },
  { id: "contacte", label: "Contacté" },
  { id: "devis", label: "Devis envoyé" },
  { id: "signe", label: "Signé" },
];

interface WFields {
  EventID?: string;
  EventType?: string;
  ReceivedAt?: string;
  Processed?: boolean;
  Payload?: string;
}

export interface Lead {
  company: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  events: string[];
  eventIds: string[];
  // Qualification (prêt à chiffrer)
  eventDate?: string; // date souhaitée (ISO ou libre)
  city?: string; // ville
  stores?: string; // nombre de magasins
  budget?: string; // fourchette de budget
  // Suivi (pipeline)
  status?: LeadStatus;
  note?: string;
}

export interface LeadRow extends Lead {
  id: string;
  createdTime: string;
}

/** Enregistre un lead. */
export async function storeLead(lead: Lead): Promise<void> {
  await createRecord<WFields>(TABLES.webhooks(), {
    EventID: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    EventType: "lead",
    Processed: true,
    Payload: JSON.stringify(lead).slice(0, 6000),
  });
}

/** Types d'événements du tunnel de conversion (analytics). */
export type FunnelKind = "visit" | "interest";

/** Enregistre un événement anonyme du tunnel (visite ou ouverture du formulaire). */
export async function logEvent(kind: FunnelKind, ctx: { path?: string; referrer?: string; src?: string }): Promise<void> {
  await createRecord<WFields>(TABLES.webhooks(), {
    EventID: `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    EventType: kind,
    Processed: true,
    Payload: JSON.stringify({ path: ctx.path ?? "", referrer: ctx.referrer ?? "", src: ctx.src ?? "" }).slice(0, 1000),
  });
}

/** Enregistre une visite (anonyme). */
export async function logVisit(ctx: { path?: string; referrer?: string; src?: string }): Promise<void> {
  await logEvent("visit", ctx);
}

function inRange(ct: string, from?: number, to?: number): boolean {
  const t = Date.parse(ct);
  if (from !== undefined && t < from) return false;
  if (to !== undefined && t > to) return false;
  return true;
}

/** Liste les leads (filtrés par plage de dates), les plus récents d'abord. */
export async function listLeads(opts?: { fromISO?: string; toISO?: string }): Promise<LeadRow[]> {
  const recs = await listRecords<WFields>(TABLES.webhooks(), { filterByFormula: `{EventType} = "lead"`, maxRecords: 10000 });
  const from = opts?.fromISO ? Date.parse(opts.fromISO) : undefined;
  const to = opts?.toISO ? Date.parse(opts.toISO) : undefined;
  const out: LeadRow[] = [];
  for (const r of recs) {
    let p: Partial<Lead> = {};
    try {
      p = JSON.parse(r.fields.Payload ?? "{}") as Partial<Lead>;
    } catch {
      continue;
    }
    const ct = r.createdTime ?? r.fields.ReceivedAt ?? "";
    if (!inRange(ct, from, to)) continue;
    out.push({
      id: r.id,
      createdTime: ct,
      company: p.company ?? "",
      name: p.name ?? "",
      email: p.email ?? "",
      phone: p.phone ?? "",
      message: p.message ?? "",
      events: Array.isArray(p.events) ? p.events : [],
      eventIds: Array.isArray(p.eventIds) ? p.eventIds : [],
      eventDate: p.eventDate ?? "",
      city: p.city ?? "",
      stores: p.stores ?? "",
      budget: p.budget ?? "",
      status: (p.status as LeadStatus) ?? "nouveau",
      note: p.note ?? "",
    });
  }
  out.sort((a, b) => Date.parse(b.createdTime) - Date.parse(a.createdTime));
  return out;
}

interface WFieldsFull {
  Payload?: string;
}

/** Met à jour le statut / la note d'un lead (pipeline). */
export async function updateLead(recordId: string, patch: { status?: LeadStatus; note?: string }): Promise<void> {
  const rec = await getRecord<WFieldsFull>(TABLES.webhooks(), recordId);
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(rec.fields.Payload ?? "{}") as Record<string, unknown>;
  } catch {
    payload = {};
  }
  if (patch.status !== undefined) payload.status = patch.status;
  if (patch.note !== undefined) payload.note = patch.note.slice(0, 2000);
  await updateRecord<WFieldsFull>(TABLES.webhooks(), recordId, { Payload: JSON.stringify(payload).slice(0, 6000) });
}

/** Un événement brut du tunnel (pour la vue Logs). */
export interface EventRow {
  id: string;
  createdTime: string;
  type: string; // "visit" | "interest"
  path: string;
  referrer: string;
  src: string;
}

/** Liste les événements bruts (logs) avec leur provenance, les plus récents d'abord. */
export async function listEvents(opts?: { fromISO?: string; toISO?: string; kinds?: FunnelKind[]; limit?: number }): Promise<EventRow[]> {
  const kinds = opts?.kinds && opts.kinds.length ? opts.kinds : (["visit", "interest"] as FunnelKind[]);
  const formula = kinds.length === 1 ? `{EventType} = "${kinds[0]}"` : `OR(${kinds.map((k) => `{EventType} = "${k}"`).join(",")})`;
  const recs = await listRecords<WFields>(TABLES.webhooks(), { filterByFormula: formula, maxRecords: 50000 });
  const from = opts?.fromISO ? Date.parse(opts.fromISO) : undefined;
  const to = opts?.toISO ? Date.parse(opts.toISO) : undefined;
  const out: EventRow[] = [];
  for (const r of recs) {
    const ct = r.createdTime ?? r.fields.ReceivedAt ?? "";
    if (!inRange(ct, from, to)) continue;
    let p: { path?: string; referrer?: string; src?: string } = {};
    try {
      p = JSON.parse(r.fields.Payload ?? "{}");
    } catch {
      /* payload illisible : on garde les champs vides */
    }
    out.push({ id: r.id, createdTime: ct, type: r.fields.EventType ?? "", path: p.path ?? "", referrer: p.referrer ?? "", src: p.src ?? "" });
  }
  out.sort((a, b) => Date.parse(b.createdTime) - Date.parse(a.createdTime));
  return opts?.limit ? out.slice(0, opts.limit) : out;
}

/** Compte les événements d'un type donné sur une plage de dates. */
export async function countEvents(kind: FunnelKind, opts?: { fromISO?: string; toISO?: string }): Promise<number> {
  const recs = await listRecords<WFields>(TABLES.webhooks(), { filterByFormula: `{EventType} = "${kind}"`, maxRecords: 50000 });
  const from = opts?.fromISO ? Date.parse(opts.fromISO) : undefined;
  const to = opts?.toISO ? Date.parse(opts.toISO) : undefined;
  let n = 0;
  for (const r of recs) {
    const ct = r.createdTime ?? r.fields.ReceivedAt ?? "";
    if (inRange(ct, from, to)) n += 1;
  }
  return n;
}

/** Compte les visites sur une plage de dates. */
export async function countVisits(opts?: { fromISO?: string; toISO?: string }): Promise<number> {
  return countEvents("visit", opts);
}
