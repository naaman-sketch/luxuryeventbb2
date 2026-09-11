import { NextResponse } from "next/server";
import { checkAdminRequest } from "@/lib/admin-auth";
import { getSetting, setSetting, CONTENT_KEY, INTEREST_WEBHOOK_KEY, NOTIFY_EMAIL_KEY } from "@/lib/settings";
import { parseContent } from "@/lib/content";

/**
 * Contenu éditable côté admin.
 *  GET  → { content, interestWebhook, notifyEmail }
 *  POST { content, interestWebhook?, notifyEmail? } → enregistre
 */
export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!checkAdminRequest(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  try {
    const [raw, webhook, notifyEmail] = await Promise.all([getSetting(CONTENT_KEY), getSetting(INTEREST_WEBHOOK_KEY), getSetting(NOTIFY_EMAIL_KEY)]);
    return NextResponse.json({ content: parseContent(raw), interestWebhook: webhook ?? "", notifyEmail: notifyEmail ?? "" });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erreur." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!checkAdminRequest(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  let body: { content?: unknown; interestWebhook?: string; notifyEmail?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide." }, { status: 400 });
  }
  try {
    if (body.content !== undefined) await setSetting(CONTENT_KEY, JSON.stringify(body.content).slice(0, 100000));
    if (typeof body.interestWebhook === "string") await setSetting(INTEREST_WEBHOOK_KEY, body.interestWebhook.trim());
    if (typeof body.notifyEmail === "string") await setSetting(NOTIFY_EMAIL_KEY, body.notifyEmail.trim());
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erreur Airtable." }, { status: 500 });
  }
}
