"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

import { canCreateCampaign, roleLabels } from "@/lib/auth/permissions";
import { LogoutButton } from "@/components/auth/logout-button";
import { GlobalFilters } from "@/components/layout/global-filters";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import logoHomie from "@/design-system/logo-homie.png";

const pageMeta = {
  "/dashboard": {
    eyebrow: "Workspace ejecutivo",
    title: "Control del marketing plan",
    description: "Lee presupuesto, riesgo, progreso y capacidad sin perder foco ejecutivo."
  },
  "/campaigns": {
    eyebrow: "Workspace de campañas",
    title: "Portafolio de campañas",
    description: "Navega campañas, responsables, prioridades y retorno esperado."
  },
  "/marketing-plan": {
    eyebrow: "Marketing plan",
    title: "Budget y ROI del plan",
    description: "Evalúa eficiencia del plan por compañía, producto y campaña."
  },
  "/gantt": {
    eyebrow: "Workspace de timeline",
    title: "Timeline de ejecución",
    description: "Visualiza dependencias, solapamientos y campañas en riesgo."
  },
  "/teams": {
    eyebrow: "Workspace de carga",
    title: "Capacidad y carga operativa",
    description: "Balancea carga por equipo y por persona con una lectura clara."
  },
  "/campaigns/new": {
    eyebrow: "Formularios de ejecución",
    title: "Captura de trabajo",
    description: "Crea campañas, deliverables y tasks con inputs simples y consistentes."
  }
} as const;

export function AppShell({
  children,
  user
}: {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    role: string;
    title: string;
  };
}) {
  const pathname = usePathname();
  const meta =
    pageMeta[pathname as keyof typeof pageMeta] ??
    (pathname.startsWith("/campaigns/")
      ? {
          eyebrow: "Workspace de campañas",
          title: "Detalle de campaña",
          description: "Baja del resumen ejecutivo al detalle operativo sin perder contexto."
        }
      : pageMeta["/dashboard"]);
  const showCreateAction = canCreateCampaign(user.role);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.68))] px-5 py-6 backdrop-blur-md lg:border-b-0 lg:border-r">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image
              alt="HOMIE logo"
              className="h-auto w-[144px]"
              priority
              src={logoHomie}
            />
          </Link>
        </div>

        <SidebarNav pathname={pathname} role={user.role} />

        <div className="mt-8 rounded-[1.6rem] bg-[linear-gradient(145deg,#131313_0%,#232323_100%)] p-5 text-white shadow-panel">
          <div className="text-xs uppercase tracking-[0.18em] text-white/58">Usuario actual</div>
          <div className="mt-3">
            <div className="font-medium text-white">{user.name}</div>
            <div className="text-sm text-white/70">
              {user.title} · {roleLabels[user.role as keyof typeof roleLabels] ?? user.role}
            </div>
          </div>
          <p className="mt-3 text-sm text-white/80">
            Prioriza insight ejecutivo, detecta riesgo y baja al detalle solo cuando hace falta.
          </p>
          <div className="mt-4">
            <LogoutButton />
          </div>
        </div>
      </aside>

      <main className="px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <header className="glass-panel mb-6 flex flex-col gap-4 rounded-[1.8rem] border border-white/70 px-5 py-4 shadow-soft backdrop-blur-md md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {meta.eyebrow}
            </div>
            <h1 className="font-display text-2xl font-semibold">{meta.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{meta.description}</p>
          </div>

          {showCreateAction ? (
            <Button asChild>
              <Link href="/campaigns/new">
                <Plus className="mr-2 size-4" />
                Nueva campaña
              </Link>
            </Button>
          ) : null}
        </header>

        <GlobalFilters />

        {children}
      </main>
    </div>
  );
}
