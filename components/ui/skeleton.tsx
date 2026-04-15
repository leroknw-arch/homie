import { cn } from "@/lib/utils";

export function Skeleton({
  className
}: {
  className?: string;
}) {
  return <div className={cn("animate-pulse rounded-[1.25rem] bg-secondary/80", className)} />;
}
