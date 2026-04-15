import { Card, CardContent } from "@/components/ui/card";

export function PerformanceHero({ referenceDate }: { referenceDate: string }) {
  return (
    <Card className="overflow-hidden bg-surface-950 text-white">
      <CardContent className="grid gap-8 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_26%),linear-gradient(135deg,#171f11_0%,#2f3f21_100%)] p-7 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-[0.22em] text-white/60">Marketing control center</div>
          <div className="space-y-3">
            <h1 className="max-w-3xl text-balance font-display text-4xl font-semibold sm:text-5xl">
              Marketing Performance Today
            </h1>
            <p className="max-w-2xl text-base text-white/74 sm:text-lg">
              See what&apos;s working, what&apos;s losing money, and what to fix next.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <HeroSignal label="Reference" value={referenceDate} detail="Stable demo reporting date" />
          <HeroSignal label="Priority" value="Money first" detail="Performance drives the first read" />
          <HeroSignal label="Action lens" value="Today" detail="Focus budget and fixes in one glance" />
        </div>
      </CardContent>
    </Card>
  );
}

function HeroSignal({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
      <div className="text-xs uppercase tracking-[0.16em] text-white/58">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-white/65">{detail}</div>
    </div>
  );
}
