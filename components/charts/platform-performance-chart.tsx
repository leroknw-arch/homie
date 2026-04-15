"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { performancePlatformLabels } from "@/lib/presentation";
import { formatCurrency } from "@/lib/utils";
import { PlatformPerformanceSnapshot } from "@/types/domain";

export function PlatformPerformanceChart({
  data
}: {
  data: PlatformPerformanceSnapshot[];
}) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data.map((item) => ({ ...item, label: performancePlatformLabels[item.platform] }))} margin={{ left: 8, right: 8 }}>
          <CartesianGrid stroke="#e8eadf" strokeDasharray="3 3" vertical={false} />
          <XAxis axisLine={false} dataKey="label" tickLine={false} />
          <YAxis axisLine={false} tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`} tickLine={false} />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Bar dataKey="spend" fill="#d7ddc7" radius={[10, 10, 0, 0]} />
          <Bar dataKey="revenue" fill="#0f766e" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
