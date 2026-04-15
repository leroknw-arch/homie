import { Activity, CircleDollarSign, ShoppingCart, TrendingUp } from "lucide-react";

import { PerformanceDailyChart } from "@/components/charts/performance-daily-chart";
import { PerformanceTrendChart } from "@/components/charts/performance-trend-chart";
import { PlatformPerformanceChart } from "@/components/charts/platform-performance-chart";
import { PerformanceInputForm } from "@/components/performance/performance-input-form";
import { PerformanceInsightsList } from "@/components/performance/performance-insights-list";
import { WeeklySummaryCard } from "@/components/performance/weekly-summary-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getDemoReferenceDateString } from "@/lib/domain/demo-clock";
import { performancePlatformLabels } from "@/lib/presentation";
import { formatCurrency } from "@/lib/utils";
import {
  CampaignPerformanceSnapshot,
  DailyPerformancePoint,
  Performance,
  PerformanceInsight,
  PlatformPerformanceSnapshot,
  WeeklyPerformanceSummary
} from "@/types/domain";

export function CampaignPerformancePanel({
  campaignName,
  latestDate,
  snapshot,
  dailySeries,
  platformBreakdown,
  insights,
  weeklySummary,
  latestEntries
}: {
  campaignName: string;
  latestDate?: string;
  snapshot?: CampaignPerformanceSnapshot;
  dailySeries: DailyPerformancePoint[];
  platformBreakdown: PlatformPerformanceSnapshot[];
  insights: PerformanceInsight[];
  weeklySummary?: WeeklyPerformanceSummary;
  latestEntries: Performance[];
}) {
  if (!dailySeries.length || !snapshot || !latestDate || !weeklySummary) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<TrendingUp className="size-6" />}
          title="No performance data for this campaign yet"
          description="Start with a manual performance entry to make spend, revenue, ROAS and CPA visible."
        />
        <PerformanceInputForm campaignName={campaignName} defaultDate={getDemoReferenceDateString()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PerformanceMetricCard icon={CircleDollarSign} label="Spend" value={formatCurrency(snapshot.spend)} hint={`Performance date: ${latestDate}`} />
        <PerformanceMetricCard icon={TrendingUp} label="Revenue" value={formatCurrency(snapshot.revenue)} hint={`${snapshot.roas.toFixed(1)}x ROAS`} />
        <PerformanceMetricCard
          icon={Activity}
          label="ROAS"
          value={`${snapshot.roas.toFixed(1)}x`}
          hint={
            typeof snapshot.roasDeltaPct === "number"
              ? `${snapshot.roasDeltaPct > 0 ? "+" : ""}${snapshot.roasDeltaPct}% vs previous day`
              : "No previous-day comparison"
          }
        />
        <PerformanceMetricCard icon={ShoppingCart} label="CPA" value={`$${snapshot.cpa.toFixed(0)}`} hint={`${snapshot.purchases} purchases`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Daily performance</CardTitle>
            <CardDescription>Spend vs revenue trend for the most recent visible days.</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceDailyChart data={dailySeries.map((item) => ({ date: item.date.slice(5), spend: item.spend, revenue: item.revenue }))} />
          </CardContent>
        </Card>

        <PerformanceInsightsList
          description="Prioriza rápido lo que necesita cambios de budget o targeting."
          insights={insights}
          title="Insights"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ROAS trend</CardTitle>
            <CardDescription>Evolution of return efficiency over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceTrendChart data={dailySeries.map((item) => ({ date: item.date.slice(5), roas: item.roas, cpa: item.cpa }))} metric="roas" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CPA trend</CardTitle>
            <CardDescription>Daily cost per acquisition trend.</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceTrendChart data={dailySeries.map((item) => ({ date: item.date.slice(5), roas: item.roas, cpa: item.cpa }))} metric="cpa" />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Platform breakdown</CardTitle>
            <CardDescription>Where today&apos;s spend and revenue are coming from.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PlatformPerformanceChart data={platformBreakdown} />
            <div className="grid gap-3 md:grid-cols-3">
              {platformBreakdown.map((platform) => (
                <div key={platform.platform} className="rounded-[1.15rem] bg-secondary/55 p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {performancePlatformLabels[platform.platform]}
                  </div>
                  <div className="mt-2 text-sm font-medium">{formatCurrency(platform.spend)} spend</div>
                  <div className="text-sm text-muted-foreground">{platform.roas.toFixed(1)}x ROAS · ${platform.cpa.toFixed(0)} CPA</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <WeeklySummaryCard summary={weeklySummary} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent performance entries</CardTitle>
            <CardDescription>Latest manual or imported rows for this campaign.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="table-readable min-w-full text-left text-sm">
              <thead className="border-b">
                <tr>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Platform</th>
                  <th className="pb-3 pr-4">Spend</th>
                  <th className="pb-3 pr-4">Revenue</th>
                  <th className="pb-3 pr-4">ROAS</th>
                  <th className="pb-3">CPA</th>
                </tr>
              </thead>
              <tbody>
                {latestEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-border/70 transition hover:bg-secondary/40 last:border-0">
                    <td className="pr-4">{entry.date}</td>
                    <td className="pr-4">{performancePlatformLabels[entry.platform]}</td>
                    <td className="pr-4">{formatCurrency(entry.spend)}</td>
                    <td className="pr-4">{formatCurrency(entry.revenue)}</td>
                    <td className="pr-4">{entry.roas.toFixed(1)}x</td>
                    <td>${entry.cpa.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <PerformanceInputForm campaignName={campaignName} defaultDate={latestDate} />
      </section>
    </div>
  );
}

function PerformanceMetricCard({
  icon: Icon,
  label,
  value,
  hint
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-surface-800">
          <Icon className="size-5" />
        </div>
        <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
        <div className="font-display text-3xl font-semibold">{value}</div>
        <div className="text-sm text-muted-foreground">{hint}</div>
      </CardContent>
    </Card>
  );
}
