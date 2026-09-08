import { EmptyState } from "@/components/query-state";
import { getProjects } from "@/lib/api";
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

export default async function ProjectsPage() {
  const projectList = await getProjects();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Replace <code className="font-mono">getProjects()</code> with a database query later.
        </p>
      </div>

      {projectList.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="When your API returns an empty list, this is the screen people will see."
        />
      ) : (
        <div className="grid gap-4">
          {projectList.map((project) => (
            <Card key={project.id}>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>
                    {project.owner} · Updated {project.updatedAt}
                  </CardDescription>
                </div>
                <Badge variant={project.status === "at_risk" ? "destructive" : "secondary"}>
                  {statusLabel[project.status]}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-foreground"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{project.progress}% complete</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
