/**
 * i18n LuxuryEvent (FR / NL / EN). Dictionnaire des textes d'interface + repli
 * automatique (langue demandée → EN → FR). Pur (client + serveur).
 */

export type Lang = "fr" | "nl" | "en";
export const LANGS: Lang[] = ["fr", "nl", "en"];
export const LANG_LABELS: Record<Lang, string> = { fr: "FR", nl: "NL", en: "EN" };

export const CONTACT = {
  home: "http://luxuryevent.be/",
  phoneDisplay: "+32 465 87 92 94",
  phoneTel: "+32465879294",
  whatsapp: "32465879294",
};

type T3 = { fr: string; nl?: string; en?: string };

export function t(m: T3, lang: string): string {
  const l = lang as Lang;
  return m[l] ?? m.en ?? m.fr;
}

/** Détecte la langue (URL ?lang / navigateur), repli FR. */
export function detectLang(): Lang {
  if (typeof window === "undefined") return "fr";
  const p = new URLSearchParams(window.location.search).get("lang");
  if (p && (LANGS as string[]).includes(p)) return p as Lang;
  const nav = (navigator.language || "").slice(0, 2);
  return (LANGS as string[]).includes(nav) ? (nav as Lang) : "fr";
}

export const UI: Record<string, T3> = {
  navHome: { fr: "Accueil", nl: "Home", en: "Home" },
  navCall: { fr: "Appeler", nl: "Bellen", en: "Call" },
  // Hero (défauts affichés en NL/EN)
  heroBadge: { fr: "Faites venir plus de clients dans vos magasins", nl: "Trek meer klanten naar uw winkels", en: "Bring more customers into your stores" },
  heroTitle: { fr: "Des événements qui transforment votre enseigne en destination.", nl: "Evenementen die uw winkel tot bestemming maken.", en: "Events that turn your store into a destination." },
  heroSub: { fr: "LuxuryEvent conçoit des animations promotionnelles sur-mesure pour les grandes enseignes. Composez votre événement idéal ci-dessous — on vous montre l'impact, puis on en discute.", nl: "LuxuryEvent ontwerpt promotionele animaties op maat voor grote retailketens. Stel hieronder uw ideale evenement samen — we tonen de impact en bespreken het samen.", en: "LuxuryEvent designs tailor-made promotional activations for major retail brands. Build your ideal event below — we show you the impact, then we talk." },
  statLine: { fr: "Plus de 129 événements réalisés en Belgique", nl: "Meer dan 129 evenementen gerealiseerd in België", en: "Over 129 events delivered across Belgium" },
  trustTitle: { fr: "Ils nous font confiance", nl: "Zij vertrouwen ons", en: "They trust us" },
  targetLabel: { fr: "Cible", nl: "Doelgroep", en: "Target" },
  targetAll: { fr: "Tout", nl: "Alles", en: "All" },
  targetTous: { fr: "Tous publics", nl: "Alle publiek", en: "All audiences" },
  targetEnfants: { fr: "Enfants", nl: "Kinderen", en: "Kids" },
  targetAdultes: { fr: "Adultes", nl: "Volwassenen", en: "Adults" },
  // Impact stats
  impTrafic: { fr: "Trafic", nl: "Verkeer", en: "Footfall" },
  impTraficD: { fr: "Plus de visiteurs en magasin", nl: "Meer bezoekers in de winkel", en: "More in-store visitors" },
  impVentes: { fr: "Ventes", nl: "Verkoop", en: "Sales" },
  impVentesD: { fr: "Plus d'achats & panier moyen", nl: "Meer aankopen & hogere mand", en: "More purchases & basket size" },
  impVisib: { fr: "Visibilité", nl: "Zichtbaarheid", en: "Visibility" },
  impVisibD: { fr: "Plus de présence en ligne", nl: "Meer online aanwezigheid", en: "More online presence" },
  impImage: { fr: "Image", nl: "Imago", en: "Image" },
  impImageD: { fr: "Une image de marque mémorable", nl: "Een memorabel merkimago", en: "A memorable brand image" },
  // Cartes
  learnMore: { fr: "En savoir plus", nl: "Meer weten", en: "Learn more" },
  learnMoreShort: { fr: "En savoir +", nl: "Meer +", en: "More +" },
  videoTag: { fr: "▶ Vidéo", nl: "▶ Video", en: "▶ Video" },
  addSel: { fr: "Sélection", nl: "Selectie", en: "Select" },
  added: { fr: "Ajouté", nl: "Toegevoegd", en: "Added" },
  add: { fr: "Ajouter", nl: "Toevoegen", en: "Add" },
  // Barre flottante
  composeTitle: { fr: "Compose ton événement", nl: "Stel je evenement samen", en: "Build your event" },
  composeSub: { fr: "Choisis les animations qui t'intéressent", nl: "Kies de animaties die je interesseren", en: "Pick the activations you like" },
  selectedOne: { fr: "animation sélectionnée", nl: "animatie geselecteerd", en: "activation selected" },
  selectedMany: { fr: "animations sélectionnées", nl: "animaties geselecteerd", en: "activations selected" },
  // Détail popup
  brandColorTitle: { fr: "100% aux couleurs de votre marque", nl: "100% in uw merkkleuren", en: "100% in your brand colors" },
  gainsTitle: { fr: "Ce que votre magasin y gagne", nl: "Wat uw winkel eraan wint", en: "What your store gains" },
  branding: { fr: "Tout le matériel est entièrement personnalisable aux couleurs de votre enseigne (habillage, logos, visuels). Nous imprimons aussi vos supports publicitaires (affiches, flyers, kakémonos, stickers) pour faire la promotion de l'événement en magasin et en ligne.", nl: "Al het materiaal is volledig personaliseerbaar in uw merkkleuren (bekleding, logo's, visuals). We drukken ook uw reclamedragers (affiches, flyers, banners, stickers) om het evenement in de winkel en online te promoten.", en: "All the equipment is fully customizable in your brand colors (wrapping, logos, visuals). We also print your advertising materials (posters, flyers, banners, stickers) to promote the event in-store and online." },
  // Gains par défaut
  gain1: { fr: "Plus de trafic : l'animation attire et fait entrer en magasin", nl: "Meer verkeer: de animatie trekt aan en brengt mensen binnen", en: "More footfall: the activation attracts and brings people in" },
  gain2: { fr: "Plus d'achats et un panier moyen en hausse", nl: "Meer aankopen en een hogere gemiddelde mand", en: "More purchases and a higher average basket" },
  gain3: { fr: "Plus de visibilité en ligne (photos, stories, avis)", nl: "Meer online zichtbaarheid (foto's, stories, reviews)", en: "More online visibility (photos, stories, reviews)" },
  gain4: { fr: "Un temps de visite prolongé en point de vente", nl: "Een langere verblijfsduur in de winkel", en: "A longer dwell time in store" },
  gain5: { fr: "Une image de marque premium et mémorable", nl: "Een premium en memorabel merkimago", en: "A premium, memorable brand image" },
  // FAQ
  faqTitle: { fr: "Questions fréquentes", nl: "Veelgestelde vragen", en: "Frequently asked questions" },
  // Formulaire d'intérêt
  interestTitle: { fr: "Ça vous intéresse ?", nl: "Interesse?", en: "Interested?" },
  interestSub: { fr: "Laissez vos coordonnées, on vous rappelle pour composer votre événement — sans engagement.", nl: "Laat uw gegevens achter, we bellen u terug om uw evenement samen te stellen — vrijblijvend.", en: "Leave your details, we'll call you back to build your event — no commitment." },
  fCompany: { fr: "Nom de l'enseigne / entreprise", nl: "Naam van de winkel / het bedrijf", en: "Store / company name" },
  fName: { fr: "Votre nom", nl: "Uw naam", en: "Your name" },
  fEmail: { fr: "E-mail professionnel", nl: "Professioneel e-mailadres", en: "Business email" },
  fPhone: { fr: "Téléphone", nl: "Telefoon", en: "Phone" },
  qualifTitle: { fr: "Pour aller plus vite (optionnel)", nl: "Om sneller te gaan (optioneel)", en: "To move faster (optional)" },
  fDate: { fr: "Date souhaitée", nl: "Gewenste datum", en: "Preferred date" },
  fCity: { fr: "Ville", nl: "Stad", en: "City" },
  fStores: { fr: "Nombre de magasins", nl: "Aantal winkels", en: "Number of stores" },
  fBudget: { fr: "Budget indicatif", nl: "Indicatief budget", en: "Indicative budget" },
  fMessage: { fr: "Votre projet, votre magasin… (optionnel)", nl: "Uw project, uw winkel… (optioneel)", en: "Your project, your store… (optional)" },
  submit: { fr: "Être recontacté", nl: "Word teruggebeld", en: "Get called back" },
  privacy: { fr: "Vos données restent confidentielles. Aucun engagement.", nl: "Uw gegevens blijven vertrouwelijk. Geen verplichting.", en: "Your data stays private. No commitment." },
  doneTitle: { fr: "Merci, c'est noté ! 🎉", nl: "Bedankt, genoteerd! 🎉", en: "Thanks, noted! 🎉" },
  doneSub: { fr: "Notre équipe LuxuryEvent vous recontacte très vite par e-mail ou téléphone pour construire votre événement.", nl: "Ons LuxuryEvent-team neemt snel contact met u op via e-mail of telefoon om uw evenement te bouwen.", en: "Our LuxuryEvent team will contact you shortly by email or phone to build your event." },
  close: { fr: "Fermer", nl: "Sluiten", en: "Close" },
  footerLegal: { fr: "Mentions légales & CGV", nl: "Juridische vermeldingen & AV", en: "Legal notice & Terms" },
  footerPrivacy: { fr: "Politique de confidentialité", nl: "Privacybeleid", en: "Privacy policy" },
  footerRights: { fr: "Tous droits réservés.", nl: "Alle rechten voorbehouden.", en: "All rights reserved." },
  privacyLink: { fr: "politique de confidentialité", nl: "privacybeleid", en: "privacy policy" },
  // Catégories
  cat_animations_t: { fr: "Animations phares", nl: "Topanimaties", en: "Flagship activations" },
  cat_animations_s: { fr: "Des concepts spectaculaires qui créent l'attroupement et l'attente devant votre enseigne.", nl: "Spectaculaire concepten die menigten en spanning creëren voor uw winkel.", en: "Spectacular concepts that draw crowds and buzz in front of your store." },
  cat_challenges_t: { fr: "Challenges", nl: "Challenges", en: "Challenges" },
  cat_challenges_s: { fr: "Des défis courts et compétitifs qui rassemblent la foule et récompensent l'achat.", nl: "Korte, competitieve uitdagingen die publiek verzamelen en aankopen belonen.", en: "Short, competitive challenges that gather crowds and reward purchases." },
  cat_dessert_t: { fr: "Stands Dessert", nl: "Dessertstanden", en: "Dessert stands" },
  cat_dessert_s: { fr: "L'odeur et la gourmandise qui font entrer — et rester — les visiteurs.", nl: "De geur en het lekkers die bezoekers binnenbrengen — en houden.", en: "The aroma and treats that bring visitors in — and keep them." },
  cat_food_t: { fr: "Stands Food", nl: "Foodstanden", en: "Food stands" },
  cat_food_s: { fr: "Le salé qui transforme une visite en moment, et un moment en achat.", nl: "Het hartige dat een bezoek in een moment verandert, en een moment in een aankoop.", en: "The savory that turns a visit into a moment, and a moment into a sale." },
};

