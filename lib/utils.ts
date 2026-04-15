import { clsx, type ClassValue } from "clsx";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPercent(value: number, digits = 0) {
  return `${value.toFixed(digits)}%`;
}

export function formatDate(value: string) {
  return format(parseISO(value), "MMM d");
}

export function compactLabel(value: string, max = 22) {
  if (value.length <= max) return value;

  const words = value.split(" ");
  const compactWords = words.slice(0, 3).join(" ");

  if (compactWords.length <= max) return `${compactWords}…`;

  return `${value.slice(0, max - 1)}…`;
}

export function getProgressTone(progress: number) {
  if (progress >= 80) return "text-emerald-700";
  if (progress >= 50) return "text-amber-700";
  return "text-rose-700";
}
