import { Shield, AlertTriangle, Activity, Network } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { AlertChart } from "@/components/AlertChart";
import { ProtocolChart } from "@/components/ProtocolChart";
import { TopIPsTable } from "@/components/TopIPsTable";
import { ResponsiveGrid, ResponsiveStack, ResponsiveHeader } from "@/components/ResponsiveContainer";

const Dashboard = () => {
  return (
    <ResponsiveStack gap="lg" className="animate-fade-in">
      <ResponsiveHeader
        title="Dashboard Overview"
        subtitle="Real-time network security monitoring"
      />

      <ResponsiveGrid columns={4} gap="md">
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
      </ResponsiveGrid>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
        <AlertChart />
        <ProtocolChart />
      </div>

      <TopIPsTable />
    </ResponsiveStack>
  );
};

export default Dashboard;
