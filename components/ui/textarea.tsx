import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-28 w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-surface-400 focus:ring-2 focus:ring-surface-200 disabled:cursor-not-allowed disabled:bg-muted",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
