/**
 * Catalogue des animations événementielles LuxuryEvent (B2B enseignes).
 * Chaque item : nom, accroche, emoji, cible (enfants / adultes / tous) et un
 * bénéfice orienté « impact magasin ». Sert au configurateur d'intérêt.
 */

export type Target = "enfants" | "adultes" | "tous";

export interface EventItem {
  id: string;
  name: string;
  desc: string;
  emoji: string;
  target: Target[];
  impact: string; // bénéfice mis en avant
  usps: string[]; // arguments clés (badges)
}

export interface EventCategory {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  items: EventItem[];
}

export const TARGET_LABELS: Record<Target, string> = {
  enfants: "Enfants",
  adultes: "Adultes",
  tous: "Tous publics",
};

export const CATEGORIES: EventCategory[] = [
  {
    id: "animations",
    title: "Animations phares",
    subtitle: "Des concepts spectaculaires qui créent l'attroupement et l'attente devant votre enseigne.",
    emoji: "🎪",
    items: [
      { id: "jeu-concours", name: "Jeu concours", emoji: "🎟️", target: ["tous"], desc: "Tirage au sort avec lots de la marque, inscription sur place ou en ligne.", impact: "Capture des contacts qualifiés + relance client", usps: ["Capte des contacts", "Relance client", "Fort engagement", "100% brandé"] },
      { id: "boule-balle", name: "Boule à balle géante", emoji: "🟡", target: ["tous"], desc: "Structure géante spectaculaire aux couleurs de la marque, photo-génique.", impact: "Attroupement + contenu viral en magasin", usps: ["Spectaculaire", "Photogénique", "Attroupement", "100% brandé"] },
      { id: "roue-xxl", name: "Roue de la fortune XXL", emoji: "🎡", target: ["tous"], desc: "Roue géante, 100% de gagnants (bons, cadeaux, réductions enseigne).", impact: "Chaque passage = un achat déclenché", usps: ["100% de gagnants", "Déclenche l'achat", "Effet waouh", "100% brandé"] },
      { id: "cash-machine", name: "Cash Machine", emoji: "💸", target: ["adultes", "tous"], desc: "Cabine à billets/bons : attrape un maximum de bons d'achat en 30 s.", impact: "Sensation forte + panier moyen en hausse", usps: ["Sensation forte", "Panier moyen ↑", "File d'attente", "Viral"] },
      { id: "grappin", name: "Machine à grappin", emoji: "🕹️", target: ["enfants", "tous"], desc: "Machine à pince géante remplie de cadeaux brandés.", impact: "Fidélise les familles, temps passé en magasin", usps: ["Fidélise les familles", "Temps passé ↑", "Ludique", "100% brandé"] },
      { id: "photobooth-360", name: "Photobooth 360°", emoji: "📸", target: ["tous"], desc: "Vidéo 360° immersive, partage instantané aux couleurs de la marque.", impact: "Présence en ligne : posts & stories offerts", usps: ["Contenu viral", "Stories offertes", "Souvenir premium", "100% brandé"] },
      { id: "magazine-box", name: "Magazine Box", emoji: "🗞️", target: ["adultes", "tous"], desc: "Couverture de magazine personnalisée du visiteur avec la marque.", impact: "Souvenir premium partagé sur les réseaux", usps: ["Souvenir premium", "Partage réseaux", "Valorisant", "100% brandé"] },
      { id: "mascotte", name: "Mascotte", emoji: "🧸", target: ["enfants", "tous"], desc: "Mascotte costumée qui accueille, anime et distribue.", impact: "Ambiance chaleureuse, mémorable pour les enfants", usps: ["Accueil chaleureux", "Adorée des enfants", "Mémorable", "Sur-mesure"] },
      { id: "chateau-marque", name: "Château gonflable brandé", emoji: "🏰", target: ["enfants"], desc: "Structure gonflable aux couleurs de la marque, sécurisée.", impact: "Attire les familles, allonge le temps de visite", usps: ["Attire les familles", "Visibilité XXL", "Temps de visite ↑", "100% brandé"] },
      { id: "football-bulle", name: "Football bulle", emoji: "⚽", target: ["tous"], desc: "Match de football dans des bulles géantes gonflables : fun, spectaculaire et sans risque.", impact: "Attroupement garanti + contenu viral", usps: ["Spectaculaire", "Fun garanti", "Contenu viral", "100% brandé"] },
    ],
  },
  {
    id: "challenges",
    title: "Challenges",
    subtitle: "Des défis courts et compétitifs qui rassemblent la foule et récompensent l'achat.",
    emoji: "🏆",
    items: [
      { id: "tenir-barre", name: "Tenir la barre avec un poids", emoji: "💪", target: ["adultes", "tous"], desc: "Qui tient la barre le plus longtemps ? Classement du jour, lots à gagner.", impact: "Attroupement compétitif + retours quotidiens", usps: ["Compétitif", "Retours quotidiens", "Attroupement", "Fun"] },
      { id: "buzzer-10s", name: "Buzzer en 10 secondes", emoji: "⏱️", target: ["tous"], desc: "Réflexe & rapidité : buzz au bon moment pour gagner.", impact: "Animation rapide, fort débit de participants", usps: ["Rapide", "Fort débit", "Fun", "Tous publics"] },
      { id: "mur-reflexes", name: "Mur des réflexes", emoji: "💡", target: ["tous"], desc: "Mur géant de boutons lumineux : tape un maximum de lumières qui s'allument, chrono & classement du jour.", impact: "Compétitif et addictif, fort débit de participants", usps: ["Réflexes", "Compétitif", "Fort débit", "100% brandé"] },
    ],
  },
  {
    id: "dessert",
    title: "Stands Dessert",
    subtitle: "L'odeur et la gourmandise qui font entrer — et rester — les visiteurs.",
    emoji: "🍬",
    items: [
      { id: "popcorn", name: "Stand Pop-corn", emoji: "🍿", target: ["tous"], desc: "Pop-corn frais offert, cornet brandé.", impact: "Odeur qui attire, cadeau qui circule", usps: ["Odeur qui attire", "Cornet brandé", "Convivial", "Petit prix"] },
      { id: "barbe-papa", name: "Stand Barbe à papa", emoji: "🍭", target: ["enfants", "tous"], desc: "Barbe à papa colorée préparée en direct.", impact: "Photogénique, adoré des familles", usps: ["Photogénique", "Adorée des familles", "Gourmand", "Coloré"] },
      { id: "mocktails", name: "Stand Mocktails", emoji: "🍹", target: ["adultes"], desc: "Cocktails sans alcool signature aux couleurs de la marque.", impact: "Expérience premium, image haut de gamme", usps: ["Premium", "Image haut de gamme", "Instagrammable", "Signature marque"] },
      { id: "bonbons", name: "Stand Bonbons", emoji: "🍬", target: ["enfants", "tous"], desc: "Bar à bonbons en libre-service, sachets brandés.", impact: "Plaisir immédiat, forte circulation", usps: ["Plaisir immédiat", "Forte circulation", "Familles", "Sachets brandés"] },
      { id: "crepes", name: "Stand à Crêpes", emoji: "🥞", target: ["tous"], desc: "Crêpes chaudes préparées minute.", impact: "Convivialité, temps de présence prolongé", usps: ["Convivial", "Temps de présence ↑", "Gourmand", "Préparé minute"] },
      { id: "cafe", name: "Stand Café", emoji: "☕", target: ["adultes", "tous"], desc: "Bar à café (expresso, cappuccino, latte…) préparé minute, gobelet brandé.", impact: "Pause premium, image chaleureuse", usps: ["Pause premium", "Image chaleureuse", "Gobelet brandé", "Adultes"] },
    ],
  },
  {
    id: "food",
    title: "Stands Food",
    subtitle: "Le salé qui transforme une visite en moment, et un moment en achat.",
    emoji: "🍟",
    items: [
      { id: "sales", name: "Stand Salés", emoji: "🥨", target: ["tous"], desc: "Assortiment salé (bretzels, mini-quiches…) préparé sur place.", impact: "Pause gourmande, ancrage en magasin", usps: ["Pause gourmande", "Ancrage magasin", "Convivial", "Préparé sur place"] },
      { id: "frites", name: "Stand Frites", emoji: "🍟", target: ["tous"], desc: "Frites fraîches, cornet brandé.", impact: "Valeur sûre, forte affluence", usps: ["Valeur sûre", "Forte affluence", "Rapide", "Cornet brandé"] },
      { id: "hotdog", name: "Stand Hot-dog", emoji: "🌭", target: ["adultes", "tous"], desc: "Hot-dogs préparés minute.", impact: "Débit rapide, satisfaction immédiate", usps: ["Débit rapide", "Satisfaction", "Convivial", "Préparé minute"] },
      { id: "nachos", name: "Stand Nachos", emoji: "🧀", target: ["tous"], desc: "Nachos & sauces à partager.", impact: "Convivialité, moment de partage", usps: ["À partager", "Convivial", "Fun", "Gourmand"] },
    ],
  },
];

/** Retrouve un item par son id (toutes catégories). */
export function findEvent(id: string): EventItem | undefined {
  for (const c of CATEGORIES) {
    const it = c.items.find((x) => x.id === id);
    if (it) return it;
  }
  return undefined;
}

/** Bénéfices « impact magasin » affichés dans le hero. */
export const IMPACT_STATS = [
  { emoji: "🚶", label: "Plus de visiteurs en magasin", value: "Trafic" },
  { emoji: "🛍️", label: "Plus d'achats & panier moyen", value: "Ventes" },
  { emoji: "📲", label: "Plus de présence en ligne", value: "Visibilité" },
  { emoji: "💛", label: "Une image de marque mémorable", value: "Image" },
];
