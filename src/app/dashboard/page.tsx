import { getActivity, getMetrics, getProjects } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProjectStatus } from "@/lib/types";

const statusLabel: Record<ProjectStatus, string> = {
  on_track: "On track",
  at_risk: "At risk",
  done: "Done",
};

export default async function DashboardPage() {
  const [metricList, projectList, activityList] = await Promise.all([
    getMetrics(),
    getProjects(),
    getActivity(),
  ]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Numbers below come from mock data. Set{" "}
          <code className="font-mono">NEXT_PUBLIC_API_URL</code> to switch to a live API.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricList.map((metric) => (
          <Card key={metric.id}>
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-2xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{metric.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>A slice of the same records shown on the projects page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {projectList.slice(0, 4).map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2"
              >
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-xs text-muted-foreground">{project.owner}</p>
                </div>
                <Badge variant={project.status === "at_risk" ? "destructive" : "secondary"}>
                  {statusLabel[project.status]}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Recent mock events.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activityList.map((item) => (
              <div key={item.id}>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.timestamp}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
