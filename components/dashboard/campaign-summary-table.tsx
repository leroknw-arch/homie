import type { Route } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { campaignStatusLabels, getPriorityVariant, getStatusVariant, priorityLabels } from "@/lib/presentation";
import { formatCurrency, formatDate, formatPercent } from "@/lib/utils";
import { CampaignTableRow } from "@/types/domain";

export function CampaignSummaryTable({ rows }: { rows: CampaignTableRow[] }) {
  if (!rows.length) {
    return (
      <EmptyState
        icon={<SearchX className="size-6" />}
        title="No campaigns available"
        description="The current filter combination removed every campaign from the executive summary."
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-end justify-between">
        <div>
          <CardTitle>Campaign summary</CardTitle>
          <CardDescription>Vista rápida de presupuesto, progreso y ROI por campaña.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="table-readable min-w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="pb-3 pr-4">Campaign</th>
              <th className="pb-3 pr-4">Company</th>
              <th className="pb-3 pr-4">Owner</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Priority</th>
              <th className="pb-3 pr-4">Progress</th>
              <th className="pb-3 pr-4">Budget</th>
              <th className="pb-3 pr-4">Spent</th>
              <th className="pb-3 pr-4">ROI</th>
              <th className="pb-3">Next deadline</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border/70 transition hover:bg-secondary/40 last:border-0">
                <td className="pr-4">
                  <Link
                    href={`/campaigns/${row.id}` as Route}
                    className="font-medium text-surface-800 hover:underline"
                  >
                    {row.campaign}
                  </Link>
                  <div className="text-xs text-muted-foreground">{row.product}</div>
                </td>
                <td className="pr-4">{row.company}</td>
                <td className="pr-4">{row.owner}</td>
                <td className="pr-4">
                  <Badge variant={getStatusVariant(row.status)}>{campaignStatusLabels[row.status]}</Badge>
                </td>
                <td className="pr-4">
                  <Badge variant={getPriorityVariant(row.priority)}>{priorityLabels[row.priority]}</Badge>
                </td>
                <td className="pr-4">{formatPercent(row.progress)}</td>
                <td className="pr-4">{formatCurrency(row.budgetTotal)}</td>
                <td className="pr-4">{formatCurrency(row.budgetSpent)}</td>
                <td className="pr-4">{row.roi.toFixed(1)}x</td>
                <td>{row.nextDeadline ? formatDate(row.nextDeadline) : "TBD"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
