import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://luxuryevent.example").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "LuxuryEvent — Événements B2B pour enseignes",
  description:
    "Faites venir plus de clients en magasin. LuxuryEvent conçoit des événements promotionnels sur-mesure pour les grandes enseignes : jeux, stands, animations. Composez le vôtre.",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased overflow-x-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
