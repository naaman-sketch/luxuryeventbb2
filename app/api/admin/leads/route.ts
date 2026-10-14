import { NextResponse } from "next/server";
import { checkAdminRequest } from "@/lib/admin-auth";
import { listLeads, listEvents, updateLead, LEAD_STATUSES, type LeadStatus, type EventRow, type LeadRow } from "@/lib/leads";

/**
 * Leads B2B + stats du tunnel (admin).
 * GET ?from=ISO&to=ISO → { leads, leadCount, visitCount, interestCount, rate,
 *   interestRate, formRate, series:[{date,visits,interest,leads}] }
 */
export const runtime = "nodejs";
export const maxDuration = 60;

const DAY = 86_400_000;
const dayKey = (iso: string) => { const d = new Date(iso); return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10); };

/** Construit des points journaliers (visites / intéressés / leads) pour les courbes. */
function buildSeries(events: EventRow[], leads: LeadRow[], fromISO?: string, toISO?: string) {
  const end = toISO ? new Date(toISO) : new Date();
  let start = fromISO ? new Date(fromISO) : new Date(end.getTime() - 29 * DAY); // défaut : 30 derniers jours
  if (isNaN(start.getTime())) start = new Date(end.getTime() - 29 * DAY);
  let days = Math.floor((end.getTime() - start.getTime()) / DAY) + 1;
  if (days < 1) days = 1;
  if (days > 92) { start = new Date(end.getTime() - 91 * DAY); days = 92; } // borne à 92 jours

  const map: Record<string, { date: string; visits: number; interest: number; leads: number }> = {};
  const series: { date: string; visits: number; interest: number; leads: number }[] = [];
  for (let i = 0; i < days; i++) {
    const k = new Date(start.getTime() + i * DAY).toISOString().slice(0, 10);
    map[k] = { date: k, visits: 0, interest: 0, leads: 0 };
    series.push(map[k]);
  }
  for (const e of events) { const k = dayKey(e.createdTime); if (map[k]) { if (e.type === "visit") map[k].visits++; else if (e.type === "interest") map[k].interest++; } }
  for (const l of leads) { const k = dayKey(l.createdTime); if (map[k]) map[k].leads++; }
  return series;
}

export async function GET(req: Request) {
  if (!checkAdminRequest(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  const url = new URL(req.url);
  const fromISO = url.searchParams.get("from") || undefined;
  const toISO = url.searchParams.get("to") || undefined;
  try {
    const [leads, events] = await Promise.all([
      listLeads({ fromISO, toISO }),
      listEvents({ fromISO, toISO, kinds: ["visit", "interest"] }),
    ]);
    const visitCount = events.filter((e) => e.type === "visit").length;
    const interestCount = events.filter((e) => e.type === "interest").length;
    const leadCount = leads.length;
    const pct = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 10 : 0);
    return NextResponse.json({
      leads,
      leadCount,
      visitCount,
      interestCount,
      rate: pct(leadCount, visitCount), // conversion globale visiteur → lead
      interestRate: pct(interestCount, visitCount), // visiteur → ouverture formulaire
      formRate: pct(leadCount, interestCount), // ouverture → formulaire envoyé
      series: buildSeries(events, leads, fromISO, toISO),
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erreur." }, { status: 500 });
  }
}

/** Met à jour le statut / la note d'un lead. PATCH { id, status?, note? } */
export async function PATCH(req: Request) {
  if (!checkAdminRequest(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  let body: { id?: string; status?: string; note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide." }, { status: 400 });
  }
  const id = String(body.id ?? "");
  if (!id) return NextResponse.json({ error: "id manquant." }, { status: 400 });
  const status = LEAD_STATUSES.some((s) => s.id === body.status) ? (body.status as LeadStatus) : undefined;
  try {
    await updateLead(id, { status, note: typeof body.note === "string" ? body.note : undefined });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erreur." }, { status: 500 });
  }
}
