export const site = {
  name: "OIMADIS",
  tagline: "Oh-I-Made-This",
  description:
    "OIMADIS is a handmade clothing shop sketched in Microsoft Paint. Browse the canvas, then shop the pieces when the catalog is wired up.",
} as const;

export const marketingNav = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/videos", label: "Videos" },
  { href: "/", label: "Paint" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const appNav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/settings", label: "Settings" },
] as const;
