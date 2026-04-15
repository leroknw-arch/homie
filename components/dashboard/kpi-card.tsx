import { TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  hint,
  trend,
  tone = "default"
}: {
  label: string;
  value: string;
  hint: string;
  trend?: "up" | "down";
  tone?: "default" | "warning";
}) {
  return (
    <Card className={cn(tone === "warning" && "border-amber-200 bg-amber-50/70")}>
      <CardContent className="space-y-4 p-6">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
        <div className="flex items-end justify-between gap-3">
          <div className="font-display text-3xl font-semibold">{value}</div>
          {trend ? (
            <div
              className={cn(
                "rounded-full p-2",
                trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
              )}
            >
              {trend === "up" ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
            </div>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
