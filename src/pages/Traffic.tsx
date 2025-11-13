import { Network, ArrowUpDown, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/StatsCard";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const bandwidthData = [
  { time: "00:00", inbound: 450, outbound: 320 },
  { time: "04:00", inbound: 320, outbound: 280 },
  { time: "08:00", inbound: 780, outbound: 620 },
  { time: "12:00", inbound: 1250, outbound: 980 },
  { time: "16:00", inbound: 950, outbound: 750 },
  { time: "20:00", inbound: 670, outbound: 520 },
  { time: "23:59", inbound: 540, outbound: 420 },
];

const protocolStats = [
  { protocol: "TCP", packets: 125430, bytes: "45.2 GB", percentage: 42 },
  { protocol: "UDP", packets: 83220, bytes: "28.7 GB", percentage: 28 },
  { protocol: "HTTP", packets: 54210, bytes: "18.1 GB", percentage: 18 },
  { protocol: "DNS", packets: 24110, bytes: "8.3 GB", percentage: 8 },
  { protocol: "TLS", packets: 12050, bytes: "4.2 GB", percentage: 4 },
];

const topTalkers = [
  { ip: "192.168.1.45", sent: "2.4 GB", received: "1.8 GB", connections: 1245 },
  { ip: "10.0.0.23", sent: "1.9 GB", received: "1.2 GB", connections: 890 },
  { ip: "172.16.0.12", sent: "1.5 GB", received: "980 MB", connections: 670 },
  { ip: "192.168.1.67", sent: "1.2 GB", received: "750 MB", connections: 543 },
  { ip: "10.0.0.89", sent: "890 MB", received: "620 MB", connections: 432 },
];

const Traffic = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Network className="h-8 w-8 text-info" />
          Network Traffic
        </h1>
        <p className="text-muted-foreground">Real-time network traffic analysis and statistics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Bandwidth"
          value="73.5 GB"
          icon={ArrowUpDown}
          trend={8}
          variant="info"
        />
        <StatsCard
          title="Packets/sec"
          value="12.4K"
          icon={Activity}
          trend={-3}
          variant="default"
        />
        <StatsCard
          title="Active Connections"
          value="3,780"
          icon={Network}
          trend={15}
          variant="success"
        />
        <StatsCard
          title="Avg Latency"
          value="24ms"
          icon={Activity}
          variant="success"
        />
      </div>

      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Bandwidth Usage (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={bandwidthData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="time" 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="inbound"
                stackId="1"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="outbound"
                stackId="1"
                stroke="hsl(var(--chart-2))"
                fill="hsl(var(--chart-2))"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle>Protocol Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Packets</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {protocolStats.map((stat) => (
                  <TableRow key={stat.protocol} className="hover:bg-accent/50 transition-colors">
                    <TableCell>
                      <Badge variant="outline">{stat.protocol}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">{stat.packets.toLocaleString()}</TableCell>
                    <TableCell className="font-semibold text-primary">{stat.bytes}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${stat.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{stat.percentage}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle>Top Talkers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Conns</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topTalkers.map((talker) => (
                  <TableRow key={talker.ip} className="hover:bg-accent/50 transition-colors">
                    <TableCell className="font-mono font-medium">{talker.ip}</TableCell>
                    <TableCell className="text-destructive">{talker.sent}</TableCell>
                    <TableCell className="text-success">{talker.received}</TableCell>
                    <TableCell className="text-muted-foreground">{talker.connections}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Traffic;
