import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users2 } from "lucide-react";

export function PersonWorkloadTable({
  people
}: {
  people: {
    id: string;
    name: string;
    title: string;
    team: string;
    openTasks: number;
    blocked: number;
    averageProgress: number;
    estimatedHours: number;
    actualHours: number;
  }[];
}) {
  if (!people.length) {
    return (
      <EmptyState
        icon={<Users2 className="size-6" />}
        title="No workload for people under current filters"
        description="Try widening company, product, team or status filters to recover assignee-level activity."
      />
    );
  }

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Workload by person</CardTitle>
        <CardDescription>Seguimiento de carga, bloqueo y avance a nivel responsable.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="table-readable min-w-full text-left text-sm">
          <thead className="border-b">
            <tr>
              <th className="pb-3 pr-4">Person</th>
              <th className="pb-3 pr-4">Team</th>
              <th className="pb-3 pr-4">Open Tasks</th>
              <th className="pb-3 pr-4">Blocked</th>
              <th className="pb-3 pr-4">Planned</th>
              <th className="pb-3 pr-4">Actual</th>
              <th className="pb-3">Progress</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id} className="border-b border-border/70 transition hover:bg-secondary/40 last:border-0">
                <td className="pr-4">
                  <div className="font-medium">{person.name}</div>
                  <div className="text-xs text-muted-foreground">{person.title}</div>
                </td>
                <td className="pr-4">{person.team}</td>
                <td className="pr-4">{person.openTasks}</td>
                <td className="pr-4">{person.blocked}</td>
                <td className="pr-4">{person.estimatedHours}h</td>
                <td className="pr-4">{person.actualHours}h</td>
                <td className="min-w-40">
                  <div className="mb-2">{person.averageProgress}%</div>
                  <Progress value={person.averageProgress} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
