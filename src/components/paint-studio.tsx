"use client";

import { createContext, useContext, useMemo, useState } from "react";

export const PAINT_COLORS = [
  "#000000",
  "#808080",
  "#800000",
  "#808000",
  "#008000",
  "#008080",
  "#000080",
  "#800080",
  "#808040",
  "#004040",
  "#0080ff",
  "#004080",
  "#400080",
  "#804000",
  "#ffffff",
  "#c0c0c0",
  "#ff0000",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#0000ff",
  "#ff00ff",
  "#ffff80",
  "#80ff80",
  "#80ffff",
  "#8080ff",
  "#ff80c0",
  "#ff8040",
] as const;

export type PaintTool =
  | "pencil"
  | "eraser"
  | "fill"
  | "pick"
  | "line"
  | "curve"
  | "roundrect"
  | "oval"
  | "stamp-tee"
  | "stamp-shorts"
  | "stamp-longsleeve"
  | "stamp-pants"
  | "stamp-hoodie"
  | "stamp-underwear"
  | "stamp-sweater"
  | "stamp-hat";

type PaintStudioValue = {
  tool: PaintTool;
  setTool: (tool: PaintTool) => void;
  foreground: string;
  background: string;
  setForeground: (color: string) => void;
  setBackground: (color: string) => void;
};

const PaintStudioContext = createContext<PaintStudioValue | null>(null);

export function PaintStudioProvider({ children }: { children: React.ReactNode }) {
  const [tool, setTool] = useState<PaintTool>("pencil");
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");

  const value = useMemo(
    () => ({
      tool,
      setTool,
      foreground,
      background,
      setForeground,
      setBackground,
    }),
    [tool, foreground, background],
  );

  return <PaintStudioContext.Provider value={value}>{children}</PaintStudioContext.Provider>;
}

export function usePaintStudio() {
  return useContext(PaintStudioContext);
}
