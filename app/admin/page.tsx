"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { defaultContent, allAnimationIds, type SiteContent } from "@/lib/content";
import type { LeadRow } from "@/lib/leads";

const STATUS_OPTS: { id: string; label: string; color: string }[] = [
  { id: "nouveau", label: "Nouveau", color: "#9a9aa2" },
  { id: "contacte", label: "Contacté", color: "#7aa2ff" },
  { id: "devis", label: "Devis envoyé", color: "#e8b84b" },
  { id: "signe", label: "Signé", color: "#8ce6a5" },
];

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#09090c", color: "#f5f2ea", padding: 20, fontFamily: "system-ui, sans-serif" },
  card: { background: "#131318", border: "1px solid #24242a", borderRadius: 16, padding: 18, marginBottom: 16, maxWidth: 820, marginInline: "auto" },
  h1: { fontSize: 22, fontWeight: 800, margin: "0 0 4px" },
  h2: { fontSize: 16, fontWeight: 800, margin: "0 0 12px" },
  label: { display: "block", fontSize: 12, color: "#9a9aa2", margin: "8px 0 4px" },
  input: { width: "100%", background: "#0f0f14", border: "1px solid #2a2a32", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 14, marginBottom: 6, boxSizing: "border-box" as const },
  btn: { background: "linear-gradient(180deg,#f3d07a,#e8b84b)", color: "#17130a", fontWeight: 700, border: "none", borderRadius: 10, padding: "11px 18px", cursor: "pointer" },
  ghost: { background: "transparent", color: "#fff", border: "1px solid #2a2a32", borderRadius: 10, padding: "9px 14px", cursor: "pointer" },
  muted: { color: "#9a9aa2", fontSize: 13 },
};

