import { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  icon
}: {
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex min-h-56 flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="rounded-[1.25rem] bg-secondary p-4 text-surface-700 shadow-soft">{icon}</div>
        <div className="space-y-1">
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
