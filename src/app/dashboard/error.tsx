"use client";

import { ErrorState } from "@/components/query-state";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <ErrorState
        title="Dashboard failed to load"
        description="The mock data layer threw. After you connect an API, this file will catch those failures."
      />
      <Button variant="outline" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