/** FAQ B2B traduite (utilisée en NL/EN ; le FR éditable vient du dashboard). */
export const FAQ_I18N: Record<Lang, { q: string; a: string }[]> = {
  fr: [],
  nl: [
    { q: "Wat kunnen jullie precies organiseren?", a: "Absoluut alles, op maat. We ontwerpen het evenement volgens uw behoeften en budget, en kunnen het uitrollen in één winkel of in al uw vestigingen." },
    { q: "In welke regio's zijn jullie actief?", a: "Overal in België (en daarbuiten op aanvraag). Meer dan 129 evenementen al gerealiseerd voor grote ketens." },
    { q: "Is het materiaal in onze kleuren?", a: "Ja — alles is personaliseerbaar in uw merkkleuren. We drukken ook uw reclamedragers (affiches, flyers, banners, stickers) om het evenement in de winkel en online te promoten." },
    { q: "Hoe verloopt een project?", a: "U klikt op « Interesse », we bellen u terug, we bepalen samen behoeften, data en budget, we sturen een offerte en verzorgen de volledige logistiek op de dag zelf." },
    { q: "Welk budget moet ik voorzien?", a: "We passen ons aan elk budget aan — van één animatie tot een opstelling in meerdere winkels. Geef ons uw budget, wij bouwen de beste formule." },
    { q: "Hoelang op voorhand reserveren?", a: "Idealiter enkele weken voor een onberispelijke gebrande opstelling, maar we behandelen ook dringende aanvragen naargelang beschikbaarheid." },
  ],
  en: [
    { q: "What exactly can you organize?", a: "Absolutely anything, tailor-made. We design the event around your needs and budget, and can roll it out in a single store or across all your locations." },
    { q: "Which areas do you cover?", a: "Anywhere in Belgium (and beyond on request). Over 129 events already delivered for major brands." },
    { q: "Is the equipment in our colors?", a: "Yes — everything is customizable in your brand colors. We also print your advertising materials (posters, flyers, banners, stickers) to promote the event in-store and online." },
    { q: "How does a project work?", a: "You click « I'm interested », we call you back, we scope needs, dates and budget together, we send a quote, then we handle all the logistics on the day." },
    { q: "What budget should I plan for?", a: "We adapt to any budget — from a single activation to a multi-store setup. Tell us your envelope, we'll build the best formula for you." },
    { q: "How far in advance to book?", a: "Ideally a few weeks for a flawless branded setup, but we also handle more urgent requests depending on availability." },
  ],
};
