import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `untitled - ${site.name}`,
    template: `%s - ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="flex min-h-full flex-col bg-desktop font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
