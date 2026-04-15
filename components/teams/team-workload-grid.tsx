import { Users2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";

export function TeamWorkloadGrid({
  teams
}: {
  teams: {
    id: string;
    name: string;
    members: number;
    openTasks: number;
    blocked: number;
    averageProgress: number;
    estimatedHours: number;
    actualHours: number;
  }[];
}) {
  if (!teams.length) {
    return (
      <EmptyState
        icon={<Users2 className="size-6" />}
        title="No team workload under current filters"
        description="Adjust the global filters to bring campaigns and team activity back into view."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {teams.map((team) => (
        <Card key={team.id} className="glass-panel">
          <CardHeader>
            <CardTitle>{team.name}</CardTitle>
            <CardDescription>{team.members} members active</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground">Open</div>
                <div className="font-display text-2xl font-semibold">{team.openTasks}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Blocked</div>
                <div className="font-display text-2xl font-semibold">{team.blocked}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Progress</div>
                <div className="font-display text-2xl font-semibold">{team.averageProgress}%</div>
              </div>
            </div>
            <div className="rounded-[1.15rem] bg-white/70 px-4 py-3 text-sm text-muted-foreground">
              {team.actualHours}h actual / {team.estimatedHours}h planned
            </div>
            <Progress value={team.averageProgress} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
