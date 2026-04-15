import { ArrowUpRight, BriefcaseBusiness, TrendingUp, TriangleAlert } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function SpotlightPanel({
  topPerformer,
  highestSpendCampaign,
  busiestTeam,
  atRiskCampaign
}: {
  topPerformer?: { campaign: string; roi: number; product: string };
  highestSpendCampaign?: { campaign: string; budgetSpent: number; company: string };
  busiestTeam?: { team: string; actualHours: number; openTasks: number };
  atRiskCampaign?: { campaign: string; progress: number; owner: string };
}) {
  const items = [
    {
      icon: TrendingUp,
      label: "Best ROI",
      value: topPerformer ? `${topPerformer.roi.toFixed(1)}x` : "N/A",
      caption: topPerformer ? `${topPerformer.campaign} · ${topPerformer.product}` : "No campaign"
    },
    {
      icon: ArrowUpRight,
      label: "Highest spend",
      value: highestSpendCampaign ? formatCurrency(highestSpendCampaign.budgetSpent) : "N/A",
      caption: highestSpendCampaign ? `${highestSpendCampaign.campaign} · ${highestSpendCampaign.company}` : "No campaign"
    },
    {
      icon: BriefcaseBusiness,
      label: "Busiest team",
      value: busiestTeam ? `${busiestTeam.actualHours}h` : "N/A",
      caption: busiestTeam ? `${busiestTeam.team} · ${busiestTeam.openTasks} open tasks` : "No team"
    },
    {
      icon: TriangleAlert,
      label: "Priority watch",
      value: atRiskCampaign ? `${atRiskCampaign.progress}%` : "Stable",
      caption: atRiskCampaign ? `${atRiskCampaign.campaign} · ${atRiskCampaign.owner}` : "No risk"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Executive spotlight</CardTitle>
        <CardDescription>Las cuatro señales que cambian decisiones de presupuesto y foco.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="flex items-start gap-4 rounded-[1.25rem] bg-secondary/55 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white text-surface-800">
                <Icon className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.label}</div>
                <div className="mt-1 font-display text-2xl font-semibold">{item.value}</div>
                <div className="truncate text-sm text-muted-foreground">{item.caption}</div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
