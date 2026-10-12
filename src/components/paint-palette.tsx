"use client";

import { usePathname } from "next/navigation";
import { PAINT_COLORS, usePaintStudio } from "@/components/paint-studio";

export function PaintPalette() {
  const pathname = usePathname();
  const studio = usePaintStudio();
  const painting = Boolean(studio) && pathname === "/";
  const top = PAINT_COLORS.slice(0, 14);
  const bottom = PAINT_COLORS.slice(14);
  const foreground = studio?.foreground ?? "#000000";
  const background = studio?.background ?? "#ffffff";

  const pick = (color: string, button: number) => {
    if (!studio || !painting) return;
    if (button === 2) studio.setBackground(color);
    else studio.setForeground(color);
  };

  const renderRow = (colors: readonly string[], prefix: string) =>
    colors.map((color) => {
      if (!painting || !studio) {
        return (
          <span
            key={`${prefix}-${color}`}
            className="win-swatch"
            style={{ backgroundColor: color }}
            title={color}
          />
        );
      }
      return (
        <button
          key={`${prefix}-${color}`}
          type="button"
          className="win-swatch"
          style={{ backgroundColor: color }}
          data-active={color === foreground ? "fg" : color === background ? "bg" : undefined}
          title={`${color} — left click foreground, right click background`}
          aria-label={`Color ${color}`}
          onPointerDown={(event) => {
            pick(color, event.button);
          }}
          onClick={(event) => {
            event.preventDefault();
            pick(color, 0);
          }}
          onContextMenu={(event) => {
            event.preventDefault();
            pick(color, 2);
          }}
        />
      );
    });

  return (
    <div className="flex items-end gap-2 bg-[#ece9d8] px-2 py-1.5">
      <div className="relative h-[36px] w-[36px] shrink-0" aria-hidden>
        <span
          className="absolute top-[10px] left-[10px] h-5 w-5 border border-[#808080] shadow-[inset_1px_1px_0_#fff,1px_1px_0_#000]"
          style={{ backgroundColor: background }}
        />
        <span
          className="absolute top-0 left-0 h-5 w-5 border border-[#808080] shadow-[inset_1px_1px_0_#404040,1px_1px_0_#000]"
          style={{ backgroundColor: foreground }}
        />
      </div>
      <div className="flex flex-col gap-px">
        <div className="flex">{renderRow(top, "t")}</div>
        <div className="flex">{renderRow(bottom, "b")}</div>
      </div>
    </div>
  );
}
