import { PaintPalette } from "@/components/paint-palette";

export function SiteFooter() {
  return (
    <footer className="bg-[#ece9d8]">
      <PaintPalette />
      <div className="win-status bg-[#ece9d8]">
        <div className="win-status-cell">
          For Help, click Help Topics on the Help Menu.
        </div>
      </div>
    </footer>
  );
}
