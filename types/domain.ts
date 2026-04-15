export const roles = [
  "ADMIN",
  "HEAD_OF_MARKETING",
  "TEAM_LEAD",
  "COLLABORATOR",
  "VIEWER"
] as const;

export const campaignStatuses = [
  "DRAFT",
  "PLANNING",
  "IN_PROGRESS",
  "AT_RISK",
  "ON_HOLD",
  "COMPLETED"
] as const;

export const workStatuses = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "BLOCKED",
  "DONE"
] as const;

export const priorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export const performancePlatforms = ["META", "GOOGLE", "TIKTOK"] as const;

export type Role = (typeof roles)[number];
export type CampaignStatus = (typeof campaignStatuses)[number];
export type WorkStatus = (typeof workStatuses)[number];
export type Priority = (typeof priorities)[number];
export type PerformancePlatform = (typeof performancePlatforms)[number];

export type Team = {
  id: string;
  name: string;
  slug: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  teamId?: string;
};

export type Company = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type Product = {
  id: string;
  companyId: string;
  name: string;
  slug: string;
  description: string;
};

export type Comment = {
  id: string;
  authorId: string;
  campaignId?: string;
  unitOfWorkId?: string;
  deliverableId?: string;
  taskId?: string;
  body: string;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  campaignId: string;
  deliverableId?: string;
  unitOfWorkId?: string;
  assigneeId?: string;
  teamId: string;
  startDate: string;
  dueDate: string;
  status: WorkStatus;
  priority: Priority;
  progress: number;
  dependencyTaskId?: string;
  estimatedHours: number;
  actualHours: number;
  isCritical: boolean;
};

export type Deliverable = {
  id: string;
  title: string;
  campaignId: string;
  unitOfWorkId: string;
  type: string;
  ownerId?: string;
  teamId: string;
  dueDate: string;
  status: WorkStatus;
  priority: Priority;
  reviewRound: number;
  finalUrl?: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  dependencyDeliverableId?: string;
};

export type UnitOfWork = {
  id: string;
  campaignId: string;
  name: string;
  objective: string;
  teamId: string;
  ownerId?: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: WorkStatus;
};

export type Campaign = {
  id: string;
  companyId: string;
  productId?: string;
  name: string;
  description: string;
  objective: string;
  ownerId: string;
  priority: Priority;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  progress: number;
  budgetTotal: number;
  budgetSpent: number;
  roi: number;
  kpiName: string;
  kpiValue: string;
  teamIds: string[];
};

export type Performance = {
  id: string;
  campaignId: string;
  date: string;
  platform: PerformancePlatform;
  spend: number;
  revenue: number;
  purchases: number;
  roas: number;
  cpa: number;
};

export type CampaignBundle = {
  campaign: Campaign;
  company: Company;
  product?: Product;
  owner: User;
  teams: Team[];
  units: UnitOfWork[];
  deliverables: Deliverable[];
  tasks: Task[];
  comments: Comment[];
  performances: Performance[];
  risk: CampaignRiskAssessment;
};

export type GanttRow = {
  id: string;
  label: string;
  type: string;
  team: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: WorkStatus;
  dependencyLabel?: string;
};

export type GanttGroup = {
  campaignId: string;
  campaignName: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: CampaignStatus;
  riskReasons?: string[];
  rows: GanttRow[];
};

export type DashboardSummary = {
  totalActiveCampaigns: number;
  campaignsAtRisk: number;
  globalProgress: number;
  totalBudget: number;
  totalSpend: number;
  averageRoi: number;
};

export type CampaignTableRow = {
  id: string;
  campaign: string;
  company: string;
  product: string;
  owner: string;
  status: CampaignStatus;
  priority: Priority;
  progress: number;
  budgetTotal: number;
  budgetSpent: number;
  roi: number;
  nextDeadline?: string;
};

export type GlobalFilters = {
  company?: string;
  product?: string;
  team?: string;
  status?: CampaignStatus | "ALL";
  priority?: Priority | "ALL";
  date?: string;
};

export type CampaignRiskReason =
  | "OVERDUE_CRITICAL_TASK"
  | "BLOCKED_DEPENDENCY"
  | "PROGRESS_BEHIND_PLAN";

export type CampaignRiskAssessment = {
  status: CampaignStatus;
  score: number;
  reasons: CampaignRiskReason[];
  expectedProgress: number;
  actualProgress: number;
};

export type PerformanceInsightSeverity = "high" | "medium" | "low";

export type PerformanceInsight = {
  id: string;
  campaignId?: string;
  campaignName?: string;
  title: string;
  detail: string;
  recommendation: string;
  severity: PerformanceInsightSeverity;
  priorityScore: number;
};

export type CampaignPerformanceSnapshot = {
  campaignId: string;
  campaignName: string;
  spend: number;
  revenue: number;
  purchases: number;
  roas: number;
  cpa: number;
  spendDeltaPct?: number;
  roasDeltaPct?: number;
  priorityScore: number;
};

export type PlatformPerformanceSnapshot = {
  platform: PerformancePlatform;
  spend: number;
  revenue: number;
  purchases: number;
  roas: number;
  cpa: number;
};

export type DailyPerformancePoint = {
  date: string;
  spend: number;
  revenue: number;
  purchases: number;
  roas: number;
  cpa: number;
};

export type WeeklyPerformanceSummary = {
  totalSpend: number;
  totalRevenue: number;
  avgRoas: number;
  avgCpa: number;
  bestCampaigns: CampaignPerformanceSnapshot[];
  worstCampaigns: CampaignPerformanceSnapshot[];
  recommendations: string[];
};
