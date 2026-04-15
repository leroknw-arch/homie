import { subDays } from "date-fns";

import { homieDemoData } from "@/lib/data/demo-data";
import { getDemoReferenceDate, getDemoReferenceDateString } from "@/lib/domain/demo-clock";
import { assessCampaignRisk, calculateCampaignProgress, getRiskReasonLabel } from "@/lib/domain/campaign-health";
import {
  buildCampaignPerformanceSnapshot,
  buildDailyPerformanceSeries,
  buildPerformanceInsights,
  buildPlatformBreakdown,
  buildWeeklyPerformanceSummary,
  getEntriesForDate,
  getEntriesForLastDays,
  getLatestPerformanceDate,
  sumPerformance
} from "@/lib/domain/performance";
import { average, calculateUtilization, sum } from "@/lib/domain/portfolio-math";
import { CampaignBundle, CampaignStatus, CampaignTableRow, GanttGroup, GlobalFilters, WorkStatus } from "@/types/domain";

const VALID_STATUSES = ["DRAFT", "PLANNING", "IN_PROGRESS", "AT_RISK", "ON_HOLD", "COMPLETED", "ALL"] as const;
const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL", "ALL"] as const;

export type CampaignFilters = GlobalFilters;

export function toCampaignFilters(
  input?: Record<string, string | undefined>
): CampaignFilters | undefined {
  if (!input) return undefined;

  const status = VALID_STATUSES.includes((input.status ?? "") as (typeof VALID_STATUSES)[number])
    ? (input.status as CampaignStatus | "ALL")
    : undefined;
  const priority = VALID_PRIORITIES.includes((input.priority ?? "") as (typeof VALID_PRIORITIES)[number])
    ? (input.priority as CampaignFilters["priority"])
    : undefined;

  return {
    company: input.company,
    product: input.product,
    team: input.team,
    status,
    priority,
    date: input.date
  };
}

export function getWorkspaceSnapshot() {
  return homieDemoData;
}

export function getCampaignBundles(filters?: CampaignFilters): CampaignBundle[] {
  const referenceDate = getDemoReferenceDate();

  return homieDemoData.campaigns
    .filter((campaign) => {
      if (filters?.company && filters.company !== "ALL" && campaign.companyId !== filters.company) return false;
      if (filters?.product && filters.product !== "ALL" && campaign.productId !== filters.product) return false;
      if (filters?.team && filters.team !== "ALL" && !campaign.teamIds.includes(filters.team)) return false;
      const campaignDeliverables = homieDemoData.deliverables.filter((item) => item.campaignId === campaign.id);
      const campaignTasks = homieDemoData.tasks.filter((item) => item.campaignId === campaign.id);
      const risk = assessCampaignRisk(campaign, campaignDeliverables, campaignTasks, referenceDate);
      if (filters?.status && filters.status !== "ALL" && risk.status !== filters.status) return false;
      if (filters?.priority && filters.priority !== "ALL" && campaign.priority !== filters.priority) return false;
      if (
        filters?.date &&
        (filters.date < campaign.startDate || filters.date > campaign.endDate)
      ) {
        return false;
      }
      return true;
    })
    .map((campaign) => {
      const company = homieDemoData.companies.find((item) => item.id === campaign.companyId)!;
      const product = homieDemoData.products.find((item) => item.id === campaign.productId);
      const owner = homieDemoData.users.find((item) => item.id === campaign.ownerId)!;
      const teams = homieDemoData.teams.filter((team) => campaign.teamIds.includes(team.id));
      const units = homieDemoData.unitsOfWork.filter((item) => item.campaignId === campaign.id);
      const deliverables = homieDemoData.deliverables.filter((item) => item.campaignId === campaign.id);
      const tasks = homieDemoData.tasks.filter((item) => item.campaignId === campaign.id);
      const comments = homieDemoData.comments.filter((item) => item.campaignId === campaign.id);
      const performances = homieDemoData.performances.filter((item) => item.campaignId === campaign.id);
      const risk = assessCampaignRisk(campaign, deliverables, tasks, referenceDate);
      const derivedProgress = calculateCampaignProgress(deliverables, tasks);

      return {
        campaign: {
          ...campaign,
          progress: derivedProgress,
          status: risk.status as CampaignStatus
        },
        company,
        product,
        owner,
        teams,
        units,
        deliverables,
        tasks,
        comments,
        performances,
        risk
      };
    });
}

function getPerformanceEntriesForBundles(bundles: CampaignBundle[]) {
  const campaignIds = new Set(bundles.map((item) => item.campaign.id));

  return homieDemoData.performances.filter((entry) => campaignIds.has(entry.campaignId));
}

