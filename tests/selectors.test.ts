import test from "node:test";
import assert from "node:assert/strict";

import { getDashboardMetrics, getMarketingPlanMetrics, getTeamsMetrics, toCampaignFilters } from "../lib/data";

test("toCampaignFilters normalizes only valid status and priority values", () => {
  const filters = toCampaignFilters({
    company: "company-aurora",
    status: "NOT_A_STATUS",
    priority: "HIGH"
  });

  assert.deepEqual(filters, {
    company: "company-aurora",
    product: undefined,
    team: undefined,
    status: undefined,
    priority: "HIGH",
    date: undefined
  });
});

test("dashboard metrics stay internally consistent", () => {
  const metrics = getDashboardMetrics();
  const budgetFromRows = metrics.budgetByCampaign.reduce((acc, item) => acc + item.budget, 0);
  const spendFromRows = metrics.budgetByCampaign.reduce((acc, item) => acc + item.spent, 0);

  assert.equal(metrics.summary.totalBudget, budgetFromRows);
  assert.equal(metrics.summary.totalSpend, spendFromRows);
  assert.ok(metrics.campaignTable.length > 0);
  assert.ok(metrics.teamLoad.every((team) => team.openTasks > 0 || team.actualHours > 0));
  assert.ok(metrics.deadlines.every((deadline) => deadline.status !== "DONE"));
});

test("marketing plan metrics align with finance table totals", () => {
  const metrics = getMarketingPlanMetrics({ company: "company-northstar" });

  assert.equal(
    metrics.totalBudget,
    metrics.campaignFinance.reduce((acc, campaign) => acc + campaign.budget, 0)
  );
  assert.equal(
    metrics.totalSpend,
    metrics.campaignFinance.reduce((acc, campaign) => acc + campaign.spend, 0)
  );
  assert.ok(metrics.companyGroups.every((group) => group.company === "Northstar Consumer"));
});

test("team metrics preserve visible capacity when campaigns remain under the filter set", () => {
  const metrics = getTeamsMetrics({ company: "company-northstar", status: "COMPLETED" });

  assert.ok(metrics.campaignCount >= 1);
  assert.ok(metrics.teams.length > 0);
  assert.ok(metrics.people.length > 0);
  assert.ok(metrics.teams.some((team) => team.openTasks === 0 && team.actualHours === 0));
});
