export const site = {
  name: "Northline",
  tagline: "The operating layer for product teams",
  description:
    "Plan work, track delivery, and keep every stakeholder aligned. Northline is a React frontend template ready to connect to your own API and database.",
} as const;

export const marketingNav = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const appNav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/settings", label: "Settings" },
] as const;
