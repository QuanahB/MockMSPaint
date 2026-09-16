import { PaintPalette } from "@/components/paint-palette";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-[#c0c0c0]">
      <PaintPalette />
      <div className="win-status">
        <div className="win-status-cell">
          For Help, click Help Topics on the Help Menu.
        </div>
        <div className="win-status-cell max-w-[40%]">
          {site.name} · frontend only
        </div>
      </div>
    </footer>
  );
}
