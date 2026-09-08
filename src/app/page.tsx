import Link from "next/link";
import { ArrowRight, Layers3, ShieldCheck, Workflow } from "lucide-react";
import { MarketingShell } from "@/components/marketing-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { site } from "@/lib/site";

const pillars = [
  {
    icon: Workflow,
    title: "One workspace for delivery",
    body: "See projects, owners, and risk in a single view. The dashboard is already structured for live records.",
  },
  {
    icon: Layers3,
    title: "UI that expects an API",
    body: "Pages load from a typed data layer. Today it returns mock records. Tomorrow it can call your backend.",
  },
  {
    icon: ShieldCheck,
    title: "Auth-shaped, not auth-locked",
    body: "Sign-in and account menus exist so you can drop in sessions later without rebuilding the shell.",
  },
];

export default function HomePage() {
  return (
    <MarketingShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <Badge variant="secondary">React frontend template</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {site.tagline}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            {site.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" nativeButton={false} render={<Link href="/sign-up" />}>
              Start free
              <ArrowRight />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              Open the app preview
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-16 sm:grid-cols-3 sm:px-6">
          {pillars.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <item.icon className="size-5 text-muted-foreground" />
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border bg-card px-6 py-12 sm:px-10">
          <h2 className="text-2xl font-semibold tracking-tight">Built to merge with a backend</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Forms, lists, and empty states are already in place. Replace the functions in{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">src/lib/api.ts</code>{" "}
            when your database and API are ready.
          </p>
          <CardContent className="mt-8 grid gap-4 p-0 sm:grid-cols-3">
            <div>
              <p className="text-sm font-medium">Marketing site</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Features, pricing, about, and contact with working local forms.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">App shell</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Dashboard, projects, and settings with desktop and mobile navigation.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Query states</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Loading, empty, and error UI so live data does not feel bolted on.
              </p>
            </div>
          </CardContent>
        </div>
      </section>
    </MarketingShell>
  );
}
