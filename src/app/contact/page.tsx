import { ContactForm } from "@/components/contact-form";
import { MarketingShell } from "@/components/marketing-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ContactPage() {
  return (
    <MarketingShell>
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Contact</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            This form stays in the browser. Submissions are not stored until you connect an
            endpoint.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Typical next step: POST to <code className="font-mono">/contact</code> on your API
            and persist the message.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Send a note</CardTitle>
            <CardDescription>
              We will toast a confirmation so you can verify the interaction today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </MarketingShell>
  );
}
