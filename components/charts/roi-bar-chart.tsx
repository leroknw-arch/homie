"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function RoiBarChart({
  data
}: {
  data: { name: string; fullName?: string; roi: number }[];
}) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 16, right: 12 }}>
          <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#e8eadf" />
          <XAxis axisLine={false} tickFormatter={(value) => `${Number(value).toFixed(0)}x`} tickLine={false} type="number" />
          <YAxis axisLine={false} dataKey="name" tickLine={false} type="category" width={132} />
          <Tooltip
            formatter={(value) => `${Number(value).toFixed(1)}x`}
            labelFormatter={(_label, payload) => payload?.[0]?.payload?.fullName ?? _label}
          />
          <Bar dataKey="roi" fill="#1f5f5b" radius={[0, 10, 10, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
