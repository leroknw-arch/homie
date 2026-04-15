"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CalendarRange,
  CircleDollarSign,
  Flag,
  FolderKanban,
  Goal,
  LayoutGrid,
  ListChecks,
  MessageSquareMore,
  TrendingUp,
  Users2
} from "lucide-react";

import { GanttBoard } from "@/components/gantt/gantt-board";
import { CampaignPerformancePanel } from "@/components/performance/campaign-performance-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { buildGanttGroup, getWorkspaceSnapshot } from "@/lib/data";
import { calculateBudgetPacing } from "@/lib/domain/portfolio-math";
import {
  campaignStatusLabels,
  getPriorityVariant,
  getStatusVariant,
  priorityLabels,
  workStatusLabels
} from "@/lib/presentation";
import { cn, formatCurrency, formatDate, formatPercent } from "@/lib/utils";
import {
  CampaignBundle,
  CampaignPerformanceSnapshot,
  DailyPerformancePoint,
  PerformanceInsight,
  PlatformPerformanceSnapshot,
  Team,
  WeeklyPerformanceSummary
} from "@/types/domain";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "performance", label: "Performance", icon: TrendingUp },
  { id: "units", label: "Units of Work", icon: FolderKanban },
  { id: "deliverables", label: "Deliverables", icon: Flag },
  { id: "tasks", label: "Tasks", icon: ListChecks },
  { id: "gantt", label: "Gantt", icon: CalendarRange },
  { id: "team-activity", label: "Team Activity", icon: Users2 }
] as const;

type TabId = (typeof tabs)[number]["id"];

