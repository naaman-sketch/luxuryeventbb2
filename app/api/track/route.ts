import { NextResponse } from "next/server";
import { logVisit } from "@/lib/leads";

/** Enregistre une visite anonyme (1×/session côté client). */
export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { path?: string; referrer?: string; src?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* corps vide : on log quand même une visite minimale */
  }
  try {
    await logVisit({ path: body.path, referrer: body.referrer, src: body.src });
  } catch {
    /* Airtable indispo : on n'échoue jamais la navigation */
  }
  return NextResponse.json({ ok: true });
}
