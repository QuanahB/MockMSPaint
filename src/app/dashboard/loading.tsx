import { LoadingState } from "@/components/query-state";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-5xl">
      <LoadingState label="Loading dashboard" />
    </div>
  );
}
