export type ProjectStatus = "on_track" | "at_risk" | "done";

export type Project = {
  id: string;
  name: string;
  owner: string;
  status: ProjectStatus;
  updatedAt: string;
  progress: number;
};

export type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
};

export type Metric = {
  id: string;
  label: string;
  value: string;
  hint: string;
};