export function getDashboardMetrics(filters?: CampaignFilters) {
  const bundles = getCampaignBundles(filters);
  const referenceDateString = getDemoReferenceDateString();
  const campaignIds = new Set(bundles.map((item) => item.campaign.id));
  const active = bundles.filter(
    ({ campaign }) => !["COMPLETED", "DRAFT"].includes(campaign.status)
  );

  const totalBudget = bundles.reduce((acc, item) => acc + item.campaign.budgetTotal, 0);
  const totalSpend = bundles.reduce((acc, item) => acc + item.campaign.budgetSpent, 0);
  const averageRoi = average(bundles.map((item) => item.campaign.roi));
  const globalProgress = average(bundles.map((item) => item.campaign.progress));

  const campaignStatusBreakdown = bundles.reduce<Record<string, number>>((acc, item) => {
    acc[item.campaign.status] = (acc[item.campaign.status] ?? 0) + 1;
    return acc;
  }, {});

  const deadlines = homieDemoData.deliverables
    .filter((deliverable) => campaignIds.has(deliverable.campaignId))
    .filter((deliverable) => deliverable.status !== "DONE" && deliverable.dueDate >= referenceDateString)
    .slice()
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 6)
    .map((deliverable) => {
      const campaign = homieDemoData.campaigns.find((item) => item.id === deliverable.campaignId)!;
      return {
        id: deliverable.id,
        title: deliverable.title,
        dueDate: deliverable.dueDate,
        campaignName: campaign.name,
        status: deliverable.status
      };
    });

  const teamLoad = homieDemoData.teams
    .map((team) => {
      const teamTasks = homieDemoData.tasks.filter(
        (task) => task.teamId === team.id && campaignIds.has(task.campaignId)
      );
      const openTasks = teamTasks.filter((task) => task.status !== "DONE").length;
      const estimatedHours = sum(teamTasks.map((task) => task.estimatedHours));
      const actualHours = sum(teamTasks.map((task) => task.actualHours));
      const utilization = calculateUtilization(estimatedHours, actualHours);

      return {
        team: team.name,
        openTasks,
        utilization,
        estimatedHours,
        actualHours
      };
    })
    .filter((team) => team.openTasks > 0 || team.actualHours > 0 || team.estimatedHours > 0);

  const budgetByCampaign = bundles
    .map(({ campaign }) => ({
      name: campaign.name,
      budget: campaign.budgetTotal,
      spent: campaign.budgetSpent,
      roi: campaign.roi
    }))
    .sort((a, b) => b.budget - a.budget);

  const campaignTable: CampaignTableRow[] = bundles
    .map(({ campaign, company, product, owner, deliverables }) => ({
      id: campaign.id,
      campaign: campaign.name,
      company: company.name,
      product: product?.name ?? "Corporate",
      owner: owner.name,
      status: campaign.status,
      priority: campaign.priority,
      progress: campaign.progress,
      budgetTotal: campaign.budgetTotal,
      budgetSpent: campaign.budgetSpent,
      roi: campaign.roi,
      nextDeadline: deliverables
        .filter((deliverable) => deliverable.status !== "DONE" && deliverable.dueDate >= referenceDateString)
        .slice()
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]
        ?.dueDate
    }))
    .sort((a, b) => {
      const riskScore = (row: CampaignTableRow) =>
        row.status === "AT_RISK" ? 3 : row.status === "ON_HOLD" ? 2 : row.status === "IN_PROGRESS" ? 1 : 0;

      return riskScore(b) - riskScore(a) || b.budgetTotal - a.budgetTotal;
    });

  const topPerformerBundle = bundles.slice().sort((a, b) => b.campaign.roi - a.campaign.roi)[0];
  const highestSpendBundle = bundles.slice().sort((a, b) => b.campaign.budgetSpent - a.campaign.budgetSpent)[0];
  const busiestTeam = teamLoad.slice().sort((a, b) => b.actualHours - a.actualHours || b.openTasks - a.openTasks)[0];
  const atRiskBundle = bundles.find(({ campaign }) => campaign.status === "AT_RISK");

  return {
    summary: {
      totalActiveCampaigns: active.length,
      campaignsAtRisk: bundles.filter(({ campaign }) => campaign.status === "AT_RISK").length,
      globalProgress: Math.round(globalProgress),
      totalBudget,
      totalSpend,
      averageRoi: Number(averageRoi.toFixed(1)),
      remainingBudget: totalBudget - totalSpend
    },
    campaignStatusBreakdown,
    deadlines,
    teamLoad,
    budgetByCampaign,
    campaignTable,
    spotlight: {
      topPerformer: topPerformerBundle
        ? {
            campaign: topPerformerBundle.campaign.name,
            roi: topPerformerBundle.campaign.roi,
            product: topPerformerBundle.product?.name ?? "Corporate"
          }
        : undefined,
      highestSpendCampaign: highestSpendBundle
        ? {
            campaign: highestSpendBundle.campaign.name,
            budgetSpent: highestSpendBundle.campaign.budgetSpent,
            company: highestSpendBundle.company.name
          }
        : undefined,
      busiestTeam,
      atRiskCampaign: atRiskBundle
        ? {
            campaign: atRiskBundle.campaign.name,
            progress: atRiskBundle.campaign.progress,
            owner: atRiskBundle.owner.name,
            status: atRiskBundle.campaign.status,
            reasons: atRiskBundle.risk.reasons.map(getRiskReasonLabel)
          }
        : undefined
    }
  };
}

