import { subDays } from "date-fns";

import { getDemoReferenceDateString } from "@/lib/domain/demo-clock";
import {
  CampaignBundle,
  CampaignPerformanceSnapshot,
  DailyPerformancePoint,
  Performance,
  PerformanceInsight,
  PlatformPerformanceSnapshot,
  WeeklyPerformanceSummary
} from "@/types/domain";

export const PERFORMANCE_THRESHOLDS = {
  lowRoas: 1.8,
  highCpa: 120,
  steepRoasDropPct: -20
} as const;

export function calculateRoas(revenue: number, spend: number) {
  if (spend <= 0) return 0;
  return Number((revenue / spend).toFixed(2));
}

export function calculateCpa(spend: number, purchases: number) {
  if (purchases <= 0) return 0;
  return Number((spend / purchases).toFixed(2));
}

export function sumPerformance(entries: Performance[]) {
  const spend = entries.reduce((acc, entry) => acc + entry.spend, 0);
  const revenue = entries.reduce((acc, entry) => acc + entry.revenue, 0);
  const purchases = entries.reduce((acc, entry) => acc + entry.purchases, 0);

  return {
    spend,
    revenue,
    purchases,
    roas: calculateRoas(revenue, spend),
    cpa: calculateCpa(spend, purchases)
  };
}

export function getLatestPerformanceDate(entries: Performance[]) {
  return entries
    .map((entry) => entry.date)
    .sort((a, b) => a.localeCompare(b))
    .at(-1);
}

export function buildDailyPerformanceSeries(entries: Performance[]) {
  const byDate = new Map<string, Performance[]>();

  for (const entry of entries) {
    const current = byDate.get(entry.date) ?? [];
    current.push(entry);
    byDate.set(entry.date, current);
  }

  return Array.from(byDate.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, items]) => {
      const aggregate = sumPerformance(items);

      return {
        date,
        spend: aggregate.spend,
        revenue: aggregate.revenue,
        purchases: aggregate.purchases,
        roas: aggregate.roas,
        cpa: aggregate.cpa
      } satisfies DailyPerformancePoint;
    });
}

export function buildPlatformBreakdown(entries: Performance[]) {
  const byPlatform = new Map<Performance["platform"], Performance[]>();

  for (const entry of entries) {
    const current = byPlatform.get(entry.platform) ?? [];
    current.push(entry);
    byPlatform.set(entry.platform, current);
  }

  return Array.from(byPlatform.entries()).map(([platform, items]) => {
    const aggregate = sumPerformance(items);

    return {
      platform,
      spend: aggregate.spend,
      revenue: aggregate.revenue,
      purchases: aggregate.purchases,
      roas: aggregate.roas,
      cpa: aggregate.cpa
    } satisfies PlatformPerformanceSnapshot;
  });
}

export function getEntriesForDate(entries: Performance[], date: string) {
  return entries.filter((entry) => entry.date === date);
}

export function getEntriesForLastDays(entries: Performance[], endDate: string, days = 7) {
  const dates = Array.from({ length: days }, (_, index) =>
    subDays(new Date(endDate), days - index - 1).toISOString().slice(0, 10)
  );

  return entries.filter((entry) => dates.includes(entry.date));
}

export function calculatePerformancePriority(snapshot: {
  spend: number;
  roas: number;
  cpa: number;
  isActive: boolean;
}) {
  let score = 0;

  if (snapshot.isActive && snapshot.spend >= 10000 && snapshot.roas < PERFORMANCE_THRESHOLDS.lowRoas) {
    score += 3;
  }

  if (snapshot.isActive && snapshot.cpa >= PERFORMANCE_THRESHOLDS.highCpa) {
    score += 2;
  }

  if (snapshot.spend >= 20000) {
    score += 1;
  }

  return score;
}

export function buildCampaignPerformanceSnapshot(
  bundle: CampaignBundle,
  entries: Performance[],
  previousEntries: Performance[]
) {
  const aggregate = sumPerformance(entries);
  const previous = sumPerformance(previousEntries);
  const roasDeltaPct =
    previous.roas > 0 ? Number((((aggregate.roas - previous.roas) / previous.roas) * 100).toFixed(1)) : undefined;
  const spendDeltaPct =
    previous.spend > 0
      ? Number((((aggregate.spend - previous.spend) / previous.spend) * 100).toFixed(1))
      : undefined;

  return {
    campaignId: bundle.campaign.id,
    campaignName: bundle.campaign.name,
    spend: aggregate.spend,
    revenue: aggregate.revenue,
    purchases: aggregate.purchases,
    roas: aggregate.roas,
    cpa: aggregate.cpa,
    spendDeltaPct,
    roasDeltaPct,
    priorityScore: calculatePerformancePriority({
      spend: aggregate.spend,
      roas: aggregate.roas,
      cpa: aggregate.cpa,
      isActive: !["COMPLETED", "DRAFT", "ON_HOLD"].includes(bundle.campaign.status)
    })
  } satisfies CampaignPerformanceSnapshot;
}

