import Link from "next/link";
import { MarketingShell } from "@/components/marketing-shell";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <MarketingShell>
      <div className="mx-auto flex w-full max-w-xl flex-col items-start gap-4 bg-white px-4 py-24 sm:px-6">
        <p className="text-sm font-medium">404</p>
        <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
        <p>
          That route is not on this canvas. Go back to the Paint window or open the shop.
        </p>
        <div className="flex gap-2">
          <Button nativeButton={false} render={<Link href="/" />}>
            Paint
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/shop" />}>
            Shop
          </Button>
        </div>
      </div>
    </MarketingShell>
  );
}
