import { NextResponse } from "next/server";
import { checkAdminRequest } from "@/lib/admin-auth";
import { listLeads, countVisits, updateLead, LEAD_STATUSES, type LeadStatus } from "@/lib/leads";

/**
 * Leads B2B + stats (admin).
 * GET ?from=ISO&to=ISO → { leads, leadCount, visitCount, rate }
 */
export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: Request) {
  if (!checkAdminRequest(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  const url = new URL(req.url);
  const fromISO = url.searchParams.get("from") || undefined;
  const toISO = url.searchParams.get("to") || undefined;
  try {
    const [leads, visitCount] = await Promise.all([listLeads({ fromISO, toISO }), countVisits({ fromISO, toISO })]);
    const leadCount = leads.length;
    const rate = visitCount ? Math.round((leadCount / visitCount) * 1000) / 10 : 0;
    return NextResponse.json({ leads, leadCount, visitCount, rate });
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
