import Link from "next/link";
import { MarketingShell } from "@/components/marketing-shell";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <MarketingShell>
      <div className="mx-auto flex w-full max-w-xl flex-col items-start gap-4 px-4 py-24 sm:px-6">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground">
          That route is not part of this template. Head back to the homepage or the app preview.
        </p>
        <div className="flex gap-2">
          <Button nativeButton={false} render={<Link href="/" />}>Home</Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/dashboard" />}>
            App preview
          </Button>
        </div>
      </div>
    </MarketingShell>
  );
}
