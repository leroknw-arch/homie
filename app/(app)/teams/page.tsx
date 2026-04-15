import { Users2 } from "lucide-react";

import { TeamLoadChart } from "@/components/charts/team-load-chart";
import { PageHero } from "@/components/layout/page-hero";
import { PersonWorkloadTable } from "@/components/teams/person-workload-table";
import { TeamWorkloadGrid } from "@/components/teams/team-workload-grid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getDashboardMetrics, getTeamsMetrics, toCampaignFilters } from "@/lib/data";

type PageProps = {
  searchParams?: Promise<{
    company?: string;
    product?: string;
    team?: string;
    status?: string;
    priority?: string;
    date?: string;
  }>;
};

export default async function TeamsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = toCampaignFilters(resolvedSearchParams);
  const workload = getTeamsMetrics(filters);
  const dashboard = getDashboardMetrics(filters);
  const hasWorkload = workload.campaignCount > 0;

  return (
    <div className="space-y-6">
      <PageHero
        description="Ideal para balancear trabajo operativo entre diseño, PR, community, growth y ventas."
        eyebrow="Team capacity view"
        title="Carga, bloqueo y avance por equipo"
      />

      {!hasWorkload ? (
        <EmptyState
          icon={<Users2 className="size-6" />}
          title="No workload under the current filters"
          description="Widen the active filters to bring team and assignee activity back into view."
        />
      ) : null}

      {hasWorkload ? <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Workload trend</CardTitle>
            <CardDescription>Horas planeadas vs horas reales por equipo.</CardDescription>
          </CardHeader>
          <CardContent>
            <TeamLoadChart data={dashboard.teamLoad} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Executive notes</CardTitle>
            <CardDescription>Lectura rápida de capacidad del equipo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>{workload.summary.totalOpenTasks} open tasks permanecen activas bajo los filtros globales actuales.</p>
            <p>{workload.summary.totalActualHours} horas reales ya fueron invertidas por el equipo visible en pantalla.</p>
            <p>Esta vista ya permite leer capacidad tanto por equipo como por persona responsable.</p>
          </CardContent>
        </Card>
      </section> : null}

      {hasWorkload ? <TeamWorkloadGrid teams={workload.teams} /> : null}
      {hasWorkload ? <PersonWorkloadTable people={workload.people} /> : null}
    </div>
  );
}
