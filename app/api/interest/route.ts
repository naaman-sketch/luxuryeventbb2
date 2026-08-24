import { NextResponse } from "next/server";
import { getSetting, INTEREST_WEBHOOK_KEY } from "@/lib/settings";
import { storeLead } from "@/lib/leads";

/**
 * Réception d'un intérêt B2B (« Ça m'intéresse »).
 * Pas de commande/paiement : on capture le lead et on déclenche un webhook
 * (pour discuter directement avec la marque) + un e-mail interne si configuré.
 *
 * Variables d'environnement (optionnelles) :
 *  - INTEREST_WEBHOOK_URL   webhook (Make/Zapier/WhatsApp…) déclenché à chaque lead
 *  - RESEND_API_KEY         envoi d'un e-mail interne (via Resend)
 *  - INTEREST_FROM_EMAIL / INTEREST_TO_EMAIL
 */
export const runtime = "nodejs";

interface Body {
  company?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  events?: string[];
  eventIds?: string[];
  eventDate?: string;
  city?: string;
  stores?: string;
  budget?: string;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Corps invalide." }, { status: 400 });
  }

  const company = String(body.company ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().slice(0, 160);
  const phone = String(body.phone ?? "").trim().slice(0, 40);
  if (company.length < 2 || (!/.+@.+\..+/.test(email) && phone.replace(/\D/g, "").length < 8)) {
    return NextResponse.json({ error: "Nom d'enseigne + e-mail ou téléphone requis." }, { status: 400 });
  }

  const lead = {
    event: "b2b_interest",
    company,
    name: String(body.name ?? "").trim().slice(0, 100),
    email,
    phone,
    message: String(body.message ?? "").trim().slice(0, 2000),
    events: Array.isArray(body.events) ? body.events.slice(0, 40) : [],
    eventIds: Array.isArray(body.eventIds) ? body.eventIds.slice(0, 40) : [],
    eventDate: String(body.eventDate ?? "").trim().slice(0, 40),
    city: String(body.city ?? "").trim().slice(0, 80),
    stores: String(body.stores ?? "").trim().slice(0, 40),
    budget: String(body.budget ?? "").trim().slice(0, 40),
    createdAt: new Date().toISOString(),
  };

  // 0. Enregistre le lead (pour le retrouver dans l'admin) — best-effort.
  try {
    await storeLead({ company, name: lead.name, email, phone, message: lead.message, events: lead.events, eventIds: lead.eventIds, eventDate: lead.eventDate, city: lead.city, stores: lead.stores, budget: lead.budget, status: "nouveau" });
  } catch {
    /* Airtable indispo : le webhook reste le canal de secours */
  }

  // 1. Webhook (discussion directe avec la marque) — dashboard OU variable d'env.
  const settingsWebhook = await getSetting(INTEREST_WEBHOOK_KEY).catch(() => null);
  const webhook = (settingsWebhook && settingsWebhook.trim()) || process.env.INTEREST_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
    } catch {
      /* webhook injoignable : on n'échoue pas le lead */
    }
  }

  // 2. E-mail interne (optionnel, via Resend)
  const RESEND = process.env.RESEND_API_KEY;
  if (RESEND) {
    const from = process.env.INTEREST_FROM_EMAIL ?? "contact@luxuryevent.example";
    const to = process.env.INTEREST_TO_EMAIL ?? from;
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to,
          subject: `🎪 Nouvel intérêt B2B — ${company}`,
          html: `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto">
            <h2>Nouvel intérêt LuxuryEvent</h2>
            <p><b>Enseigne :</b> ${esc(company)}<br>
            <b>Contact :</b> ${esc(lead.name)}<br>
            <b>E-mail :</b> ${esc(email)}<br>
            <b>Téléphone :</b> ${esc(phone)}</p>
            <p><b>Animations :</b> ${lead.events.length ? esc(lead.events.join(", ")) : "—"}</p>
            ${lead.message ? `<p><b>Message :</b><br>${esc(lead.message)}</p>` : ""}
          </div>`,
        }),
      });
    } catch {
      /* e-mail best-effort */
    }
  }

  return NextResponse.json({ ok: true });
}

function esc(s: string): string {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
