import { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  aside,
  tone = "dark"
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden border-0",
        tone === "dark"
          ? "bg-transparent text-white shadow-none"
          : "glass-panel text-foreground"
      )}
    >
      <CardContent
        className={cn(
          "grid gap-6 rounded-[1.9rem] p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-7",
          tone === "dark" &&
            "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(233,193,255,0.12),transparent_18%),linear-gradient(135deg,#171717_0%,#2f3f21_100%)] shadow-panel"
        )}
      >
        <div className="space-y-3">
          <div
            className={cn(
              "text-xs uppercase tracking-[0.2em]",
              tone === "dark" ? "text-white/60" : "text-muted-foreground"
            )}
          >
            {eyebrow}
          </div>
          <h2 className="max-w-3xl text-balance font-display text-4xl font-semibold tracking-[-0.03em]">{title}</h2>
          <p
            className={cn(
              "max-w-3xl text-sm leading-6 sm:text-base",
              tone === "dark" ? "text-white/74" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        </div>

        {aside ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">{aside}</div> : null}
      </CardContent>
    </Card>
  );
}
