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
      <span className="text-[0.95rem] font-medium text-foreground">
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
        "flex h-11 w-full rounded-[1.15rem] border border-border bg-white/92 px-4 text-sm outline-none transition shadow-[0_10px_30px_-24px_rgba(15,23,42,0.28)] focus:border-surface-400 focus:ring-2 focus:ring-surface-200 disabled:cursor-not-allowed disabled:bg-muted",
        className
      )}
      {...props}
    />
  );
}
