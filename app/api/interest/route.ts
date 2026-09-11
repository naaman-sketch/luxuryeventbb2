import { NextResponse } from "next/server";
import { getSetting, INTEREST_WEBHOOK_KEY, NOTIFY_EMAIL_KEY } from "@/lib/settings";
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
  lang?: string;
  hp?: string; // honeypot (doit rester vide)
  elapsed?: number; // ms entre l'ouverture du formulaire et l'envoi
}

/**
 * Anti-abus léger en mémoire (best-effort, par instance serverless) :
 * limite les envois par IP sur une fenêtre glissante.
 */
const RATE_MAX = 6; // envois max
const RATE_WINDOW = 10 * 60 * 1000; // par 10 min
const rateHits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateHits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW);
  hits.push(now);
  rateHits.set(ip, hits);
  if (rateHits.size > 5000) { // purge grossière pour éviter une fuite mémoire
    for (const [k, v] of rateHits) if (!v.some((t) => now - t < RATE_WINDOW)) rateHits.delete(k);
  }
  return hits.length > RATE_MAX;
}

/** Contenu de l'e-mail de confirmation au prospect, par langue. */
const CONFIRM = {
  fr: { subject: "Merci de votre intérêt — LuxuryEvent", hi: "Bonjour", body: "Merci pour votre demande ! Notre équipe LuxuryEvent vous recontacte très vite par e-mail ou téléphone pour construire votre événement.", sel: "Votre sélection", sign: "L'équipe LuxuryEvent" },
  nl: { subject: "Bedankt voor uw interesse — LuxuryEvent", hi: "Hallo", body: "Bedankt voor uw aanvraag! Ons LuxuryEvent-team neemt snel contact met u op via e-mail of telefoon om uw evenement te bouwen.", sel: "Uw selectie", sign: "Het LuxuryEvent-team" },
  en: { subject: "Thanks for your interest — LuxuryEvent", hi: "Hi", body: "Thank you for your request! Our LuxuryEvent team will contact you shortly by email or phone to build your event.", sel: "Your selection", sign: "The LuxuryEvent team" },
} as const;

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Corps invalide." }, { status: 400 });
  }

  // Anti-bot : honeypot rempli ou soumission quasi-instantanée → on répond OK
  // (pour ne pas renseigner le bot) mais on n'enregistre rien.
  if ((body.hp && body.hp.trim() !== "") || (typeof body.elapsed === "number" && body.elapsed >= 0 && body.elapsed < 1500)) {
    return NextResponse.json({ ok: true });
  }

  // Rate-limiting par IP.
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Trop de demandes. Réessaie dans quelques minutes." }, { status: 429 });
  }

  const company = String(body.company ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().slice(0, 160);
  const phone = String(body.phone ?? "").trim().slice(0, 40);
  const lang = String(body.lang ?? "fr").slice(0, 2);
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

  // 2. E-mails via Resend (optionnel) : interne (équipe) + confirmation prospect.
  const RESEND = process.env.RESEND_API_KEY;
  if (RESEND) {
    const from = process.env.INTEREST_FROM_EMAIL ?? "contact@cadeauentreprise.be";
    // Destinataire des notifications : réglage dashboard > variable d'env > défaut.
    const notifySetting = await getSetting(NOTIFY_EMAIL_KEY).catch(() => null);
    const to = (notifySetting && notifySetting.trim()) || process.env.INTEREST_TO_EMAIL || "contact@cadeauentreprise.be";
    const qualif = [
      lead.eventDate ? `<b>Date souhaitée :</b> ${esc(lead.eventDate)}` : "",
      lead.city ? `<b>Ville :</b> ${esc(lead.city)}` : "",
      lead.stores ? `<b>Magasins :</b> ${esc(lead.stores)}` : "",
      lead.budget ? `<b>Budget :</b> ${esc(lead.budget)}` : "",
    ].filter(Boolean).join("<br>");

    const send = (payload: Record<string, unknown>) =>
      fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${RESEND}`, "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(() => {});

    // a) E-mail interne (équipe) — enrichi avec la qualification.
    await send({
      from,
      to,
      subject: `🎪 Nouvel intérêt B2B — ${company}`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto">
        <h2>Nouvel intérêt LuxuryEvent</h2>
        <p><b>Enseigne :</b> ${esc(company)}<br>
        <b>Contact :</b> ${esc(lead.name)}<br>
        <b>E-mail :</b> ${esc(email)}<br>
        <b>Téléphone :</b> ${esc(phone)}</p>
        ${qualif ? `<p>${qualif}</p>` : ""}
        <p><b>Animations :</b> ${lead.events.length ? esc(lead.events.join(", ")) : "—"}</p>
        ${lead.message ? `<p><b>Message :</b><br>${esc(lead.message)}</p>` : ""}
      </div>`,
    });

    // b) E-mail de confirmation au prospect (si e-mail valide).
    if (/.+@.+\..+/.test(email)) {
      const c = CONFIRM[(lang as keyof typeof CONFIRM)] ?? CONFIRM.fr;
      await send({
        from,
        to: email,
        subject: c.subject,
        html: `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto">
          <p>${c.hi} ${esc(lead.name || company)},</p>
          <p>${c.body}</p>
          ${lead.events.length ? `<p><b>${c.sel} :</b> ${esc(lead.events.join(", "))}</p>` : ""}
          <p style="margin-top:24px">${c.sign}<br><a href="https://www.luxuryevent.be/">luxuryevent.be</a></p>
        </div>`,
      });
    }
  }

  return NextResponse.json({ ok: true });
}

function esc(s: string): string {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
