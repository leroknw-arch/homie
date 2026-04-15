import type { Route } from "next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BarChart3, CalendarRange, FolderKanban, LayoutDashboard, ListTodo, Users2 } from "lucide-react";

import { canCreateCampaign } from "@/lib/auth/permissions";
import { getGlobalFilterQueryString } from "@/lib/domain/global-filters";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campañas", icon: FolderKanban },
  { href: "/marketing-plan", label: "Plan de Marketing", icon: BarChart3 },
  { href: "/gantt", label: "Gantt", icon: CalendarRange },
  { href: "/teams", label: "Equipos", icon: Users2 },
  { href: "/campaigns/new", label: "Formularios", icon: ListTodo }
] satisfies { href: Route; label: string; icon: typeof LayoutDashboard }[];

export function SidebarNav({
  pathname,
  role
}: {
  pathname: string;
  role: string;
}) {
  const searchParams = useSearchParams();
  const globalFilterQuery = getGlobalFilterQueryString(searchParams);
  const visibleItems = items.filter((item) =>
    item.href === "/campaigns/new" ? canCreateCampaign(role) : true
  );

  return (
    <nav className="space-y-1">
      {visibleItems.map((item) => {
        const isCampaignWorkspace =
          item.href === "/campaigns" &&
          (pathname === "/campaigns" || (pathname.startsWith("/campaigns/") && !pathname.startsWith("/campaigns/new")));
        const isActive =
          item.href === "/campaigns/new"
            ? pathname === item.href
            : isCampaignWorkspace || pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={(globalFilterQuery ? `${item.href}?${globalFilterQuery}` : item.href) as Route}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
              isActive
                ? "bg-white text-foreground shadow-soft"
                : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
