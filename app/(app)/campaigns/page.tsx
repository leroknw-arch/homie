import { CampaignListTable } from "@/components/campaigns/campaign-list-table";
import { PageHero } from "@/components/layout/page-hero";
import { getCampaignBundles, toCampaignFilters } from "@/lib/data";

type PageProps = {
  searchParams?: Promise<{
    company?: string;
    product?: string;
    team?: string;
    status?: string;
    priority?: string;
    date?: string;
  }>;
};

export default async function CampaignsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const bundles = getCampaignBundles(toCampaignFilters(resolvedSearchParams));

  return (
    <div className="space-y-6">
      <PageHero
        description="Navega rápidamente entre iniciativas, dueños, compañías, estado operativo y retorno esperado."
        eyebrow="Campaign portfolio"
        title="Lista ejecutiva de campañas"
      />

      <CampaignListTable bundles={bundles} />
    </div>
  );
}
