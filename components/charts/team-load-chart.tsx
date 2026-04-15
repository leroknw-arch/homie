"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function TeamLoadChart({
  data
}: {
  data: {
    team: string;
    openTasks: number;
    utilization: number;
    estimatedHours: number;
    actualHours: number;
  }[];
}) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 16, right: 12 }}>
          <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#e8eadf" />
          <XAxis axisLine={false} tickLine={false} type="number" />
          <YAxis axisLine={false} dataKey="team" tickLine={false} type="category" width={108} />
          <Tooltip
            formatter={(value, name, item) => {
              if (name === "actualHours") return [`${value} h`, "Actual"];
              if (name === "estimatedHours") return [`${value} h`, "Planned"];
              return [value, item.name];
            }}
            labelFormatter={(label) => `Team: ${label}`}
          />
          <Bar dataKey="estimatedHours" fill="#d7ddc7" radius={[0, 10, 10, 0]} />
          <Bar dataKey="actualHours" fill="#0f766e" radius={[0, 10, 10, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
