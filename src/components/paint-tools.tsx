"use client";

import { usePathname } from "next/navigation";
import {
  Brush,
  Circle,
  Eraser,
  Minus,
  Pencil,
  Pipette,
  Square,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tools = [
  { icon: Pencil, label: "Pencil" },
  { icon: Brush, label: "Brush" },
  { icon: Eraser, label: "Eraser" },
  { icon: Pipette, label: "Pick color" },
  { icon: Type, label: "Text" },
  { icon: Minus, label: "Line" },
  { icon: Square, label: "Rectangle" },
  { icon: Circle, label: "Ellipse" },
];

export function PaintTools() {
  const pathname = usePathname();
  const activeIndex = pathname === "/" ? 0 : pathname.length % tools.length;

  return (
    <div className="grid grid-cols-2 gap-px">
      {tools.map((tool, index) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.label}
            type="button"
            className={cn("win-tool")}
            data-active={index === activeIndex ? "true" : undefined}
            title={tool.label}
            aria-label={tool.label}
          >
            <Icon className="size-3.5" strokeWidth={1.75} />
          </button>
        );
      })}
    </div>
  );
}
