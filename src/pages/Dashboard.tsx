import { Shield, AlertTriangle, Activity, Network } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { AlertChart } from "@/components/AlertChart";
import { ProtocolChart } from "@/components/ProtocolChart";
import { TopIPsTable } from "@/components/TopIPsTable";

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Real-time network security monitoring</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Alerts"
          value="1,247"
          icon={AlertTriangle}
          trend={12}
          variant="destructive"
        />
        <StatsCard
          title="Active Rules"
          value="3,456"
          icon={Shield}
          variant="success"
        />
        <StatsCard
          title="Network Events"
          value="89.2K"
          icon={Network}
          trend={-5}
          variant="info"
        />
        <StatsCard
          title="System Health"
          value="98.5%"
          icon={Activity}
          trend={2}
          variant="success"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <AlertChart />
        <ProtocolChart />
      </div>

      <TopIPsTable />
    </div>
  );
};

export default Dashboard;
