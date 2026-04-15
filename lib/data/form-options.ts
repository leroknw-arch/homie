import { seedCompanies, seedProducts, seedTeams, seedUsers } from "@/lib/data/seed-blueprints";

export const formOptions = {
  companies: seedCompanies.map((company) => ({
    value: company.id,
    label: company.name
  })),
  products: seedProducts.map((product) => ({
    value: product.id,
    label: product.name,
    companyId: seedCompanies.find((company) => company.slug === product.companySlug)?.id ?? ""
  })),
  teams: seedTeams.map((team) => ({
    value: team.slug,
    label: team.name
  })),
  owners: seedUsers.map((user) => ({
    value: user.id,
    label: user.name
  })),
  assignees: seedUsers
    .filter((user) => "teamSlug" in user)
    .map((user) => ({
      value: user.id,
      label: user.name
    })),
  deliverableTypes: [
    { value: "Landing Page", label: "Landing Page" },
    { value: "Content Package", label: "Content Package" },
    { value: "PR Asset", label: "PR Asset" },
    { value: "Sales Deck", label: "Sales Deck" }
  ]
} as const;
