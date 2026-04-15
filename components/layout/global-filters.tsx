"use client";

import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFilterOptions } from "@/lib/data";
import { campaignStatusLabels, priorityLabels } from "@/lib/presentation";

const options = getFilterOptions();

const filterGroups = [
  {
    key: "company",
    label: "Company",
    options: options.companies.map((item) => ({ value: item.id, label: item.name }))
  },
  {
    key: "product",
    label: "Product",
    options: options.products.map((item) => ({ value: item.id, label: item.name }))
  },
  {
    key: "team",
    label: "Team",
    options: options.teams.map((item) => ({ value: item.id, label: item.name }))
  },
  {
    key: "status",
    label: "Status",
    options: Object.entries(campaignStatusLabels).map(([value, label]) => ({ value, label }))
  },
  {
    key: "priority",
    label: "Priority",
    options: Object.entries(priorityLabels).map(([value, label]) => ({ value, label }))
  }
] as const;

export function GlobalFilters() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCompany = searchParams.get("company");
  const activeFiltersCount = ["company", "product", "team", "status", "priority", "date"].filter(
    (key) => !!searchParams.get(key)
  ).length;
  const availableProducts = selectedCompany
    ? options.products.filter((item) => item.companyId === selectedCompany)
    : options.products;

  const shouldShow =
    pathname === "/dashboard" ||
    pathname === "/campaigns" ||
    pathname === "/marketing-plan" ||
    pathname === "/gantt" ||
    pathname === "/teams";

  if (!shouldShow) return null;

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "ALL") params.delete(key);
    else params.set(key, value);

    if (key === "company") {
      const nextProducts = value && value !== "ALL"
        ? options.products.filter((item) => item.companyId === value)
        : options.products;
      const currentProduct = params.get("product");

      if (currentProduct && !nextProducts.some((item) => item.id === currentProduct)) {
        params.delete("product");
      }
    }

    router.push(`${pathname}?${params.toString()}` as Route);
  }

  function clearAll() {
    router.push(pathname as Route);
  }

  return (
    <div className="mb-6 rounded-[1.5rem] border border-white/70 bg-white/85 p-4 shadow-soft backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-surface-800">
          <SlidersHorizontal className="size-4" />
          Global filters
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {activeFiltersCount} active
          </span>
        </div>
        <Button disabled={activeFiltersCount === 0} onClick={clearAll} size="sm" type="button" variant="ghost">
          <X className="mr-2 size-4" />
          Clear
        </Button>
      </div>

      <div className="grid gap-3 lg:grid-cols-6">
        {filterGroups.map((filter) => (
          <label key={filter.key} className="space-y-2 text-sm">
            <span className="font-medium text-muted-foreground">{filter.label}</span>
            <select
              className="flex h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none transition focus-visible:border-surface-400 focus-visible:ring-2 focus-visible:ring-surface-200"
              value={searchParams.get(filter.key) ?? "ALL"}
              onChange={(event) => updateParam(filter.key, event.target.value)}
            >
              <option value="ALL">All</option>
              {(filter.key === "product"
                ? availableProducts.map((item) => ({ value: item.id, label: item.name }))
                : filter.options
              ).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}

        <label className="space-y-2 text-sm">
          <span className="font-medium text-muted-foreground">Date</span>
          <Input
            value={searchParams.get("date") ?? ""}
            onChange={(event) => updateParam("date", event.target.value)}
            type="date"
          />
        </label>
      </div>
    </div>
  );
}
