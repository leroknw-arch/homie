import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-[1.15rem] border border-border bg-white/92 px-4 text-sm outline-none transition placeholder:text-muted-foreground shadow-[0_10px_30px_-24px_rgba(15,23,42,0.28)] focus:border-surface-400 focus:ring-2 focus:ring-surface-200 disabled:cursor-not-allowed disabled:bg-muted",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
