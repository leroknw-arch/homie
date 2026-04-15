import { AlertTriangle, ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";

type MetricTone = "good" | "warning" | "bad";

export function PerformanceKpiStrip({
  metrics
}: {
  metrics: {
    spend: number;
    revenue: number;
    roas: number;
    cpa: number;
    spendDeltaPct?: number;
    revenueDeltaPct?: number;
    roasDeltaPct?: number;
    cpaDeltaPct?: number;
  };
}) {
  const cards = [
    {
      label: "Spend",
      value: formatCurrency(metrics.spend),
      delta: metrics.spendDeltaPct,
      tone: getSpendTone(metrics.spendDeltaPct),
      helper: "vs yesterday"
    },
    {
      label: "Revenue",
      value: formatCurrency(metrics.revenue),
      delta: metrics.revenueDeltaPct,
      tone: getPositiveTone(metrics.revenueDeltaPct),
      helper: "vs yesterday"
    },
    {
      label: "ROAS",
      value: `${metrics.roas.toFixed(1)}x`,
      delta: metrics.roasDeltaPct,
      tone: metrics.roas >= 2.3 ? "good" : metrics.roas >= 1.8 ? "warning" : "bad",
      helper: "core efficiency"
    },
    {
      label: "CPA",
      value: `$${metrics.cpa.toFixed(0)}`,
      delta: metrics.cpaDeltaPct,
      tone: metrics.cpa <= 95 ? "good" : metrics.cpa <= 120 ? "warning" : "bad",
      helper: "cost per purchase",
      invertDelta: true
    }
  ] as const;

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <MetricCard key={card.label} {...card} highlight={card.label === "ROAS"} />
      ))}
    </section>
  );
}

function MetricCard({
  label,
  value,
  helper,
  delta,
  tone,
  invertDelta,
  highlight
}: {
  label: string;
  value: string;
  helper: string;
  delta?: number;
  tone: MetricTone;
  invertDelta?: boolean;
  highlight?: boolean;
}) {
  const isPositiveDelta = typeof delta === "number" ? (invertDelta ? delta < 0 : delta > 0) : undefined;
  const DeltaIcon = isPositiveDelta ? ArrowUpRight : ArrowDownRight;

  return (
    <Card
      className={cn(
        "overflow-hidden border-0 shadow-soft",
        highlight && "ring-1 ring-emerald-300/50",
        tone === "good" && "bg-surface-950 text-white",
        tone === "warning" && "bg-amber-50",
        tone === "bad" && "bg-rose-50"
      )}
    >
      <CardContent className="space-y-5 p-6">
        <div className="flex items-center justify-between gap-3">
          <div className={cn("text-xs uppercase tracking-[0.18em]", tone === "good" ? "text-white/58" : "text-muted-foreground")}>
            {label}
          </div>
          <MetricStatus tone={tone} />
        </div>

        <div className={cn("font-display text-4xl font-semibold tracking-tight", tone !== "good" && "text-surface-900")}>
          {value}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className={cn("text-sm", tone === "good" ? "text-white/68" : "text-muted-foreground")}>{helper}</div>
          {typeof delta === "number" ? (
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium",
                isPositiveDelta
                  ? tone === "good"
                    ? "bg-emerald-500/18 text-emerald-100"
                    : "bg-emerald-100 text-emerald-800"
                  : tone === "good"
                    ? "bg-white/12 text-white"
                    : "bg-white text-surface-800"
              )}
            >
              <DeltaIcon className="size-4" />
              {delta > 0 ? "+" : ""}
              {delta}%
            </div>
          ) : (
            <div className={cn("text-sm", tone === "good" ? "text-white/55" : "text-muted-foreground")}>No prior day</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MetricStatus({ tone }: { tone: MetricTone }) {
  if (tone === "good") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/18 px-3 py-1 text-sm font-medium text-emerald-100">
        <TrendingUp className="size-4" />
        Good
      </div>
    );
  }

  if (tone === "warning") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
        <AlertTriangle className="size-4" />
        Warning
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-800">
      <AlertTriangle className="size-4" />
      Bad
    </div>
  );
}

function getPositiveTone(delta?: number): MetricTone {
  if (typeof delta !== "number") return "warning";
  if (delta >= 10) return "good";
  if (delta >= 0) return "warning";
  return "bad";
}

function getSpendTone(delta?: number): MetricTone {
  if (typeof delta !== "number") return "warning";
  if (delta <= 5) return "good";
  if (delta <= 20) return "warning";
  return "bad";
}
