"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatCurrency } from "@/lib/utils";

export function BudgetVsSpendChart({
  data
}: {
  data: { name: string; fullName?: string; budget: number; spent: number }[];
}) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={8} layout="vertical" margin={{ left: 16, right: 12 }}>
          <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#e8eadf" />
          <XAxis axisLine={false} tickFormatter={(value) => `$${Math.round(value / 1000)}k`} tickLine={false} type="number" />
          <YAxis axisLine={false} dataKey="name" tickLine={false} type="category" width={132} />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            labelFormatter={(_label, payload) => payload?.[0]?.payload?.fullName ?? _label}
          />
          <Bar dataKey="budget" fill="#7c8f54" radius={[0, 10, 10, 0]} />
          <Bar dataKey="spent" fill="#0f766e" radius={[0, 10, 10, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
