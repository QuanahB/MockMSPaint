import { MarketingShell } from "@/components/marketing-shell";

export default function ShopPage() {
  return (
    <MarketingShell>
      <div className="paint-scroll flex min-h-full min-w-[640px] items-start bg-white p-8">
        <div>
          <h1 className="text-xl font-bold">Shop</h1>
          <p className="mt-3 max-w-lg text-[13px]">
            The closet is empty until the catalog is connected. Use the tools on the left as a
            preview of tees, shorts, hoodies, and hats.
          </p>
        </div>
      </div>
    </MarketingShell>
  );
}
