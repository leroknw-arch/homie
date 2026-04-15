import {
  Campaign,
  Comment,
  Company,
  Deliverable,
  Performance,
  Product,
  Task,
  Team,
  UnitOfWork,
  User
} from "@/types/domain";
import { performanceBlueprints } from "@/lib/data/performance-blueprints";
import { seedCampaigns, seedCompanies, seedProducts, seedTeams, seedUsers } from "@/lib/data/seed-blueprints";

export const teams: Team[] = seedTeams.map((team) => ({
  id: `team-${team.slug}`,
  name: team.name,
  slug: team.slug
}));

export const users: User[] = seedUsers.map((user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  title: user.title,
  teamId: "teamSlug" in user ? `team-${user.teamSlug}` : undefined
}));

export const companies: Company[] = seedCompanies.map((company) => ({
  id: company.id,
  name: company.name,
  slug: company.slug,
  description: company.description
}));

export const products: Product[] = seedProducts.map((product) => ({
  id: product.id,
  companyId: seedCompanies.find((company) => company.slug === product.companySlug)!.id,
  name: product.name,
  slug: product.slug,
  description: product.description
}));

export const campaigns: Campaign[] = seedCampaigns.map((campaign) => ({
  id: campaign.id,
  companyId: seedCompanies.find((company) => company.slug === campaign.companySlug)!.id,
  productId: "productSlug" in campaign
    ? seedProducts.find((product) => product.slug === campaign.productSlug)?.id
    : undefined,
  name: campaign.name,
  description: campaign.description,
  objective: campaign.objective,
  ownerId: seedUsers.find((user) => user.email === campaign.ownerEmail)!.id,
  priority: campaign.priority,
  status: campaign.status,
  startDate: campaign.startDate,
  endDate: campaign.endDate,
  progress: campaign.progress,
  budgetTotal: campaign.budgetTotal,
  budgetSpent: campaign.budgetSpent,
  roi: campaign.roi,
  kpiName: campaign.kpiName,
  kpiValue: campaign.kpiValue,
  teamIds: campaign.teamSlugs.map((slug) => `team-${slug}`)
}));

export const unitsOfWork: UnitOfWork[] = seedCampaigns.flatMap((campaign) =>
  campaign.unitNames.map((name, index) => ({
    id: `${campaign.id}-unit-${index + 1}`,
    campaignId: campaign.id,
    name,
    objective: `Keep ${name.toLowerCase()} aligned with campaign KPI and budget.`,
    teamId: `team-${campaign.teamSlugs[index] ?? campaign.teamSlugs[0]}`,
    ownerId: users[(index + 1) % users.length]?.id,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    progress: Math.min(100, campaign.progress + index * 4),
    status:
      campaign.status === "COMPLETED"
        ? "DONE"
        : campaign.status === "AT_RISK" && index === 0
          ? "BLOCKED"
          : campaign.status === "PLANNING"
            ? "TODO"
            : "IN_PROGRESS"
  }))
);

