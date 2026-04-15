import { CampaignStatus, Priority, Role } from "@/types/domain";

export const seedTeams = [
  { name: "Diseño", slug: "design", description: "Creative execution pod" },
  { name: "PR", slug: "pr", description: "Press and narrative pod" },
  { name: "Community", slug: "community", description: "Social community pod" },
  { name: "Growth", slug: "growth", description: "Acquisition and optimization pod" },
  { name: "Ventas", slug: "sales", description: "Sales enablement pod" }
] as const;

export const seedUsers = [
  {
    id: "user-ariana",
    name: "Ariana Torres",
    email: "ariana@homie.app",
    title: "Head of Marketing",
    role: "HEAD_OF_MARKETING" as Role
  },
  {
    id: "user-leo",
    name: "Leo Mendez",
    email: "leo@homie.app",
    title: "Growth Lead",
    role: "TEAM_LEAD" as Role,
    teamSlug: "growth"
  },
  {
    id: "user-maya",
    name: "Maya Chen",
    email: "maya@homie.app",
    title: "Creative Lead",
    role: "TEAM_LEAD" as Role,
    teamSlug: "design"
  },
  {
    id: "user-nina",
    name: "Nina Alvarez",
    email: "nina@homie.app",
    title: "PR Strategist",
    role: "COLLABORATOR" as Role,
    teamSlug: "pr"
  },
  {
    id: "user-omar",
    name: "Omar Ruiz",
    email: "omar@homie.app",
    title: "Community Manager",
    role: "COLLABORATOR" as Role,
    teamSlug: "community"
  },
  {
    id: "user-paula",
    name: "Paula Soto",
    email: "paula@homie.app",
    title: "Sales Enablement Lead",
    role: "TEAM_LEAD" as Role,
    teamSlug: "sales"
  }
] as const;

export const seedCompanies = [
  {
    id: "company-aurora",
    name: "Aurora Ventures",
    slug: "aurora-ventures",
    description: "B2B software company expanding multi-product growth."
  },
  {
    id: "company-northstar",
    name: "Northstar Consumer",
    slug: "northstar-consumer",
    description: "Consumer brand portfolio focused on digital acquisition."
  }
] as const;

export const seedProducts = [
  {
    id: "product-aurora-cloud",
    companySlug: "aurora-ventures",
    name: "Aurora Cloud",
    slug: "aurora-cloud",
    description: "Enterprise analytics suite"
  },
  {
    id: "product-aurora-pulse",
    companySlug: "aurora-ventures",
    name: "Aurora Pulse",
    slug: "aurora-pulse",
    description: "AI reporting assistant"
  },
  {
    id: "product-luma",
    companySlug: "northstar-consumer",
    name: "Luma Skin",
    slug: "luma-skin",
    description: "Premium skincare line"
  },
  {
    id: "product-peak",
    companySlug: "northstar-consumer",
    name: "Peak Fuel",
    slug: "peak-fuel",
    description: "High-performance supplements"
  }
] as const;

