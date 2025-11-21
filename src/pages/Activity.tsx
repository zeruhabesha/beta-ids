import { Activity as ActivityIcon, Clock, CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatsCard } from "@/components/StatsCard";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

type ActivityLog = {
  id: number;
  timestamp: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  severity: 'high' | 'medium' | 'success' | 'info';
  message: string;
  user: string;
};

type SeverityTone = {
  row: string;
  iconBg: string;
  iconText: string;
};

const activityLogs: ActivityLog[] = [
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

  const severityToneMap: Record<ActivityLog['severity'], SeverityTone> = {
    high: {
      row: "border-l-4 border-destructive/60 bg-destructive/5 hover:bg-destructive/10",
      iconBg: "bg-destructive/10",
      iconText: "text-destructive",
    },
    medium: {
      row: "border-l-4 border-warning/60 bg-warning/5 hover:bg-warning/10",
      iconBg: "bg-warning/10",
      iconText: "text-warning",
    },
    success: {
      row: "border-l-4 border-success/60 bg-success/5 hover:bg-success/10",
      iconBg: "bg-success/10",
      iconText: "text-success",
    },
    info: {
      row: "border-l-4 border-info/60 bg-info/5 hover:bg-info/10",
      iconBg: "bg-info/10",
      iconText: "text-info",
    },
  };

  const getSeverityTone = (severity: ActivityLog['severity']): SeverityTone => {
    return severityToneMap[severity] ?? severityToneMap.info;
  };

  const alertCount = activityLogs.filter(log => log.type === "alert").length;
  const successCount = activityLogs.filter(log => log.type === "success").length;
  const warningCount = activityLogs.filter(log => log.type === "warning").length;

  const activityColumns: ColumnDef<ActivityLog>[] = [
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.timestamp}</span>,
    },
    {
      accessorKey: 'type',
      header: 'Event',
      cell: ({ row }) => {
        const Icon = getIcon(row.original.type);
        const tone = getSeverityTone(row.original.severity);
        return (
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${tone.iconBg}`}>
              <Icon className={`h-4 w-4 ${tone.iconText}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold capitalize">{row.original.type}</span>
              <span className="text-xs text-muted-foreground">{row.original.severity} event</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'message',
      header: 'Message',
      cell: ({ row }) => <span className="text-sm">{row.original.message}</span>,
    },
    {
      accessorKey: 'severity',
      header: 'Severity',
      cell: ({ row }) => (
        <Badge variant={getVariant(row.original.severity)} className="capitalize">
          {row.original.severity}
        </Badge>
      ),
    },
    {
      accessorKey: 'user',
      header: 'User',
      cell: ({ row }) => <span className="font-mono">@{row.original.user}</span>,
    },
  ];

  const activityFilterOptions = [
    {
      columnId: 'type',
      title: 'Type',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Alert', value: 'alert' },
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
      ],
    },
    {
      columnId: 'severity',
      title: 'Severity',
      options: [
        { label: 'All', value: 'all' },
        { label: 'High', value: 'high' },
        { label: 'Medium', value: 'medium' },
        { label: 'Success', value: 'success' },
        { label: 'Info', value: 'info' },
      ],
    },
  ];

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

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={activityColumns}
            data={activityLogs}
            searchKey={["message", "user", "timestamp"]}
            filterOptions={activityFilterOptions}
            searchPlaceholder="Search events by message, user, or timestamp..."
            pageSizeOptions={[5, 10, 20]}
            rowClassName={(row) => {
              const tone = getSeverityTone((row.original as ActivityLog).severity);
              return `bg-card/40 transition-colors ${tone.row}`;
            }}
          />
        </CardContent>
      </Card>

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
