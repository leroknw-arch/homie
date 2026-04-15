import { CampaignStatus, PerformancePlatform, PrismaClient, Priority, Role, WorkStatus } from "@prisma/client";

import { performanceBlueprints } from "@/lib/data/performance-blueprints";
import { seedCampaigns, seedCompanies, seedProducts, seedTeams, seedUsers } from "@/lib/data/seed-blueprints";

const prisma = new PrismaClient();

function toRole(role: string) {
  return Role[role as keyof typeof Role];
}

function toCampaignStatus(status: string) {
  return CampaignStatus[status as keyof typeof CampaignStatus];
}

function toPriority(priority: string) {
  return Priority[priority as keyof typeof Priority];
}

async function main() {
  await prisma.performance.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.deliverable.deleteMany();
  await prisma.unitOfWork.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.product.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();

  const teams = await Promise.all(
    seedTeams.map((team) =>
      prisma.team.create({
        data: {
          name: team.name,
          slug: team.slug,
          description: team.description
        }
      })
    )
  );

  const teamBySlug = Object.fromEntries(teams.map((team) => [team.slug, team]));

  const users = await Promise.all(
    seedUsers.map((user) =>
      prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          title: user.title,
          role: toRole(user.role),
          teamId: "teamSlug" in user ? teamBySlug[user.teamSlug].id : undefined
        }
      })
    )
  );

  const userByEmail = Object.fromEntries(users.map((user) => [user.email, user]));

  const companies = await Promise.all(
    seedCompanies.map((company) =>
      prisma.company.create({
        data: {
          name: company.name,
          slug: company.slug,
          description: company.description
        }
      })
    )
  );

  const companyBySlug = Object.fromEntries(companies.map((company) => [company.slug, company]));

  const products = await Promise.all(
    seedProducts.map((product) =>
      prisma.product.create({
        data: {
          companyId: companyBySlug[product.companySlug].id,
          name: product.name,
          slug: product.slug,
          description: product.description
        }
      })
    )
  );

  const productBySlug = Object.fromEntries(products.map((product) => [product.slug, product]));

  for (const [campaignIndex, blueprint] of seedCampaigns.entries()) {
    const campaign = await prisma.campaign.create({
      data: {
        companyId: companyBySlug[blueprint.companySlug].id,
        productId: "productSlug" in blueprint ? productBySlug[blueprint.productSlug].id : null,
        ownerId: userByEmail[blueprint.ownerEmail].id,
        name: blueprint.name,
        description: blueprint.description,
        objective: blueprint.objective,
        priority: toPriority(blueprint.priority),
        status: toCampaignStatus(blueprint.status),
        startDate: new Date(blueprint.startDate),
        endDate: new Date(blueprint.endDate),
        progress: blueprint.progress,
        budgetTotal: blueprint.budgetTotal,
        budgetSpent: blueprint.budgetSpent,
        roi: blueprint.roi,
        kpiName: blueprint.kpiName,
        kpiValue: blueprint.kpiValue,
        teams: {
          connect: blueprint.teamSlugs.map((slug) => ({ id: teamBySlug[slug].id }))
        }
      }
    });

    const units = await Promise.all(
      blueprint.unitNames.map((name, index) =>
        prisma.unitOfWork.create({
          data: {
            campaignId: campaign.id,
            teamId: teamBySlug[blueprint.teamSlugs[index] ?? blueprint.teamSlugs[0]].id,
            ownerId: users[(index + 1) % users.length].id,
            name,
            objective: `Keep ${name.toLowerCase()} aligned with campaign KPI and budget.`,
            startDate: new Date(blueprint.startDate),
            endDate: new Date(blueprint.endDate),
            progress: Math.min(100, blueprint.progress + index * 4),
            status:
              blueprint.status === "AT_RISK" && index === 0
                ? WorkStatus.BLOCKED
                : blueprint.status === "COMPLETED"
                  ? WorkStatus.DONE
                  : blueprint.status === "PLANNING"
                    ? WorkStatus.TODO
                    : WorkStatus.IN_PROGRESS
          }
        })
      )
    );

    let previousDeliverableId: string | undefined;

    for (const [index, unit] of units.entries()) {
      const deliverable = await prisma.deliverable.create({
        data: {
          campaignId: campaign.id,
          unitOfWorkId: unit.id,
          ownerId: users[(index + 2) % users.length].id,
          teamId: unit.teamId,
          dependencyDeliverableId: previousDeliverableId,
          title: `${unit.name} Master Asset`,
          type: index % 2 === 0 ? "Landing Page" : "Content Package",
          dueDate: new Date(
            new Date(blueprint.endDate).getTime() - (((index % 4) + 5) * 24 * 60 * 60 * 1000)
          ),
          status:
            blueprint.status === "COMPLETED"
              ? WorkStatus.DONE
              : blueprint.status === "AT_RISK" && index % 4 === 0
                ? WorkStatus.BLOCKED
                : index % 3 === 0
                  ? WorkStatus.IN_REVIEW
                  : WorkStatus.IN_PROGRESS,
          priority: index % 4 === 0 ? Priority.HIGH : Priority.MEDIUM,
          reviewRound: (index % 3) + 1,
          finalUrl: blueprint.status === "COMPLETED" ? "https://homie.app/assets/final" : null,
          estimatedHours: 16 + (index % 4) * 6,
          actualHours: 12 + (index % 4) * 7,
          progress: Math.min(100, Math.min(100, blueprint.progress + index * 4) + 5)
        }
      });

      previousDeliverableId = deliverable.id;

      const taskOne = await prisma.task.create({
        data: {
          campaignId: campaign.id,
          deliverableId: deliverable.id,
          unitOfWorkId: unit.id,
          assigneeId: users[(index + 1) % users.length].id,
          teamId: unit.teamId,
          title: `Build ${deliverable.title}`,
          description: "Produce the core asset and align it with campaign KPI.",
          startDate: new Date(blueprint.startDate),
          dueDate: new Date(
            new Date(blueprint.startDate).getTime() + (((index % 5) + 10) * 24 * 60 * 60 * 1000)
          ),
          status: blueprint.status === "COMPLETED" ? WorkStatus.DONE : WorkStatus.IN_PROGRESS,
          priority: index % 4 === 0 ? Priority.HIGH : Priority.MEDIUM,
          progress: Math.min(100, deliverable.progress + 4),
          estimatedHours: 10 + (index % 3) * 4,
          actualHours: 8 + (index % 3) * 5,
          isCritical: index % 4 === 0
        }
      });

      await prisma.task.create({
        data: {
          campaignId: campaign.id,
          deliverableId: deliverable.id,
          unitOfWorkId: unit.id,
          assigneeId: users[(index + 2) % users.length].id,
          teamId: unit.teamId,
          title: `Review ${deliverable.title}`,
          description: "Run QA, collect feedback and close approval loop.",
          startDate: new Date(
            new Date(blueprint.startDate).getTime() + (((index % 5) + 12) * 24 * 60 * 60 * 1000)
          ),
          dueDate: new Date(
            new Date(blueprint.startDate).getTime() + (((index % 5) + 18) * 24 * 60 * 60 * 1000)
          ),
          status:
            blueprint.status === "AT_RISK" && index % 4 === 0
              ? WorkStatus.BLOCKED
              : blueprint.status === "COMPLETED"
                ? WorkStatus.DONE
                : WorkStatus.IN_REVIEW,
          priority: index % 5 === 0 ? Priority.HIGH : Priority.MEDIUM,
          progress:
            blueprint.status === "AT_RISK" && index % 4 === 0 ? 36 : Math.min(100, deliverable.progress),
          dependencyTaskId: taskOne.id,
          estimatedHours: 6 + (index % 3) * 2,
          actualHours: 5 + (index % 3) * 2,
          isCritical: index % 4 === 0
        }
      });
    }

    await prisma.comment.createMany({
      data: [
        {
          authorId: userByEmail["ariana@homie.app"].id,
          campaignId: campaign.id,
          body: "Keep the narrative tight and tie execution back to the executive KPI.",
          createdAt: new Date(2026, 3, 10 + campaignIndex)
        },
        {
          authorId: userByEmail[blueprint.ownerEmail].id,
          campaignId: campaign.id,
          body: "Budget pacing looks acceptable for now; re-check with the next milestone.",
          createdAt: new Date(2026, 3, 11 + campaignIndex)
        }
      ]
    });
  }

  await prisma.performance.createMany({
    data: performanceBlueprints.map((entry) => ({
      id: entry.id,
      campaignId: entry.campaignId,
      date: new Date(entry.date),
      platform: PerformancePlatform[entry.platform],
      spend: entry.spend,
      revenue: entry.revenue,
      purchases: entry.purchases
    }))
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
