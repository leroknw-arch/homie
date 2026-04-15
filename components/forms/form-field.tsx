import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function FormField({
  label,
  hint,
  htmlFor,
  required,
  children,
  className
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("space-y-2 text-sm", className)} htmlFor={htmlFor}>
      <span className="font-medium text-foreground">
        {label}
        {required ? <span className="ml-1 text-rose-600">*</span> : null}
      </span>
      {children}
      {hint ? <p className="text-xs leading-5 text-muted-foreground">{hint}</p> : null}
    </label>
  );
}

export function FormSelect({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none transition focus:border-surface-400 focus:ring-2 focus:ring-surface-200 disabled:cursor-not-allowed disabled:bg-muted",
        className
      )}
      {...props}
    />
  );
}
