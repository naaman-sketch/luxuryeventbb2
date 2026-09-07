/**
 * Contenu éditable du site (textes, images, vidéos) — surcharge les valeurs par
 * défaut via un JSON stocké dans les Paramètres Airtable (clé `content`).
 * Sans Airtable, on sert les valeurs par défaut. Serveur + client (types).
 */

import { CATEGORIES } from "./events-data";

/** Contenu d'une animation (surcharge éditable). */
export interface AnimationContent {
  long?: string; // description détaillée (popup)
  images?: string[]; // URLs d'images
  video?: string; // URL vidéo (mp4 ou embed)
  usps?: string[]; // badges d'arguments (surcharge ceux par défaut)
  price?: number; // prix « à partir de » (€) — surcharge le prix par défaut
  hidden?: boolean; // masquée sur le site public
  order?: number; // ordre d'affichage (plus petit = en premier)
}

export interface FaqItem {
  q: string;
  a: string;
}

/** Pixels & outils de tracking (injectés dans le <head> du site public). */
export interface TrackingConfig {
  metaPixelId?: string; // Meta / Facebook Pixel — ex. 123456789012345
  ga4Id?: string; // Google Analytics 4 — ex. G-XXXXXXX
  googleAdsId?: string; // Google Ads (gtag conversions) — ex. AW-XXXXXXX
  tiktokPixelId?: string; // TikTok Pixel — ex. Cxxxxxxxxxxxxxxx
  gtmId?: string; // Google Tag Manager (pour tout le reste) — ex. GTM-XXXXXX
}

export interface SiteContent {
  heroBadge: string;
  heroTitle: string;
  heroSub: string;
  statLine: string; // ex. « Plus de 129 événements réalisés en Belgique »
  branding: string; // message « matériel brandé + supports pub », montré dans chaque popup
  ctaInterest: string; // libellé du CTA
  brands: string[]; // marques défilantes (preuve sociale)
  gains: string[]; // « Ce que votre magasin y gagne » (affiché dans chaque popup)
  faq: FaqItem[]; // questions/réponses B2B
  storyVideo: Record<string, string>; // vidéo « story » par langue { fr, nl, en }
  tracking: TrackingConfig; // pixels & analytics
  animations: Record<string, AnimationContent>;
}

/** Message par défaut mis en avant dans chaque pop-up. */
export const BRANDING_DEFAULT =
  "Tout le matériel est entièrement personnalisable aux couleurs de votre enseigne (habillage, logos, visuels). Nous imprimons aussi vos supports publicitaires (affiches, flyers, kakémonos, stickers) pour faire la promotion de l'événement en magasin et en ligne.";

export const BRANDS_DEFAULT = ["Maniet Luxus", "Bershka", "Pull & Bear", "The Luxury Box", "Massimo Dutti"];

export const GAINS_DEFAULT = [
  "Plus de trafic : l'animation attire et fait entrer en magasin",
  "Plus d'achats et un panier moyen en hausse",
  "Plus de visibilité en ligne (photos, stories, avis)",
  "Un temps de visite prolongé en point de vente",
  "Une image de marque premium et mémorable",
];

export const FAQ_DEFAULT: FaqItem[] = [
  { q: "Que pouvez-vous organiser exactement ?", a: "Absolument tout, sur-mesure. On conçoit l'événement selon vos besoins et votre budget, et on peut le déployer dans un seul magasin comme dans l'ensemble de vos établissements." },
  { q: "Dans quelles zones intervenez-vous ?", a: "Partout en Belgique (et au-delà sur demande). Plus de 129 événements déjà réalisés pour de grandes enseignes." },
  { q: "Le matériel est-il à nos couleurs ?", a: "Oui — tout est personnalisable aux couleurs de votre enseigne. On imprime aussi vos supports publicitaires (affiches, flyers, kakémonos, stickers) pour promouvoir l'événement en magasin et en ligne." },
  { q: "Comment se déroule un projet ?", a: "Vous cliquez « Ça m'intéresse », on vous rappelle, on cadre ensemble besoins, dates et budget, on vous envoie un devis, puis on gère toute la logistique le jour J." },
  { q: "Quel budget faut-il prévoir ?", a: "On s'adapte à tous les budgets — d'une animation unique à un dispositif multi-magasins. Indiquez-nous votre enveloppe, on construit la meilleure formule pour vous." },
  { q: "Combien de temps à l'avance faut-il réserver ?", a: "Idéalement quelques semaines pour préparer un dispositif brandé impeccable, mais on gère aussi les demandes plus urgentes selon nos disponibilités." },
];

