"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PaintIcon } from "@/components/paint-icon";
import { WindowControls } from "@/components/window-controls";
import { marketingNav, site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-[#ece9d8]">
      <div className="win-titlebar">
        <PaintIcon />
        <span className="min-w-0 flex-1 truncate tracking-[0.35em]">{site.name}</span>
        <WindowControls />
      </div>
      <nav className="win-menubar flex flex-wrap bg-[#ece9d8]">
        {marketingNav.map((item) => (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            className="win-menu-item"
            data-active={
              item.href === "/"
                ? pathname === "/"
                  ? "true"
                  : undefined
                : pathname === item.href
                  ? "true"
                  : undefined
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
