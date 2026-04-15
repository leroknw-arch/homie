# HOMIE

HOMIE is a premium Marketing Execution Platform for Heads of Marketing. It connects company and product structure with campaigns, units of work, deliverables, tasks, budget, ROI, workload, gantt visibility and campaign risk logic.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives
- Prisma ORM
- PostgreSQL
- Recharts
- NextAuth

## Current Product Scope

- Login with demo credentials
- Executive dashboard
- Campaign portfolio list
- Marketing plan view
- Campaign detail with tabs
- Gantt view
- Team and person workload view
- Demo forms for campaign, deliverable and task creation

## Project Structure

```text
app/
  (auth)/login
  (app)/
    dashboard
    campaigns
    campaigns/[campaignId]
    campaigns/new
    marketing-plan
    gantt
    teams
  api/auth/[...nextauth]
components/
  auth/
  campaigns/
  charts/
  dashboard/
  forms/
  gantt/
  layout/
  teams/
  ui/
lib/
  auth/
  data/
  domain/
  db.ts
  presentation.ts
  utils.ts
prisma/
  schema.prisma
  seed.ts
tests/
```

## Environment Variables

Copy `.env.example` to `.env` and adjust values as needed:

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL`: PostgreSQL connection string for Prisma
- `AUTH_SECRET`: secret used by NextAuth
- `NEXTAUTH_URL`: local or deployed app URL
- `DEMO_PASSWORD`: shared password for internal demo users
- `DEMO_REFERENCE_DATE`: fixed date used to stabilize risk and deadline calculations in demo mode

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma Client:

```bash
npm run prisma:generate
```

3. Push the schema to your local database:

```bash
npx prisma db push
```

4. Seed demo data:

```bash
npm run prisma:seed
```

5. Start the app:

```bash
npm run dev
```

## Demo Credentials

- Email: `ariana@homie.app`
- Password: `demo1234`

## Commands

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run prisma:generate`
- `npm run prisma:seed`

## Database Notes

- Prisma schema is defined in `prisma/schema.prisma`
- Demo seed data lives in `prisma/seed.ts`
- The UI currently reads from the demo data layer for presentation consistency
- Prisma and PostgreSQL are ready for the next step: wiring real reads and writes

## Demo Assets

- Demo walkthrough: `DEMO_GUIDE.md`
- QA flow: `QA_CHECKLIST.md`
- Release summary: `RELEASE_READINESS.md`