export const seedCampaigns = [
  {
    id: "campaign-demand-engine",
    name: "Q2 Demand Engine",
    companySlug: "aurora-ventures",
    productSlug: "aurora-cloud",
    ownerEmail: "leo@homie.app",
    description: "Performance engine to scale qualified pipeline for Aurora Cloud.",
    objective: "Increase SQL generation with tighter paid-to-demo conversion.",
    status: "IN_PROGRESS" as CampaignStatus,
    priority: "CRITICAL" as Priority,
    startDate: "2026-03-03",
    endDate: "2026-06-28",
    progress: 68,
    budgetTotal: 240000,
    budgetSpent: 162000,
    roi: 3.6,
    kpiName: "SQLs",
    kpiValue: "412 / 600",
    teamSlugs: ["growth", "design", "sales"],
    unitNames: ["Paid Media", "Creative Production", "Sales Enablement"]
  },
  {
    id: "campaign-pulse-launch",
    name: "Aurora Pulse Launch",
    companySlug: "aurora-ventures",
    productSlug: "aurora-pulse",
    ownerEmail: "ariana@homie.app",
    description: "Integrated launch to build awareness and create executive-level demand.",
    objective: "Convert launch momentum into pipeline across enterprise accounts.",
    status: "AT_RISK" as CampaignStatus,
    priority: "HIGH" as Priority,
    startDate: "2026-04-01",
    endDate: "2026-07-15",
    progress: 41,
    budgetTotal: 185000,
    budgetSpent: 93000,
    roi: 1.4,
    kpiName: "Pipeline",
    kpiValue: "$410k / $900k",
    teamSlugs: ["pr", "design", "growth", "community"],
    unitNames: ["PR Push", "Creative Production", "Paid Media", "Social Content"]
  },
  {
    id: "campaign-brand-refresh",
    name: "Executive Brand Refresh",
    companySlug: "aurora-ventures",
    ownerEmail: "maya@homie.app",
    description: "Refresh narrative, visuals and leadership story for the corporate brand.",
    objective: "Clarify category position and unify product storytelling.",
    status: "PLANNING" as CampaignStatus,
    priority: "MEDIUM" as Priority,
    startDate: "2026-04-12",
    endDate: "2026-08-05",
    progress: 18,
    budgetTotal: 95000,
    budgetSpent: 12000,
    roi: 0.9,
    kpiName: "Brand Lift",
    kpiValue: "Baseline captured",
    teamSlugs: ["design", "pr"],
    unitNames: ["Creative Production", "PR Push"]
  },
  {
    id: "campaign-luma-summer",
    name: "Luma Summer Glow",
    companySlug: "northstar-consumer",
    productSlug: "luma-skin",
    ownerEmail: "omar@homie.app",
    description: "Seasonal DTC push with creator content and conversion-focused assets.",
    objective: "Drive efficient new customer acquisition during summer peak.",
    status: "IN_PROGRESS" as CampaignStatus,
    priority: "HIGH" as Priority,
    startDate: "2026-03-18",
    endDate: "2026-06-20",
    progress: 74,
    budgetTotal: 160000,
    budgetSpent: 118000,
    roi: 4.1,
    kpiName: "ROAS",
    kpiValue: "4.1x",
    teamSlugs: ["community", "growth", "design"],
    unitNames: ["Social Content", "Paid Media", "Creative Production"]
  },
  {
    id: "campaign-peak-retail",
    name: "Peak Fuel Retail Push",
    companySlug: "northstar-consumer",
    productSlug: "peak-fuel",
    ownerEmail: "paula@homie.app",
    description: "Retail launch support for trade marketing and field-ready materials.",
    objective: "Open new retail doors with a clean go-to-market toolkit.",
    status: "ON_HOLD" as CampaignStatus,
    priority: "MEDIUM" as Priority,
    startDate: "2026-02-15",
    endDate: "2026-05-30",
    progress: 47,
    budgetTotal: 132000,
    budgetSpent: 69000,
    roi: 1.1,
    kpiName: "Retail Doors",
    kpiValue: "28 / 50",
    teamSlugs: ["sales", "pr", "design"],
    unitNames: ["Sales Enablement", "PR Push", "Creative Production"]
  },
  {
    id: "campaign-always-on",
    name: "Always-On Performance",
    companySlug: "northstar-consumer",
    productSlug: "peak-fuel",
    ownerEmail: "leo@homie.app",
    description: "Quarterly paid engine focused on profitable acquisition.",
    objective: "Lower CAC while sustaining revenue contribution.",
    status: "COMPLETED" as CampaignStatus,
    priority: "LOW" as Priority,
    startDate: "2026-01-06",
    endDate: "2026-03-31",
    progress: 100,
    budgetTotal: 88000,
    budgetSpent: 84500,
    roi: 5.3,
    kpiName: "CAC",
    kpiValue: "$28",
    teamSlugs: ["growth", "community"],
    unitNames: ["Paid Media", "Social Content"]
  }
] as const;
