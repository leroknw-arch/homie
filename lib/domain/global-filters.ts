import { GlobalFilters } from "@/types/domain";

export const GLOBAL_FILTER_KEYS = [
  "company",
  "product",
  "team",
  "status",
  "priority",
  "date"
] as const;

export function extractGlobalFilters(
  input?: Record<string, string | undefined>
): GlobalFilters | undefined {
  if (!input) return undefined;

  return {
    company: input.company,
    product: input.product,
    team: input.team,
    status: input.status as GlobalFilters["status"],
    priority: input.priority as GlobalFilters["priority"],
    date: input.date
  };
}

export function getGlobalFilterQueryString(
  searchParams: URLSearchParams | ReadonlyURLSearchParamsLike
) {
  const next = new URLSearchParams();

  for (const key of GLOBAL_FILTER_KEYS) {
    const value = searchParams.get(key);

    if (value) next.set(key, value);
  }

  return next.toString();
}

type ReadonlyURLSearchParamsLike = {
  get(name: string): string | null;
};
