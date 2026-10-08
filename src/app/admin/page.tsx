import { AdminBoard } from "@/components/admin-board";
import { MarketingShell } from "@/components/marketing-shell";
import { getStoreApiUrl } from "@/lib/api";

export default function AdminPage() {
  if (!getStoreApiUrl()) {
    return (
      <MarketingShell>
        <div className="paint-scroll flex min-h-full min-w-[640px] items-start bg-white p-6">
          <div>
            <h1 className="text-xl font-bold">Staff lock</h1>
            <p className="mt-3 max-w-lg text-[13px]">
              Set NEXT_PUBLIC_API_URL to open the catalog editor. This page is not linked from
              the public menu.
            </p>
          </div>
        </div>
      </MarketingShell>
    );
  }

  return (
    <MarketingShell>
      <AdminBoard />
    </MarketingShell>
  );
}
