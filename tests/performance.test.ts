import test from "node:test";
import assert from "node:assert/strict";

import { getCampaignPerformanceDetail, getDashboardPerformanceMetrics } from "../lib/data";

test("dashboard performance metrics expose today's control-center summary", () => {
  const metrics = getDashboardPerformanceMetrics();

  assert.ok(metrics.summary.spend > 0);
  assert.ok(metrics.summary.revenue > 0);
  assert.ok(metrics.summary.roas > 0);
  assert.ok(metrics.topCampaigns.length > 0);
  assert.ok(metrics.worstCampaigns.length > 0);
  assert.ok(metrics.insights.length > 0);
  assert.ok(metrics.weeklySummary.totalSpend >= metrics.summary.spend);
});

test("campaign performance detail returns trends, breakdown and latest entries", () => {
  const detail = getCampaignPerformanceDetail("campaign-pulse-launch");

  assert.ok(detail);
  assert.ok(detail.snapshot);
  assert.ok(detail!.dailySeries.length > 0);
  assert.ok(detail!.platformBreakdown.length > 0);
  assert.ok(detail!.latestEntries.length > 0);
  assert.ok(detail!.insights.length > 0);
});

test("campaigns without performance return a clean empty performance state", () => {
  const detail = getCampaignPerformanceDetail("campaign-brand-refresh");

  assert.ok(detail);
  assert.equal(detail!.dailySeries.length, 0);
  assert.equal(detail!.platformBreakdown.length, 0);
  assert.equal(detail!.latestEntries.length, 0);
});