export const deliverables: Deliverable[] = unitsOfWork.map((unit, index) => {
  const campaign = campaigns.find((item) => item.id === unit.campaignId)!;
  const campaignUnits = unitsOfWork.filter((item) => item.campaignId === unit.campaignId);
  const unitIndex = campaignUnits.findIndex((item) => item.id === unit.id);
  const dependencyUnit = unitIndex > 0 ? campaignUnits[unitIndex - 1] : undefined;

  return {
    id: `${unit.id}-deliverable`,
    title: `${unit.name} Master Asset`,
    campaignId: unit.campaignId,
    unitOfWorkId: unit.id,
    type: index % 2 === 0 ? "Landing Page" : "Content Package",
    ownerId: users[(index + 2) % users.length]?.id,
    teamId: unit.teamId,
    dueDate: new Date(
      new Date(campaign.endDate).getTime() - ((index % 4) + 5) * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .slice(0, 10),
    status:
      campaign.status === "COMPLETED"
        ? "DONE"
        : campaign.status === "AT_RISK" && index % 4 === 0
          ? "BLOCKED"
          : index % 3 === 0
            ? "IN_REVIEW"
            : "IN_PROGRESS",
    priority: index % 4 === 0 ? "HIGH" : "MEDIUM",
    reviewRound: (index % 3) + 1,
    finalUrl: campaign.status === "COMPLETED" ? "https://homie.app/assets/final" : undefined,
    estimatedHours: 16 + (index % 4) * 6,
    actualHours: 12 + (index % 4) * 7,
    progress: Math.min(100, unit.progress + 5),
    dependencyDeliverableId: dependencyUnit ? `${dependencyUnit.id}-deliverable` : undefined
  };
});

export const tasks: Task[] = deliverables.flatMap((deliverable, index) => {
  const unit = unitsOfWork.find((item) => item.id === deliverable.unitOfWorkId)!;
  const campaign = campaigns.find((item) => item.id === deliverable.campaignId)!;
  const firstTaskId = `${deliverable.id}-task-1`;

  return [
    {
      id: firstTaskId,
      title: `Build ${deliverable.title}`,
      description: "Produce the core asset and align it with campaign KPI.",
      campaignId: deliverable.campaignId,
      deliverableId: deliverable.id,
      unitOfWorkId: unit.id,
      assigneeId: users[(index + 1) % users.length]?.id,
      teamId: deliverable.teamId,
      startDate: campaign.startDate,
      dueDate: new Date(
        new Date(campaign.startDate).getTime() + ((index % 5) + 10) * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 10),
      status: campaign.status === "COMPLETED" ? "DONE" : "IN_PROGRESS",
      priority: index % 4 === 0 ? "HIGH" : "MEDIUM",
      progress: Math.min(100, deliverable.progress + 4),
      estimatedHours: 10 + (index % 3) * 4,
      actualHours: 8 + (index % 3) * 5,
      isCritical: index % 4 === 0
    },
    {
      id: `${deliverable.id}-task-2`,
      title: `Review ${deliverable.title}`,
      description: "Run QA, collect feedback and close approval loop.",
      campaignId: deliverable.campaignId,
      deliverableId: deliverable.id,
      unitOfWorkId: unit.id,
      assigneeId: users[(index + 2) % users.length]?.id,
      teamId: deliverable.teamId,
      startDate: new Date(
        new Date(campaign.startDate).getTime() + ((index % 5) + 12) * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 10),
      dueDate: new Date(
        new Date(campaign.startDate).getTime() + ((index % 5) + 18) * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 10),
      status:
        campaign.status === "AT_RISK" && index % 4 === 0
          ? "BLOCKED"
          : campaign.status === "COMPLETED"
            ? "DONE"
            : "IN_REVIEW",
      priority: index % 5 === 0 ? "HIGH" : "MEDIUM",
      progress:
        campaign.status === "AT_RISK" && index % 4 === 0 ? 36 : Math.min(100, deliverable.progress),
      dependencyTaskId: firstTaskId,
      estimatedHours: 6 + (index % 3) * 2,
      actualHours: 5 + (index % 3) * 2,
      isCritical: index % 4 === 0
    }
  ];
});

export const comments: Comment[] = campaigns.flatMap((campaign, index) => [
  {
    id: `${campaign.id}-comment-1`,
    authorId: "user-ariana",
    campaignId: campaign.id,
    body: "Keep the narrative tight and tie execution back to the executive KPI.",
    createdAt: new Date(2026, 3, 10 + index).toISOString()
  },
  {
    id: `${campaign.id}-comment-2`,
    authorId: campaign.ownerId,
    campaignId: campaign.id,
    body: "Budget pacing looks acceptable for now; re-check with the next milestone.",
    createdAt: new Date(2026, 3, 11 + index).toISOString()
  }
]);

export const performances: Performance[] = performanceBlueprints.map((entry) => ({
  id: entry.id,
  campaignId: entry.campaignId,
  date: entry.date,
  platform: entry.platform,
  spend: entry.spend,
  revenue: entry.revenue,
  purchases: entry.purchases,
  roas: entry.spend > 0 ? Number((entry.revenue / entry.spend).toFixed(2)) : 0,
  cpa: entry.purchases > 0 ? Number((entry.spend / entry.purchases).toFixed(2)) : 0
}));

export const homieDemoData = {
  teams,
  users,
  companies,
  products,
  campaigns,
  unitsOfWork,
  deliverables,
  tasks,
  comments,
  performances
};