export function CampaignDetailView({
  bundle,
  performance
}: {
  bundle: CampaignBundle;
  performance: {
    latestDate?: string;
    snapshot?: CampaignPerformanceSnapshot;
    dailySeries: DailyPerformancePoint[];
    platformBreakdown: PlatformPerformanceSnapshot[];
    insights: PerformanceInsight[];
    weeklySummary?: WeeklyPerformanceSummary;
    latestEntries: CampaignBundle["performances"];
  };
}) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const { campaign, company, product, owner, teams, units, deliverables, tasks, comments } = bundle;
  const workspace = getWorkspaceSnapshot();

  const findUserName = (userId?: string) =>
    workspace.users.find((user) => user.id === userId)?.name ?? "Unassigned";

  const tasksByTeam = useMemo(() => {
    const taskTeamIds = Array.from(new Set(tasks.map((task) => task.teamId)));

    return taskTeamIds.map((teamId) => {
      const team = workspace.teams.find((item) => item.id === teamId) ?? {
        id: teamId,
        name: "Unknown Team",
        slug: teamId
      };
      const teamTasks = tasks
        .filter((task) => task.teamId === teamId)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

      const totalEstimated = teamTasks.reduce((acc, task) => acc + task.estimatedHours, 0);
      const totalActual = teamTasks.reduce((acc, task) => acc + task.actualHours, 0);
      const averageProgress = Math.round(
        teamTasks.reduce((acc, task) => acc + task.progress, 0) / Math.max(teamTasks.length, 1)
      );

      return {
        team,
        tasks: teamTasks,
        totalEstimated,
        totalActual,
        averageProgress,
        blocked: teamTasks.filter((task) => task.status === "BLOCKED").length
      };
    });
  }, [tasks, workspace.teams]);

  const deliverablesInReview = deliverables.filter((item) => item.status === "IN_REVIEW").length;
  const completedTasks = tasks.filter((item) => item.status === "DONE").length;
  const openTasks = tasks.filter((item) => item.status !== "DONE").length;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-transparent text-white shadow-none">
        <CardContent className="grid gap-8 rounded-[2rem] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_80%_16%,rgba(233,193,255,0.12),transparent_18%),linear-gradient(135deg,#181818_0%,#2f3f21_100%)] p-7 shadow-panel lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-white/12 text-white" variant={getStatusVariant(campaign.status)}>
                {campaignStatusLabels[campaign.status]}
              </Badge>
              <Badge className="bg-white/12 text-white" variant={getPriorityVariant(campaign.priority)}>
                {priorityLabels[campaign.priority]}
              </Badge>
              <div className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/65">
                {company.name} · {product?.name ?? "Corporate"}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs uppercase tracking-[0.2em] text-white/60">Campaign detail</div>
              <h2 className="max-w-3xl text-balance font-display text-4xl font-semibold">{campaign.name}</h2>
              <p className="max-w-3xl text-white/74">{campaign.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <HeaderMetric label="Owner" value={owner.name} subvalue={owner.title} />
              <HeaderMetric
                label="Timeline"
                value={`${formatDate(campaign.startDate)} - ${formatDate(campaign.endDate)}`}
                subvalue={`${campaign.progress}% progress`}
              />
              <HeaderMetric label="Budget" value={formatCurrency(campaign.budgetTotal)} subvalue={`${formatCurrency(campaign.budgetSpent)} spent`} />
              <HeaderMetric label="ROI" value={`${campaign.roi.toFixed(1)}x`} subvalue={`${campaign.kpiName}: ${campaign.kpiValue}`} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <QuickStat
              icon={Goal}
              label="Campaign progress"
              value={`${campaign.progress}%`}
              helper={`${completedTasks}/${tasks.length} tasks completed`}
            />
            <QuickStat
              icon={CircleDollarSign}
              label="Budget pacing"
              value={formatPercent(calculateBudgetPacing(campaign.budgetTotal, campaign.budgetSpent))}
              helper={`${formatCurrency(campaign.budgetTotal - campaign.budgetSpent)} remaining`}
            />
            <QuickStat
              icon={Activity}
              label="Open execution"
              value={`${openTasks}`}
              helper={`${deliverablesInReview} deliverables in review`}
            />
            <QuickStat
              icon={Users2}
              label="Teams involved"
              value={`${teams.length}`}
              helper={teams.map((team) => team.name).join(" · ")}
            />
          </div>
        </CardContent>
      </Card>

      {bundle.risk.reasons.length ? (
        <Card className="border-0 bg-[linear-gradient(180deg,#fff1f1_0%,#fff8f0_100%)]">
          <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <AlertTriangle className="size-4" />
              </div>
              <div>
                <div className="font-medium text-rose-900">Campaign risk is active</div>
                <div className="mt-1 text-sm text-rose-700">
                  {bundle.risk.reasons.map((reason) => reasonLabel(reason)).join(" · ")}
                </div>
              </div>
            </div>
            <div className="text-sm text-rose-700">
              {bundle.risk.actualProgress}% actual vs {bundle.risk.expectedProgress}% expected
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="glass-panel flex flex-wrap gap-2 rounded-[1.65rem] border border-white/70 p-2 shadow-soft backdrop-blur-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm transition",
                isActive ? "bg-surface-800 text-white shadow-soft" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "overview" ? (
        <OverviewTab
          campaign={campaign}
          comments={comments}
          deliverables={deliverables}
          findUserName={findUserName}
          tasks={tasks}
          teams={teams}
          units={units}
        />
      ) : null}

      {activeTab === "performance" ? (
        <CampaignPerformancePanel
          campaignName={campaign.name}
          dailySeries={performance.dailySeries}
          insights={performance.insights}
          latestDate={performance.latestDate}
          latestEntries={performance.latestEntries}
          platformBreakdown={performance.platformBreakdown}
          snapshot={performance.snapshot}
          weeklySummary={performance.weeklySummary}
        />
      ) : null}

      {activeTab === "units" ? (
        <UnitsTab teams={teams} units={units} deliverables={deliverables} tasks={tasks} findUserName={findUserName} />
      ) : null}

      {activeTab === "deliverables" ? (
        <DeliverablesTab deliverables={deliverables} teams={teams} findUserName={findUserName} />
      ) : null}

      {activeTab === "tasks" ? <TasksTab tasksByTeam={tasksByTeam} findUserName={findUserName} /> : null}

      {activeTab === "gantt" ? (
        <GanttBoard groups={[buildGanttGroup(bundle)]} />
      ) : null}

      {activeTab === "team-activity" ? <TeamActivityTab tasksByTeam={tasksByTeam} /> : null}
    </div>
  );
}

