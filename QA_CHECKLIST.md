# HOMIE QA Checklist

## Core Flows

- [ ] Login with `ariana@homie.app` / `demo1234`
- [ ] Confirm unauthenticated access redirects to `/login`
- [ ] Logout returns the user to the login flow

## Dashboard

- [ ] `/dashboard` loads without console errors
- [ ] KPI cards render with seed values
- [ ] Budget, ROI and team charts render correctly
- [ ] Campaign summary links navigate to campaign detail
- [ ] Empty state appears if global filters remove all campaigns

## Marketing Plan

- [ ] `/marketing-plan` loads grouped finance data
- [ ] Budget and ROI charts match finance table totals
- [ ] Empty state appears when filters remove all plan data

## Campaign Detail

- [ ] Open `Aurora Pulse Launch` and verify risk banner shows
- [ ] Open `Luma Summer Glow` and verify healthy execution state
- [ ] All tabs switch correctly: Overview, Units of Work, Deliverables, Tasks, Gantt, Team Activity
- [ ] Deliverable and task dependencies are visible

## Filters

- [ ] Global filters persist in URL query params
- [ ] Clear button resets active filters
- [ ] Company, product, team, status, priority and date filters affect dashboard, marketing plan, gantt and teams

## Gantt

- [ ] `/gantt` renders timeline rows with dependencies
- [ ] At-risk campaigns surface risk labels in the timeline
- [ ] Empty state appears if filters remove all rows

## Workload

- [ ] `/teams` shows workload by team and by person
- [ ] Empty state appears when filters remove all visible workload

## Forms

- [ ] `/campaigns/new` renders all three forms
- [ ] Required-field validation triggers for campaign form
- [ ] Required-field validation triggers for deliverable form
- [ ] Required-field validation triggers for task form
- [ ] Success and error feedback messages announce correctly

## Regression Smoke

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test`
- [ ] `npm run build`
