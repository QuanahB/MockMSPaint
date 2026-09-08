import { activity, metrics, projects } from "@/lib/mock-data";
import type { ActivityItem, Metric, Project } from "@/lib/types";

/**
 * Frontend-only data access.
 * Replace these functions with `fetch` calls to your backend when it exists.
 *
 * Example:
 *   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`);
 *   if (!res.ok) throw new Error("Failed to load projects");
 *   return res.json();
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, fallback: T): Promise<T> {
  if (!API_BASE) {
    return fallback;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new ApiError(`Request failed for ${path}`, res.status);
  }

  return res.json() as Promise<T>;
}

export function getProjects() {
  return request<Project[]>("/projects", projects);
}

export function getMetrics() {
  return request<Metric[]>("/metrics", metrics);
}

export function getActivity() {
  return request<ActivityItem[]>("/activity", activity);
}
