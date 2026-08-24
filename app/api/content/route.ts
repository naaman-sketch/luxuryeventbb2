import { NextResponse } from "next/server";
import { getSetting, CONTENT_KEY } from "@/lib/settings";
import { parseContent, defaultContent } from "@/lib/content";

/** Contenu public (textes/images/vidéos éditables, fusionnés avec les défauts). */
export async function GET() {
  try {
    const content = parseContent(await getSetting(CONTENT_KEY));
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ content: defaultContent() });
  }
}
