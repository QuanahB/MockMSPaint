import { MarketingShell } from "@/components/marketing-shell";

export default function AboutPage() {
  return (
    <MarketingShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight">About this template</h1>
        <div className="mt-6 space-y-4 text-[13px]">
          <p>
            Northline is a starting UI for a product site and an authenticated-looking app. It is
            not connected to a server. Session data, projects, and metrics are local fixtures.
          </p>
          <p>
            Use it when you want layout, navigation, and copy in place before the API is designed.
            The React tree is Next.js App Router with TypeScript, Tailwind CSS, and shadcn/ui.
          </p>
          <p>
            When you add a backend, keep the pages and replace the functions in the data layer.
            Do not introduce a second component library or a second styling system unless you
            intend to migrate the whole template.
          </p>
        </div>
      </div>
    </MarketingShell>
  );
}
