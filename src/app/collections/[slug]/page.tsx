import { CollectionDropBoard } from "@/components/collection-drop-board";
import { MarketingShell } from "@/components/marketing-shell";

export default async function CollectionDropPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <MarketingShell>
      <CollectionDropBoard slug={slug} />
    </MarketingShell>
  );
}
