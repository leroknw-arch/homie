import { CircleDollarSign } from "lucide-react";

import { BudgetVsSpendChart } from "@/components/charts/budget-vs-spend-chart";
import { RoiBarChart } from "@/components/charts/roi-bar-chart";
import { PageHero } from "@/components/layout/page-hero";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getMarketingPlanMetrics, toCampaignFilters } from "@/lib/data";
import { campaignStatusLabels, getStatusVariant } from "@/lib/presentation";
import { compactLabel, formatCurrency } from "@/lib/utils";

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

export default async function MarketingPlanPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const metrics = getMarketingPlanMetrics(toCampaignFilters(resolvedSearchParams));
  const hasCampaigns = metrics.campaignFinance.length > 0;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <PageHero
          description="Agrupa campañas por compañía y producto para evaluar dónde conviene seguir invirtiendo."
          eyebrow="Marketing plan view"
          title="Budget, ROI y eficiencia del plan"
        />
        <div className="grid gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Total budget</div>
              <div className="mt-3 font-display text-4xl font-semibold">{formatCurrency(metrics.totalBudget)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Actual spend</div>
              <div className="mt-3 font-display text-4xl font-semibold">{formatCurrency(metrics.totalSpend)}</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {!hasCampaigns ? (
        <EmptyState
          icon={<CircleDollarSign className="size-6" />}
          title="No marketing plan data for these filters"
          description="Adjust the global filters to bring campaigns, budget and ROI back into view."
        />
      ) : null}

      {hasCampaigns ? <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Budget distribution</CardTitle>
            <CardDescription>Presupuesto planeado vs gasto real por campaña.</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetVsSpendChart
              data={metrics.campaignFinance.map((item) => ({
                name: compactLabel(item.campaign),
                fullName: item.campaign,
                budget: item.budget,
                spent: item.spend
              }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ROI signal</CardTitle>
            <CardDescription>Campañas más y menos eficientes según retorno.</CardDescription>
          </CardHeader>
          <CardContent>
            <RoiBarChart
              data={metrics.campaignFinance.map((item) => ({
                name: compactLabel(item.campaign),
                fullName: item.campaign,
                roi: item.roi
              }))}
            />
          </CardContent>
        </Card>
      </section> : null}

      {hasCampaigns ? <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Grouped by company</CardTitle>
            <CardDescription>Lectura financiera agregada para dirección de marketing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.companyGroups.map((group) => (
              <div key={group.company} className="grid gap-4 rounded-[1.5rem] border border-border/70 p-5 md:grid-cols-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Company</div>
                  <div className="font-display text-lg font-semibold">{group.company}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Budget</div>
                  <div className="text-sm">{formatCurrency(group.budget)}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Spend</div>
                  <div className="text-sm">{formatCurrency(group.spend)}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Avg ROI</div>
                  <div className="text-sm">{group.averageRoi.toFixed(1)}x</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top efficiency</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics.efficientCampaigns.map((campaign) => (
                <div key={campaign.name} className="rounded-[1.25rem] bg-emerald-50 p-4">
                  <div className="font-medium text-emerald-900">{campaign.name}</div>
                  <div className="mt-1 text-sm text-emerald-700">{campaign.roi.toFixed(1)}x ROI</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Underperforming campaigns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics.lowPerformanceCampaigns.map((campaign) => (
                <div key={campaign.name} className="rounded-[1.25rem] bg-rose-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-rose-900">{campaign.name}</div>
                    <Badge variant={getStatusVariant(campaign.status)}>{campaignStatusLabels[campaign.status]}</Badge>
                  </div>
                  <div className="mt-1 text-sm text-rose-700">
                    ROI {campaign.roi.toFixed(1)}x · Progress {campaign.progress}%
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section> : null}

      {hasCampaigns ? <Card>
        <CardHeader>
          <CardTitle>Campaign finance table</CardTitle>
          <CardDescription>Budget, spend, ROI and grouping by company / product.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="table-readable min-w-full text-left text-sm">
            <thead className="border-b">
              <tr>
                <th className="pb-3 pr-4">Company</th>
                <th className="pb-3 pr-4">Product</th>
                <th className="pb-3 pr-4">Campaign</th>
                <th className="pb-3 pr-4">Budget</th>
                <th className="pb-3 pr-4">Spend</th>
                <th className="pb-3 pr-4">ROI</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics.campaignFinance.map((row) => (
                <tr key={row.id} className="border-b border-border/70 transition hover:bg-secondary/40 last:border-0">
                  <td className="pr-4">{row.company}</td>
                  <td className="pr-4">{row.product}</td>
                  <td className="pr-4 font-medium">{row.campaign}</td>
                  <td className="pr-4">{formatCurrency(row.budget)}</td>
                  <td className="pr-4">{formatCurrency(row.spend)}</td>
                  <td className="pr-4">{row.roi.toFixed(1)}x</td>
                  <td>
                    <Badge variant={getStatusVariant(row.status)}>{campaignStatusLabels[row.status]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card> : null}
    </div>
  );
}
