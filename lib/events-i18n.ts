/**
 * Traductions NL/EN des animations (le FR vient de events-data.ts).
 * Résolution : localizedEvent(item, lang).
 */

import type { EventItem } from "./events-data";

interface LEvent {
  name: string;
  desc: string;
  impact: string;
  usps: string[];
}

const TR: Record<string, { nl: LEvent; en: LEvent }> = {
  "jeu-concours": {
    nl: { name: "Wedstrijd", desc: "Loting met prijzen van het merk, inschrijving ter plaatse of online.", impact: "Verzamelt gekwalificeerde contacten + klantopvolging", usps: ["Verzamelt contacten", "Klantopvolging", "Sterke betrokkenheid", "100% gebrand"] },
    en: { name: "Prize draw", desc: "Raffle with brand prizes, sign-up on-site or online.", impact: "Captures qualified leads + customer follow-up", usps: ["Captures leads", "Follow-up", "High engagement", "100% branded"] },
  },
  "boule-balle": {
    nl: { name: "Reuzenballenbol", desc: "Spectaculaire reuzenstructuur in uw merkkleuren, fotogeniek.", impact: "Menigte + virale content in de winkel", usps: ["Spectaculair", "Fotogeniek", "Trekt menigte", "100% gebrand"] },
    en: { name: "Giant ball dome", desc: "Spectacular giant structure in your brand colors, photogenic.", impact: "Crowds + viral in-store content", usps: ["Spectacular", "Photogenic", "Draws crowds", "100% branded"] },
  },
  "roue-xxl": {
    nl: { name: "Rad van fortuin XXL", desc: "Reuzenrad, 100% winnaars (bonnen, cadeaus, kortingen).", impact: "Elke beurt = een aankoop getriggerd", usps: ["100% winnaars", "Triggert aankoop", "Wow-effect", "100% gebrand"] },
    en: { name: "XXL wheel of fortune", desc: "Giant wheel, 100% winners (vouchers, gifts, discounts).", impact: "Every spin = a purchase triggered", usps: ["100% winners", "Triggers purchase", "Wow effect", "100% branded"] },
  },
  "cash-machine": {
    nl: { name: "Cash Machine", desc: "Cabine met biljetten/bonnen: vang zoveel mogelijk bonnen in 30 s.", impact: "Sterke sensatie + hogere gemiddelde mand", usps: ["Sterke sensatie", "Mand ↑", "Wachtrij", "Viraal"] },
    en: { name: "Cash Machine", desc: "Money/voucher booth: grab as many vouchers as you can in 30 s.", impact: "Big thrill + higher average basket", usps: ["Big thrill", "Basket ↑", "Queue", "Viral"] },
  },
  "grappin": {
    nl: { name: "Grijpmachine", desc: "Reuzengrijpmachine vol gebrande cadeaus.", impact: "Bindt gezinnen, langer in de winkel", usps: ["Bindt gezinnen", "Langer verblijf", "Speels", "100% gebrand"] },
    en: { name: "Claw machine", desc: "Giant claw machine filled with branded gifts.", impact: "Builds family loyalty, longer store time", usps: ["Family loyalty", "Longer stay", "Playful", "100% branded"] },
  },
  "photobooth-360": {
    nl: { name: "Photobooth 360°", desc: "Meeslepende 360°-video, direct delen in uw merkkleuren.", impact: "Online aanwezigheid: gratis posts & stories", usps: ["Virale content", "Gratis stories", "Premium souvenir", "100% gebrand"] },
    en: { name: "360° photobooth", desc: "Immersive 360° video, instant sharing in your brand colors.", impact: "Online presence: free posts & stories", usps: ["Viral content", "Free stories", "Premium keepsake", "100% branded"] },
  },
  "magazine-box": {
    nl: { name: "Magazine Box", desc: "Gepersonaliseerde magazinecover van de bezoeker met het merk.", impact: "Premium souvenir gedeeld op sociale media", usps: ["Premium souvenir", "Delen op social", "Waarderend", "100% gebrand"] },
    en: { name: "Magazine Box", desc: "Personalized magazine cover of the visitor with the brand.", impact: "Premium keepsake shared on social", usps: ["Premium keepsake", "Social sharing", "Flattering", "100% branded"] },
  },
  "mascotte": {
    nl: { name: "Mascotte", desc: "Verklede mascotte die verwelkomt, animeert en uitdeelt.", impact: "Warme sfeer, memorabel voor kinderen", usps: ["Warm onthaal", "Geliefd bij kinderen", "Memorabel", "Op maat"] },
    en: { name: "Mascot", desc: "Costumed mascot that welcomes, entertains and hands out.", impact: "Warm vibe, memorable for kids", usps: ["Warm welcome", "Kids love it", "Memorable", "Custom-made"] },
  },
  "chateau-marque": {
    nl: { name: "Gebrand springkasteel", desc: "Springkasteel in uw merkkleuren, beveiligd.", impact: "Trekt gezinnen, verlengt het bezoek", usps: ["Trekt gezinnen", "XXL-zichtbaarheid", "Langer bezoek", "100% gebrand"] },
    en: { name: "Branded bouncy castle", desc: "Inflatable castle in your brand colors, secured.", impact: "Attracts families, extends the visit", usps: ["Attracts families", "XXL visibility", "Longer visit", "100% branded"] },
  },
  "tenir-barre": {
    nl: { name: "Stang vasthouden met gewicht", desc: "Wie houdt de stang het langst vast? Dagklassement, prijzen.", impact: "Competitieve menigte + dagelijkse terugkeer", usps: ["Competitief", "Dagelijkse terugkeer", "Trekt menigte", "Fun"] },
    en: { name: "Hold the bar with a weight", desc: "Who holds the bar longest? Daily ranking, prizes to win.", impact: "Competitive crowd + daily returns", usps: ["Competitive", "Daily returns", "Draws crowds", "Fun"] },
  },
  "buzzer-10s": {
    nl: { name: "Buzzer in 10 seconden", desc: "Reflex & snelheid: buzz op het juiste moment om te winnen.", impact: "Snelle animatie, veel deelnemers", usps: ["Snel", "Hoog debiet", "Fun", "Alle publiek"] },
    en: { name: "Buzzer in 10 seconds", desc: "Reflex & speed: buzz at the right moment to win.", impact: "Fast activation, high participant flow", usps: ["Fast", "High flow", "Fun", "All audiences"] },
  },
  "football-bulle": {
    nl: { name: "Bubbelvoetbal", desc: "Voetbalmatch in reuzenopblaasbubbels: fun, spectaculair en zonder risico.", impact: "Gegarandeerde menigte + virale content", usps: ["Spectaculair", "Gegarandeerd fun", "Virale content", "100% gebrand"] },
    en: { name: "Bubble football", desc: "Football match inside giant inflatable bubbles: fun, spectacular and safe.", impact: "Guaranteed crowd + viral content", usps: ["Spectacular", "Guaranteed fun", "Viral content", "100% branded"] },
  },
  "cafe": {
    nl: { name: "Koffiestand", desc: "Koffiebar (espresso, cappuccino, latte…) vers bereid, gebrande beker.", impact: "Premium pauze, warm imago", usps: ["Premium pauze", "Warm imago", "Gebrande beker", "Volwassenen"] },
    en: { name: "Coffee stand", desc: "Coffee bar (espresso, cappuccino, latte…) made to order, branded cup.", impact: "Premium break, warm image", usps: ["Premium break", "Warm image", "Branded cup", "Adults"] },
  },
  "mur-reflexes": {
    nl: { name: "Reflexmuur", desc: "Reuzenmuur met verlichte knoppen: sla zoveel mogelijk oplichtende lichten, chrono & dagklassement.", impact: "Competitief en verslavend, hoog deelnemersdebiet", usps: ["Reflexen", "Competitief", "Hoog debiet", "100% gebrand"] },
    en: { name: "Reflex wall", desc: "Giant wall of lit-up buttons: hit as many lights as you can, timer & daily ranking.", impact: "Competitive and addictive, high participant flow", usps: ["Reflexes", "Competitive", "High flow", "100% branded"] },
  },
  "popcorn": {
    nl: { name: "Popcornstand", desc: "Verse popcorn gratis, gebrand zakje.", impact: "Geur die aantrekt, cadeau dat circuleert", usps: ["Geur trekt aan", "Gebrand zakje", "Gezellig", "Lage kost"] },
    en: { name: "Popcorn stand", desc: "Free fresh popcorn, branded cone.", impact: "Aroma that attracts, gift that circulates", usps: ["Aroma attracts", "Branded cone", "Convivial", "Low cost"] },
  },
  "barbe-papa": {
    nl: { name: "Suikerspinstand", desc: "Kleurrijke suikerspin live bereid.", impact: "Fotogeniek, geliefd bij gezinnen", usps: ["Fotogeniek", "Geliefd bij gezinnen", "Lekker", "Kleurrijk"] },
    en: { name: "Cotton candy stand", desc: "Colorful cotton candy made live.", impact: "Photogenic, loved by families", usps: ["Photogenic", "Families love it", "Tasty", "Colorful"] },
  },
  "mocktails": {
    nl: { name: "Mocktailbar", desc: "Alcoholvrije signatuurcocktails in uw merkkleuren.", impact: "Premium ervaring, hoogstaand imago", usps: ["Premium", "Hoogstaand imago", "Instagrammable", "Merksignatuur"] },
    en: { name: "Mocktail bar", desc: "Alcohol-free signature cocktails in your brand colors.", impact: "Premium experience, upscale image", usps: ["Premium", "Upscale image", "Instagrammable", "Brand signature"] },
  },
  "bonbons": {
    nl: { name: "Snoepstand", desc: "Snoepbar in zelfbediening, gebrande zakjes.", impact: "Onmiddellijk plezier, sterke circulatie", usps: ["Direct plezier", "Sterke circulatie", "Gezinnen", "Gebrande zakjes"] },
    en: { name: "Candy stand", desc: "Self-service candy bar, branded bags.", impact: "Instant delight, strong circulation", usps: ["Instant delight", "Strong flow", "Families", "Branded bags"] },
  },
  "crepes": {
    nl: { name: "Crêpestand", desc: "Warme crêpes vers bereid.", impact: "Gezelligheid, langere verblijfsduur", usps: ["Gezellig", "Langer verblijf", "Lekker", "Vers bereid"] },
    en: { name: "Crêpe stand", desc: "Warm crêpes made to order.", impact: "Conviviality, longer dwell time", usps: ["Convivial", "Longer stay", "Tasty", "Made to order"] },
  },
  "sales": {
    nl: { name: "Hartige stand", desc: "Hartig assortiment (pretzels, mini-quiches…) ter plaatse bereid.", impact: "Lekkere pauze, verankering in de winkel", usps: ["Lekkere pauze", "Winkelverankering", "Gezellig", "Ter plaatse bereid"] },
    en: { name: "Savory stand", desc: "Savory assortment (pretzels, mini-quiches…) made on-site.", impact: "Tasty break, in-store anchoring", usps: ["Tasty break", "Store anchoring", "Convivial", "Made on-site"] },
  },
  "frites": {
    nl: { name: "Frietstand", desc: "Verse frieten, gebrande puntzak.", impact: "Vaste waarde, sterke toeloop", usps: ["Vaste waarde", "Sterke toeloop", "Snel", "Gebrande puntzak"] },
    en: { name: "Fries stand", desc: "Fresh fries, branded cone.", impact: "Safe bet, strong footfall", usps: ["Safe bet", "Strong footfall", "Fast", "Branded cone"] },
  },
  "hotdog": {
    nl: { name: "Hotdogstand", desc: "Hotdogs vers bereid.", impact: "Snel debiet, onmiddellijke tevredenheid", usps: ["Snel debiet", "Tevredenheid", "Gezellig", "Vers bereid"] },
    en: { name: "Hot-dog stand", desc: "Hot-dogs made to order.", impact: "Fast flow, instant satisfaction", usps: ["Fast flow", "Satisfaction", "Convivial", "Made to order"] },
  },
  "nachos": {
    nl: { name: "Nachostand", desc: "Nachos & sausjes om te delen.", impact: "Gezelligheid, deelmoment", usps: ["Om te delen", "Gezellig", "Fun", "Lekker"] },
    en: { name: "Nachos stand", desc: "Nachos & sauces to share.", impact: "Conviviality, sharing moment", usps: ["To share", "Convivial", "Fun", "Tasty"] },
  },
};

/** Renvoie l'animation localisée (FR = données d'origine). */
export function localizedEvent(item: EventItem, lang: string): { name: string; desc: string; impact: string; usps: string[] } {
  if (lang === "nl" && TR[item.id]) return TR[item.id].nl;
  if (lang === "en" && TR[item.id]) return TR[item.id].en;
  return { name: item.name, desc: item.desc, impact: item.impact, usps: item.usps };
}
