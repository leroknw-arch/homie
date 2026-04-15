import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/utils";

export function PerformanceComparison({
  topCampaign,
  worstCampaign
}: {
  topCampaign?: {
    campaignName: string;
    spend: number;
    revenue: number;
    roas: number;
    cpa: number;
  };
  worstCampaign?: {
    campaignName: string;
    spend: number;
    revenue: number;
    roas: number;
    cpa: number;
  };
}) {
  if (!topCampaign && !worstCampaign) {
    return (
      <EmptyState
        icon={<ArrowUpRight className="size-6" />}
        title="No campaign comparison available"
        description="Visible performance entries will populate the best and worst campaign comparison."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance comparison</CardTitle>
        <CardDescription>Top campaign vs worst campaign side by side.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-2">
        <ComparisonPanel
          campaign={topCampaign}
          icon={<ArrowUpRight className="size-4" />}
          label="Top campaign"
          tone="positive"
        />
        <ComparisonPanel
          campaign={worstCampaign}
          icon={<ArrowDownRight className="size-4" />}
          label="Worst campaign"
          tone="negative"
        />
      </CardContent>
    </Card>
  );
}

function ComparisonPanel({
  campaign,
  label,
  icon,
  tone
}: {
  campaign?: {
    campaignName: string;
    spend: number;
    revenue: number;
    roas: number;
    cpa: number;
  };
  label: string;
  icon: ReactNode;
  tone: "positive" | "negative";
}) {
  return (
    <div className={tone === "positive" ? "rounded-[1.35rem] bg-emerald-50 p-5" : "rounded-[1.35rem] bg-rose-50 p-5"}>
      <div className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {label}
      </div>
      <div className="mt-3">
        <div className="font-display text-3xl font-semibold">{campaign?.campaignName ?? "No campaign"}</div>
        {campaign ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SmallMetric label="Spend" value={formatCurrency(campaign.spend)} />
            <SmallMetric label="Revenue" value={formatCurrency(campaign.revenue)} />
            <SmallMetric label="ROAS" value={`${campaign.roas.toFixed(1)}x`} />
            <SmallMetric label="CPA" value={`$${campaign.cpa.toFixed(0)}`} />
          </div>
        ) : (
          <div className="mt-2 text-sm text-muted-foreground">No visible performance data.</div>
        )}
      </div>
    </div>
  );
}

function SmallMetric({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.05rem] bg-white/85 p-3">
      <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div className="mt-2 text-lg font-semibold text-surface-900">{value}</div>
    </div>
  );
}
