"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles, ArrowRight, X, Loader2, PartyPopper, Store, TrendingUp, Users, Info, Palette, Megaphone, ChevronLeft, ChevronRight, Plus, Home as HomeIcon, Phone, MessageCircle, Play, ShieldCheck, Wrench, UserCheck, Truck } from "lucide-react";
import { CATEGORIES, IMPACT_STATS, EVENT_IMAGE, EVENT_FAMILY, EVENT_PRICE, FAMILIES, formatEUR, findEvent, type Family, type EventItem } from "@/lib/events-data";
import { defaultContent, type SiteContent, type AnimationContent } from "@/lib/content";
import { UI, FAQ_I18N, CONTACT, LANGS, LANG_LABELS, detectLang, t, type Lang } from "@/lib/i18n";
import { localizedEvent, eventGains } from "@/lib/events-i18n";

const SERIF = "var(--font-serif), Georgia, serif";
const BUDGETS = ["À définir", "Moins de 1 000 €", "1 000 – 3 000 €", "3 000 – 5 000 €", "5 000 – 10 000 €", "Plus de 10 000 €"];

/** Envoie un événement de conversion aux pixels publicitaires (s'ils sont chargés). */
function firePixel(stage: "interest" | "lead") {
  if (typeof window === "undefined") return;
  const w = window as unknown as { fbq?: (...a: unknown[]) => void; gtag?: (...a: unknown[]) => void; ttq?: { track: (...a: unknown[]) => void } };
  try {
    if (stage === "interest") {
      w.fbq?.("track", "InitiateCheckout");
      w.gtag?.("event", "begin_checkout");
      w.ttq?.track("ClickButton");
    } else {
      w.fbq?.("track", "Lead");
      w.gtag?.("event", "generate_lead");
      w.ttq?.track("SubmitForm");
    }
  } catch { /* pixels absents : sans effet */ }
}

// Libellés impact par index (mêmes que IMPACT_STATS) — traduits.
const IMPACT_KEYS = [
  { v: "impTrafic", d: "impTraficD" },
  { v: "impVentes", d: "impVentesD" },
  { v: "impVisib", d: "impVisibD" },
  { v: "impImage", d: "impImageD" },
];

