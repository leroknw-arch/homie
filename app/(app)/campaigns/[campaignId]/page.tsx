import { notFound } from "next/navigation";

import { CampaignDetailView } from "@/components/campaigns/campaign-detail";
import { getCampaignPerformanceDetail } from "@/lib/data";

export default function CampaignDetailPage({
  params
}: {
  params: Promise<{ campaignId: string }>;
}) {
  return <CampaignDetailPageContent params={params} />;
}

async function CampaignDetailPageContent({
  params
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const performanceDetail = getCampaignPerformanceDetail(campaignId);

  if (!performanceDetail) {
    notFound();
  }

  return <CampaignDetailView bundle={performanceDetail.bundle} performance={performanceDetail} />;
}
