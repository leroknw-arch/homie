import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getStatusVariant } from "@/lib/presentation";
import { formatCurrency } from "@/lib/utils";
import { CampaignStatus } from "@/types/domain";

export function AttentionCard({
  item
}: {
  item?: {
    insight: {
      campaignId?: string;
      campaignName?: string;
      title: string;
      detail: string;
      recommendation: string;
    };
    snapshot?: {
      spend: number;
      roas: number;
      cpa: number;
    };
    campaignStatus?: CampaignStatus;
  };
}) {
  if (!item) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Sparkles className="size-4" />
            No urgent performance issue detected right now.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 bg-[linear-gradient(135deg,#1a1a1a_0%,#2e1e1d_48%,#fdf4ee_48%,#fffaf7_100%)] shadow-panel">
      <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-800">
              <TriangleAlert className="size-4" />
              What needs your attention
            </div>
            {item.campaignStatus ? (
              <Badge variant={getStatusVariant(item.campaignStatus)}>{item.campaignStatus.replaceAll("_", " ")}</Badge>
            ) : null}
          </div>

          <div>
            <h2 className="font-display text-3xl font-semibold text-white lg:text-rose-950">{item.insight.title}</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/72 lg:text-rose-900/78">{item.insight.detail}</p>
          </div>

          <div className="rounded-[1.25rem] bg-white/[0.88] p-4 text-sm text-surface-800">
            <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Recommended action</div>
            <div className="mt-2 font-medium">{item.insight.recommendation}</div>
          </div>

          {item.insight.campaignId ? (
            <Link
              className="inline-flex items-center gap-2 text-sm font-medium text-white transition hover:text-white/78 lg:text-rose-900 lg:hover:text-rose-700"
              href={`/campaigns/${item.insight.campaignId}` as Route}
            >
              Open campaign
              <ArrowRight className="size-4" />
            </Link>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <MetricBlock label="Campaign" value={item.insight.campaignName ?? "Portfolio"} />
          <MetricBlock label="Spend" value={item.snapshot ? formatCurrency(item.snapshot.spend) : "N/A"} />
          <MetricBlock label="ROAS / CPA" value={item.snapshot ? `${item.snapshot.roas.toFixed(1)}x · $${item.snapshot.cpa.toFixed(0)}` : "N/A"} />
        </div>
      </CardContent>
    </Card>
  );
}

function MetricBlock({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.2rem] bg-white/[0.88] p-4 shadow-soft">
      <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold text-surface-900">{value}</div>
    </div>
  );
}
