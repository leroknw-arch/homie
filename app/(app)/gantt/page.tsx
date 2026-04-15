import { GanttBoard } from "@/components/gantt/gantt-board";
import { PageHero } from "@/components/layout/page-hero";
import { getGanttRows, toCampaignFilters } from "@/lib/data";

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

export default async function GanttPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const groups = getGanttRows(toCampaignFilters(resolvedSearchParams));

  return (
    <div className="space-y-6">
      <PageHero
        description="Detecta rápido cuellos de botella, solapamientos y campañas con avance por debajo del esperado."
        eyebrow="Timeline view"
        title="Gantt del portfolio y su ejecución"
      />

      <GanttBoard groups={groups} />
    </div>
  );
}
