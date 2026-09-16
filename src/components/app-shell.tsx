"use client";

import Link from "next/link";
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
import { currentUser } from "@/lib/mock-data";
import { site } from "@/lib/site";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-desktop p-2 sm:p-4">
      <div className="win-window mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl flex-1 flex-col">
        <div className="win-titlebar">
          <PaintIcon />
          <span className="min-w-0 flex-1 truncate">{site.name} - Paint</span>
          <WindowControls />
        </div>
        <div className="win-menubar flex flex-wrap items-center">
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
          <span className="flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" className="gap-2 px-2" />}
            >
              <Avatar className="size-6">
                <AvatarFallback>{currentUser.initials}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">{currentUser.name}</span>
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

        <div className="flex min-h-0 flex-1">
          <aside className="w-[58px] shrink-0 bg-[#c0c0c0] p-1">
            <PaintTools />
          </aside>
          <div className="win-canvas min-h-0 flex-1 overflow-auto bg-white p-3 sm:p-4">
            {children}
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
