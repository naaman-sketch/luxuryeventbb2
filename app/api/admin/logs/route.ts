import { NextResponse } from "next/server";
import { checkAdminRequest } from "@/lib/admin-auth";
import { listEvents } from "@/lib/leads";

/**
 * Logs bruts du tunnel (admin) : visites + ouvertures de formulaire, avec
 * leur provenance (referrer / UTM).
 * GET ?from=ISO&to=ISO&limit=N → { events }
 */
export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: Request) {
  if (!checkAdminRequest(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  const url = new URL(req.url);
  const fromISO = url.searchParams.get("from") || undefined;
  const toISO = url.searchParams.get("to") || undefined;
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 500, 1), 2000);
  try {
    const events = await listEvents({ fromISO, toISO, limit });
    return NextResponse.json({ events });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erreur." }, { status: 500 });
  }
}
