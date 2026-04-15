import test from "node:test";
import assert from "node:assert/strict";

import { assessCampaignRisk, calculateCampaignProgress, calculateExpectedProgress } from "../lib/domain/campaign-health";
import type { Campaign, Deliverable, Task } from "../types/domain";

const baseCampaign: Campaign = {
  id: "campaign-test",
  companyId: "company-aurora",
  productId: "product-aurora-pulse",
  name: "Risk Test Campaign",
  description: "Synthetic campaign for business-logic tests.",
  objective: "Validate progress and risk rules.",
  ownerId: "user-ariana",
  priority: "HIGH",
  status: "IN_PROGRESS",
  startDate: "2026-04-01",
  endDate: "2026-04-30",
  progress: 0,
  budgetTotal: 100000,
  budgetSpent: 40000,
  roi: 1.4,
  kpiName: "Pipeline",
  kpiValue: "$120k",
  teamIds: ["team-growth"]
};

test("calculateCampaignProgress applies the weighted deliverable/task mix", () => {
  const deliverables: Deliverable[] = [
    {
      id: "d-1",
      title: "Launch page",
      campaignId: "campaign-test",
      unitOfWorkId: "unit-1",
      type: "Landing Page",
      ownerId: "user-maya",
      teamId: "team-design",
      dueDate: "2026-04-10",
      status: "IN_PROGRESS",
      priority: "HIGH",
      reviewRound: 1,
      finalUrl: undefined,
      estimatedHours: 20,
      actualHours: 10,
      progress: 50,
      dependencyDeliverableId: undefined
    }
  ];

  const tasks: Task[] = [
    {
      id: "t-1",
      title: "Build asset",
      description: "Execution task",
      campaignId: "campaign-test",
      deliverableId: "d-1",
      unitOfWorkId: "unit-1",
      assigneeId: "user-leo",
      teamId: "team-growth",
      startDate: "2026-04-01",
      dueDate: "2026-04-07",
      status: "DONE",
      priority: "HIGH",
      progress: 100,
      dependencyTaskId: undefined,
      estimatedHours: 8,
      actualHours: 8,
      isCritical: true
    }
  ];

  assert.equal(calculateCampaignProgress(deliverables, tasks), 78);
});

test("calculateExpectedProgress respects timeline boundaries", () => {
  assert.equal(calculateExpectedProgress("2026-04-10", "2026-04-20", new Date("2026-04-05")), 0);
  assert.equal(calculateExpectedProgress("2026-04-10", "2026-04-20", new Date("2026-04-25")), 100);
});

test("assessCampaignRisk flags overdue critical work and lagging progress", () => {
  const deliverables: Deliverable[] = [
    {
      id: "d-2",
      title: "Press kit",
      campaignId: "campaign-test",
      unitOfWorkId: "unit-2",
      type: "PR Asset",
      ownerId: "user-nina",
      teamId: "team-pr",
      dueDate: "2026-04-15",
      status: "BLOCKED",
      priority: "HIGH",
      reviewRound: 2,
      finalUrl: undefined,
      estimatedHours: 12,
      actualHours: 4,
      progress: 15,
      dependencyDeliverableId: "d-1"
    }
  ];

  const tasks: Task[] = [
    {
      id: "t-2",
      title: "Approve press release",
      description: "Needs leadership approval",
      campaignId: "campaign-test",
      deliverableId: "d-2",
      unitOfWorkId: "unit-2",
      assigneeId: "user-nina",
      teamId: "team-pr",
      startDate: "2026-04-05",
      dueDate: "2026-04-10",
      status: "BLOCKED",
      priority: "CRITICAL",
      progress: 10,
      dependencyTaskId: "t-1",
      estimatedHours: 6,
      actualHours: 2,
      isCritical: true
    }
  ];

  const assessment = assessCampaignRisk(baseCampaign, deliverables, tasks, new Date("2026-04-20"));

  assert.equal(assessment.status, "AT_RISK");
  assert.deepEqual(
    assessment.reasons.sort(),
    ["BLOCKED_DEPENDENCY", "OVERDUE_CRITICAL_TASK", "PROGRESS_BEHIND_PLAN"].sort()
  );
  assert.equal(assessment.actualProgress, 12);
  assert.ok(assessment.expectedProgress > assessment.actualProgress);
});
