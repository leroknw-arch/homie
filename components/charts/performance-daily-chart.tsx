"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatCurrency } from "@/lib/utils";

export function PerformanceDailyChart({
  data
}: {
  data: { date: string; spend: number; revenue: number }[];
}) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 8, right: 8 }}>
          <defs>
            <linearGradient id="performanceSpend" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#7c8f54" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7c8f54" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="performanceRevenue" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#0f766e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e8eadf" strokeDasharray="3 3" vertical={false} />
          <XAxis axisLine={false} dataKey="date" tickLine={false} />
          <YAxis
            axisLine={false}
            tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`}
            tickLine={false}
          />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Area dataKey="spend" fill="url(#performanceSpend)" stroke="#7c8f54" strokeWidth={2} type="monotone" />
          <Area dataKey="revenue" fill="url(#performanceRevenue)" stroke="#0f766e" strokeWidth={2} type="monotone" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
