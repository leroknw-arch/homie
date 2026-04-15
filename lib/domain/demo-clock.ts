import { parseISO } from "date-fns";

const DEFAULT_DEMO_REFERENCE_DATE = "2026-04-14";

export function getDemoReferenceDate() {
  return parseISO(process.env.DEMO_REFERENCE_DATE ?? DEFAULT_DEMO_REFERENCE_DATE);
}

export function getDemoReferenceDateString() {
  return (process.env.DEMO_REFERENCE_DATE ?? DEFAULT_DEMO_REFERENCE_DATE).slice(0, 10);
}
