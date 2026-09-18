import { MarketingShell } from "@/components/marketing-shell";

export default function VideosPage() {
  return (
    <MarketingShell>
      <div className="paint-scroll flex min-h-full min-w-[640px] items-start bg-white p-8">
        <div>
          <h1 className="text-xl font-bold">Videos</h1>
          <p className="mt-3 max-w-lg text-[13px]">
            Process clips and lookbooks will play on this canvas. Nothing is streamed yet.
          </p>
        </div>
      </div>
    </MarketingShell>
  );
}