export function getDashboardPerformanceMetrics(filters?: CampaignFilters) {
  const bundles = getCampaignBundles(filters);
  const performances = getPerformanceEntriesForBundles(bundles);
  const referenceDate = getDemoReferenceDateString();
  const previousDate = subDays(new Date(referenceDate), 1).toISOString().slice(0, 10);
  const todayEntries = getEntriesForDate(performances, referenceDate);
  const previousEntries = getEntriesForDate(performances, previousDate);
  const trailingEntries = getEntriesForLastDays(performances, referenceDate, 7);
  const todayAggregate = sumPerformance(todayEntries);
  const previousAggregate = sumPerformance(previousEntries);
  const todaySnapshots = bundles
    .map((bundle) =>
      buildCampaignPerformanceSnapshot(
        bundle,
        getEntriesForDate(bundle.performances, referenceDate),
        getEntriesForDate(bundle.performances, previousDate)
      )
    )
    .filter((snapshot) => snapshot.spend > 0)
    .sort((left, right) => right.priorityScore - left.priorityScore || right.spend - left.spend);
  const insights = buildPerformanceInsights(bundles, performances, referenceDate);
  const weeklySummary = buildWeeklyPerformanceSummary(bundles, performances, referenceDate);
  const aggregateDailySeries = buildDailyPerformanceSeries(trailingEntries).slice(-7);
  const focusNow = todaySnapshots
    .map((snapshot) => {
      const bundle = bundles.find((item) => item.campaign.id === snapshot.campaignId)!;
      const executionPenalty =
        bundle.campaign.status === "AT_RISK" ? 3 : bundle.campaign.status === "ON_HOLD" ? 2 : 0;

      return {
        ...snapshot,
        status: bundle.campaign.status,
        owner: bundle.owner.name,
        riskReasons: bundle.risk.reasons.map(getRiskReasonLabel),
        score: snapshot.priorityScore + executionPenalty
      };
    })
    .sort((left, right) => right.score - left.score || right.spend - left.spend || left.roas - right.roas)
    .slice(0, 5);
  const underperforming = insights[0]
    ? {
        insight: insights[0],
        snapshot: todaySnapshots.find((item) => item.campaignId === insights[0].campaignId),
        campaignStatus: bundles.find((item) => item.campaign.id === insights[0].campaignId)?.campaign.status
      }
    : todaySnapshots[0]
      ? {
          insight: {
            id: `${todaySnapshots[0].campaignId}-focus`,
            campaignId: todaySnapshots[0].campaignId,
            campaignName: todaySnapshots[0].campaignName,
            title: `${todaySnapshots[0].campaignName} needs a budget review`,
            detail: `ROAS is ${todaySnapshots[0].roas.toFixed(1)}x with ${todaySnapshots[0].cpa.toFixed(0)} CPA on ${todaySnapshots[0].spend.toLocaleString()} spend.`,
            recommendation: "Reallocate budget toward stronger campaigns and check audience or creative quality today.",
            severity: "medium" as const,
            priorityScore: todaySnapshots[0].priorityScore
          },
          snapshot: todaySnapshots[0],
          campaignStatus: bundles.find((item) => item.campaign.id === todaySnapshots[0].campaignId)?.campaign.status
        }
      : undefined;

  const spendDeltaPct =
    previousAggregate.spend > 0
      ? Number((((todayAggregate.spend - previousAggregate.spend) / previousAggregate.spend) * 100).toFixed(1))
      : undefined;
  const revenueDeltaPct =
    previousAggregate.revenue > 0
      ? Number((((todayAggregate.revenue - previousAggregate.revenue) / previousAggregate.revenue) * 100).toFixed(1))
      : undefined;
  const roasDeltaPct =
    previousAggregate.roas > 0
      ? Number((((todayAggregate.roas - previousAggregate.roas) / previousAggregate.roas) * 100).toFixed(1))
      : undefined;
  const cpaDeltaPct =
    previousAggregate.cpa > 0
      ? Number((((todayAggregate.cpa - previousAggregate.cpa) / previousAggregate.cpa) * 100).toFixed(1))
      : undefined;

  return {
    summary: {
      spend: todayAggregate.spend,
      revenue: todayAggregate.revenue,
      roas: todayAggregate.roas,
      cpa: todayAggregate.cpa,
      spendDeltaPct,
      revenueDeltaPct,
      roasDeltaPct,
      cpaDeltaPct
    },
    aggregateDailySeries,
    topCampaigns: todaySnapshots.slice().sort((left, right) => right.roas - left.roas).slice(0, 3),
    worstCampaigns: todaySnapshots.slice().sort((left, right) => left.roas - right.roas).slice(0, 3),
    focusNow,
    underperforming,
    insights,
    weeklySummary,
    referenceDate
  };
}

