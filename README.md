# Northline frontend template

A React frontend for a product website and in-app workspace. It is ready to merge with a backend and database later. Nothing is persisted yet.

Stack: **Next.js** (App Router), **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

Production build:

```bash
npm run build
npm start
```

## What you can click through

- Marketing pages: home, features, pricing, about, contact
- Account screens: sign in and sign up (UI only)
- App preview: dashboard overview, projects, settings

Contact, auth, and settings forms validate in the browser and show a toast. They do not write to a server.

## Connect an API later

Data lives in `src/lib/mock-data.ts` and is loaded through `src/lib/api.ts`.

1. Set `NEXT_PUBLIC_API_URL` to your API origin (see `.env.example`).
2. Keep the TypeScript types in `src/lib/types.ts` in sync with your backend.
3. Replace the fallback returns in `src/lib/api.ts` with real endpoints as they exist.

Until that env var is set, the app serves the bundled mock records.

## Layout notes

- Marketing chrome: `src/components/site-header.tsx`, `src/components/site-footer.tsx`
- App chrome: `src/components/app-shell.tsx`
- Loading / empty / error: `src/components/query-state.tsx`
