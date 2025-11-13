import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "TCP", value: 42, color: "hsl(var(--chart-1))" },
  { name: "UDP", value: 28, color: "hsl(var(--chart-2))" },
  { name: "HTTP", value: 18, color: "hsl(var(--chart-3))" },
  { name: "DNS", value: 8, color: "hsl(var(--chart-4))" },
  { name: "TLS", value: 4, color: "hsl(var(--chart-5))" },
];

export const ProtocolChart = () => {
  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader>
        <CardTitle>Protocol Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