export function getMarketingPlanMetrics(filters?: CampaignFilters) {
  const bundles = getCampaignBundles(filters);
  const companyIds = new Set(bundles.map((item) => item.company.id));

  const companyGroups = homieDemoData.companies
    .filter((company) => companyIds.has(company.id))
    .map((company) => {
    const companyCampaigns = bundles.filter(({ company: item }) => item.id === company.id);

    return {
      company: company.name,
      budget: companyCampaigns.reduce((acc, item) => acc + item.campaign.budgetTotal, 0),
      spend: companyCampaigns.reduce((acc, item) => acc + item.campaign.budgetSpent, 0),
      averageRoi:
        average(companyCampaigns.map((item) => item.campaign.roi))
    };
  });

  const efficientCampaigns = bundles
    .slice()
    .sort((a, b) => b.campaign.roi - a.campaign.roi)
    .slice(0, 3)
    .map(({ campaign }) => ({
      name: campaign.name,
      roi: campaign.roi,
      spend: campaign.budgetSpent
    }));

  const lowPerformanceCampaigns = bundles
    .filter(({ campaign }) => campaign.roi < 1.5 || campaign.status === "AT_RISK")
    .map(({ campaign }) => ({
      name: campaign.name,
      roi: campaign.roi,
      progress: campaign.progress,
      status: campaign.status
    }));

  return {
    totalBudget: bundles.reduce((acc, item) => acc + item.campaign.budgetTotal, 0),
    totalSpend: bundles.reduce((acc, item) => acc + item.campaign.budgetSpent, 0),
    campaignFinance: bundles.map(({ campaign, company, product }) => ({
      id: campaign.id,
      company: company.name,
      product: product?.name ?? "Corporate",
      campaign: campaign.name,
      budget: campaign.budgetTotal,
      spend: campaign.budgetSpent,
      roi: campaign.roi,
      status: campaign.status
    })),
    companyGroups,
    efficientCampaigns,
    lowPerformanceCampaigns
  };
}

export function getTeamsMetrics(filters?: CampaignFilters) {
  const bundles = getCampaignBundles(filters);
  const campaignIds = new Set(bundles.map((item) => item.campaign.id));

  if (!bundles.length) {
    return {
      teams: [],
      people: [],
      campaignCount: 0,
      summary: {
        totalOpenTasks: 0,
        totalActualHours: 0
      }
    };
  }

  const teams = homieDemoData.teams
    .map((team) => {
      const members = homieDemoData.users.filter((user) => user.teamId === team.id);
      const tasks = homieDemoData.tasks.filter(
        (task) => task.teamId === team.id && campaignIds.has(task.campaignId)
      );
      const blocked = tasks.filter((task) => task.status === "BLOCKED").length;
      const estimatedHours = sum(tasks.map((task) => task.estimatedHours));
      const actualHours = sum(tasks.map((task) => task.actualHours));

      return {
        ...team,
        members: members.length,
        openTasks: tasks.filter((task) => task.status !== "DONE").length,
        blocked,
        averageProgress: Math.round(average(tasks.map((task) => task.progress))),
        estimatedHours,
        actualHours
      };
    });

  const people = homieDemoData.users
    .filter((user) => user.teamId)
    .map((user) => {
      const tasks = homieDemoData.tasks.filter(
        (task) => task.assigneeId === user.id && campaignIds.has(task.campaignId)
      );
      const estimatedHours = sum(tasks.map((task) => task.estimatedHours));
      const actualHours = sum(tasks.map((task) => task.actualHours));

      return {
        id: user.id,
        name: user.name,
        title: user.title,
        team: homieDemoData.teams.find((team) => team.id === user.teamId)?.name ?? "Unknown",
        openTasks: tasks.filter((task) => task.status !== "DONE").length,
        blocked: tasks.filter((task) => task.status === "BLOCKED").length,
        averageProgress: Math.round(average(tasks.map((task) => task.progress))),
        estimatedHours,
        actualHours
      };
    })
    .sort((a, b) => b.openTasks - a.openTasks || b.actualHours - a.actualHours);

  return {
    teams,
    people,
    campaignCount: bundles.length,
    summary: {
      totalOpenTasks: people.reduce((acc, person) => acc + person.openTasks, 0),
      totalActualHours: people.reduce((acc, person) => acc + person.actualHours, 0)
    }
  };
}

