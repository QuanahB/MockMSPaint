import Link from "next/link";
import { MarketingShell } from "@/components/marketing-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const plans = [
  {
    name: "Starter",
    price: "$0",
    note: "While this is frontend-only",
    items: ["Mock workspace", "Up to 4 sample projects", "Local form validation"],
    href: "/sign-up",
    cta: "Use the template",
    featured: false,
  },
  {
    name: "Team",
    price: "$24",
    note: "Per seat / month, once billed",
    items: ["Shared dashboard", "Project statuses", "Ready for a real API"],
    href: "/contact",
    cta: "Talk to us",
    featured: true,
  },
  {
    name: "Company",
    price: "Custom",
    note: "SSO and audit later",
    items: ["Dedicated workspace", "Role models in the UI", "Bring your own backend"],
    href: "/contact",
    cta: "Contact sales",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-semibold tracking-tight">Simple pricing copy</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          These cards are placeholders. Replace the amounts when billing exists. Checkout is not
          wired on purpose.
        </p>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.featured ? "ring-2 ring-foreground" : undefined}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <p className="text-3xl font-semibold">{plan.price}</p>
                <CardDescription>{plan.note}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {plan.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.featured ? "default" : "outline"}
                  render={<Link href={plan.href} />}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MarketingShell>
  );
}
