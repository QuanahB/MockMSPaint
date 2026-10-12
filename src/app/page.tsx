import { MarketingShell } from "@/components/marketing-shell";
import { PaintCanvas } from "@/components/paint-canvas";
import { PaintStudioProvider } from "@/components/paint-studio";

export default function HomePage() {
  return (
    <PaintStudioProvider>
      <MarketingShell>
        <PaintCanvas />
      </MarketingShell>
    </PaintStudioProvider>
  );
}
