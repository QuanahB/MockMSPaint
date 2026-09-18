import { MarketingShell } from "@/components/marketing-shell";
import { site } from "@/lib/site";

export default function AboutPage() {
  return (
    <MarketingShell>
      <div className="paint-scroll mx-auto w-full max-w-3xl bg-white px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight">About {site.name}</h1>
        <div className="mt-6 space-y-4 text-[13px]">
          <p>
            {site.name} ({site.tagline}) is a clothing shop drawn inside a Microsoft Paint window.
            The homepage is the canvas. Shop, collections, and videos are ready to fill once a
            backend exists.
          </p>
          <p>
            This frontend is React (Next.js) only. Forms stay in the browser. Swap the mock data
            layer when you add a database.
          </p>
        </div>
      </div>
    </MarketingShell>
  );
}