export default function Home() {
  const [content, setContent] = useState<SiteContent>(defaultContent());
  const [lang, setLang] = useState<Lang>("fr");
  const [fam, setFam] = useState<Family | "all">("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<EventItem | null>(null);
  const [interest, setInterest] = useState(false);
  const [story, setStory] = useState(false);
  const [exitPrompt, setExitPrompt] = useState(false);
  const canExitRef = useRef(false);

  const fr = lang === "fr";
  const tr = (k: string) => t(UI[k], lang);
  const storyUrl = content.storyVideo[lang] || content.storyVideo.fr || content.storyVideo.nl || content.storyVideo.en || "";
  const priceOf = (id: string) => content.animations[id]?.price ?? (EVENT_PRICE[id] ?? 0);
  const estimateTotal = selected.reduce((s, id) => s + priceOf(id), 0);

  useEffect(() => {
    setLang(detectLang());
    fetch("/api/content").then((r) => r.json()).then((d) => { if (d.content) setContent(d.content); }).catch(() => {});
    // Tracking visiteur (1×/session) avec provenance (UTM / referrer).
    try {
      if (!sessionStorage.getItem("lx_visit")) {
        sessionStorage.setItem("lx_visit", "1");
        const qs = new URLSearchParams(window.location.search);
        const src = qs.get("utm_source") || qs.get("ref") || qs.get("source") || "";
        fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: window.location.pathname, referrer: document.referrer || "direct", src }), keepalive: true }).catch(() => {});
      }
    } catch { /* mode privé : on ignore */ }
  }, []);

  // Le pop-up de relance ne peut apparaître que si des animations sont choisies
  // et que le formulaire n'est pas déjà ouvert.
  useEffect(() => { canExitRef.current = selected.length > 0 && !interest; }, [selected, interest]);

  // Exit-intent : « Gardez votre sélection, on vous rappelle » (1×/session).
  useEffect(() => {
    const trigger = () => {
      if (!canExitRef.current) return;
      try {
        if (sessionStorage.getItem("lx_exit")) return;
        sessionStorage.setItem("lx_exit", "1");
      } catch { /* mode privé */ }
      setExitPrompt(true);
    };
    // Desktop : la souris quitte la page par le haut.
    const onMouseOut = (e: MouseEvent) => { if (!e.relatedTarget && e.clientY <= 0) trigger(); };
    // Mobile / desktop : l'onglet passe en arrière-plan (le rappel s'affiche au retour).
    const onVisibility = () => { if (document.visibilityState === "hidden") trigger(); };
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const toggle = (id: string) => setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const openInterestWith = (id?: string) => {
    if (id && !selected.includes(id)) setSelected((p) => [...p, id]);
    setDetail(null);
    setInterest(true);
    // Analytics interne : 1 « intéressé » unique par session.
    try {
      if (!sessionStorage.getItem("lx_interest")) {
        sessionStorage.setItem("lx_interest", "1");
        fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "interest", path: window.location.pathname }), keepalive: true }).catch(() => {});
      }
    } catch { /* mode privé : on ignore */ }
    // Pixels publicitaires (si configurés) : intention d'achat.
    firePixel("interest");
  };

  const filtered = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        ...c,
        items: c.items
          .map((it, i) => ({ it, i }))
          // Masque les animations désactivées dans le dashboard + filtre par famille.
          .filter(({ it }) => !content.animations[it.id]?.hidden && (fam === "all" || EVENT_FAMILY[it.id] === fam))
          // Trie par ordre défini au dashboard (défaut = ordre du catalogue).
          .sort((a, b) => (content.animations[a.it.id]?.order ?? a.i) - (content.animations[b.it.id]?.order ?? b.i))
          .map(({ it }) => it),
      })).filter((c) => c.items.length > 0),
    [fam, content],
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink pb-40 text-[#f5f2ea]">
      <div className="halo left-1/2 top-[-6rem] h-96 w-96 -translate-x-1/2 bg-gold" />
      <div className="halo right-[-6rem] top-1/3 h-80 w-80 bg-gold-deep" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-4 sm:px-5 sm:py-5">
        <a href={CONTACT.home} className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold/15 text-gold sm:h-9 sm:w-9"><Sparkles size={17} /></span>
          <span className="text-base font-extrabold tracking-tight sm:text-lg">Luxury<span className="text-gold">Event</span></span>
        </a>
        <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Sélecteur de langue */}
          <div className="flex overflow-hidden rounded-full border border-white/15">
            {LANGS.map((l) => (
              <button key={l} type="button" onClick={() => setLang(l)} className={`px-2 py-1 text-[11px] font-bold transition-colors sm:text-xs ${lang === l ? "bg-gold text-ink" : "text-white/60 hover:text-white"}`}>{LANG_LABELS[l]}</button>
            ))}
          </div>
          <a href={CONTACT.home} className="hidden items-center gap-1.5 rounded-full border border-white/15 px-3 py-2 text-sm font-semibold text-white/80 hover:border-gold/40 sm:inline-flex"><HomeIcon size={15} /> {tr("navHome")}</a>
          {/* Téléphone : numéro sur desktop, icône ronde sur mobile */}
          <a href={`tel:${CONTACT.phoneTel}`} className="hidden items-center gap-1.5 rounded-full border border-gold/40 px-3 py-2 text-sm font-semibold text-gold hover:bg-gold/10 sm:inline-flex"><Phone size={15} /> {CONTACT.phoneDisplay}</a>
          <a href={`tel:${CONTACT.phoneTel}`} aria-label="Appeler" className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold sm:hidden"><Phone size={16} /></a>
          {/* WhatsApp — mobile uniquement, icône ronde */}
          <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-black sm:hidden"><MessageCircle size={17} /></a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-4xl px-5 pt-8 text-center">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
          <Store size={13} /> {fr ? content.heroBadge : tr("heroBadge")}
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mx-auto mt-4 max-w-3xl text-4xl leading-[1.05] sm:text-6xl" style={{ fontFamily: SERIF }}>
          {fr ? content.heroTitle : tr("heroTitle")}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mx-auto mt-5 max-w-2xl text-base text-white/60 sm:text-lg">
          {fr ? content.heroSub : tr("heroSub")}
        </motion.p>
        {(fr ? content.statLine : tr("statLine")) && (
          <motion.p initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-bold text-gold">
            <Sparkles size={14} /> {fr ? content.statLine : tr("statLine")}
          </motion.p>
        )}
        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          {IMPACT_STATS.map((s, i) => (
            <motion.div key={s.value} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.05 }} className="glass rounded-2xl p-3 text-center">
              <div className="text-2xl">{s.emoji}</div>
              <div className="mt-1 text-xs font-bold text-gold">{tr(IMPACT_KEYS[i].v)}</div>
              <div className="mt-0.5 text-[11px] leading-tight text-white/50">{tr(IMPACT_KEYS[i].d)}</div>
            </motion.div>
          ))}
        </div>

        {/* Mentions rassurantes */}
        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] text-white/60">
          {[[ShieldCheck, "reass1"], [Check, "reass2"], [UserCheck, "reass3"], [Wrench, "reass4"]].map(([Icon, key], i) => {
            const I = Icon as typeof ShieldCheck;
            return <span key={i} className="inline-flex items-center gap-1.5"><I size={15} className="text-gold" /> {tr(key as string)}</span>;
          })}
        </div>
      </section>

      {/* Ils nous font confiance — bandeau défilant */}
      {content.brands.length > 0 && (
        <section className="relative mt-12">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.25em] text-white/35">{tr("trustTitle")}</p>
          <div className="marquee-mask overflow-hidden">
            <div className="marquee-track items-center">
              {[...content.brands, ...content.brands].map((b, i) => (
                <span key={i} className="flex items-center">
                  <span className="whitespace-nowrap px-6 text-2xl font-bold text-white/70 sm:text-3xl" style={{ fontFamily: SERIF }}>{b}</span>
                  <span className="text-gold/60" aria-hidden>•</span>
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cible */}
      <section className="relative mx-auto mt-14 max-w-6xl px-5">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="mr-1 flex items-center gap-1.5 text-sm text-white/50"><Users size={15} /> {tr("familyLabel")} :</span>
          {([["all", tr("famAll")], ["concept", tr("famConcept")], ["physique", tr("famPhysique")], ["food", tr("famFood")]] as [Family | "all", string][]).map(([id, label]) => (
            <button key={id} type="button" onClick={() => setFam(id)} className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${fam === id ? "border-gold bg-gold/15 text-gold" : "border-white/10 text-white/60 hover:border-gold/40"}`}>
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Catalogue */}
      <div className="relative mx-auto mt-10 max-w-6xl space-y-14 px-5">
        {filtered.map((cat) => (
          <section key={cat.id}>
            <div className="mb-5 flex items-baseline gap-3">
              <span className="text-3xl">{cat.emoji}</span>
              <div>
                <h2 className="text-2xl font-extrabold" style={{ fontFamily: SERIF }}>{fr ? cat.title : tr(`cat_${cat.id}_t`)}</h2>
                <p className="mt-0.5 max-w-2xl text-sm text-white/50">{fr ? cat.subtitle : tr(`cat_${cat.id}_s`)}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cat.items.map((it) => {
                const on = selected.includes(it.id);
                const co = content.animations[it.id];
                const cover = co?.images?.[0] || (EVENT_IMAGE[it.id] ? encodeURI(EVENT_IMAGE[it.id]) : "");
                const le = localizedEvent(it, lang);
                return (
                  <motion.div key={it.id} whileHover={{ y: -4 }} className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-colors ${on ? "border-gold bg-gold/10 shadow-glow" : "border-white/10 bg-ink-soft hover:border-gold/40"}`}>
                    <button type="button" onClick={() => setDetail(it)} className="relative flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-br from-ink-muted to-ink text-6xl">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cover} alt={le.name} className="h-full w-full object-cover" />
                      ) : (
                        <span>{it.emoji}</span>
                      )}
                      {co?.video && <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">{tr("videoTag")}</span>}
                      <span className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-1 text-[11px] font-semibold text-gold backdrop-blur">{tr("learnMoreShort")}</span>
                    </button>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-bold text-white">{le.name}</h3>
                      <p className="mt-1 flex-1 text-sm leading-snug text-white/55">{le.desc}</p>
                      <p className="mt-3 inline-flex w-max items-center gap-1.5 rounded-full bg-gold/10 px-2.5 py-1 text-[11px] font-semibold text-gold"><TrendingUp size={12} /> {le.impact}</p>
                      <div className="mt-3 flex gap-2">
                        <button type="button" onClick={() => setDetail(it)} className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/10 py-2 text-xs font-semibold text-white/70 hover:border-gold/40"><Info size={13} /> {tr("learnMore")}</button>
                        <button type="button" onClick={() => toggle(it.id)} className={`flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition-colors ${on ? "bg-gold text-ink" : "border border-gold/40 text-gold hover:bg-gold/10"}`}>
                          {on ? <><Check size={13} /> {tr("added")}</> : <><Plus size={13} /> {tr("addSel")}</>}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Comment ça marche */}
      <section className="relative mx-auto mt-16 max-w-4xl px-5">
        <h2 className="text-center text-2xl font-extrabold" style={{ fontFamily: SERIF }}>{tr("howTitle")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="relative rounded-2xl border border-white/10 bg-ink-soft p-5 text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-lg font-extrabold text-gold">{n}</span>
              <p className="mt-3 font-bold text-white">{tr(`how${n}t`)}</p>
              <p className="mt-1 text-sm text-white/55">{tr(`how${n}d`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ B2B */}
      {(() => {
        const faq = fr ? content.faq : FAQ_I18N[lang];
        if (!faq || faq.length === 0) return null;
        return (
          <section className="relative mx-auto mt-16 max-w-3xl px-5">
            <h2 className="text-center text-2xl font-extrabold" style={{ fontFamily: SERIF }}>{tr("faqTitle")}</h2>
            <div className="mt-6 space-y-2">
              {faq.map((f, i) => <FaqRow key={i} q={f.q} a={f.a} />)}
            </div>
          </section>
        );
      })()}

      {/* Footer */}
      <footer className="relative mx-auto mt-20 max-w-6xl px-5 pb-4 text-center">
        <div className="border-t border-white/10 pt-6">
          <p className="text-lg font-extrabold">Luxury<span className="text-gold">Event</span></p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/55">
            <a href={CONTACT.home} className="hover:text-gold">{tr("navHome")}</a>
            <a href={`tel:${CONTACT.phoneTel}`} className="hover:text-gold">{CONTACT.phoneDisplay}</a>
            <a href="/mentions-legales" className="hover:text-gold">{tr("footerLegal")}</a>
            <a href="/confidentialite" className="hover:text-gold">{tr("footerPrivacy")}</a>
          </div>
          <p className="mt-4 text-xs text-white/30">© {new Date().getFullYear()} LuxuryEvent — {tr("footerRights")}</p>
        </div>
      </footer>

      {/* Barre flottante */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
        <div className="px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
          <div className="pointer-events-auto mx-auto flex max-w-2xl items-center justify-between gap-3 rounded-[26px] border border-gold/25 bg-ink-soft/90 px-4 py-3 shadow-card backdrop-blur-xl">
            <div className="min-w-0">
              <p className="text-sm font-bold text-white">
                {selected.length > 0 ? `${selected.length} ${selected.length > 1 ? tr("selectedMany") : tr("selectedOne")}` : tr("composeTitle")}
              </p>
              <p className="truncate text-xs text-white/45">{selected.length > 0 ? selected.map((id) => { const it = findEvent(id); return it ? localizedEvent(it, lang).name : null; }).filter(Boolean).join(" · ") : tr("composeSub")}</p>
            </div>
            <button type="button" onClick={() => openInterestWith()} className="btn-primary flex shrink-0 items-center gap-2 px-5 py-3 text-sm">
              {fr ? content.ctaInterest : t(UI.interestTitle, lang)} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bulle « story » (bas gauche) — visible si une vidéo est configurée */}
      {storyUrl && (
        <button type="button" onClick={() => setStory(true)} aria-label="Voir la vidéo" className="pointer-events-auto fixed bottom-24 left-4 z-40 flex h-16 w-16 items-center justify-center rounded-full p-[3px] sm:bottom-6" style={{ background: "linear-gradient(45deg,#e8b84b,#f3d07a)" }}>
          <span className="flex h-full w-full items-center justify-center rounded-full border-2 border-ink bg-ink-soft text-gold">
            <Play size={22} className="ml-0.5" />
          </span>
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-black">▶</span>
        </button>
      )}

      <AnimatePresence>
        {story && storyUrl && <StoryPlayer url={storyUrl} onClose={() => setStory(false)} />}
        {detail && <DetailModal item={detail} lang={lang} content={content.animations[detail.id]} price={priceOf(detail.id)} branding={fr ? content.branding : t(UI.branding, lang)} ctaLabel={fr ? content.ctaInterest : t(UI.interestTitle, lang)} selected={selected.includes(detail.id)} onToggle={() => toggle(detail.id)} onInterest={() => openInterestWith(detail.id)} onClose={() => setDetail(null)} />}
        {interest && <InterestModal selected={selected} lang={lang} estimateTotal={estimateTotal} onClose={() => setInterest(false)} />}
        {exitPrompt && !interest && (
          <ExitIntentModal
            lang={lang}
            count={selected.length}
            names={selected.map((id) => { const it = findEvent(id); return it ? localizedEvent(it, lang).name : null; }).filter(Boolean) as string[]}
            ctaLabel={fr ? content.ctaInterest : t(UI.interestTitle, lang)}
            onAccept={() => { setExitPrompt(false); openInterestWith(); }}
            onClose={() => setExitPrompt(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

/** Lecteur « story » façon Instagram : barre de progression, swipe/tap pour fermer. */
function StoryPlayer({ url, onClose }: { url: string; onClose: () => void }) {
  const [pct, setPct] = useState(0);
  const startY = useRef<number | null>(null);
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  const isEmbed = !!(yt || vimeo);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[130] flex items-center justify-center bg-black"
      onTouchStart={(e) => (startY.current = e.touches[0].clientY)}
      onTouchEnd={(e) => { if (startY.current != null && e.changedTouches[0].clientY - startY.current > 80) onClose(); startY.current = null; }}
    >
      <div className="relative aspect-[9/16] max-h-full w-full max-w-[430px] overflow-hidden bg-neutral-900 sm:rounded-2xl">
        {/* Barre de progression (durée) */}
        <div className="absolute left-2 right-2 top-2 z-20 h-[3px] overflow-hidden rounded-full bg-white/30">
          <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
        </div>
        <button type="button" onClick={onClose} aria-label="Fermer" className="absolute right-3 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"><X size={18} /></button>

        {isEmbed ? (
          <iframe className="h-full w-full" src={yt ? `https://www.youtube.com/embed/${yt[1]}?autoplay=1` : `https://player.vimeo.com/video/${vimeo![1]}?autoplay=1`} title="Story" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        ) : (
          <video src={url} autoPlay playsInline controls={false} onEnded={onClose} onTimeUpdate={(e) => { const v = e.currentTarget; if (v.duration) setPct((v.currentTime / v.duration) * 100); }} className="h-full w-full object-cover" onClick={(e) => { const v = e.currentTarget; if (v.paused) v.play(); else v.pause(); }} />
        )}
        {/* Zones de tap : gauche = fermer, droite = laisser jouer */}
        {!isEmbed && <button type="button" aria-label="Fermer" onClick={onClose} className="absolute inset-y-0 left-0 z-10 w-1/4" />}
      </div>
    </motion.div>
  );
}

/** Pop-up détaillée d'une animation : médias + description + branding + CTA. */
function DetailModal({ item, lang, content, price, branding, ctaLabel, selected, onToggle, onInterest, onClose }: { item: EventItem; lang: Lang; content?: AnimationContent; price: number; branding: string; ctaLabel: string; selected: boolean; onToggle: () => void; onInterest: () => void; onClose: () => void }) {
  const defImg = EVENT_IMAGE[item.id] ? encodeURI(EVENT_IMAGE[item.id]) : "";
  const images = content?.images?.length ? content.images : (defImg ? [defImg] : []);
  const [idx, setIdx] = useState(0);
  const le = localizedEvent(item, lang);
  const long = lang === "fr" ? (content?.long?.trim() || le.desc) : le.desc;
  const usps = (lang === "fr" && content?.usps && content.usps.length ? content.usps : le.usps) ?? [];
  const options = le.options ?? [];
  const gains = eventGains(item.id, lang);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <motion.div initial={{ y: 40, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-ink sm:rounded-3xl">
        <button type="button" onClick={onClose} aria-label="Fermer" className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur hover:text-white"><X size={16} /></button>

        {/* Média : vidéo prioritaire, sinon carrousel d'images, sinon emoji */}
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-br from-ink-muted to-ink text-7xl">
          {content?.video ? (
            <VideoPlayer url={content.video} />
          ) : images.length > 0 ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[idx]} alt={item.name} className="h-full w-full object-cover" />
              {images.length > 1 && (
                <>
                  <button type="button" onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"><ChevronLeft size={18} /></button>
                  <button type="button" onClick={() => setIdx((i) => (i + 1) % images.length)} className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white"><ChevronRight size={18} /></button>
                  <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">{images.map((_, i) => <span key={i} className="h-1.5 rounded-full" style={{ width: i === idx ? 16 : 6, background: i === idx ? "#E8B84B" : "rgba(255,255,255,0.4)" }} />)}</div>
                </>
              )}
            </>
          ) : (
            <span>{item.emoji}</span>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{item.emoji}</span>
            <h2 className="text-2xl font-extrabold text-white" style={{ fontFamily: SERIF }}>{le.name}</h2>
          </div>
          {price > 0 && <p className="mt-1.5 text-sm font-bold text-gold">{t(UI.priceFrom, lang)} {formatEUR(price)}</p>}
          {/* Badges USP */}
          {usps.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {usps.map((u, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/[0.08] px-2.5 py-1 text-[11px] font-bold text-gold"><Check size={11} strokeWidth={3} /> {u}</span>
              ))}
            </div>
          )}

          <p className="mt-4 text-sm leading-relaxed text-white/70">{long}</p>

          {/* Options « au choix » (ex. Food Truck) */}
          {options.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-bold text-white">{t(UI.optionsTitle, lang)} :</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {options.map((o, i) => (
                  <span key={i} className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[12px] font-semibold text-white/80">{o}</span>
                ))}
              </div>
            </div>
          )}

          {/* Ce que votre magasin y gagne */}
          {gains.length > 0 && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-white"><TrendingUp size={15} className="text-gold" /> {t(UI.gainsTitle, lang)}</p>
              <ul className="mt-2 space-y-1.5">
                {gains.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] leading-snug text-white/70"><Check size={15} className="mt-0.5 shrink-0 text-gold" /> {g}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Message branding / supports pub */}
          <div className="mt-4 rounded-2xl border border-gold/25 bg-gold/[0.07] p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-gold"><Palette size={15} /> {t(UI.brandColorTitle, lang)}</p>
            <p className="mt-1.5 flex items-start gap-2 text-[13px] leading-relaxed text-white/70"><Megaphone size={15} className="mt-0.5 shrink-0 text-gold" /> {branding}</p>
          </div>

        </div>

        {/* CTA collés en bas du pop-up — toujours visibles */}
        <div className="sticky bottom-0 z-10 flex gap-2 border-t border-white/10 bg-ink/95 px-6 py-4 backdrop-blur">
          <button type="button" onClick={onToggle} className={`flex items-center justify-center gap-1.5 rounded-full px-4 py-3 text-sm font-bold transition-colors ${selected ? "bg-white/10 text-white" : "border border-gold/40 text-gold hover:bg-gold/10"}`}>
            {selected ? <><Check size={15} /> {t(UI.added, lang)}</> : <><Plus size={15} /> {t(UI.add, lang)}</>}
          </button>
          <button type="button" onClick={onInterest} className="btn-primary flex flex-1 items-center justify-center gap-2 py-3 text-sm">
            {ctaLabel} <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Lecteur vidéo : iframe pour YouTube/Vimeo, sinon balise <video>. */
function VideoPlayer({ url }: { url: string }) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (yt) return <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${yt[1]}`} title="Vidéo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />;
  if (vimeo) return <iframe className="h-full w-full" src={`https://player.vimeo.com/video/${vimeo[1]}`} title="Vidéo" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />;
  return <video src={url} controls playsInline className="h-full w-full object-cover" />;
}

/** Pop-in « Ça m'intéresse ». */
/** Pop-up de relance (exit-intent) : « Gardez votre sélection, on vous rappelle ». */
const EXIT_TXT = {
  fr: { title: "Attendez ! Gardez votre sélection", sub: "Ne perdez pas votre composition. Laissez-nous vos coordonnées : on vous rappelle avec un devis sur-mesure — sans engagement.", stay: "Continuer à composer" },
  nl: { title: "Wacht! Bewaar uw selectie", sub: "Verlies uw samenstelling niet. Laat uw gegevens achter: we bellen u terug met een offerte op maat — vrijblijvend.", stay: "Verder samenstellen" },
  en: { title: "Wait! Keep your selection", sub: "Don't lose your setup. Leave your details and we'll call you back with a tailored quote — no commitment.", stay: "Keep composing" },
} as const;

function ExitIntentModal({ lang, count, names, ctaLabel, onAccept, onClose }: { lang: Lang; count: number; names: string[]; ctaLabel: string; onAccept: () => void; onClose: () => void }) {
  const x = EXIT_TXT[lang] ?? EXIT_TXT.fr;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <motion.div initial={{ y: 20, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md rounded-3xl border border-gold/30 bg-ink p-6 text-center shadow-card">
        <button type="button" onClick={onClose} aria-label="Fermer" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white"><X size={16} /></button>
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold"><Sparkles size={26} /></div>
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: SERIF }}>{x.title}</h2>
        <p className="mt-2 text-sm text-white/60">{x.sub}</p>
        {count > 0 && (
          <div className="mx-auto mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">{count} {count > 1 ? "animations" : "animation"}</p>
            <p className="mt-1 truncate text-sm text-white/70">{names.join(" · ")}</p>
          </div>
        )}
        <button type="button" onClick={onAccept} className="btn-primary mt-5 flex w-full items-center justify-center gap-2 px-5 py-3 text-sm">{ctaLabel} <ArrowRight size={16} /></button>
        <button type="button" onClick={onClose} className="mt-3 text-xs font-medium text-white/40 hover:text-white/70">{x.stay}</button>
      </motion.div>
    </motion.div>
  );
}

function InterestModal({ selected, lang, estimateTotal, onClose }: { selected: string[]; lang: Lang; estimateTotal: number; onClose: () => void }) {
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", message: "", eventDate: "", city: "", stores: "", budget: "" });
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [err, setErr] = useState<string | null>(null);
  const [hp, setHp] = useState(""); // honeypot anti-bot (invisible pour l'humain)
  const openedAt = useRef(Date.now()); // horodatage d'ouverture (anti-bot : soumission trop rapide)
  const L = (k: string) => t(UI[k], lang);

  const emailOk = /.+@.+\..+/.test(form.email.trim());
  const phoneOk = form.phone.replace(/\D/g, "").length >= 8;
  const canSend = form.company.trim().length >= 2 && (emailOk || phoneOk);

  const submit = async () => {
    if (!canSend || state === "sending") return;
    setState("sending"); setErr(null);
    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lang, hp, elapsed: Date.now() - openedAt.current, events: selected.map((id) => findEvent(id)?.name).filter(Boolean), eventIds: selected }),
      });
      const data = await res.json();
      if (!res.ok || data.error) { setErr(data.error || "Une erreur est survenue."); setState("idle"); }
      else { firePixel("lead"); setState("done"); }
    } catch {
      setErr("Réseau indisponible, réessaie."); setState("idle");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[110] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <motion.div initial={{ y: 40, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md rounded-t-3xl border border-white/10 bg-ink p-6 sm:rounded-3xl">
        <button type="button" onClick={onClose} aria-label="Fermer" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white"><X size={16} /></button>
        {state === "done" ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold"><PartyPopper size={28} /></div>
            <h2 className="text-xl font-bold text-white">{L("doneTitle")}</h2>
            <p className="mt-2 text-sm text-white/60">{L("doneSub")}</p>
            <button type="button" onClick={onClose} className="btn-primary mt-5 px-6 py-2.5 text-sm">{L("close")}</button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-extrabold text-white" style={{ fontFamily: SERIF }}>{L("interestTitle")}</h2>
            <p className="mt-1 text-sm text-white/55">{L("interestSub")}</p>
            {selected.length > 0 && (
              <>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selected.map((id) => { const it = findEvent(id); return it ? <span key={id} className="rounded-full bg-gold/12 px-2.5 py-1 text-[11px] font-semibold text-gold">{it.emoji} {localizedEvent(it, lang).name}</span> : null; })}
                </div>
                <p className="mt-2 text-sm font-bold text-gold">{L("estimateLabel")} {formatEUR(estimateTotal)}</p>
                <p className="text-[11px] text-white/40">{L("priceNote")}</p>
              </>
            )}
            <div className="mt-4 space-y-3">
              {/* Honeypot anti-bot : invisible et hors tabulation pour un humain. */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
              <Field placeholder={L("fCompany")} value={form.company} onChange={(v) => setForm((f) => ({ ...f, company: v }))} />
              <Field placeholder={L("fName")} value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
              <Field placeholder={L("fEmail")} type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
              <Field placeholder={L("fPhone")} value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />

              {/* Qualification — pour un devis plus rapide */}
              <p className="pt-1 text-[11px] font-semibold uppercase tracking-wide text-white/35">{L("qualifTitle")}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] text-white/40">{L("fDate")}</label>
                  <input type="date" value={form.eventDate} onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-ink-soft px-3 py-2.5 text-sm text-white outline-none focus:border-gold/50" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-white/40">{L("fCity")}</label>
                  <Field placeholder={L("fCity")} value={form.city} onChange={(v) => setForm((f) => ({ ...f, city: v }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field placeholder={L("fStores")} value={form.stores} onChange={(v) => setForm((f) => ({ ...f, stores: v }))} />
                <select value={form.budget} onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-ink-soft px-3 py-3 text-sm text-white outline-none focus:border-gold/50">
                  <option value="">{L("fBudget")}</option>
                  {BUDGETS.map((b) => <option key={b} value={b} className="bg-ink">{b}</option>)}
                </select>
              </div>

              <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder={L("fMessage")} className="min-h-[70px] w-full resize-y rounded-xl border border-white/10 bg-ink-soft px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-gold/50" />
              {err && <p className="text-sm text-red-400">{err}</p>}
              <button type="button" onClick={submit} disabled={!canSend || state === "sending"} className="btn-primary flex w-full items-center justify-center gap-2 py-3.5 text-sm disabled:opacity-40">
                {state === "sending" ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />} {L("submit")}
              </button>
              <p className="text-center text-[11px] text-white/35">{L("privacy")} <a href="/confidentialite" target="_blank" className="underline hover:text-gold">{L("privacyLink")}</a>.</p>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

function Field({ placeholder, value, onChange, type = "text" }: { placeholder: string; value: string; onChange: (v: string) => void; type?: string }) {
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-white/10 bg-ink-soft px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-gold/50" />;
}

/** Ligne de FAQ (accordéon). */
function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-white/10 bg-ink-soft">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
        <span className="font-semibold text-white">{q}</span>
        <ChevronRight size={18} className="shrink-0 text-gold transition-transform" style={{ transform: open ? "rotate(90deg)" : "none" }} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="px-4 pb-4 text-sm leading-relaxed text-white/60">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
