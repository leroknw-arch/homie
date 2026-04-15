import { Role } from "@/types/domain";

export const roleLabels: Record<Role, string> = {
  ADMIN: "Admin",
  HEAD_OF_MARKETING: "Head of Marketing",
  TEAM_LEAD: "Team Lead",
  COLLABORATOR: "Collaborator",
  VIEWER: "Viewer"
};

export function canCreateCampaign(role: Role | string | undefined) {
  return role === "ADMIN" || role === "HEAD_OF_MARKETING" || role === "TEAM_LEAD";
}

export function canManageExecution(role: Role | string | undefined) {
  return role !== "VIEWER";
}
