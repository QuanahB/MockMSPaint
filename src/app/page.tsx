import { OimadisCanvas } from "@/components/oimadis-canvas";
import { MarketingShell } from "@/components/marketing-shell";

export default function HomePage() {
  return (
    <MarketingShell>
      <OimadisCanvas />
    </MarketingShell>
  );
}