export function getCampaignDetail(campaignId: string) {
  return getCampaignBundles().find((item) => item.campaign.id === campaignId);
}

export function getCampaignPerformanceDetail(campaignId: string) {
  const bundle = getCampaignDetail(campaignId);

  if (!bundle) return undefined;

  const latestDate = getLatestPerformanceDate(bundle.performances);

  if (!latestDate) {
    return {
      bundle,
      latestDate: undefined,
      snapshot: undefined,
      dailySeries: [],
      platformBreakdown: [],
      insights: [],
      weeklySummary: undefined,
      latestEntries: []
    };
  }

  const previousDate = subDays(new Date(latestDate), 1).toISOString().slice(0, 10);
  const todayEntries = getEntriesForDate(bundle.performances, latestDate);
  const yesterdayEntries = getEntriesForDate(bundle.performances, previousDate);

  return {
    bundle,
    latestDate,
    snapshot: buildCampaignPerformanceSnapshot(bundle, todayEntries, yesterdayEntries),
    dailySeries: buildDailyPerformanceSeries(bundle.performances),
    platformBreakdown: buildPlatformBreakdown(todayEntries),
    insights: buildPerformanceInsights([bundle], bundle.performances, latestDate),
    weeklySummary: buildWeeklyPerformanceSummary([bundle], bundle.performances, latestDate),
    latestEntries: bundle.performances
      .slice()
      .sort((left, right) => right.date.localeCompare(left.date) || left.platform.localeCompare(right.platform))
      .slice(0, 12)
  };
}

export function buildGanttGroup(bundle: CampaignBundle): GanttGroup {
  const { campaign, units, tasks, deliverables, risk } = bundle;

  return {
    campaignId: campaign.id,
    campaignName: campaign.name,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    progress: campaign.progress,
    status: campaign.status,
    riskReasons: risk.reasons.map(getRiskReasonLabel),
    rows: [
      ...units.map((unit) => ({
        id: unit.id,
        label: unit.name,
        type: "Unit of Work",
        team: homieDemoData.teams.find((team) => team.id === unit.teamId)?.name ?? "",
        startDate: unit.startDate,
        endDate: unit.endDate,
        progress: unit.progress,
        status: unit.status as WorkStatus
      })),
      ...deliverables.map((deliverable) => ({
        id: deliverable.id,
        label: deliverable.title,
        type: "Deliverable",
        team: homieDemoData.teams.find((team) => team.id === deliverable.teamId)?.name ?? "",
        startDate:
          tasks
            .filter((task) => task.deliverableId === deliverable.id)
            .sort((a, b) => a.startDate.localeCompare(b.startDate))[0]?.startDate ?? campaign.startDate,
        endDate: deliverable.dueDate,
        progress: deliverable.progress,
        status: deliverable.status,
        dependencyLabel: deliverable.dependencyDeliverableId
          ? deliverables.find((item) => item.id === deliverable.dependencyDeliverableId)?.title
          : undefined
      })),
      ...tasks.map((task) => ({
        id: task.id,
        label: task.title,
        type: "Task",
        team: homieDemoData.teams.find((team) => team.id === task.teamId)?.name ?? "",
        startDate: task.startDate,
        endDate: task.dueDate,
        progress: task.progress,
        status: task.status,
        dependencyLabel: task.dependencyTaskId
          ? tasks.find((item) => item.id === task.dependencyTaskId)?.title
          : undefined
      }))
    ]
  };
}

export function getGanttRows(filters?: CampaignFilters) {
  return getCampaignBundles(filters).map(buildGanttGroup);
}

export function getFilterOptions() {
  return {
    companies: homieDemoData.companies,
    products: homieDemoData.products,
    teams: homieDemoData.teams
  };
}
