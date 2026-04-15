import type { Route } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { campaignStatusLabels, getPriorityVariant, getStatusVariant, priorityLabels } from "@/lib/presentation";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { CampaignBundle } from "@/types/domain";

export function CampaignListTable({ bundles }: { bundles: CampaignBundle[] }) {
  if (!bundles.length) {
    return (
      <EmptyState
        icon={<SearchX className="size-6" />}
        title="No campaigns match these filters"
        description="Try widening the company, product, team or status filters to recover portfolio visibility."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All campaigns</CardTitle>
        <CardDescription>
          Vista operativa para navegar campañas por compañía, producto y salud general.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bundles.map(({ campaign, company, product, owner, teams, tasks }) => (
          <div key={campaign.id} className="grid gap-4 rounded-[1.5rem] border border-border/70 p-5 lg:grid-cols-[1.8fr_1fr_1fr_1fr_1fr]">
            <div>
              <Link
                href={`/campaigns/${campaign.id}` as Route}
                className="font-display text-lg font-semibold hover:underline"
              >
                {campaign.name}
              </Link>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{campaign.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {teams.map((team) => (
                  <Badge key={team.id}>{team.name}</Badge>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <div className="text-muted-foreground">Company / Product</div>
              <div className="font-medium">{company.name}</div>
              <div>{product?.name ?? "Corporate"}</div>
            </div>

            <div className="space-y-1 text-sm">
              <div className="text-muted-foreground">Owner / Status</div>
              <div className="font-medium">{owner.name}</div>
              <Badge className="mt-1" variant={getStatusVariant(campaign.status)}>
                {campaignStatusLabels[campaign.status]}
              </Badge>
            </div>

            <div className="space-y-1 text-sm">
              <div className="text-muted-foreground">Budget / ROI</div>
              <div className="font-medium">{formatCurrency(campaign.budgetTotal)}</div>
              <div>{campaign.roi.toFixed(1)}x ROI</div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="text-muted-foreground">Execution</div>
              <div className="font-medium">{formatPercent(campaign.progress)} progress</div>
              <Badge variant={getPriorityVariant(campaign.priority)}>{priorityLabels[campaign.priority]}</Badge>
              <div className="text-xs text-muted-foreground">{tasks.length} tasks linked</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
