import { useState } from "react";
import {
  Activity,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Server,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type ServiceStatus = 'running' | 'stopped' | 'warning';

type Service = {
  id: string;
  name: string;
  status: ServiceStatus;
  uptime: string;
  cpu: number;
  memory: number;
  description: string;
};

const SystemHealth = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Suricata IDS Engine',
      status: 'running',
      uptime: '15d 7h 23m',
      cpu: 34,
      memory: 2.4,
      description: 'Main intrusion detection engine'
    },
    {
      id: '2',
      name: 'Traffic Analyzer',
      status: 'running',
      uptime: '15d 7h 23m',
      cpu: 18,
      memory: 1.8,
      description: 'Network traffic analysis service'
    },
    {
      id: '3',
      name: 'Alert Manager',
      status: 'running',
      uptime: '15d 7h 23m',
      cpu: 5,
      memory: 0.6,
      description: 'Alert processing and notification'
    },
    {
      id: '4',
      name: 'Database Service',
      status: 'running',
      uptime: '15d 7h 23m',
      cpu: 12,
      memory: 3.2,
      description: 'PostgreSQL database server'
    },
    {
      id: '5',
      name: 'Web Interface',
      status: 'running',
      uptime: '15d 7h 23m',
      cpu: 3,
      memory: 0.4,
      description: 'Frontend web application'
    },
    {
      id: '6',
      name: 'Backup Service',
      status: 'warning',
      uptime: '2h 15m',
      cpu: 8,
      memory: 0.9,
      description: 'Automated backup system'
    },
  ]);

  const systemMetrics = {
    cpu: 28,
    memory: 67,
    disk: 45,
    network: 156, // Mbps
    uptime: '15 days, 7 hours',
    temperature: 52, // Celsius
  };

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'stopped':
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'stopped':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const refreshMetrics = () => {
    setLastUpdate(new Date());
    toast.success('System metrics refreshed');
  };

  const restartService = (serviceId: string) => {
    setServices(prev =>
      prev.map(s =>
        s.id === serviceId ? { ...s, status: 'running' as ServiceStatus, uptime: '0m' } : s
      )
    );
    toast.success('Service restarted successfully');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Activity className="h-3 w-3 sm:h-4 sm:w-4" /> System Monitoring
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">System Health</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Monitor system resources, services, and performance metrics in real-time.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="truncate">Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
          <Button variant="outline" size="sm" onClick={refreshMetrics} className="text-xs sm:text-sm">
            <RefreshCw className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">CPU Usage</p>
              <Cpu className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-3xl font-semibold mb-2">{systemMetrics.cpu}%</p>
            <Progress value={systemMetrics.cpu} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {systemMetrics.cpu < 50 ? 'Normal' : systemMetrics.cpu < 80 ? 'Moderate' : 'High'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Memory Usage</p>
              <MemoryStick className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-3xl font-semibold mb-2">{systemMetrics.memory}%</p>
            <Progress value={systemMetrics.memory} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {systemMetrics.memory < 70 ? 'Normal' : systemMetrics.memory < 85 ? 'Moderate' : 'High'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Disk Usage</p>
              <HardDrive className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-3xl font-semibold mb-2">{systemMetrics.disk}%</p>
            <Progress value={systemMetrics.disk} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {systemMetrics.disk < 60 ? 'Healthy' : systemMetrics.disk < 80 ? 'Moderate' : 'Critical'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Network I/O</p>
              <Network className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-3xl font-semibold mb-2">{systemMetrics.network}</p>
            <p className="text-xs text-muted-foreground">Mbps throughput</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">+12% from avg</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" /> System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">System Uptime</span>
              <span className="font-medium">{systemMetrics.uptime}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">CPU Temperature</span>
              <span className="font-medium">{systemMetrics.temperature}°C</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Active Services</span>
              <span className="font-medium">{services.filter(s => s.status === 'running').length} / {services.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Total Memory</span>
              <span className="font-medium">16 GB</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Total Disk Space</span>
              <span className="font-medium">500 GB SSD</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Operating System</span>
              <span className="font-medium">Ubuntu 22.04 LTS</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" /> Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Packets Processed</span>
                <span className="font-medium">2.4M / hour</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Alerts Generated</span>
                <span className="font-medium">1,247 / day</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rules Active</span>
                <span className="font-medium">8,432 rules</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Database Size</span>
                <span className="font-medium">45 GB / 100 GB</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Log Retention</span>
                <span className="font-medium">30 days</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" /> Service Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {services.map((service) => (
              <Card key={service.id} className="border-l-4 border-l-primary/20">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        {getStatusIcon(service.status)}
                        <h3 className="font-semibold">{service.name}</h3>
                        <Badge className={`capitalize ${getStatusColor(service.status)}`}>
                          {service.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Uptime: {service.uptime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Cpu className="h-3 w-3" />
                          CPU: {service.cpu}%
                        </span>
                        <span className="flex items-center gap-1">
                          <MemoryStick className="h-3 w-3" />
                          Memory: {service.memory} GB
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {service.status === 'warning' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => restartService(service.id)}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" /> Restart
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        View Logs
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealth;
