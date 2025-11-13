import { Activity as ActivityIcon, Clock, CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatsCard } from "@/components/StatsCard";

const activityLogs = [
  { id: 1, timestamp: "2025-11-04 14:23:45", type: "alert", severity: "high", message: "Malware detected and blocked from 192.168.1.45", user: "system" },
  { id: 2, timestamp: "2025-11-04 14:22:18", type: "info", severity: "info", message: "Rule 2100499 triggered for port scan detection", user: "system" },
  { id: 3, timestamp: "2025-11-04 14:20:03", type: "success", severity: "success", message: "System health check completed successfully", user: "admin" },
  { id: 4, timestamp: "2025-11-04 14:18:56", type: "alert", severity: "high", message: "DNS query to malicious domain blocked", user: "system" },
  { id: 5, timestamp: "2025-11-04 14:15:32", type: "warning", severity: "medium", message: "High CPU usage detected (87%)", user: "system" },
  { id: 6, timestamp: "2025-11-04 14:12:45", type: "info", severity: "info", message: "Configuration backup completed", user: "admin" },
  { id: 7, timestamp: "2025-11-04 14:10:22", type: "alert", severity: "high", message: "SSH brute force attempt blocked", user: "system" },
  { id: 8, timestamp: "2025-11-04 14:08:15", type: "success", severity: "success", message: "Rule database updated successfully", user: "system" },
  { id: 9, timestamp: "2025-11-04 14:05:33", type: "warning", severity: "medium", message: "Network interface eth0 packet loss detected (2.3%)", user: "system" },
  { id: 10, timestamp: "2025-11-04 14:02:11", type: "info", severity: "info", message: "New rule signature loaded (SID: 2100508)", user: "admin" },
  { id: 11, timestamp: "2025-11-04 14:00:00", type: "success", severity: "success", message: "Hourly statistics report generated", user: "system" },
  { id: 12, timestamp: "2025-11-04 13:58:45", type: "alert", severity: "medium", message: "Suspicious outbound connection detected", user: "system" },
  { id: 13, timestamp: "2025-11-04 13:55:22", type: "info", severity: "info", message: "Log rotation completed successfully", user: "system" },
  { id: 14, timestamp: "2025-11-04 13:52:10", type: "warning", severity: "medium", message: "Disk usage exceeded 70% threshold", user: "system" },
  { id: 15, timestamp: "2025-11-04 13:50:03", type: "success", severity: "success", message: "All network interfaces operational", user: "system" },
];

const Activity = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case "success": return CheckCircle;
      case "alert": return AlertCircle;
      case "warning": return AlertCircle;
      case "info": return Info;
      default: return XCircle;
    }
  };

  const getVariant = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "default";
      case "success": return "success";
      case "info": return "secondary";
      default: return "outline";
    }
  };

  const alertCount = activityLogs.filter(log => log.type === "alert").length;
  const successCount = activityLogs.filter(log => log.type === "success").length;
  const warningCount = activityLogs.filter(log => log.type === "warning").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ActivityIcon className="h-8 w-8 text-accent" />
          System Activity
        </h1>
        <p className="text-muted-foreground">Real-time system events and activity logs</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <StatsCard
          title="Total Events"
          value={activityLogs.length}
          icon={ActivityIcon}
          variant="info"
        />
        <StatsCard
          title="Alerts"
          value={alertCount}
          icon={AlertCircle}
          variant="destructive"
        />
        <StatsCard
          title="Warnings"
          value={warningCount}
          icon={AlertCircle}
          variant="warning"
        />
        <StatsCard
          title="Success"
          value={successCount}
          icon={CheckCircle}
          variant="success"
        />
      </div>

      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {activityLogs.map((log, index) => {
                const Icon = getIcon(log.type);
                return (
                  <div 
                    key={log.id}
                    className="flex gap-4 p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-shrink-0">
                      <div className={`rounded-full p-2 ${
                        log.severity === 'high' ? 'bg-destructive/10' :
                        log.severity === 'medium' ? 'bg-warning/10' :
                        log.severity === 'success' ? 'bg-success/10' :
                        'bg-info/10'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          log.severity === 'high' ? 'text-destructive' :
                          log.severity === 'medium' ? 'text-warning' :
                          log.severity === 'success' ? 'text-success' :
                          'text-info'
                        }`} />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-relaxed">{log.message}</p>
                        <Badge variant={getVariant(log.severity)} className="capitalize flex-shrink-0">
                          {log.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {log.timestamp}
                        </span>
                        <span className="font-mono">@{log.user}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Activity;
