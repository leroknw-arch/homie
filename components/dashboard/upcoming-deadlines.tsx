import { CalendarRange } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getStatusVariant, workStatusLabels } from "@/lib/presentation";
import { formatDate } from "@/lib/utils";
import { WorkStatus } from "@/types/domain";

export function UpcomingDeadlines({
  deadlines
}: {
  deadlines: {
    id: string;
    title: string;
    dueDate: string;
    campaignName: string;
    status: WorkStatus;
  }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming deadlines</CardTitle>
        <CardDescription>Los próximos hitos que pueden impactar el plan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {!deadlines.length ? (
          <EmptyState
            icon={<CalendarRange className="size-6" />}
            title="No upcoming deadlines"
            description="No deliverable deadlines are visible under the current filters."
          />
        ) : null}
        {deadlines.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl bg-secondary/55 px-4 py-3">
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-muted-foreground">{item.campaignName}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{formatDate(item.dueDate)}</div>
              <Badge className="mt-1" variant={getStatusVariant(item.status)}>
                {workStatusLabels[item.status]}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
