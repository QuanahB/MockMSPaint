import { PaintTools } from "@/components/paint-tools";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-desktop p-2 sm:p-4">
      <div className="win-window mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl flex-1 flex-col">
        <SiteHeader />
        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-[58px] shrink-0 border-r border-[#808080] bg-[#c0c0c0] p-1 sm:block">
            <PaintTools />
          </aside>
          <main className="win-canvas min-w-0 flex-1 overflow-auto bg-white">{children}</main>
        </div>
        <SiteFooter />
      </div>
    </div>
  );
}