export function defaultContent(): SiteContent {
  return {
    heroBadge: "Faites venir plus de clients dans vos magasins",
    heroTitle: "Des événements qui transforment votre enseigne en destination.",
    heroSub:
      "LuxuryEvent conçoit des animations promotionnelles sur-mesure pour les grandes enseignes. Composez votre événement idéal ci-dessous — on vous montre l'impact, puis on en discute.",
    statLine: "Plus de 129 événements réalisés en Belgique",
    branding: BRANDING_DEFAULT,
    ctaInterest: "Ça m'intéresse",
    brands: [...BRANDS_DEFAULT],
    gains: [...GAINS_DEFAULT],
    faq: FAQ_DEFAULT.map((f) => ({ ...f })),
    storyVideo: {},
    tracking: {},
    animations: {},
  };
}

/** Nettoie un identifiant de pixel/tag (caractères sûrs uniquement). */
function cleanId(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim().replace(/[^A-Za-z0-9_-]/g, "").slice(0, 40);
  return s || undefined;
}

/** Parse la config de tracking (identifiants seulement, jamais de HTML brut). */
export function parseTracking(v: unknown): TrackingConfig {
  if (!v || typeof v !== "object") return {};
  const x = v as Record<string, unknown>;
  return {
    metaPixelId: cleanId(x.metaPixelId),
    ga4Id: cleanId(x.ga4Id),
    googleAdsId: cleanId(x.googleAdsId),
    tiktokPixelId: cleanId(x.tiktokPixelId),
    gtmId: cleanId(x.gtmId),
  };
}

/** Liste des ids d'animations (pour l'admin). */
export function allAnimationIds(): { id: string; name: string; category: string }[] {
  const out: { id: string; name: string; category: string }[] = [];
  for (const c of CATEGORIES) for (const it of c.items) out.push({ id: it.id, name: it.name, category: c.title });
  return out;
}

/** Parse + fusionne le JSON de contenu sur les valeurs par défaut. */
export function parseContent(raw: string | null | undefined): SiteContent {
  const base = defaultContent();
  if (!raw) return base;
  try {
    const o = JSON.parse(raw) as Partial<SiteContent>;
    const animations: Record<string, AnimationContent> = {};
    if (o.animations && typeof o.animations === "object") {
      for (const [id, v] of Object.entries(o.animations)) {
        if (!v || typeof v !== "object") continue;
        const x = v as AnimationContent;
        animations[id] = {
          long: typeof x.long === "string" ? x.long : undefined,
          images: Array.isArray(x.images) ? x.images.map(String).filter(Boolean) : undefined,
          video: typeof x.video === "string" && x.video.trim() ? x.video.trim() : undefined,
          usps: Array.isArray(x.usps) ? x.usps.map(String).map((s) => s.trim()).filter(Boolean) : undefined,
          price: typeof x.price === "number" && x.price >= 0 ? x.price : undefined,
          hidden: x.hidden === true ? true : undefined,
          order: typeof x.order === "number" && Number.isFinite(x.order) ? x.order : undefined,
        };
      }
    }
    const brands = Array.isArray(o.brands) ? o.brands.map((b) => String(b).trim()).filter(Boolean) : base.brands;
    const gains = Array.isArray(o.gains) ? o.gains.map((g) => String(g).trim()).filter(Boolean) : base.gains;
    const storyVideo: Record<string, string> = {};
    if (o.storyVideo && typeof o.storyVideo === "object") {
      for (const [lg, v] of Object.entries(o.storyVideo as Record<string, unknown>)) {
        if (typeof v === "string" && v.trim()) storyVideo[lg] = v.trim();
      }
    }
    const faq = Array.isArray(o.faq)
      ? o.faq.filter((f) => f && typeof f === "object" && String((f as FaqItem).q ?? "").trim()).map((f) => ({ q: String((f as FaqItem).q).trim(), a: String((f as FaqItem).a ?? "").trim() }))
      : base.faq;
    return {
      heroBadge: o.heroBadge?.trim() || base.heroBadge,
      heroTitle: o.heroTitle?.trim() || base.heroTitle,
      heroSub: o.heroSub?.trim() || base.heroSub,
      statLine: o.statLine?.trim() || base.statLine,
      branding: o.branding?.trim() || base.branding,
      ctaInterest: o.ctaInterest?.trim() || base.ctaInterest,
      brands: brands.length ? brands : base.brands,
      gains: gains.length ? gains : base.gains,
      faq: faq.length ? faq : base.faq,
      storyVideo,
      tracking: parseTracking(o.tracking),
      animations,
    };
  } catch {
    return base;
  }
}
