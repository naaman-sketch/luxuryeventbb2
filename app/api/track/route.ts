import { NextResponse } from "next/server";
import { logEvent, type FunnelKind } from "@/lib/leads";

/** Enregistre un événement anonyme du tunnel (visite / ouverture formulaire). */
export const runtime = "nodejs";

const KINDS: FunnelKind[] = ["visit", "interest"];

export async function POST(req: Request) {
  let body: { kind?: string; path?: string; referrer?: string; src?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* corps vide : on log quand même une visite minimale */
  }
  const kind: FunnelKind = KINDS.includes(body.kind as FunnelKind) ? (body.kind as FunnelKind) : "visit";
  try {
    await logEvent(kind, { path: body.path, referrer: body.referrer, src: body.src });
  } catch {
    /* Airtable indispo : on n'échoue jamais la navigation */
  }
  return NextResponse.json({ ok: true });
}
