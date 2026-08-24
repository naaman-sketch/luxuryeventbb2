import { LegalDoc } from "@/components/LegalDoc";
import { CONFIDENTIALITE } from "@/lib/legal";

export const metadata = { title: "Politique de confidentialité — LuxuryEvent" };

export default function Page() {
  return <LegalDoc title="Politique de confidentialité" text={CONFIDENTIALITE} />;
}
