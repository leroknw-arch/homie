import { differenceInCalendarDays, eachDayOfInterval, parseISO } from "date-fns";
import { AlertTriangle, GitBranch } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getStatusVariant, workStatusLabels } from "@/lib/presentation";
import { cn, formatDate } from "@/lib/utils";
import { GanttGroup } from "@/types/domain";

function getSpanPercent(start: string, end: string, totalStart: string, totalEnd: string) {
  const timelineStart = parseISO(totalStart);
  const timelineEnd = parseISO(totalEnd);
  const itemStart = parseISO(start);
  const itemEnd = parseISO(end);
  const totalDays = Math.max(differenceInCalendarDays(timelineEnd, timelineStart), 1);

  return {
    left: (differenceInCalendarDays(itemStart, timelineStart) / totalDays) * 100,
    width: (Math.max(differenceInCalendarDays(itemEnd, itemStart), 1) / totalDays) * 100
  };
}

export function GanttBoard({ groups }: { groups: GanttGroup[] }) {
  if (!groups.length) {
    return (
      <EmptyState
        icon={<CalendarIcon />}
        title="No timeline data under current filters"
        description="Adjust the global filters to bring campaigns, deliverables and tasks back into the Gantt view."
      />
    );
  }

  const globalStart = groups.reduce((min, group) => (group.startDate < min ? group.startDate : min), groups[0]?.startDate ?? "2026-04-01");
  const globalEnd = groups.reduce((max, group) => (group.endDate > max ? group.endDate : max), groups[0]?.endDate ?? "2026-07-31");
  const timelineDays = eachDayOfInterval({ start: parseISO(globalStart), end: parseISO(globalEnd) });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Gantt</CardTitle>
        <CardDescription>Timeline consolidada entre campaña, units of work y tareas clave.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[940px] space-y-8">
          <div className="grid grid-cols-[280px_1fr] gap-4">
            <div />
            <div className="grid grid-cols-8 gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {timelineDays.filter((_, index) => index % Math.max(Math.floor(timelineDays.length / 8), 1) === 0).map((day) => (
                <div key={day.toISOString()}>{formatDate(day.toISOString())}</div>
              ))}
            </div>
          </div>

          {groups.map((group) => (
            <div key={group.campaignId} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold">{group.campaignName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(group.startDate)} to {formatDate(group.endDate)} · {group.progress}% progress
                  </p>
                </div>
                {group.riskReasons?.length ? (
                  <div className="flex items-center gap-2 rounded-full bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                    <AlertTriangle className="size-4" />
                    {group.riskReasons[0]}
                  </div>
                ) : null}
              </div>

              <div className="space-y-3">
                {group.rows.map((row) => {
                  const span = getSpanPercent(row.startDate, row.endDate, globalStart, globalEnd);

                  return (
                    <div key={row.id} className="grid grid-cols-[280px_1fr] items-center gap-4">
                      <div>
                        <div className="font-medium">{row.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {row.type} · {row.team}
                        </div>
                        {row.dependencyLabel ? (
                          <div className="mt-1 inline-flex items-center gap-1 text-xs text-amber-700">
                            <GitBranch className="size-3.5" />
                            Depends on {row.dependencyLabel}
                          </div>
                        ) : null}
                      </div>
                      <div className="relative h-11 rounded-full bg-secondary/80">
                        <div
                          className={cn(
                            "absolute top-1/2 h-8 -translate-y-1/2 rounded-full px-4 py-2 text-xs font-medium text-white",
                            row.status === "BLOCKED"
                              ? "bg-rose-500"
                              : row.status === "DONE"
                                ? "bg-emerald-600"
                                : "bg-surface-700"
                          )}
                          style={{ left: `${span.left}%`, width: `${Math.max(span.width, 8)}%` }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate">{row.progress}%</span>
                            <Badge variant={getStatusVariant(row.status)} className="bg-white/20 text-white">
                              {workStatusLabels[row.status]}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CalendarIcon() {
  return <GitBranch className="size-6" />;
}
