import { CampaignStatus, PerformancePlatform, Priority, WorkStatus } from "@/types/domain";

export const campaignStatusLabels: Record<CampaignStatus, string> = {
  DRAFT: "Draft",
  PLANNING: "Planning",
  IN_PROGRESS: "In Progress",
  AT_RISK: "At Risk",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed"
};

export const workStatusLabels: Record<WorkStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  BLOCKED: "Blocked",
  DONE: "Done"
};

export const priorityLabels: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical"
};

export const performancePlatformLabels: Record<PerformancePlatform, string> = {
  META: "Meta",
  GOOGLE: "Google",
  TIKTOK: "TikTok"
};

export function getStatusVariant(status: CampaignStatus | WorkStatus) {
  if (status === "COMPLETED" || status === "DONE") return "success";
  if (status === "AT_RISK" || status === "BLOCKED") return "danger";
  if (status === "IN_PROGRESS" || status === "IN_REVIEW") return "info";
  if (status === "ON_HOLD") return "warning";
  return "neutral";
}

export function getPriorityVariant(priority: Priority) {
  if (priority === "CRITICAL") return "danger";
  if (priority === "HIGH") return "warning";
  return "neutral";
}
