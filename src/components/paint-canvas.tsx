"use client";

import { Gochi_Hand, Kalam } from "next/font/google";
import { useCallback, useEffect, useRef } from "react";
import { site } from "@/lib/site";
import { type PaintTool, usePaintStudio } from "@/components/paint-studio";

const gochi = Gochi_Hand({
  weight: "400",
  subsets: ["latin"],
});

const kalam = Kalam({
  weight: "400",
  subsets: ["latin"],
});

const STAMP_PATHS: Record<string, string> = {
  "stamp-tee": "M2 4h4l2-1 2 1h4v2h-2v7H4V6H2z",
  "stamp-shorts": "M3 4h10v4H9L8 12 7 8H3z",
  "stamp-longsleeve": "M1 3h4l3-1 3 1h4v3h-2v8H3V6H1z",
  "stamp-pants": "M4 2h8v4l-1 9H9L8 7 7 15H5L4 6z",
  "stamp-hoodie": "M4 5c0-3 8-3 8 0v2h2v2h-2v5H4V9H2V7h2z",
  "stamp-underwear": "M3 5h10v3H9l-1 4-1-4H3z",
  "stamp-sweater": "M1 4h4l3-2 3 2h4v3h-2v7H3V7H1z",
  "stamp-hat": "M4 8c0-3 8-3 8 0H4z M3 8h11v2H3z",
};

type Point = { x: number; y: number };

type CurveDraft = {
  a: Point;
  b: Point;
  c1: Point;
  c2: Point;
  stage: 0 | 1 | 2;
};

function parseColor(hex: string): [number, number, number, number] {
  const raw = hex.replace("#", "");
  const n = raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw;
  const v = Number.parseInt(n, 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255, 255];
}

function toHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function pointerPos(event: PointerEvent, canvas: HTMLCanvasElement): Point {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) * canvas.width) / rect.width,
    y: ((event.clientY - rect.top) * canvas.height) / rect.height,
  };
}

function strokeColor(button: number, foreground: string, background: string) {
  return button === 2 ? background : foreground;
}

