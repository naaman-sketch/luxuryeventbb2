import { LegalDoc } from "@/components/LegalDoc";
import { CGV } from "@/lib/legal";

export const metadata = { title: "Mentions légales & CGV — LuxuryEvent" };

export default function Page() {
  return <LegalDoc title="Conditions générales & mentions légales" text={CGV} />;
}
