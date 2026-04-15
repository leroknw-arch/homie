import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { WeeklyPerformanceSummary } from "@/types/domain";

export function WeeklySummaryCard({
  summary
}: {
  summary: WeeklyPerformanceSummary;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Summary</CardTitle>
        <CardDescription>Una lectura simple del desempeño de los últimos 7 días visibles.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          <SummaryCell label="Spend" value={formatCurrency(summary.totalSpend)} />
          <SummaryCell label="Revenue" value={formatCurrency(summary.totalRevenue)} />
          <SummaryCell label="Avg ROAS" value={`${summary.avgRoas.toFixed(1)}x`} />
          <SummaryCell label="Avg CPA" value={`$${summary.avgCpa.toFixed(0)}`} />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Best campaigns</div>
            {summary.bestCampaigns.map((campaign) => (
              <div key={campaign.campaignId} className="rounded-[1.1rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                {campaign.campaignName} · {campaign.roas.toFixed(1)}x
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Recommendations</div>
            {summary.recommendations.length ? (
              summary.recommendations.map((item) => (
                <div key={item} className="rounded-[1.1rem] bg-secondary/60 px-4 py-3 text-sm text-surface-800">
                  {item}
                </div>
              ))
            ) : (
              <div className="rounded-[1.1rem] bg-secondary/60 px-4 py-3 text-sm text-surface-800">
                Keep current allocation and monitor tomorrow&apos;s ROAS trend before changing budgets.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryCell({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.15rem] bg-secondary/55 p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
    </div>
  );
}
