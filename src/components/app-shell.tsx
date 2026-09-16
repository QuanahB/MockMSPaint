"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FolderKanban, LayoutDashboard, Menu, Settings } from "lucide-react";
import { PaintIcon } from "@/components/paint-icon";
import { PaintPalette } from "@/components/paint-palette";
import { PaintTools } from "@/components/paint-tools";
import { WindowControls } from "@/components/window-controls";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { currentUser } from "@/lib/mock-data";
import { appNav, site } from "@/lib/site";
import { cn } from "@/lib/utils";

const icons = {
  "/dashboard": LayoutDashboard,
  "/dashboard/projects": FolderKanban,
  "/dashboard/settings": Settings,
} as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col">
      {appNav.map((item) => {
        const Icon = icons[item.href];
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "win-menu-item flex items-center gap-2",
              active && "bg-[#000080] text-white",
            )}
            data-active={active ? "true" : undefined}
          >
            <Icon className="size-3.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-desktop p-2 sm:p-4">
      <div className="win-window mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl flex-1 flex-col">
        <div className="win-titlebar">
          <PaintIcon />
          <span className="min-w-0 flex-1 truncate">
            {site.name} - Paint
          </span>
          <WindowControls />
        </div>
        <div className="win-menubar hidden md:flex">
          <Link href="/" className="win-menu-item">
            File
          </Link>
          <Link href="/dashboard" className="win-menu-item">
            Overview
          </Link>
          <Link href="/dashboard/projects" className="win-menu-item">
            Image
          </Link>
          <Link href="/dashboard/settings" className="win-menu-item">
            Colors
          </Link>
        </div>

        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-[58px] shrink-0 bg-[#c0c0c0] p-1 md:block">
            <PaintTools />
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center justify-between bg-[#c0c0c0] px-1 py-0.5 md:hidden">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Open navigation"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
              >
                <Menu />
              </Button>
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetContent side="left" className="w-64 bg-[#c0c0c0]">
                  <SheetHeader>
                    <SheetTitle>{site.name}</SheetTitle>
                  </SheetHeader>
                  <div className="px-2">
                    <NavLinks onNavigate={() => setMenuOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="ghost" className="gap-2 px-2" />}
                >
                  <Avatar className="size-6">
                    <AvatarFallback>{currentUser.initials}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-52">
                  <DropdownMenuLabel>
                    {currentUser.name}
                    <p className="font-normal">{currentUser.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/" />}>
                    Back to site
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/sign-in" />}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="hidden items-center justify-end bg-[#c0c0c0] px-2 py-0.5 md:flex">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="ghost" className="gap-2 px-2" />}
                >
                  <Avatar className="size-6">
                    <AvatarFallback>{currentUser.initials}</AvatarFallback>
                  </Avatar>
                  <span>{currentUser.name}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-52">
                  <DropdownMenuLabel>
                    {currentUser.name}
                    <p className="font-normal">{currentUser.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/" />}>
                    Back to site
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/sign-in" />}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="win-canvas min-h-0 flex-1 overflow-auto bg-white p-3 sm:p-4">
              {children}
            </div>
          </div>
        </div>
        <PaintPalette />
        <div className="win-status">
          <div className="win-status-cell">For Help, click Help Topics on the Help Menu.</div>
          <div className="win-status-cell max-w-[30%]">Mock session</div>
        </div>
      </div>
    </div>
  );
}
