import { PaintTools } from "@/components/paint-tools";
import { SiteHeader } from "@/components/site-header";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f3f3f3] p-2 sm:p-5">
      <div className="paint-frame mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-6xl flex-1 flex-col">
        <SiteHeader />
        <div className="flex min-h-0 flex-1 bg-[#ece9d8] p-1">
          <aside className="w-[52px] shrink-0 bg-[#ece9d8] p-0.5">
            <PaintTools />
          </aside>
          <main className="paint-scroll win-canvas min-w-0 flex-1 bg-white">{children}</main>
        </div>
      </div>
    </div>
  );
}
