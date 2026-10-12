"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { type PaintTool, usePaintStudio } from "@/components/paint-studio";

function SelectLasso({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path
        d="M4 3h3M9 3h2M13 4v2M13 8v2M12 13H9M7 13H5M3 12V9M3 7V5"
        stroke="#000"
        strokeWidth="1.2"
        fill="none"
        strokeDasharray="1.5 1.2"
      />
    </svg>
  );
}

function SelectRect({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <rect x="3" y="4" width="10" height="8" fill="none" stroke="#000" strokeDasharray="1.5 1.2" />
    </svg>
  );
}

function Tee({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M2 4h4l2-1 2 1h4v2h-2v7H4V6H2z" fill="#111" />
    </svg>
  );
}

function Shorts({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M3 4h10v4H9L8 12 7 8H3z" fill="#111" />
    </svg>
  );
}

function LongSleeve({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M1 3h4l3-1 3 1h4v3h-2v8H3V6H1z" fill="#111" />
    </svg>
  );
}

function Pants({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M4 2h8v4l-1 9H9L8 7 7 15H5L4 6z" fill="#111" />
    </svg>
  );
}

function Hoodie({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M4 5c0-3 8-3 8 0v2h2v2h-2v5H4V9H2V7h2z" fill="#111" />
      <circle cx="8" cy="5" r="1.4" fill="#c0c0c0" />
    </svg>
  );
}

function Boxers({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M3 5h10v3H9l-1 4-1-4H3z" fill="#111" />
    </svg>
  );
}

function Sweater({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M1 4h4l3-2 3 2h4v3h-2v7H3V7H1z" fill="#111" />
    </svg>
  );
}

function Cap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M4 8c0-3 8-3 8 0H4z" fill="#111" />
      <path d="M3 8h11v2H3z" fill="#111" />
    </svg>
  );
}

function LineTool({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M3 13 13 3" stroke="#000" strokeWidth="1.4" />
    </svg>
  );
}

function CurveTool({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M3 12c3-10 7 6 10-8" fill="none" stroke="#000" strokeWidth="1.4" />
    </svg>
  );
}

function RoundRect({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <rect x="3" y="4" width="10" height="8" rx="2" fill="none" stroke="#000" />
    </svg>
  );
}

function Oval({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <ellipse cx="8" cy="8" rx="5" ry="4" fill="none" stroke="#000" />
    </svg>
  );
}

function FillBucket({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M2 8 8 2l6 6H12v5H4V8z" fill="#111" />
      <path d="M11 12c1.2 1.4 3.2 1.2 3.2-1" stroke="#000080" fill="none" strokeWidth="1.2" />
    </svg>
  );
}

function Eyedropper({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M9 2l5 5-7 7H2v-5z" fill="#111" />
      <path d="M8.5 3.5 12.5 7.5" stroke="#c0c0c0" strokeWidth="1.2" />
    </svg>
  );
}

const tools: {
  id: PaintTool;
  href: string;
  label: string;
  paintLabel: string;
  icon: (props: { className?: string }) => ReactNode;
}[] = [
  { id: "pencil", href: "/", label: "Select", paintLabel: "Pencil", icon: SelectLasso },
  { id: "eraser", href: "/", label: "Select area", paintLabel: "Eraser", icon: SelectRect },
  { id: "stamp-tee", href: "/shop", label: "Tees", paintLabel: "Stamp tee", icon: Tee },
  { id: "stamp-shorts", href: "/shop", label: "Shorts", paintLabel: "Stamp shorts", icon: Shorts },
  { id: "stamp-longsleeve", href: "/shop", label: "Long sleeve", paintLabel: "Stamp long sleeve", icon: LongSleeve },
  { id: "stamp-pants", href: "/shop", label: "Pants", paintLabel: "Stamp pants", icon: Pants },
  { id: "stamp-hoodie", href: "/shop", label: "Hoodie", paintLabel: "Stamp hoodie", icon: Hoodie },
  { id: "stamp-underwear", href: "/shop", label: "Underwear", paintLabel: "Stamp underwear", icon: Boxers },
  { id: "stamp-sweater", href: "/shop", label: "Sweater", paintLabel: "Stamp sweater", icon: Sweater },
  { id: "stamp-hat", href: "/shop", label: "Hat", paintLabel: "Stamp hat", icon: Cap },
  { id: "line", href: "/", label: "Line", paintLabel: "Line", icon: LineTool },
  { id: "curve", href: "/", label: "Curve", paintLabel: "Curve", icon: CurveTool },
  { id: "roundrect", href: "/", label: "Rounded rectangle", paintLabel: "Rounded rectangle", icon: RoundRect },
  { id: "oval", href: "/", label: "Oval", paintLabel: "Oval", icon: Oval },
  { id: "fill", href: "/", label: "Fill", paintLabel: "Fill", icon: FillBucket },
  { id: "pick", href: "/", label: "Pick color", paintLabel: "Pick color", icon: Eyedropper },
];

export function PaintTools() {
  const pathname = usePathname();
  const studio = usePaintStudio();

  return (
    <div className="grid grid-cols-2 gap-px">
      {tools.map((tool, index) => {
        const Icon = tool.icon;
        if (studio) {
          const active = studio.tool === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              className={cn("win-tool")}
              data-active={active ? "true" : undefined}
              title={tool.paintLabel}
              aria-label={tool.paintLabel}
              aria-pressed={active}
              onClick={() => studio.setTool(tool.id)}
            >
              <Icon className="size-4" />
            </button>
          );
        }

        const active = pathname === "/" ? index === 0 : tool.href === pathname && index === 2;
        return (
          <Link
            key={`${tool.label}-${index}`}
            href={tool.href}
            className={cn("win-tool")}
            data-active={active ? "true" : undefined}
            title={tool.label}
            aria-label={tool.label}
          >
            <Icon className="size-4" />
          </Link>
        );
      })}
    </div>
  );
}
