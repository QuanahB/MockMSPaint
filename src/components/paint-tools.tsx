"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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

const tools = [
  { href: "/", label: "Select", icon: SelectLasso },
  { href: "/", label: "Select area", icon: SelectRect },
  { href: "/shop", label: "Tees", icon: Tee },
  { href: "/shop", label: "Shorts", icon: Shorts },
  { href: "/shop", label: "Long sleeve", icon: LongSleeve },
  { href: "/shop", label: "Pants", icon: Pants },
  { href: "/shop", label: "Hoodie", icon: Hoodie },
  { href: "/shop", label: "Underwear", icon: Boxers },
  { href: "/shop", label: "Sweater", icon: Sweater },
  { href: "/shop", label: "Hat", icon: Cap },
  { href: "/", label: "Line", icon: LineTool },
  { href: "/", label: "Curve", icon: CurveTool },
  { href: "/", label: "Rounded rectangle", icon: RoundRect },
  { href: "/", label: "Oval", icon: Oval },
];

export function PaintTools() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-2 gap-px">
      {tools.map((tool, index) => {
        const Icon = tool.icon;
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
