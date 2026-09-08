import type { ActivityItem, Metric, Project } from "@/lib/types";

export const currentUser = {
  name: "Alex Rivera",
  email: "alex@northline.dev",
  initials: "AR",
};

export const metrics: Metric[] = [
  {
    id: "active",
    label: "Active projects",
    value: "12",
    hint: "3 launched this quarter",
  },
  {
    id: "cycle",
    label: "Avg. cycle time",
    value: "4.6d",
    hint: "12% faster than last month",
  },
  {
    id: "open",
    label: "Open requests",
    value: "28",
    hint: "8 waiting on review",
  },
  {
    id: "uptime",
    label: "Workspace health",
    value: "99.9%",
    hint: "All mock services healthy",
  },
];

export const projects: Project[] = [
  {
    id: "prj_aurora",
    name: "Aurora checkout",
    owner: "Maya Chen",
    status: "on_track",
    updatedAt: "2026-09-07",
    progress: 72,
  },
  {
    id: "prj_harbor",
    name: "Harbor analytics",
    owner: "Jonah Cole",
    status: "at_risk",
    updatedAt: "2026-09-06",
    progress: 41,
  },
  {
    id: "prj_lumen",
    name: "Lumen onboarding",
    owner: "Priya Shah",
    status: "on_track",
    updatedAt: "2026-09-05",
    progress: 88,
  },
  {
    id: "prj_atlas",
    name: "Atlas billing",
    owner: "Alex Rivera",
    status: "done",
    updatedAt: "2026-09-01",
    progress: 100,
  },
];

export const activity: ActivityItem[] = [
  {
    id: "act_1",
    title: "Harbor analytics flagged",
    detail: "Cycle time slipped past the 5-day target.",
    timestamp: "2 hours ago",
  },
  {
    id: "act_2",
    title: "Lumen onboarding review",
    detail: "Priya requested a final pass on the welcome flow.",
    timestamp: "Yesterday",
  },
  {
    id: "act_3",
    title: "Atlas billing shipped",
    detail: "Invoice exports are live for finance.",
    timestamp: "3 days ago",
  },
];
