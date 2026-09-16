import { Check } from "lucide-react";
import { MarketingShell } from "@/components/marketing-shell";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Project overview",
    body: "Track ownership, status, and progress without waiting on a spreadsheet export.",
  },
  {
    title: "Activity feed",
    body: "Surface the latest reviews, slips, and launches in the same workspace.",
  },
  {
    title: "Team settings",
    body: "A settings screen is already stubbed for workspace name, timezone, and notifications.",
  },
  {
    title: "Typed data contracts",
    body: "Projects, metrics, and activity share TypeScript types you can reuse on the API.",
  },
  {
    title: "Form patterns",
    body: "Contact and auth forms validate locally and explain that persistence comes later.",
  },
  {
    title: "Responsive layout",
    body: "Marketing pages and the app shell both collapse to a sheet menu on small screens.",
  },
];

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight">What ships in this template</h1>
        <p className="mt-3 max-w-2xl text-[13px]">
          Everything on this site is frontend. The pieces below are the ones you will keep when
          you attach a database.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <Check className="size-4 text-muted-foreground" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </MarketingShell>
  );
}