export function buildPerformanceInsights(
  bundles: CampaignBundle[],
  performances: Performance[],
  referenceDate = getDemoReferenceDateString()
) {
  const previousDate = subDays(new Date(referenceDate), 1).toISOString().slice(0, 10);

  const insights = bundles.flatMap((bundle) => {
    const campaignEntries = performances.filter((entry) => entry.campaignId === bundle.campaign.id);
    const todayEntries = getEntriesForDate(campaignEntries, referenceDate);

    if (!todayEntries.length) return [];

    const yesterdayEntries = getEntriesForDate(campaignEntries, previousDate);
    const snapshot = buildCampaignPerformanceSnapshot(bundle, todayEntries, yesterdayEntries);
    const items: PerformanceInsight[] = [];

    if (snapshot.roas > 0 && snapshot.roas < PERFORMANCE_THRESHOLDS.lowRoas) {
      items.push({
        id: `${bundle.campaign.id}-low-roas`,
        campaignId: bundle.campaign.id,
        campaignName: bundle.campaign.name,
        title: `${bundle.campaign.name} is underperforming today`,
        detail: `ROAS is ${snapshot.roas.toFixed(1)}x on ${snapshot.spend.toLocaleString()} spend.`,
        recommendation: "Consider reducing budget or shifting spend to the best-performing platform.",
        severity: "high",
        priorityScore: snapshot.priorityScore + 2
      });
    }

    if (snapshot.cpa >= PERFORMANCE_THRESHOLDS.highCpa) {
      items.push({
        id: `${bundle.campaign.id}-high-cpa`,
        campaignId: bundle.campaign.id,
        campaignName: bundle.campaign.name,
        title: `${bundle.campaign.name} is showing high CPA`,
        detail: `CPA reached ${snapshot.cpa.toFixed(0)} today.`,
        recommendation: "Tighten targeting and review landing page friction before scaling further.",
        severity: "medium",
        priorityScore: snapshot.priorityScore + 1
      });
    }

    if (
      typeof snapshot.roasDeltaPct === "number" &&
      snapshot.roasDeltaPct <= PERFORMANCE_THRESHOLDS.steepRoasDropPct
    ) {
      items.push({
        id: `${bundle.campaign.id}-roas-drop`,
        campaignId: bundle.campaign.id,
        campaignName: bundle.campaign.name,
        title: `ROAS dropped ${Math.abs(snapshot.roasDeltaPct).toFixed(0)}% vs yesterday`,
        detail: `${bundle.campaign.name} moved from yesterday's baseline to ${snapshot.roas.toFixed(1)}x today.`,
        recommendation: "Review creative fatigue, platform mix and audience overlap before tomorrow's budget cycle.",
        severity: "high",
        priorityScore: snapshot.priorityScore + 2
      });
    }

    return items;
  });

  return insights.sort((left, right) => right.priorityScore - left.priorityScore).slice(0, 6);
}

export function buildWeeklyPerformanceSummary(
  bundles: CampaignBundle[],
  performances: Performance[],
  referenceDate = getDemoReferenceDateString()
) {
  const weeklyEntries = getEntriesForLastDays(performances, referenceDate, 7);
  const aggregate = sumPerformance(weeklyEntries);
  const snapshots = bundles
    .map((bundle) => {
      const campaignEntries = weeklyEntries.filter((entry) => entry.campaignId === bundle.campaign.id);
      return buildCampaignPerformanceSnapshot(bundle, campaignEntries, []);
    })
    .filter((snapshot) => snapshot.spend > 0)
    .sort((left, right) => right.roas - left.roas);

  return {
    totalSpend: aggregate.spend,
    totalRevenue: aggregate.revenue,
    avgRoas: aggregate.roas,
    avgCpa: aggregate.cpa,
    bestCampaigns: snapshots.slice(0, 3),
    worstCampaigns: snapshots.slice().sort((left, right) => left.roas - right.roas).slice(0, 3),
    recommendations: buildPerformanceInsights(bundles, performances, referenceDate)
      .slice(0, 3)
      .map((insight) => insight.recommendation)
  } satisfies WeeklyPerformanceSummary;
}
