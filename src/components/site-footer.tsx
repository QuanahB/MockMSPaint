import { PaintPalette } from "@/components/paint-palette";
import { StatusBoard } from "@/components/status-board";

export function SiteFooter() {
  return (
    <footer className="bg-[#ece9d8]">
      <PaintPalette />
      <StatusBoard />
    </footer>
  );
}
