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
  options?: string[];
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
  "trampoline": {
    nl: { name: "Trampoline", desc: "Gebrande springstructuur / trampoline, beveiligd: sensatie en fun gegarandeerd.", impact: "Trekt gezinnen, verlengt het bezoek", usps: ["Trekt gezinnen", "Gegarandeerd fun", "Langer bezoek", "100% gebrand"] },
    en: { name: "Trampoline", desc: "Branded jumping structure / trampoline, secured: thrills and fun guaranteed.", impact: "Attracts families, extends the visit", usps: ["Attracts families", "Guaranteed fun", "Longer visit", "100% branded"] },
  },
  "attrape-baton": {
    nl: { name: "Vang de stok", desc: "Pure reflex: vang de vallende stok voor hij de grond raakt. Chrono & dagklassement.", impact: "Snelle en verslavende uitdaging, hoog debiet", usps: ["Reflexen", "Snel", "Competitief", "Fun"] },
    en: { name: "Catch the stick", desc: "Pure reflex: catch the falling stick before it hits the ground. Timer & daily ranking.", impact: "Fast, addictive challenge, high flow", usps: ["Reflexes", "Fast", "Competitive", "Fun"] },
  },
  "cafe": {
    nl: { name: "Koffiestand", desc: "Koffiebar (espresso, cappuccino, latte…) vers bereid, gebrande beker.", impact: "Premium pauze, warm imago", usps: ["Premium pauze", "Warm imago", "Gebrande beker", "Volwassenen"] },
    en: { name: "Coffee stand", desc: "Coffee bar (espresso, cappuccino, latte…) made to order, branded cup.", impact: "Premium break, warm image", usps: ["Premium break", "Warm image", "Branded cup", "Adults"] },
  },
  "tiramisu": {
    nl: { name: "Reuzen Tiramisu", desc: "Reuzentiramisu uitgedeeld in individuele potjes in uw merkkleuren.", impact: "Premium lekkernij + gebrande potjes die circuleren", usps: ["Premium", "Gebrande potjes", "Lekker", "Fotogeniek"] },
    en: { name: "Giant Tiramisu", desc: "Giant tiramisu served in individual pots in your brand colors.", impact: "Premium treat + branded pots that circulate", usps: ["Premium", "Branded pots", "Tasty", "Photogenic"] },
  },
  "food-truck": {
    nl: { name: "Food Truck", desc: "Een gebrande food truck voor uw winkel, met de keuken van uw keuze — vers bereid.", impact: "Complete beleving: trekt aan, verwent en houdt mensen in de winkel", usps: ["100% gebrand", "Keuken naar keuze", "Sterke toeloop", "Premium beleving"], options: ["Aziatisch", "Burger", "Hot-dog", "Pasta", "Tacos", "Bagels", "Friet", "Vegetarisch"] },
    en: { name: "Food Truck", desc: "A branded food truck outside your store, with the cuisine of your choice — made to order.", impact: "Full experience: attracts, delights and keeps people in store", usps: ["100% branded", "Cuisine of choice", "Strong footfall", "Premium experience"], options: ["Asian", "Burger", "Hot-dog", "Pasta", "Tacos", "Bagels", "Fries", "Vegetarian"] },
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

/** « Ce que votre magasin y gagne » — propre à CHAQUE animation (FR/NL/EN). */
const GAINS: Record<string, { fr: string[]; nl: string[]; en: string[] }> = {
  "jeu-concours": { fr: ["Constitue une base de contacts clients", "Fait revenir les participants (annonce des gagnants)", "Booste vos réseaux et votre newsletter"], nl: ["Bouwt een klantendatabase op", "Doet deelnemers terugkeren (winnaars bekendmaken)", "Boost uw social media en nieuwsbrief"], en: ["Builds a customer contact base", "Brings participants back (winner announcements)", "Boosts your socials and newsletter"] },
  "boule-balle": { fr: ["Crée un point de rassemblement spectaculaire", "Génère des photos partagées spontanément", "Renforce une image de marque moderne"], nl: ["Creëert een spectaculair verzamelpunt", "Genereert spontaan gedeelde foto's", "Versterkt een modern merkimago"], en: ["Creates a spectacular gathering point", "Generates spontaneously shared photos", "Reinforces a modern brand image"] },
  "roue-xxl": { fr: ["Transforme chaque passage en achat (bon en magasin)", "Crée une file qui attire d'autres visiteurs", "Écoule vos stocks via des offres ciblées"], nl: ["Zet elke beurt om in een aankoop (bon in de winkel)", "Creëert een rij die andere bezoekers aantrekt", "Ruimt voorraad op via gerichte aanbiedingen"], en: ["Turns each spin into a purchase (in-store voucher)", "Creates a queue that draws more visitors", "Clears stock via targeted offers"] },
  "cash-machine": { fr: ["Fait grimper le panier moyen (bons à dépenser sur place)", "Crée un buzz et une file d'attente", "Génère des vidéos virales"], nl: ["Verhoogt de gemiddelde mand (bonnen ter plaatse)", "Creëert buzz en een wachtrij", "Genereert virale video's"], en: ["Raises the average basket (vouchers to spend on-site)", "Creates buzz and a queue", "Generates viral videos"] },
  "grappin": { fr: ["Fidélise les familles qui reviennent tenter leur chance", "Allonge le temps passé en magasin", "Distribue vos goodies de façon ludique"], nl: ["Bindt gezinnen die terugkomen om hun kans te wagen", "Verlengt de tijd in de winkel", "Deelt uw goodies speels uit"], en: ["Builds loyalty with families who return to try again", "Extends time spent in store", "Hands out your goodies playfully"] },
  "photobooth-360": { fr: ["Multiplie votre visibilité en ligne (stories partagées)", "Offre un souvenir premium à vos visiteurs", "Associe la marque à un moment fun"], nl: ["Vermenigvuldigt uw online zichtbaarheid (gedeelde stories)", "Biedt bezoekers een premium souvenir", "Verbindt het merk aan een leuk moment"], en: ["Multiplies your online visibility (shared stories)", "Gives visitors a premium keepsake", "Ties the brand to a fun moment"] },
  "magazine-box": { fr: ["Valorise le visiteur (effet « star »)", "Génère des partages fiers sur les réseaux", "Renforce une image premium"], nl: ["Waardeert de bezoeker op (« ster »-effect)", "Genereert trotse shares op social", "Versterkt een premium imago"], en: ["Flatters the visitor (« star » effect)", "Generates proud social shares", "Reinforces a premium image"] },
  "mascotte": { fr: ["Crée un accueil chaleureux et mémorable", "Rassure et attire les familles", "Anime et oriente le flux en magasin"], nl: ["Creëert een warm en memorabel onthaal", "Stelt gerust en trekt gezinnen aan", "Animeert en stuurt de stroom in de winkel"], en: ["Creates a warm, memorable welcome", "Reassures and attracts families", "Animates and guides in-store flow"] },
  "chateau-marque": { fr: ["Attire massivement les familles", "Allonge le temps de visite des parents", "Offre une visibilité XXL aux couleurs de la marque"], nl: ["Trekt massaal gezinnen aan", "Verlengt het bezoek van de ouders", "Biedt XXL-zichtbaarheid in uw merkkleuren"], en: ["Massively attracts families", "Extends parents' visit time", "Offers XXL visibility in your brand colors"] },
  "football-bulle": { fr: ["Rassemble une foule autour du terrain", "Génère un contenu vidéo très partageable", "Crée un événement dont on parle localement"], nl: ["Verzamelt een menigte rond het veld", "Genereert zeer deelbare video-content", "Creëert een lokaal besproken evenement"], en: ["Gathers a crowd around the pitch", "Generates highly shareable video", "Creates a locally talked-about event"] },
  "trampoline": { fr: ["Attire les enfants (et donc les parents)", "Prolonge la durée de visite", "Anime l'espace avec de l'énergie positive"], nl: ["Trekt kinderen aan (en dus ouders)", "Verlengt de bezoekduur", "Animeert de ruimte met positieve energie"], en: ["Attracts kids (and therefore parents)", "Extends visit duration", "Animates the space with positive energy"] },
  "tenir-barre": { fr: ["Crée un attroupement compétitif", "Fait revenir les challengers chaque jour", "Récompense l'achat via les lots"], nl: ["Creëert een competitieve menigte", "Doet challengers dagelijks terugkeren", "Beloont aankopen via prijzen"], en: ["Creates a competitive crowd", "Brings challengers back daily", "Rewards purchases via prizes"] },
  "buzzer-10s": { fr: ["Anime un flux rapide de participants", "Crée une ambiance dynamique et fun", "Distribue des récompenses liées à l'achat"], nl: ["Animeert een snelle stroom deelnemers", "Creëert een dynamische, leuke sfeer", "Deelt beloningen uit gekoppeld aan aankoop"], en: ["Drives a fast flow of participants", "Creates a dynamic, fun atmosphere", "Hands out purchase-linked rewards"] },
  "mur-reflexes": { fr: ["Addictif : les gens rejouent et restent", "Crée un classement qui fait revenir", "Anime l'espace avec énergie"], nl: ["Verslavend: mensen spelen opnieuw en blijven", "Creëert een klassement dat doet terugkeren", "Animeert de ruimte met energie"], en: ["Addictive: people replay and stay", "Creates a ranking that brings them back", "Animates the space with energy"] },
  "attrape-baton": { fr: ["Défi rapide qui capte l'attention", "Fort débit de participants", "Ambiance fun et compétitive"], nl: ["Snelle uitdaging die de aandacht vangt", "Hoog deelnemersdebiet", "Leuke en competitieve sfeer"], en: ["Fast challenge that grabs attention", "High participant throughput", "Fun, competitive atmosphere"] },
  "popcorn": { fr: ["L'odeur attire et fait entrer en magasin", "Le cornet brandé circule dans la zone", "Crée une ambiance conviviale"], nl: ["De geur trekt aan en brengt binnen", "Het gebrande zakje circuleert in de zone", "Creëert een gezellige sfeer"], en: ["The aroma attracts and brings people in", "The branded cone circulates around", "Creates a convivial vibe"] },
  "barbe-papa": { fr: ["Ravit les familles (moment gourmand)", "Très photogénique → partages réseaux", "Associe la marque à un plaisir sucré"], nl: ["Verrukt gezinnen (lekker moment)", "Zeer fotogeniek → shares op social", "Verbindt het merk aan een zoet plezier"], en: ["Delights families (sweet moment)", "Very photogenic → social shares", "Ties the brand to a sweet treat"] },
  "mocktails": { fr: ["Renforce une image premium", "Crée une pause qualitative en magasin", "Génère du contenu Instagrammable"], nl: ["Versterkt een premium imago", "Creëert een kwalitatieve pauze", "Genereert Instagram-waardige content"], en: ["Reinforces a premium image", "Creates a quality in-store break", "Generates Instagrammable content"] },
  "bonbons": { fr: ["Plaisir immédiat qui attire petits et grands", "Sachets brandés qui circulent", "Forte circulation autour du stand"], nl: ["Direct plezier voor jong en oud", "Gebrande zakjes die circuleren", "Sterke circulatie rond de stand"], en: ["Instant delight for young and old", "Branded bags that circulate", "Strong flow around the stand"] },
  "crepes": { fr: ["Prolonge le temps de présence", "Crée un moment convivial et gourmand", "Attire par l'odeur et la préparation minute"], nl: ["Verlengt de verblijfsduur", "Creëert een gezellig, lekker moment", "Trekt aan door geur en verse bereiding"], en: ["Extends dwell time", "Creates a convivial, tasty moment", "Attracts with aroma and fresh prep"] },
  "cafe": { fr: ["Offre une pause premium et chaleureuse", "Valorise l'image de l'enseigne", "Gobelet brandé qui circule"], nl: ["Biedt een premium, warme pauze", "Waardeert het imago van de winkel op", "Gebrande beker die circuleert"], en: ["Offers a premium, warm break", "Elevates the store's image", "Branded cup that circulates"] },
  "tiramisu": { fr: ["Effet « waouh » gourmand et premium", "Pots brandés emportés → visibilité prolongée", "Très photogénique"], nl: ["« Wow »-effect, lekker en premium", "Meegenomen gebrande potjes → langere zichtbaarheid", "Zeer fotogeniek"], en: ["Gourmet, premium « wow » effect", "Branded pots taken away → extended visibility", "Very photogenic"] },
  "sales": { fr: ["Crée une pause gourmande qui ancre en magasin", "Convivialité qui prolonge la visite", "Préparation minute qui attire l'œil"], nl: ["Creëert een lekkere pauze die verankert", "Gezelligheid die het bezoek verlengt", "Verse bereiding die de aandacht trekt"], en: ["Creates a tasty break that anchors people", "Conviviality that extends the visit", "Fresh prep that catches the eye"] },
  "frites": { fr: ["Valeur sûre à forte affluence", "Cornet brandé qui circule", "Débit rapide, satisfaction immédiate"], nl: ["Vaste waarde met veel toeloop", "Gebrande puntzak die circuleert", "Snel debiet, directe voldoening"], en: ["Safe bet with strong footfall", "Branded cone that circulates", "Fast flow, instant satisfaction"] },
  "hotdog": { fr: ["Débit rapide pour un flux important", "Satisfaction gourmande immédiate", "Ambiance conviviale"], nl: ["Snel debiet voor een grote stroom", "Directe lekkere voldoening", "Gezellige sfeer"], en: ["Fast flow for high volume", "Instant tasty satisfaction", "Convivial atmosphere"] },
  "nachos": { fr: ["Moment de partage convivial", "Attire les groupes et les familles", "Ambiance fun et gourmande"], nl: ["Gezellig deelmoment", "Trekt groepen en gezinnen aan", "Leuke, lekkere sfeer"], en: ["Convivial sharing moment", "Attracts groups and families", "Fun, tasty atmosphere"] },
  "food-truck": { fr: ["Expérience complète qui fait rester en magasin", "Forte affluence toute la journée", "Visibilité XXL du camion brandé"], nl: ["Complete beleving die mensen doet blijven", "Sterke toeloop de hele dag", "XXL-zichtbaarheid van de gebrande truck"], en: ["Full experience that keeps people in store", "Strong footfall all day", "XXL visibility from the branded truck"] },
};

/** Gains propres à une animation (repli FR si langue absente, [] si inconnu). */
export function eventGains(id: string, lang: string): string[] {
  const g = GAINS[id];
  if (!g) return [];
  if (lang === "nl") return g.nl;
  if (lang === "en") return g.en;
  return g.fr;
}

/** Renvoie l'animation localisée (FR = données d'origine). */
export function localizedEvent(item: EventItem, lang: string): { name: string; desc: string; impact: string; usps: string[]; options?: string[] } {
  if (lang === "nl" && TR[item.id]) return { ...TR[item.id].nl, options: TR[item.id].nl.options ?? item.options };
  if (lang === "en" && TR[item.id]) return { ...TR[item.id].en, options: TR[item.id].en.options ?? item.options };
  return { name: item.name, desc: item.desc, impact: item.impact, usps: item.usps, options: item.options };
}
