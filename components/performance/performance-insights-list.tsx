import { AlertTriangle, ArrowDownRight, Sparkles, TriangleAlert } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { PerformanceInsight } from "@/types/domain";

const severityStyles = {
  high: "border-rose-200 bg-rose-50/80 text-rose-900",
  medium: "border-amber-200 bg-amber-50/80 text-amber-900",
  low: "border-emerald-200 bg-emerald-50/80 text-emerald-900"
} as const;

export function PerformanceInsightsList({
  insights,
  title = "AI Insights",
  description = "Detecta rápidamente campañas que requieren intervención de presupuesto."
}: {
  insights: PerformanceInsight[];
  title?: string;
  description?: string;
}) {
  if (!insights.length) {
    return (
      <EmptyState
        icon={<Sparkles className="size-6" />}
        title="No critical performance insights"
        description="The visible campaigns are stable enough today. Keep monitoring spend and ROAS."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.id} className={cn("rounded-[1.25rem] border p-4", severityStyles[insight.severity])}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <TriangleAlert className="size-4" />
                  <div className="font-medium">{insight.title}</div>
                </div>
                <div className="mt-2 text-sm opacity-85">{insight.detail}</div>
              </div>
              <div className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium">
                P{insight.priorityScore}
              </div>
            </div>
            <div className="mt-3 flex items-start gap-2 text-sm">
              <ArrowDownRight className="mt-0.5 size-4 shrink-0" />
              <span>{insight.recommendation}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
