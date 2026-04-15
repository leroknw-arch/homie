import { addDays, format, subDays } from "date-fns";

import { getDemoReferenceDate } from "@/lib/domain/demo-clock";
import { PerformancePlatform } from "@/types/domain";

type PerformanceProfile = {
  campaignId: string;
  mode: "live" | "historical" | "none";
  anchorDate?: string;
  channels: {
    platform: PerformancePlatform;
    baseSpend: number;
    baseRevenue: number;
    basePurchases: number;
    dailySpendDelta: number;
    dailyRevenueDelta: number;
    dailyPurchasesDelta: number;
  }[];
};

const demoReferenceDate = getDemoReferenceDate();

const performanceProfiles: PerformanceProfile[] = [
  {
    campaignId: "campaign-demand-engine",
    mode: "live",
    channels: [
      {
        platform: "GOOGLE",
        baseSpend: 13200,
        baseRevenue: 45200,
        basePurchases: 54,
        dailySpendDelta: 260,
        dailyRevenueDelta: 1480,
        dailyPurchasesDelta: 2
      },
      {
        platform: "META",
        baseSpend: 9100,
        baseRevenue: 24800,
        basePurchases: 31,
        dailySpendDelta: 180,
        dailyRevenueDelta: 780,
        dailyPurchasesDelta: 1
      }
    ]
  },
  {
    campaignId: "campaign-pulse-launch",
    mode: "live",
    channels: [
      {
        platform: "META",
        baseSpend: 11600,
        baseRevenue: 9800,
        basePurchases: 12,
        dailySpendDelta: 220,
        dailyRevenueDelta: -320,
        dailyPurchasesDelta: 0
      },
      {
        platform: "GOOGLE",
        baseSpend: 7600,
        baseRevenue: 8900,
        basePurchases: 11,
        dailySpendDelta: 120,
        dailyRevenueDelta: -180,
        dailyPurchasesDelta: 0
      },
      {
        platform: "TIKTOK",
        baseSpend: 4200,
        baseRevenue: 2500,
        basePurchases: 4,
        dailySpendDelta: 80,
        dailyRevenueDelta: -140,
        dailyPurchasesDelta: 0
      }
    ]
  },
  {
    campaignId: "campaign-brand-refresh",
    mode: "none",
    channels: []
  },
  {
    campaignId: "campaign-luma-summer",
    mode: "live",
    channels: [
      {
        platform: "META",
        baseSpend: 10200,
        baseRevenue: 43800,
        basePurchases: 68,
        dailySpendDelta: 160,
        dailyRevenueDelta: 1420,
        dailyPurchasesDelta: 2
      },
      {
        platform: "TIKTOK",
        baseSpend: 8400,
        baseRevenue: 30100,
        basePurchases: 49,
        dailySpendDelta: 120,
        dailyRevenueDelta: 1100,
        dailyPurchasesDelta: 1
      },
      {
        platform: "GOOGLE",
        baseSpend: 4800,
        baseRevenue: 18400,
        basePurchases: 22,
        dailySpendDelta: 60,
        dailyRevenueDelta: 520,
        dailyPurchasesDelta: 1
      }
    ]
  },
  {
    campaignId: "campaign-peak-retail",
    mode: "historical",
    anchorDate: "2026-04-10",
    channels: [
      {
        platform: "META",
        baseSpend: 1800,
        baseRevenue: 2400,
        basePurchases: 5,
        dailySpendDelta: -120,
        dailyRevenueDelta: -180,
        dailyPurchasesDelta: -1
      },
      {
        platform: "GOOGLE",
        baseSpend: 1200,
        baseRevenue: 1800,
        basePurchases: 4,
        dailySpendDelta: -80,
        dailyRevenueDelta: -120,
        dailyPurchasesDelta: 0
      }
    ]
  },
  {
    campaignId: "campaign-always-on",
    mode: "historical",
    anchorDate: "2026-03-31",
    channels: [
      {
        platform: "GOOGLE",
        baseSpend: 6200,
        baseRevenue: 37200,
        basePurchases: 54,
        dailySpendDelta: 140,
        dailyRevenueDelta: 1120,
        dailyPurchasesDelta: 1
      },
      {
        platform: "META",
        baseSpend: 3100,
        baseRevenue: 12200,
        basePurchases: 18,
        dailySpendDelta: 60,
        dailyRevenueDelta: 380,
        dailyPurchasesDelta: 1
      }
    ]
  }
];

export const performanceBlueprints = performanceProfiles.flatMap((profile) => {
  if (profile.mode === "none") return [];

  const endDate =
    profile.mode === "live"
      ? demoReferenceDate
      : new Date(profile.anchorDate ?? format(demoReferenceDate, "yyyy-MM-dd"));
  const startDate = subDays(endDate, 6);

  return profile.channels.flatMap((channel, channelIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => {
      const day = addDays(startDate, dayIndex);
      const adjustment = dayIndex - 3 + channelIndex;
      const spend = Math.max(0, channel.baseSpend + adjustment * channel.dailySpendDelta);
      const revenue = Math.max(0, channel.baseRevenue + adjustment * channel.dailyRevenueDelta);
      const purchases = Math.max(1, channel.basePurchases + adjustment * channel.dailyPurchasesDelta);

      return {
        id: `${profile.campaignId}-${channel.platform.toLowerCase()}-${format(day, "yyyyMMdd")}`,
        campaignId: profile.campaignId,
        date: format(day, "yyyy-MM-dd"),
        platform: channel.platform,
        spend,
        revenue,
        purchases
      };
    })
  );
});
