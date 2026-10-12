# OIMADIS

A Microsoft Paint–styled shopfront for OIMADIS (Oh-I-Made-This). The catalog, cart, and checkout talk to the store API at `NEXT_PUBLIC_API_URL` with no `/api` prefix.

Stack: **Next.js** (App Router), **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

`.env.example` points at `http://localhost:4000`. Production builds use `.env.production` (`https://storebackend-ivb3.onrender.com`).

```bash
npm run build
npm start
```

## Paint tab

On `/`, the window is a drawing surface. Left click uses the foreground color; right click uses the background. Pick a swatch with left/right click. Clothing icons stamp silhouettes. Curve works like Paint: drag a line, then click twice to bend it. Ctrl+Z / Ctrl+Y undo and redo. Escape cancels a curve in progress.

## Pages

- Paint tab (`/`) is a working Microsoft Paint canvas (pencil, eraser, fill, line, curve, shapes, clothing stamps, palette, undo). Shop (live catalog + Stripe test checkout), collections (live drops from `GET /collections`), videos, about, contact
- Paint status line is an anonymous note board (`GET`/`POST /board`) when `NEXT_PUBLIC_API_URL` is set. No accounts. Staff can remove notes after unlocking at `/admin`.
- Staff catalog editor at `/admin` (not in the public nav). Shoppers do not have accounts. Unlock with the API password, then create, patch, and delete products.

## Staff editor

`/admin` checks `GET /admin/session` with `credentials: "include"`. A false session shows a password form (`POST /admin/login`). The password is typed by staff and is not stored in this repo. Lock calls `POST /admin/logout`.
