import { FolderKanban, Gauge } from "lucide-react";

import { PerformanceDailyChart } from "@/components/charts/performance-daily-chart";
import { PerformanceTrendChart } from "@/components/charts/performance-trend-chart";
import { CampaignSummaryTable } from "@/components/dashboard/campaign-summary-table";
import { AttentionCard } from "@/components/dashboard/attention-card";
import { FocusNowList } from "@/components/dashboard/focus-now-list";
import { PerformanceComparison } from "@/components/dashboard/performance-comparison";
import { PerformanceHero } from "@/components/dashboard/performance-hero";
import { PerformanceKpiStrip } from "@/components/dashboard/performance-kpi-strip";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getDashboardMetrics, getDashboardPerformanceMetrics, toCampaignFilters } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

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

export default async function DashboardPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = toCampaignFilters(resolvedSearchParams);
  const metrics = getDashboardMetrics(filters);
  const performance = getDashboardPerformanceMetrics(filters);
  const hasCampaigns = metrics.campaignTable.length > 0;
  const hasPerformance = performance.topCampaigns.length > 0 || performance.worstCampaigns.length > 0;

  return (
    <div className="space-y-6">
      <PerformanceHero referenceDate={performance.referenceDate} />

      {!hasCampaigns ? (
        <EmptyState
          icon={<FolderKanban className="size-6" />}
          title="No campaigns match the current filters"
          description="Clear or widen the global filters to recover the performance and execution view."
        />
      ) : null}

      {hasCampaigns && hasPerformance ? (
        <>
          <PerformanceKpiStrip metrics={performance.summary} />

          <AttentionCard item={performance.underperforming} />

          <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <FocusNowList items={performance.focusNow} />

            <div className="grid gap-6">
              <PerformanceComparison
                topCampaign={performance.topCampaigns[0]}
                worstCampaign={performance.worstCampaigns[0]}
              />
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Performance trend</CardTitle>
                <CardDescription>Spend vs revenue over the last visible days.</CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceDailyChart
                  data={performance.aggregateDailySeries.map((item) => ({
                    date: item.date.slice(5),
                    spend: item.spend,
                    revenue: item.revenue
                  }))}
                />
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>ROAS trend</CardTitle>
                <CardDescription>See efficiency direction before moving budget.</CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceTrendChart
                  data={performance.aggregateDailySeries.map((item) => ({
                    date: item.date.slice(5),
                    roas: item.roas,
                    cpa: item.cpa
                  }))}
                  metric="roas"
                />
              </CardContent>
            </Card>
          </section>
        </>
      ) : hasCampaigns ? (
        <EmptyState
          icon={<Gauge className="size-6" />}
          title="No performance data for the current filters"
          description="Adjust the current filter set to bring back spend, revenue and campaign efficiency."
        />
      ) : null}

      {hasCampaigns ? (
        <section className="space-y-4">
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Execution below performance</div>
            <h2 className="font-display text-2xl font-semibold">Execution health</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep these metrics lower in the page so money and action stay first.
            </p>
          </div>

          <section className="grid gap-4 md:grid-cols-3">
            <ExecutionMetricCard
              label="Campaigns active"
              value={String(metrics.summary.totalActiveCampaigns)}
              hint="Currently moving budget and execution."
            />
            <ExecutionMetricCard
              label="Progress"
              value={`${metrics.summary.globalProgress}%`}
              hint="Average completion across visible campaigns."
            />
            <ExecutionMetricCard
              label="Risk"
              value={`${metrics.summary.campaignsAtRisk}`}
              hint="Campaigns that need intervention."
              tone="warning"
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <UpcomingDeadlines deadlines={metrics.deadlines} />

            <Card>
              <CardHeader>
                <CardTitle>Execution snapshot</CardTitle>
                <CardDescription>Quick budget and portfolio context without taking focus from performance.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <ExecutionMiniCard label="Budget assigned" value={formatCurrency(metrics.summary.totalBudget)} />
                <ExecutionMiniCard label="Budget spent" value={formatCurrency(metrics.summary.totalSpend)} />
                <ExecutionMiniCard label="Average ROI" value={`${metrics.summary.averageRoi.toFixed(1)}x`} />
              </CardContent>
            </Card>
          </section>
        </section>
      ) : null}

      <CampaignSummaryTable rows={metrics.campaignTable} />
    </div>
  );
}

function ExecutionMetricCard({
  label,
  value,
  hint,
  tone = "default"
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "default" | "warning";
}) {
  return (
    <Card className={tone === "warning" ? "border-amber-200 bg-amber-50/70" : ""}>
      <CardContent className="space-y-3 p-6">
        <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
        <div className="font-display text-3xl font-semibold">{value}</div>
        <div className="text-sm text-muted-foreground">{hint}</div>
      </CardContent>
    </Card>
  );
}

function ExecutionMiniCard({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.2rem] bg-secondary/55 p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
    </div>
  );
}