function HeaderMetric({
  label,
  value,
  subvalue
}: {
  label: string;
  value: string;
  subvalue: string;
}) {
  return (
    <div className="rounded-[1.25rem] bg-white/10 p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-white/60">{label}</div>
      <div className="mt-2 text-sm font-medium text-white">{value}</div>
      <div className="mt-1 text-sm text-white/68">{subvalue}</div>
    </div>
  );
}

function QuickStat({
  icon: Icon,
  label,
  value,
  helper
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-[1.35rem] bg-white/10 p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/60">
        <Icon className="size-4" />
        {label}
      </div>
      <div className="mt-3 font-display text-3xl font-semibold">{value}</div>
      <div className="mt-2 text-sm text-white/72">{helper}</div>
    </div>
  );
}

function OverviewTab({
  campaign,
  units,
  deliverables,
  tasks,
  comments,
  teams,
  findUserName
}: {
  campaign: CampaignBundle["campaign"];
  units: CampaignBundle["units"];
  deliverables: CampaignBundle["deliverables"];
  tasks: CampaignBundle["tasks"];
  comments: CampaignBundle["comments"];
  teams: Team[];
  findUserName: (userId?: string) => string;
}) {
  const deliverablesDone = deliverables.filter((item) => item.status === "DONE").length;
  const blockedTasks = tasks.filter((item) => item.status === "BLOCKED").length;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Execution summary</CardTitle>
            <CardDescription>Lectura rápida de avance, output y trabajo pendiente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              <SummaryMetric label="Units of Work" value={`${units.length}`} detail={`${teams.length} teams involved`} />
              <SummaryMetric label="Deliverables" value={`${deliverables.length}`} detail={`${deliverablesDone} completed`} />
              <SummaryMetric label="Tasks" value={`${tasks.length}`} detail={`${blockedTasks} blocked`} />
            </div>
            <div className="space-y-3 rounded-[1.35rem] bg-secondary/55 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-display text-lg font-semibold">Campaign progress</div>
                  <div className="text-sm text-muted-foreground">
                    Calculated from deliverables and tasks execution.
                  </div>
                </div>
                <div className="font-display text-3xl font-semibold">{campaign.progress}%</div>
              </div>
              <Progress value={campaign.progress} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Units snapshot</CardTitle>
            <CardDescription>Estado del trabajo funcional que sostiene la campaña.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {units.map((unit) => (
              <div key={unit.id} className="rounded-[1.25rem] border border-border/70 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{unit.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{unit.objective}</div>
                  </div>
                  <Badge variant={getStatusVariant(unit.status)}>{workStatusLabels[unit.status]}</Badge>
                </div>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <div className="text-muted-foreground">Responsible</div>
                    <div>{findUserName(unit.ownerId)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Timeline</div>
                    <div>
                      {formatDate(unit.startDate)} - {formatDate(unit.endDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Progress</div>
                    <div>{unit.progress}%</div>
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={unit.progress} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Deliverables list</CardTitle>
            <CardDescription>Piezas concretas a producir dentro de esta campaña.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {deliverables.map((deliverable) => (
              <div key={deliverable.id} className="rounded-[1.25rem] border border-border/70 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{deliverable.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {deliverable.type} · {findUserName(deliverable.ownerId)}
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(deliverable.status)}>{workStatusLabels[deliverable.status]}</Badge>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4 text-sm">
                  <div className="text-muted-foreground">Due {formatDate(deliverable.dueDate)}</div>
                  <div>{deliverable.progress}% progress</div>
                </div>
                <div className="mt-3">
                  <Progress value={deliverable.progress} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
            <CardDescription>Notas ejecutivas y observaciones recientes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-[1.25rem] bg-secondary/60 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-9 items-center justify-center rounded-2xl bg-white text-surface-800">
                    <MessageSquareMore className="size-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{comment.body}</div>
                    <div className="mt-2 text-xs text-muted-foreground">{formatDate(comment.createdAt)}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UnitsTab({
  units,
  deliverables,
  tasks,
  teams,
  findUserName
}: {
  units: CampaignBundle["units"];
  deliverables: CampaignBundle["deliverables"];
  tasks: CampaignBundle["tasks"];
  teams: Team[];
  findUserName: (userId?: string) => string;
}) {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Units of Work</CardTitle>
          <CardDescription>Bloques funcionales con progreso, responsables y carga asociada.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!units.length ? (
            <EmptyState
              icon={<FolderKanban className="size-6" />}
              title="No units of work yet"
              description="Add the first unit of work to define how this campaign will be executed by team."
            />
          ) : null}
          {units.map((unit) => {
          const unitDeliverables = deliverables.filter((item) => item.unitOfWorkId === unit.id);
          const unitTasks = tasks.filter((item) => item.unitOfWorkId === unit.id);
          const teamName = teams.find((team) => team.id === unit.teamId)?.name ?? "Unknown";

          return (
            <div key={unit.id} className="rounded-[1.35rem] border border-border/70 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-display text-xl font-semibold">{unit.name}</div>
                    <Badge variant={getStatusVariant(unit.status)}>{workStatusLabels[unit.status]}</Badge>
                  </div>
                  <div className="max-w-2xl text-sm text-muted-foreground">{unit.objective}</div>
                </div>

                <div className="grid gap-3 sm:grid-cols-4 lg:min-w-[460px]">
                  <MetaCell label="Team" value={teamName} />
                  <MetaCell label="Responsible" value={findUserName(unit.ownerId)} />
                  <MetaCell label="Deliverables" value={`${unitDeliverables.length}`} />
                  <MetaCell label="Tasks" value={`${unitTasks.length}`} />
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <MetaCell label="Start" value={formatDate(unit.startDate)} />
                <MetaCell label="End" value={formatDate(unit.endDate)} />
                <MetaCell label="Progress" value={`${unit.progress}%`} />
              </div>

              <div className="mt-4">
                <Progress value={unit.progress} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function DeliverablesTab({
  deliverables,
  teams,
  findUserName
}: {
  deliverables: CampaignBundle["deliverables"];
  teams: Team[];
  findUserName: (userId?: string) => string;
}) {
  return (
      <Card>
        <CardHeader>
          <CardTitle>Deliverables</CardTitle>
          <CardDescription>Listado completo de piezas con owner, equipo, horas y estado.</CardDescription>
        </CardHeader>
      <CardContent className="space-y-3">
        {!deliverables.length ? (
          <EmptyState
            icon={<Flag className="size-6" />}
            title="No deliverables defined"
            description="Create deliverables to make output, ownership and deadlines visible."
          />
        ) : null}
        {deliverables.map((deliverable) => (
          <div
            key={deliverable.id}
            className="grid gap-4 rounded-[1.35rem] border border-border/70 p-5 lg:grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr_0.8fr]"
          >
            <div>
              <div className="font-medium">{deliverable.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{deliverable.type}</div>
            </div>
            <MetaCell label="Owner" value={findUserName(deliverable.ownerId)} />
            <MetaCell label="Team" value={teams.find((team) => team.id === deliverable.teamId)?.name ?? "Unknown"} />
            <MetaCell label="Due" value={formatDate(deliverable.dueDate)} />
            <div className="space-y-2">
              <Badge variant={getStatusVariant(deliverable.status)}>{workStatusLabels[deliverable.status]}</Badge>
              <div className="text-xs text-muted-foreground">
                {deliverable.actualHours}h / {deliverable.estimatedHours}h
              </div>
              {deliverable.dependencyDeliverableId ? (
                <div className="text-xs text-amber-700">
                  Depends on {deliverables.find((item) => item.id === deliverable.dependencyDeliverableId)?.title ?? "another deliverable"}
                </div>
              ) : null}
            </div>
            <div className="lg:col-span-5">
              <Progress value={deliverable.progress} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TasksTab({
  tasksByTeam,
  findUserName
}: {
  tasksByTeam: {
    team: Team;
    tasks: CampaignBundle["tasks"];
    totalEstimated: number;
    totalActual: number;
    averageProgress: number;
    blocked: number;
  }[];
  findUserName: (userId?: string) => string;
}) {
  return (
    <div className="space-y-6">
      {!tasksByTeam.some((group) => group.tasks.length) ? (
        <EmptyState
          icon={<ListChecks className="size-6" />}
          title="No tasks visible in this campaign"
          description="Tasks will appear here once execution is assigned to teams and owners."
        />
      ) : null}
      {tasksByTeam.map((group) => (
        group.tasks.length ? (
        <Card key={group.team.id}>
          <CardHeader className="flex-row items-end justify-between gap-4">
            <div>
              <CardTitle>{group.team.name}</CardTitle>
              <CardDescription>
                {group.tasks.length} tasks · {group.totalActual}h actual / {group.totalEstimated}h planned
              </CardDescription>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div>{group.averageProgress}% average progress</div>
              <div>{group.blocked} blocked</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {group.tasks.map((task) => (
              <div
                key={task.id}
                className="grid gap-4 rounded-[1.25rem] border border-border/70 p-4 lg:grid-cols-[1.6fr_0.8fr_0.7fr_0.7fr_0.7fr]"
              >
                <div>
                  <div className="font-medium">{task.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{task.description}</div>
                </div>
                <MetaCell label="Assignee" value={findUserName(task.assigneeId)} />
                <MetaCell label="Start" value={formatDate(task.startDate)} />
                <MetaCell label="Due" value={formatDate(task.dueDate)} />
                <div className="space-y-2">
                  <Badge variant={getStatusVariant(task.status)}>{workStatusLabels[task.status]}</Badge>
                  <div className="text-xs text-muted-foreground">{task.actualHours}h actual</div>
                  {task.dependencyTaskId ? (
                    <div className="text-xs text-amber-700">
                      Depends on {group.tasks.find((item) => item.id === task.dependencyTaskId)?.title ?? "another task"}
                    </div>
                  ) : null}
                </div>
                <div className="lg:col-span-5">
                  <Progress value={task.progress} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        ) : null
      ))}
    </div>
  );
}

function TeamActivityTab({
  tasksByTeam
}: {
  tasksByTeam: {
    team: Team;
    tasks: CampaignBundle["tasks"];
    totalEstimated: number;
    totalActual: number;
    averageProgress: number;
    blocked: number;
  }[];
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <CardHeader>
          <CardTitle>Team activity summary</CardTitle>
          <CardDescription>Lectura consolidada por equipo para detectar carga y fricción.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!tasksByTeam.some((group) => group.tasks.length) ? (
            <EmptyState
              icon={<Users2 className="size-6" />}
              title="No team activity yet"
              description="Team activity will show up here once the campaign has active tasks."
            />
          ) : null}
          {tasksByTeam.map((group) => (
            group.tasks.length ? (
            <div key={group.team.id} className="rounded-[1.35rem] border border-border/70 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-display text-xl font-semibold">{group.team.name}</div>
                  <div className="text-sm text-muted-foreground">{group.tasks.length} active tasks</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl font-semibold">{group.averageProgress}%</div>
                  <div className="text-xs text-muted-foreground">avg progress</div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <MetaCell label="Planned" value={`${group.totalEstimated}h`} />
                <MetaCell label="Actual" value={`${group.totalActual}h`} />
                <MetaCell label="Blocked" value={`${group.blocked}`} />
              </div>
              <div className="mt-4">
                <Progress value={group.averageProgress} />
              </div>
            </div>
            ) : null
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operational reading</CardTitle>
          <CardDescription>Resumen ejecutivo del esfuerzo cross-functional de la campaña.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!tasksByTeam.some((group) => group.tasks.length) ? (
            <EmptyState
              icon={<Users2 className="size-6" />}
              title="No operational summary available"
              description="The operational reading will populate when the campaign has active tasks."
            />
          ) : null}
          {tasksByTeam
            .slice()
            .sort((a, b) => b.totalActual - a.totalActual || b.tasks.length - a.tasks.length)
            .filter((group) => group.tasks.length)
            .map((group) => (
              <div key={group.team.id} className="rounded-[1.25rem] bg-secondary/60 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{group.team.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {group.tasks.length} tasks · {group.totalActual}h invested
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl font-semibold">{group.averageProgress}%</div>
                    <div className="text-xs text-muted-foreground">delivery pace</div>
                  </div>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryMetric({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-border/70 p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{detail}</div>
    </div>
  );
}

function MetaCell({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="text-sm">
      <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

function reasonLabel(reason: string) {
  if (reason === "OVERDUE_CRITICAL_TASK") return "Critical overdue task";
  if (reason === "BLOCKED_DEPENDENCY") return "Blocked dependency";
  return "Progress behind plan";
}
