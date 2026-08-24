import Link from "next/link";

/** Rendu d'un document légal (texte brut) avec titres et paragraphes. */
export function LegalDoc({ title, text }: { title: string; text: string }) {
  const lines = text.split("\n");
  return (
    <main className="min-h-screen bg-ink text-[#f5f2ea]">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-extrabold tracking-tight">Luxury<span className="text-gold">Event</span></span>
        </Link>
        <Link href="/" className="rounded-full border border-white/15 px-3 py-1.5 text-sm font-semibold text-white/80 hover:border-gold/40">← Retour</Link>
      </header>
      <article className="mx-auto max-w-3xl px-5 pb-24">
        <h1 className="mb-6 text-3xl font-extrabold" style={{ fontFamily: "var(--font-serif), Georgia, serif" }}>{title}</h1>
        <div className="space-y-3 text-[15px] leading-relaxed text-white/70">
          {lines.map((raw, i) => {
            const line = raw.trim();
            if (!line) return null;
            if (line.startsWith("• ")) {
              return <p key={i} className="ml-4 flex gap-2 text-white/70"><span className="text-gold">•</span> {line.slice(2)}</p>;
            }
            const isHeading = /^article\s/i.test(line) || (line.length < 62 && !/[.!?]$/.test(line));
            if (isHeading) {
              return <h2 key={i} className="pt-4 text-lg font-bold text-gold">{line}</h2>;
            }
            return <p key={i}>{line}</p>;
          })}
        </div>
        <p className="mt-10 text-xs text-white/35">Document repris du site officiel LuxuryEvent — luxuryevent.be</p>
      </article>
    </main>
  );
}
