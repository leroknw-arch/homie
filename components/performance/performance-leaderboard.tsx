import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/utils";
import { CampaignPerformanceSnapshot } from "@/types/domain";

export function PerformanceLeaderboard({
  title,
  description,
  campaigns,
  tone
}: {
  title: string;
  description: string;
  campaigns: CampaignPerformanceSnapshot[];
  tone: "positive" | "negative";
}) {
  if (!campaigns.length) {
    return (
      <EmptyState
        icon={tone === "positive" ? <ArrowUpRight className="size-6" /> : <ArrowDownRight className="size-6" />}
        title={`No ${tone === "positive" ? "top" : "at-risk"} campaigns today`}
        description="Performance entries will populate this leaderboard once there is visible spend for the selected filters."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {campaigns.map((campaign) => (
          <div
            key={campaign.campaignId}
            className={`rounded-[1.25rem] p-4 ${tone === "positive" ? "bg-emerald-50" : "bg-rose-50"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className={`font-medium ${tone === "positive" ? "text-emerald-900" : "text-rose-900"}`}>
                  {campaign.campaignName}
                </div>
                <div className={`mt-1 text-sm ${tone === "positive" ? "text-emerald-700" : "text-rose-700"}`}>
                  Spend {formatCurrency(campaign.spend)} · Revenue {formatCurrency(campaign.revenue)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl font-semibold">{campaign.roas.toFixed(1)}x</div>
                <div className="text-xs text-muted-foreground">CPA ${campaign.cpa.toFixed(0)}</div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
