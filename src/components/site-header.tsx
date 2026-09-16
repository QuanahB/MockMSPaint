"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PaintIcon } from "@/components/paint-icon";
import { WindowControls } from "@/components/window-controls";
import { marketingNav, site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const title =
    pathname === "/"
      ? `untitled - ${site.name}`
      : `${pathname.replace(/^\//, "")} - ${site.name}`;

  return (
    <header className="bg-[#c0c0c0]">
      <div className="win-titlebar">
        <PaintIcon />
        <span className="min-w-0 flex-1 truncate">{title}</span>
        <WindowControls />
      </div>
      <nav className="win-menubar flex flex-wrap">
        <Link
          href="/"
          className="win-menu-item"
          data-active={pathname === "/" ? "true" : undefined}
        >
          File
        </Link>
        {marketingNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="win-menu-item"
            data-active={pathname === item.href ? "true" : undefined}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/dashboard" className="win-menu-item">
          View
        </Link>
        <span className="hidden flex-1 sm:block" />
        <Link href="/sign-in" className="win-menu-item">
          Sign in
        </Link>
        <Link href="/sign-up" className="win-menu-item">
          Start free
        </Link>
      </nav>
    </header>
  );
}
