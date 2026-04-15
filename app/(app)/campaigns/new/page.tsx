import { ListTodo } from "lucide-react";

import { auth } from "@/auth";
import { canCreateCampaign } from "@/lib/auth/permissions";
import { CampaignForm } from "@/components/forms/campaign-form";
import { DeliverableForm } from "@/components/forms/deliverable-form";
import { TaskForm } from "@/components/forms/task-form";
import { PageHero } from "@/components/layout/page-hero";
import { EmptyState } from "@/components/ui/empty-state";

export default async function CampaignFormsPage() {
  const session = await auth();

  if (!canCreateCampaign(session?.user?.role)) {
    return (
      <div className="space-y-6">
        <PageHero
          description="El acceso a creación de campañas está reservado para roles con ownership operativo."
          eyebrow="Permisos"
          title="Acceso restringido"
        />

        <EmptyState
          icon={<ListTodo className="size-6" />}
          title="Tu rol no puede crear campañas"
          description="Usa un rol Admin, Head of Marketing o Team Lead para acceder a estos formularios de demo."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHero
        description="Formularios demo listos para captura inicial consistente y futura persistencia real."
        eyebrow="Formularios"
        title="Captura demo de campañas, entregables y tasks"
      />

      <div className="grid gap-6">
        <CampaignForm />
        <DeliverableForm />
        <TaskForm />
      </div>
    </div>
  );
}
