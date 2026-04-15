import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getStatusVariant } from "@/lib/presentation";
import { formatCurrency } from "@/lib/utils";
import { CampaignStatus } from "@/types/domain";

export function FocusNowList({
  items
}: {
  items: {
    campaignId: string;
    campaignName: string;
    spend: number;
    roas: number;
    cpa: number;
    score: number;
    owner: string;
    status: CampaignStatus;
    riskReasons: string[];
  }[];
}) {
  if (!items.length) {
    return (
      <EmptyState
        icon={<TriangleAlert className="size-6" />}
        title="No priority campaigns right now"
        description="Performance and execution signals are stable under the current filters."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Focus now</CardTitle>
        <CardDescription>Ranked by spend pressure, weak efficiency and execution risk.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, index) => (
          <Link
            key={item.campaignId}
            href={`/campaigns/${item.campaignId}` as Route}
            className="block rounded-[1.25rem] bg-secondary/55 p-4 transition hover:bg-secondary"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex size-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-surface-900">
                    {index + 1}
                  </div>
                  <div className="font-medium text-surface-900">{item.campaignName}</div>
                  <Badge variant={getStatusVariant(item.status)}>{item.status.replaceAll("_", " ")}</Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Spend {formatCurrency(item.spend)} · ROAS {item.roas.toFixed(1)}x · CPA ${item.cpa.toFixed(0)} · {item.owner}
                </div>
                <div className="mt-2 line-clamp-1 text-sm text-surface-800">
                  {item.riskReasons[0] ?? "Performance pressure requires budget attention."}
                </div>
              </div>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-surface-800">
                P{item.score}
                <ArrowRight className="size-4" />
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
