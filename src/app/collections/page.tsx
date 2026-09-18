import { MarketingShell } from "@/components/marketing-shell";

export default function CollectionsPage() {
  return (
    <MarketingShell>
      <div className="paint-scroll flex min-h-full min-w-[640px] items-start bg-white p-8">
        <div>
          <h1 className="text-xl font-bold">Collections</h1>
          <p className="mt-3 max-w-lg text-[13px]">
            Drops will land here. This page is a canvas placeholder so the Paint window stays
            intact while you design the first collection.
          </p>
        </div>
      </div>
    </MarketingShell>
  );
}
