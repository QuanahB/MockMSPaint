"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

export function MobileDrawer({
  open,
  onClose,
  side = "right",
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[200] md:hidden" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        className={
          side === "left"
            ? "win-window absolute inset-y-0 left-0 flex w-72 flex-col bg-[#c0c0c0]"
            : "win-window absolute inset-y-0 right-0 flex w-72 flex-col bg-[#c0c0c0]"
        }
      >
        <div className="win-titlebar">
          <span className="flex-1 truncate">{title}</span>
          <Button type="button" size="icon-xs" onClick={onClose} aria-label="Close">
            ×
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-2">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
