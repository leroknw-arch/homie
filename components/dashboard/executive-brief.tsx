import { AlertTriangle, BarChart3, Coins, Target } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function ExecutiveBrief({
  filteredCampaigns,
  totalBudget,
  remainingBudget,
  topPerformer,
  atRiskCampaign
}: {
  filteredCampaigns: number;
  totalBudget: number;
  remainingBudget: number;
  topPerformer?: { campaign: string; roi: number };
  atRiskCampaign?: { campaign: string; progress: number; status: string };
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
      <Card className="overflow-hidden bg-surface-900 text-white">
        <CardContent className="grid gap-8 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_28%),linear-gradient(135deg,#202a17_0%,#324124_100%)] p-7 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/60">Executive dashboard</div>
            <h2 className="max-w-2xl text-balance font-display text-4xl font-semibold">
              Panorama ejecutivo del marketing plan en una sola lectura.
            </h2>
            <p className="max-w-2xl text-white/74">
              {filteredCampaigns > 0
                ? `${filteredCampaigns} campañas visibles bajo los filtros actuales. ${topPerformer?.campaign ?? "Ninguna campaña"} lidera el retorno${atRiskCampaign ? ` y ${atRiskCampaign.campaign} es la iniciativa que pide atención inmediata.` : "."}`
                : "No hay campañas visibles bajo los filtros actuales. Ajusta el contexto para recuperar lectura ejecutiva."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[
              {
                icon: Coins,
                label: "Plan budget",
                value: formatCurrency(totalBudget)
              },
              {
                icon: Target,
                label: "Budget remaining",
                value: formatCurrency(remainingBudget)
              }
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="rounded-[1.35rem] bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/60">
                    <Icon className="size-4" />
                    {item.label}
                  </div>
                  <div className="mt-3 font-display text-2xl font-semibold">{item.value}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
        {[
          {
            icon: BarChart3,
            label: "Top performer",
            value: topPerformer ? `${topPerformer.roi.toFixed(1)}x ROI` : "N/A",
            caption: topPerformer?.campaign ?? "No campaign"
          },
          {
            icon: AlertTriangle,
            label: "Risk signal",
            value: atRiskCampaign ? `${atRiskCampaign.progress}% progress` : "Stable",
            caption: atRiskCampaign?.campaign ?? "No critical campaign"
          }
        ].map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.label}>
              <CardContent className="space-y-4 p-6">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-surface-800">
                  <Icon className="size-5" />
                </div>
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.label}</div>
                <div className="font-display text-3xl font-semibold">{item.value}</div>
                <div className="text-sm text-muted-foreground">{item.caption}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