export default function Admin() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [content, setContent] = useState<SiteContent>(defaultContent());
  const [webhook, setWebhook] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"content" | "leads">("content");

  const headers = useMemo(() => ({ "Content-Type": "application/json", "x-admin-token": token.trim() }), [token]);

  useEffect(() => {
    const m = document.cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
    if (m) setToken(decodeURIComponent(m[1]));
  }, []);

  const load = useCallback(async () => {
    setMsg("");
    try {
      const res = await fetch("/api/admin/content", { headers });
      if (res.status === 401) { setMsg("Token invalide."); setAuthed(false); return; }
      setAuthed(true);
      const data = await res.json().catch(() => ({}));
      if (data.error) setMsg("⚠️ Airtable indisponible — l'interface s'affiche mais les données ne se chargent pas.");
      else { if (data.content) setContent(data.content); setWebhook(data.interestWebhook || ""); }
    } catch { setMsg("Erreur réseau."); }
  }, [headers]);

  const signIn = () => {
    document.cookie = `admin_token=${encodeURIComponent(token.trim())}; path=/; max-age=86400; SameSite=Lax`;
    load();
  };

  const save = async () => {
    setSaving(true); setMsg("");
    try {
      const res = await fetch("/api/admin/content", { method: "POST", headers, body: JSON.stringify({ content, interestWebhook: webhook }) });
      const data = await res.json();
      setMsg(!res.ok || data.error ? `✗ ${data.error || "Erreur"}` : "✓ Enregistré");
    } catch { setMsg("✗ Erreur réseau"); }
    finally { setSaving(false); }
  };

  const setAnim = (id: string, patch: Partial<{ long: string; images: string[]; video: string; usps: string[] }>) =>
    setContent((c) => ({ ...c, animations: { ...c.animations, [id]: { ...c.animations[id], ...patch } } }));

  if (!authed) {
    return (
      <main style={S.page}>
        <div style={{ ...S.card, maxWidth: 400 }}>
          <h1 style={S.h1}>🔐 Admin LuxuryEvent</h1>
          <p style={S.muted}>Entre le token d&apos;administration (ADMIN_DASHBOARD_TOKEN).</p>
          <input type="password" value={token} onChange={(e) => setToken(e.target.value)} onKeyDown={(e) => e.key === "Enter" && signIn()} placeholder="Token" style={S.input} />
          <button style={S.btn} onClick={signIn}>Se connecter</button>
          {msg && <p style={{ ...S.muted, marginTop: 8, color: msg.startsWith("✓") ? "#8ce6a5" : "#ff9a9a" }}>{msg}</p>}
        </div>
      </main>
    );
  }

  const anims = allAnimationIds();

  return (
    <main style={S.page}>
      <div style={{ ...S.card, position: "sticky" as const, top: 12, zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {([["content", "🎪 Contenu"], ["leads", "📥 Leads"]] as [typeof view, string][]).map(([id, label]) => (
            <button key={id} style={{ ...S.ghost, ...(view === id ? { background: "#e8b84b", color: "#17130a", border: "none", fontWeight: 700 } : {}) }} onClick={() => setView(id)}>{label}</button>
          ))}
        </div>
        {view === "content" && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {msg && <span style={{ ...S.muted, color: msg.startsWith("✓") ? "#8ce6a5" : "#ff9a9a" }}>{msg}</span>}
            <button style={S.ghost} onClick={load}>↻</button>
            <button style={S.btn} onClick={save} disabled={saving}>{saving ? "…" : "Enregistrer"}</button>
          </div>
        )}
      </div>

      {view === "leads" ? (
        <LeadsView headers={headers} />
      ) : (<>
      <div style={S.card}>
        <h2 style={S.h2}>🏠 Accueil (hero)</h2>
        <label style={S.label}>Badge</label>
        <input style={S.input} value={content.heroBadge} onChange={(e) => setContent({ ...content, heroBadge: e.target.value })} />
        <label style={S.label}>Titre</label>
        <textarea style={{ ...S.input, minHeight: 60 }} value={content.heroTitle} onChange={(e) => setContent({ ...content, heroTitle: e.target.value })} />
        <label style={S.label}>Sous-titre</label>
        <textarea style={{ ...S.input, minHeight: 60 }} value={content.heroSub} onChange={(e) => setContent({ ...content, heroSub: e.target.value })} />
        <label style={S.label}>Ligne de crédibilité (ex. « Plus de 129 événements réalisés en Belgique »)</label>
        <input style={S.input} value={content.statLine} onChange={(e) => setContent({ ...content, statLine: e.target.value })} />
        <label style={S.label}>Libellé du CTA (« Ça m&apos;intéresse »)</label>
        <input style={S.input} value={content.ctaInterest} onChange={(e) => setContent({ ...content, ctaInterest: e.target.value })} />
      </div>

      <div style={S.card}>
        <h2 style={S.h2}>🏷️ Marques (bandeau défilant « Ils nous font confiance »)</h2>
        <p style={{ ...S.muted, marginBottom: 6 }}>Une marque par ligne.</p>
        <textarea style={{ ...S.input, minHeight: 110 }} value={content.brands.join("\n")} onChange={(e) => setContent({ ...content, brands: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
      </div>

      <div style={S.card}>
        <h2 style={S.h2}>❓ FAQ B2B</h2>
        {content.faq.map((f, i) => (
          <div key={i} style={{ border: "1px solid #26262e", borderRadius: 12, padding: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <input style={{ ...S.input, marginBottom: 0 }} placeholder="Question" value={f.q} onChange={(e) => setContent({ ...content, faq: content.faq.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)) })} />
              <button style={{ ...S.ghost, color: "#fca5a5" }} onClick={() => setContent({ ...content, faq: content.faq.filter((_, j) => j !== i) })}>✕</button>
            </div>
            <textarea style={{ ...S.input, minHeight: 60 }} placeholder="Réponse" value={f.a} onChange={(e) => setContent({ ...content, faq: content.faq.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)) })} />
          </div>
        ))}
        <button style={S.ghost} onClick={() => setContent({ ...content, faq: [...content.faq, { q: "", a: "" }] })}>+ Ajouter une question</button>
      </div>

      <div style={S.card}>
        <h2 style={S.h2}>🎨 Message « branding + supports publicitaires »</h2>
        <p style={{ ...S.muted, marginBottom: 6 }}>Affiché dans CHAQUE pop-up d&apos;animation.</p>
        <textarea style={{ ...S.input, minHeight: 90 }} value={content.branding} onChange={(e) => setContent({ ...content, branding: e.target.value })} />
      </div>

      <div style={S.card}>
        <h2 style={S.h2}>📈 « Ce que votre magasin y gagne »</h2>
        <p style={{ ...S.muted, marginBottom: 6 }}>Liste de bénéfices affichée dans CHAQUE pop-up. Un bénéfice par ligne.</p>
        <textarea style={{ ...S.input, minHeight: 110 }} value={content.gains.join("\n")} onChange={(e) => setContent({ ...content, gains: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
      </div>

      <div style={S.card}>
        <h2 style={S.h2}>🎥 Vidéo « Story » (bulle en bas à gauche)</h2>
        <p style={{ ...S.muted, marginBottom: 6, fontSize: 12 }}>Une vidéo par langue (lien direct .mp4, YouTube ou Vimeo). Vide = pas de bulle. La vidéo s&apos;ouvre en plein écran façon Story Instagram (swipe/tap pour fermer).</p>
        {["fr", "nl", "en"].map((lg) => (
          <div key={lg} style={{ marginBottom: 6 }}>
            <label style={S.label}>Vidéo {lg.toUpperCase()}</label>
            <input style={{ ...S.input, marginBottom: 0 }} placeholder="https://youtu.be/… ou https://…/story.mp4" value={content.storyVideo?.[lg] ?? ""} onChange={(e) => setContent({ ...content, storyVideo: { ...content.storyVideo, [lg]: e.target.value } })} />
          </div>
        ))}
      </div>

      <div style={S.card}>
        <h2 style={S.h2}>🔗 Webhook « Ça m&apos;intéresse »</h2>
        <p style={{ ...S.muted, marginBottom: 6 }}>URL déclenchée à chaque lead (pour discuter avec la marque).</p>
        <input style={S.input} placeholder="https://hook…" value={webhook} onChange={(e) => setWebhook(e.target.value)} />
      </div>

      <div style={S.card}>
        <h2 style={S.h2}>🎬 Animations (texte détaillé + images + vidéo)</h2>
        <p style={{ ...S.muted, marginBottom: 10 }}>Laisse un champ vide → valeur par défaut. Images : une URL par ligne. Vidéo : lien direct .mp4, YouTube ou Vimeo.</p>
        {anims.map((a) => {
          const co = content.animations[a.id] || {};
          return (
            <div key={a.id} style={{ border: "1px solid #26262e", borderRadius: 12, padding: 12, marginBottom: 12 }}>
              <p style={{ fontWeight: 700, marginBottom: 6 }}>{a.name} <span style={{ ...S.muted, fontWeight: 400 }}>· {a.category}</span></p>
              <label style={S.label}>Description détaillée (pop-up)</label>
              <textarea style={{ ...S.input, minHeight: 70 }} placeholder="Description longue et vendeuse…" value={co.long ?? ""} onChange={(e) => setAnim(a.id, { long: e.target.value })} />
              <label style={S.label}>Badges USP (séparés par des virgules — vide = valeurs par défaut)</label>
              <input style={S.input} placeholder="Ex. Fort trafic, Photogénique, 100% brandé" value={(co.usps ?? []).join(", ")} onChange={(e) => setAnim(a.id, { usps: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
              <label style={S.label}>Images (une URL par ligne)</label>
              <textarea style={{ ...S.input, minHeight: 54 }} placeholder="https://…/photo1.jpg" value={(co.images ?? []).join("\n")} onChange={(e) => setAnim(a.id, { images: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
              <label style={S.label}>Vidéo (URL)</label>
              <input style={S.input} placeholder="https://youtu.be/… ou https://…/video.mp4" value={co.video ?? ""} onChange={(e) => setAnim(a.id, { video: e.target.value })} />
            </div>
          );
        })}
        <button style={S.btn} onClick={save} disabled={saving}>{saving ? "…" : "Enregistrer tout"}</button>
      </div>
      </>)}
    </main>
  );
}

/** Vue Leads : filtres par date, stats (visiteurs / leads / taux), tableau, export CSV. */
function LeadsView({ headers }: { headers: Record<string, string> }) {
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ leads: LeadRow[]; leadCount: number; visitCount: number; rate: number } | null>(null);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true); setErr("");
    try {
      const qs = new URLSearchParams();
      if (from) qs.set("from", new Date(from + "T00:00:00").toISOString());
      if (to) qs.set("to", new Date(to + "T23:59:59").toISOString());
      const res = await fetch(`/api/admin/leads?${qs.toString()}`, { headers });
      const d = await res.json();
      if (!res.ok || d.error) setErr(d.error || "Erreur");
      else setData(d);
    } catch { setErr("Erreur réseau"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const patchLead = async (id: string, patch: { status?: string; note?: string }) => {
    setData((d) => d ? { ...d, leads: d.leads.map((l) => (l.id === id ? { ...l, ...patch } as LeadRow : l)) } : d);
    try {
      await fetch("/api/admin/leads", { method: "PATCH", headers, body: JSON.stringify({ id, ...patch }) });
    } catch { /* silencieux : la valeur locale reste affichée */ }
  };

  const exportCsv = () => {
    if (!data) return;
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      ["Date", "Statut", "Enseigne", "Contact", "Email", "Téléphone", "Date souhaitée", "Ville", "Magasins", "Budget", "Animations", "Message", "Note"].join(","),
      ...data.leads.map((l) => [l.createdTime, l.status, l.company, l.name, l.email, l.phone, l.eventDate, l.city, l.stores, l.budget, (l.events || []).join(" · "), l.message, l.note].map(esc).join(",")),
    ].join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `luxuryevent-leads-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cell: React.CSSProperties = { padding: "8px 6px", borderBottom: "1px solid #1c1c22", textAlign: "left", verticalAlign: "top", fontSize: 13 };

  return (
    <>
      <div style={S.card}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <label style={S.label}>Du</label>
            <input type="date" style={{ ...S.input, marginBottom: 0 }} value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Au</label>
            <input type="date" style={{ ...S.input, marginBottom: 0 }} value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <button style={S.btn} onClick={load} disabled={loading}>{loading ? "…" : "Filtrer"}</button>
          <button style={S.ghost} onClick={() => { setFrom(""); setTo(""); setTimeout(load, 0); }}>Tout</button>
          <button style={S.ghost} onClick={exportCsv} disabled={!data || data.leads.length === 0}>⬇ Export CSV</button>
        </div>
        {err && <p style={{ ...S.muted, color: "#ff9a9a", marginTop: 8 }}>{err}</p>}
      </div>

      <div style={{ ...S.card, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        <Stat label="Visiteurs" value={data?.visitCount ?? 0} />
        <Stat label="Leads (Ça m'intéresse)" value={data?.leadCount ?? 0} accent />
        <Stat label="Taux de conversion" value={`${data?.rate ?? 0}%`} />
      </div>

      <div style={S.card}>
        <h2 style={S.h2}>📥 Leads {data ? `(${data.leadCount})` : ""}</h2>
        {!data || data.leads.length === 0 ? (
          <p style={S.muted}>Aucun lead sur la période.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
              <thead>
                <tr>{["Date", "Statut", "Enseigne / contact", "Coordonnées", "Projet & qualification", "Note"].map((h) => <th key={h} style={{ ...cell, color: "#9a9aa2", fontWeight: 600 }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {data.leads.map((l) => {
                  const st = STATUS_OPTS.find((s) => s.id === (l.status || "nouveau")) || STATUS_OPTS[0];
                  return (
                    <tr key={l.id}>
                      <td style={cell}>{l.createdTime ? new Date(l.createdTime).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "2-digit" }) : "—"}<br /><span style={{ ...S.muted, fontSize: 11 }}>{l.createdTime ? new Date(l.createdTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : ""}</span></td>
                      <td style={cell}>
                        <select value={l.status || "nouveau"} onChange={(e) => patchLead(l.id, { status: e.target.value })} style={{ background: "#0f0f14", border: `1px solid ${st.color}66`, color: st.color, borderRadius: 8, padding: "5px 6px", fontSize: 12, fontWeight: 700 }}>
                          {STATUS_OPTS.map((s) => <option key={s.id} value={s.id} style={{ color: "#fff" }}>{s.label}</option>)}
                        </select>
                      </td>
                      <td style={cell}><b>{l.company}</b><br /><span style={{ ...S.muted, fontSize: 11 }}>{l.name || "—"}</span></td>
                      <td style={cell}>{l.phone}<br /><span style={{ ...S.muted, fontSize: 11 }}>{l.email}</span></td>
                      <td style={{ ...cell, maxWidth: 300 }}>
                        <div style={{ marginBottom: 4 }}>{(l.events || []).join(" · ") || "—"}</div>
                        <div style={{ ...S.muted, fontSize: 11, lineHeight: 1.6 }}>
                          {l.eventDate ? `📅 ${l.eventDate}  ` : ""}{l.city ? `📍 ${l.city}  ` : ""}{l.stores ? `🏬 ${l.stores}  ` : ""}{l.budget ? `💰 ${l.budget}` : ""}
                          {l.message ? <><br />💬 {l.message}</> : ""}
                        </div>
                      </td>
                      <td style={{ ...cell, minWidth: 160 }}>
                        <input defaultValue={l.note || ""} onBlur={(e) => { if (e.target.value !== (l.note || "")) patchLead(l.id, { note: e.target.value }); }} placeholder="Note…" style={{ ...S.input, marginBottom: 0, fontSize: 12, padding: "6px 8px" }} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div style={{ textAlign: "center", padding: "8px 4px" }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent ? "#e8b84b" : "#fff" }}>{value}</div>
      <div style={{ ...S.muted, fontSize: 12, marginTop: 2 }}>{label}</div>
    </div>
  );
}