function floodFill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  fill: [number, number, number, number],
) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const cx0 = x | 0;
  const cy0 = y | 0;
  if (cx0 < 0 || cy0 < 0 || cx0 >= w || cy0 >= h) return;

  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const i0 = (cy0 * w + cx0) * 4;
  const tr = d[i0];
  const tg = d[i0 + 1];
  const tb = d[i0 + 2];
  const ta = d[i0 + 3];
  if (tr === fill[0] && tg === fill[1] && tb === fill[2] && ta === fill[3]) return;

  const match = (i: number) =>
    d[i] === tr && d[i + 1] === tg && d[i + 2] === tb && d[i + 3] === ta;
  const paint = (i: number) => {
    d[i] = fill[0];
    d[i + 1] = fill[1];
    d[i + 2] = fill[2];
    d[i + 3] = fill[3];
  };

  const stack = [cx0, cy0];
  while (stack.length) {
    const cy = stack.pop()!;
    let cx = stack.pop()!;
    let i = (cy * w + cx) * 4;
    while (cx > 0 && match(i - 4)) {
      cx -= 1;
      i -= 4;
    }
    let spanUp = false;
    let spanDown = false;
    while (cx < w && match(i)) {
      paint(i);
      if (cy > 0) {
        if (match(i - w * 4)) {
          if (!spanUp) {
            stack.push(cx, cy - 1);
            spanUp = true;
          }
        } else spanUp = false;
      }
      if (cy < h - 1) {
        if (match(i + w * 4)) {
          if (!spanDown) {
            stack.push(cx, cy + 1);
            spanDown = true;
          }
        } else spanDown = false;
      }
      cx += 1;
      i += 4;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function drawStamp(
  ctx: CanvasRenderingContext2D,
  tool: PaintTool,
  point: Point,
  color: string,
  scale: number,
) {
  const path = STAMP_PATHS[tool];
  if (!path) return;
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.scale(scale, scale);
  ctx.translate(-8, -8);
  ctx.fillStyle = color;
  ctx.fill(new Path2D(path));
  if (tool === "stamp-hoodie") {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(8, 5, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawShape(
  ctx: CanvasRenderingContext2D,
  tool: PaintTool,
  a: Point,
  b: Point,
  color: string,
  lineWidth: number,
  shift: boolean,
) {
  const { x: x1, y: y1 } = a;
  let { x: x2, y: y2 } = b;
  if (shift && (tool === "roundrect" || tool === "oval")) {
    const side = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    x2 = x1 + Math.sign(x2 - x1 || 1) * side;
    y2 = y1 + Math.sign(y2 - y1 || 1) * side;
  }
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  if (tool === "line") {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  } else if (tool === "oval") {
    const rx = Math.abs(x2 - x1) / 2;
    const ry = Math.abs(y2 - y1) / 2;
    ctx.ellipse((x1 + x2) / 2, (y1 + y2) / 2, Math.max(rx, 0.5), Math.max(ry, 0.5), 0, 0, Math.PI * 2);
  } else {
    const x = Math.min(x1, x2);
    const y = Math.min(y1, y2);
    const w = Math.abs(x2 - x1);
    const h = Math.abs(y2 - y1);
    const r = Math.min(16, w / 4, h / 4);
    ctx.roundRect(x, y, w, h, r);
  }
  ctx.stroke();
  ctx.restore();
}

function drawCurve(ctx: CanvasRenderingContext2D, draft: CurveDraft, color: string, lineWidth: number) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(draft.a.x, draft.a.y);
  if (draft.stage === 0) {
    ctx.lineTo(draft.b.x, draft.b.y);
  } else {
    ctx.bezierCurveTo(draft.c1.x, draft.c1.y, draft.c2.x, draft.c2.y, draft.b.x, draft.b.y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawWelcome(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const titleSize = Math.min(width * 0.16, height * 0.22, 128);
  ctx.font = `400 ${titleSize}px ${gochi.style.fontFamily}, cursive`;
  ctx.fillText(site.name, width / 2, height / 2 - titleSize * 0.15);
  ctx.font = `400 ${Math.max(22, titleSize * 0.28)}px ${kalam.style.fontFamily}, cursive`;
  ctx.fillText(`(${site.tagline})`, width / 2, height / 2 + titleSize * 0.55);
  ctx.restore();
}

function cursorFor(tool: PaintTool) {
  if (tool === "fill") return "cell";
  if (tool === "pick") return "crosshair";
  if (tool.startsWith("stamp-")) return "copy";
  return "crosshair";
}

export function PaintCanvas() {
  const studio = usePaintStudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef(studio);
  const historyRef = useRef<ImageData[]>([]);
  const redoRef = useRef<ImageData[]>([]);
  const snapshotRef = useRef<ImageData | null>(null);
  const drawingRef = useRef(false);
  const buttonRef = useRef(0);
  const lastRef = useRef<Point | null>(null);
  const startRef = useRef<Point | null>(null);
  const curveRef = useRef<CurveDraft | null>(null);
  const userDrawnRef = useRef(false);

  useEffect(() => {
    studioRef.current = studio;
  }, [studio]);

  const lineWidth = () => Math.max(1.5, window.devicePixelRatio || 1);
  const eraserSize = () => Math.max(12, 12 * (window.devicePixelRatio || 1));
  const stampScale = () => 7 * (window.devicePixelRatio || 1);

  const snapshot = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current.push(data);
    if (historyRef.current.length > 40) historyRef.current.shift();
    redoRef.current = [];
  }, []);

  const restore = useCallback((data: ImageData) => {
    const ctx = canvasRef.current?.getContext("2d");
    ctx?.putImageData(data, 0, 0);
  }, []);

  const undo = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const prev = historyRef.current.pop();
    if (!canvas || !ctx || !prev) return;
    redoRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.putImageData(prev, 0, 0);
  }, []);

  const redo = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const next = redoRef.current.pop();
    if (!canvas || !ctx || !next) return;
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.putImageData(next, 0, 0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const fit = (forceWelcome: boolean) => {
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.floor(Math.max(rect.width, 720) * dpr));
      const height = Math.max(1, Math.floor(Math.max(rect.height, 520) * dpr));
      const sizeChanged = canvas.width !== width || canvas.height !== height;
      if (!sizeChanged && !forceWelcome) return;
      const previous =
        canvas.width > 0 && canvas.height > 0 ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
      if (sizeChanged) {
        canvas.width = width;
        canvas.height = height;
        ctx.imageSmoothingEnabled = false;
      }
      if (!userDrawnRef.current && (forceWelcome || !previous)) {
        drawWelcome(ctx, width, height);
        return;
      }
      if (sizeChanged) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        if (previous) ctx.putImageData(previous, 0, 0);
      }
    };

    const start = async () => {
      try {
        await document.fonts.load(`400 72px ${gochi.style.fontFamily}`);
        await document.fonts.load(`400 28px ${kalam.style.fontFamily}`);
        await document.fonts.ready;
      } catch {
        /* use fallbacks */
      }
      fit(true);
    };

    void start();
    const observer = new ResizeObserver(() => fit(false));
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    studioRef.current = studio;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = () => canvas.getContext("2d");

    const onDown = (event: PointerEvent) => {
      const paint = studioRef.current;
      if (!paint) return;
      if (event.button !== 0 && event.button !== 2) return;
      event.preventDefault();
      canvas.setPointerCapture(event.pointerId);
      const point = pointerPos(event, canvas);
      const context = ctx();
      if (!context) return;
      const color = strokeColor(event.button, paint.foreground, paint.background);
      const tool = paint.tool;
      buttonRef.current = event.button;

      if (tool === "curve" && curveRef.current) {
        const draft = curveRef.current;
        drawingRef.current = true;
        if (draft.stage === 1) {
          draft.c1 = point;
        } else if (draft.stage === 2) {
          draft.c2 = point;
        }
        if (snapshotRef.current) restore(snapshotRef.current);
        drawCurve(context, draft, color, lineWidth());
        return;
      }

      if (tool !== "pick") {
        userDrawnRef.current = true;
        snapshot();
      }
      drawingRef.current = true;
      lastRef.current = point;
      startRef.current = point;

      if (tool === "pencil") {
        context.strokeStyle = color;
        context.fillStyle = color;
        context.lineWidth = lineWidth();
        context.lineCap = "round";
        context.beginPath();
        context.arc(point.x, point.y, lineWidth() / 2, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.moveTo(point.x, point.y);
        return;
      }

      if (tool === "eraser") {
        const size = eraserSize();
        context.fillStyle = paint.background;
        context.fillRect(point.x - size / 2, point.y - size / 2, size, size);
        return;
      }

      if (tool === "fill") {
        floodFill(context, point.x, point.y, parseColor(color));
        drawingRef.current = false;
        return;
      }

      if (tool === "pick") {
        const pixel = context.getImageData(point.x | 0, point.y | 0, 1, 1).data;
        const hex = toHex(pixel[0], pixel[1], pixel[2]);
        if (event.button === 2) paint.setBackground(hex);
        else paint.setForeground(hex);
        drawingRef.current = false;
        return;
      }

      if (tool.startsWith("stamp-")) {
        drawStamp(context, tool, point, color, stampScale());
        drawingRef.current = false;
        return;
      }

      snapshotRef.current = context.getImageData(0, 0, canvas.width, canvas.height);
      if (tool === "curve") {
        curveRef.current = { a: point, b: point, c1: point, c2: point, stage: 0 };
      }
    };

    const onMove = (event: PointerEvent) => {
      if (!drawingRef.current) return;
      const paint = studioRef.current;
      const context = ctx();
      if (!paint || !context) return;
      const point = pointerPos(event, canvas);
      const color = strokeColor(buttonRef.current, paint.foreground, paint.background);
      const tool = paint.tool;

      if (tool === "pencil") {
        const last = lastRef.current;
        if (!last) return;
        context.strokeStyle = color;
        context.lineWidth = lineWidth();
        context.lineCap = "round";
        context.beginPath();
        context.moveTo(last.x, last.y);
        context.lineTo(point.x, point.y);
        context.stroke();
        lastRef.current = point;
        return;
      }

      if (tool === "eraser") {
        const size = eraserSize();
        const last = lastRef.current ?? point;
        const dist = Math.hypot(point.x - last.x, point.y - last.y);
        const steps = Math.max(1, Math.ceil(dist / (size / 3)));
        context.fillStyle = paint.background;
        for (let i = 1; i <= steps; i += 1) {
          const t = i / steps;
          const x = last.x + (point.x - last.x) * t;
          const y = last.y + (point.y - last.y) * t;
          context.fillRect(x - size / 2, y - size / 2, size, size);
        }
        lastRef.current = point;
        return;
      }

      if (tool === "curve" && curveRef.current) {
        const draft = curveRef.current;
        if (draft.stage === 0) draft.b = point;
        else if (draft.stage === 1) {
          draft.c1 = point;
          draft.c2 = draft.b;
        } else draft.c2 = point;
        if (snapshotRef.current) restore(snapshotRef.current);
        drawCurve(context, draft, color, lineWidth());
        return;
      }

      if ((tool === "line" || tool === "roundrect" || tool === "oval") && startRef.current && snapshotRef.current) {
        restore(snapshotRef.current);
        drawShape(context, tool, startRef.current, point, color, lineWidth(), event.shiftKey);
      }
    };

    const onUp = (event: PointerEvent) => {
      if (!drawingRef.current) return;
      const paint = studioRef.current;
      const context = ctx();
      const point = pointerPos(event, canvas);
      if (paint?.tool === "curve" && curveRef.current && context) {
        const draft = curveRef.current;
        const color = strokeColor(buttonRef.current, paint.foreground, paint.background);
        if (draft.stage === 0) {
          draft.b = point;
          draft.c1 = draft.a;
          draft.c2 = draft.b;
          draft.stage = 1;
          drawingRef.current = false;
          if (snapshotRef.current) restore(snapshotRef.current);
          drawCurve(context, draft, color, lineWidth());
          return;
        }
        if (draft.stage === 1) {
          draft.c1 = point;
          draft.stage = 2;
          drawingRef.current = false;
          if (snapshotRef.current) restore(snapshotRef.current);
          drawCurve(context, draft, color, lineWidth());
          return;
        }
        draft.c2 = point;
        if (snapshotRef.current) restore(snapshotRef.current);
        drawCurve(context, draft, color, lineWidth());
        curveRef.current = null;
        snapshotRef.current = null;
        drawingRef.current = false;
        return;
      }

      drawingRef.current = false;
      lastRef.current = null;
      startRef.current = null;
      snapshotRef.current = null;
    };

    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      }
      if ((event.metaKey || event.ctrlKey) && key === "y") {
        event.preventDefault();
        redo();
      }
      if (key === "escape" && curveRef.current && snapshotRef.current) {
        restore(snapshotRef.current);
        curveRef.current = null;
        drawingRef.current = false;
        const last = historyRef.current.pop();
        if (last) restore(last);
        snapshotRef.current = null;
      }
    };

    const onContext = (event: Event) => event.preventDefault();

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("contextmenu", onContext);
    window.addEventListener("keydown", onKey);
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("contextmenu", onContext);
      window.removeEventListener("keydown", onKey);
    };
  }, [studio, restore, snapshot, undo, redo]);

  if (!studio) return null;

  return (
    <div ref={wrapRef} className="relative h-full min-h-full min-w-[720px] bg-white">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full touch-none"
        style={{ cursor: cursorFor(studio.tool) }}
        aria-label="Paint canvas"
      />
    </div>
  );
}
