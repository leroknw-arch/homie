"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type TrendKey = "roas" | "cpa";

export function PerformanceTrendChart({
  data,
  metric
}: {
  data: { date: string; roas: number; cpa: number }[];
  metric: TrendKey;
}) {
  const isRoas = metric === "roas";

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 8, right: 8 }}>
          <CartesianGrid stroke="#e8eadf" strokeDasharray="3 3" vertical={false} />
          <XAxis axisLine={false} dataKey="date" tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip formatter={(value) => (isRoas ? `${Number(value).toFixed(2)}x` : `$${Number(value).toFixed(0)}`)} />
          <Line
            dataKey={metric}
            dot={{ fill: isRoas ? "#0f766e" : "#b45309", r: 3 }}
            stroke={isRoas ? "#0f766e" : "#b45309"}
            strokeWidth={2.5}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
