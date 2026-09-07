import type { Metadata, Viewport } from "next";
import "./globals.css";
import TrackingScripts from "@/components/TrackingScripts";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "LuxuryEvent — Événements B2B pour enseignes",
  description:
    "Faites venir plus de clients en magasin. LuxuryEvent conçoit des événements promotionnels sur-mesure pour les grandes enseignes : jeux, stands, animations. Composez le vôtre.",
  keywords: [
    "animation magasin Belgique",
    "animation commerciale enseigne",
    "événement promotionnel magasin",
    "animation point de vente",
    "stand animation retail",
    "événementiel enseigne Belgique",
    "LuxuryEvent",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "LuxuryEvent",
    title: "Événements promotionnels pour enseignes — LuxuryEvent",
    description: "Plus de visiteurs, plus d'achats, plus de présence en ligne. Composez votre événement.",
    images: [{ url: "/og.png", width: 1024, height: 739, alt: "LuxuryEvent" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Événements promotionnels pour enseignes — LuxuryEvent",
    description: "Plus de visiteurs, plus d'achats, plus de présence en ligne.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#09090c",
  width: "device-width",
  initialScale: 1,
};

// Régénère le HTML périodiquement pour refléter les pixels/tracking réglés
// dans le dashboard sans redéploiement (ISR).
export const revalidate = 60;

// Données structurées (SEO / rich results) — entreprise locale en Belgique.
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "LuxuryEvent",
  description: "Événements et animations promotionnelles sur-mesure pour enseignes et magasins en Belgique.",
  url: SITE_URL,
  image: `${SITE_URL}/og.png`,
  telephone: "+32465879294",
  priceRange: "€€€",
  areaServed: { "@type": "Country", name: "Belgique" },
  knowsLanguage: ["fr", "nl", "en"],
  sameAs: ["http://luxuryevent.be/"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
        <TrackingScripts />
      </head>
      <body className="font-sans antialiased overflow-x-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
