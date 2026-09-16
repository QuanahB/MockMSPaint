"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { PaintIcon } from "@/components/paint-icon";
import { WindowControls } from "@/components/window-controls";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { marketingNav, site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
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
      <nav className="win-menubar hidden md:flex">
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
        <span className="flex-1" />
        <Link href="/sign-in" className="win-menu-item">
          Sign in
        </Link>
        <Link href="/sign-up" className="win-menu-item">
          Start free
        </Link>
      </nav>
      <div className="flex items-center justify-between px-1 py-0.5 md:hidden">
        <span className="px-2 text-xs">File</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu />
        </Button>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetContent side="right" className="w-72 bg-[#c0c0c0]">
            <SheetHeader>
              <SheetTitle>{site.name}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 px-2">
              {marketingNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="win-menu-item"
                >
                  {item.label}
                </Link>
              ))}
              <Button
                className="mt-3"
                nativeButton={false}
                render={<Link href="/sign-up" />}
                onClick={() => setMenuOpen(false)}
              >
                Start free
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/sign-in" />}
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
