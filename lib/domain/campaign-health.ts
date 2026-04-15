import { isAfter, isBefore, parseISO } from "date-fns";

import { average } from "@/lib/domain/portfolio-math";
import {
  Campaign,
  CampaignRiskAssessment,
  CampaignRiskReason,
  CampaignStatus,
  Deliverable,
  Task
} from "@/types/domain";

export function calculateCampaignProgress(
  deliverables: Deliverable[],
  tasks: Task[]
) {
  const deliverablesAverage = average(deliverables.map((item) => item.progress));
  const tasksAverage = average(tasks.map((item) => item.progress));

  return Math.round(deliverablesAverage * 0.45 + tasksAverage * 0.55);
}

export function calculateExpectedProgress(
  startDate: string,
  endDate: string,
  referenceDate = new Date()
) {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  if (isBefore(referenceDate, start)) return 0;
  if (isAfter(referenceDate, end)) return 100;

  const total = Math.max(end.getTime() - start.getTime(), 1);
  const elapsed = Math.max(referenceDate.getTime() - start.getTime(), 0);

  return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
}

export function assessCampaignRisk(
  campaign: Campaign,
  deliverables: Deliverable[],
  tasks: Task[],
  referenceDate = new Date()
): CampaignRiskAssessment {
  const actualProgress = calculateCampaignProgress(deliverables, tasks);
  const expectedProgress = calculateExpectedProgress(
    campaign.startDate,
    campaign.endDate,
    referenceDate
  );

  const reasons: CampaignRiskReason[] = [];

  const overdueCritical = tasks.some(
    (task) =>
      task.isCritical &&
      task.status !== "DONE" &&
      isAfter(referenceDate, parseISO(task.dueDate))
  );

  const blockedDependency =
    tasks.some((task) => task.status === "BLOCKED" && !!task.dependencyTaskId) ||
    deliverables.some((item) => item.status === "BLOCKED" && !!item.dependencyDeliverableId);

  const progressBehindPlan = actualProgress < Math.max(expectedProgress - 15, 20);

  if (overdueCritical) reasons.push("OVERDUE_CRITICAL_TASK");
  if (blockedDependency) reasons.push("BLOCKED_DEPENDENCY");
  if (progressBehindPlan) reasons.push("PROGRESS_BEHIND_PLAN");

  const forcedAtRisk =
    reasons.length > 0 &&
    !["DRAFT", "COMPLETED", "ON_HOLD"].includes(campaign.status);

  return {
    status: forcedAtRisk ? "AT_RISK" : (campaign.status as CampaignStatus),
    score: reasons.length,
    reasons,
    expectedProgress,
    actualProgress
  };
}

export function getRiskReasonLabel(reason: CampaignRiskReason) {
  if (reason === "OVERDUE_CRITICAL_TASK") return "Critical overdue task";
  if (reason === "BLOCKED_DEPENDENCY") return "Blocked dependency";
  return "Progress behind plan";
}
