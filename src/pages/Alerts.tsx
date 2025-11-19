import { useState } from "react";
import { AlertTriangle, Download, Filter, Search, X, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

type Alert = {
  id: number;
  timestamp: string;
  signature: string;
  srcIP: string;
  destIP: string;
  severity: string;
  protocol: string;
  action: string;
};

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, timestamp: "2025-11-04 14:23:45", signature: "ET MALWARE Possible Trojan Download", srcIP: "192.168.1.45", destIP: "203.0.113.42", severity: "high", protocol: "TCP", action: "drop" },
    { id: 2, timestamp: "2025-11-04 14:22:18", signature: "ET SCAN Port Scan Detected", srcIP: "10.0.0.23", destIP: "172.16.0.12", severity: "medium", protocol: "TCP", action: "alert" },
    { id: 3, timestamp: "2025-11-04 14:20:03", signature: "ET INFO HTTP Request to Suspicious Domain", srcIP: "192.168.1.67", destIP: "198.51.100.7", severity: "low", protocol: "HTTP", action: "alert" },
    { id: 4, timestamp: "2025-11-04 14:18:56", signature: "ET POLICY DNS Query to Malicious Domain", srcIP: "172.16.0.8", destIP: "8.8.8.8", severity: "high", protocol: "DNS", action: "drop" },
    { id: 5, timestamp: "2025-11-04 14:15:32", signature: "ET EXPLOIT Attempted Buffer Overflow", srcIP: "203.0.113.88", destIP: "192.168.1.10", severity: "high", protocol: "TCP", action: "drop" },
    { id: 6, timestamp: "2025-11-04 14:12:45", signature: "ET INFO TLS Certificate Expired", srcIP: "192.168.1.99", destIP: "1.1.1.1", severity: "low", protocol: "TLS", action: "alert" },
    { id: 7, timestamp: "2025-11-04 14:10:22", signature: "ET SCAN SSH Brute Force Attempt", srcIP: "198.51.100.99", destIP: "192.168.1.5", severity: "medium", protocol: "SSH", action: "drop" },
    { id: 8, timestamp: "2025-11-04 14:08:15", signature: "ET WEB SQL Injection Attempt", srcIP: "203.0.113.15", destIP: "192.168.1.80", severity: "high", protocol: "HTTP", action: "drop" },
    { id: 9, timestamp: "2025-11-04 14:05:33", signature: "ET SCAN Nmap Scripting Engine", srcIP: "198.51.100.45", destIP: "192.168.1.20", severity: "medium", protocol: "TCP", action: "alert" },
    { id: 10, timestamp: "2025-11-04 14:03:12", signature: "ET MALWARE Ransomware Activity", srcIP: "203.0.113.77", destIP: "192.168.1.55", severity: "high", protocol: "TCP", action: "drop" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [protocolFilter, setProtocolFilter] = useState<"all" | "TCP" | "UDP" | "HTTP" | "DNS" | "TLS" | "SSH">("all");
  const [actionFilter, setActionFilter] = useState<"all" | "alert" | "drop">("all");

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  const handleDelete = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast.success("Alert deleted successfully");
  };

  const handleExport = () => {
    toast.success("Alerts exported successfully!", {
      description: `${alerts.length} alerts exported to CSV`,
    });
  };

  const getRowTone = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high':
        return 'border-l-4 border-destructive/50 bg-destructive/5';
      case 'medium':
        return 'border-l-4 border-warning/50 bg-warning/5';
      case 'low':
      default:
        return 'border-l-4 border-muted/40 bg-muted/10';
    }
  };

  const columns: ColumnDef<Alert>[] = [
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.getValue("timestamp")}</span>
      ),
    },
    {
      accessorKey: "signature",
      header: "Signature",
      cell: ({ row }) => (
        <span className="max-w-xs truncate block">{row.getValue("signature")}</span>
      ),
    },
    {
      accessorKey: "srcIP",
      header: "Source IP",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.getValue("srcIP")}</span>
      ),
    },
    {
      accessorKey: "destIP",
      header: "Dest IP",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.getValue("destIP")}</span>
      ),
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => {
        const severity = row.getValue("severity") as string;
        return (
          <Badge variant={getSeverityVariant(severity)} className="capitalize">
            {severity}
          </Badge>
        );
      },
    },
    {
      accessorKey: "protocol",
      header: "Protocol",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("protocol")}</Badge>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const action = row.getValue("action") as string;
        return (
          <Badge variant={action === "drop" ? "destructive" : "secondary"}>
            {action}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const alert = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleClearAlert(alert.id)}
              aria-label="Clear alert"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(alert.id)}
              aria-label="Delete alert"
              className="text-red-500 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const filterOptions = [
    {
      columnId: 'severity',
      title: 'Severity',
      options: [
        { label: 'All', value: 'all' },
        { label: 'High', value: 'high' },
        { label: 'Medium', value: 'medium' },
        { label: 'Low', value: 'low' },
      ],
    },
    {
      columnId: 'protocol',
      title: 'Protocol',
      options: [
        { label: 'All', value: 'all' },
        { label: 'TCP', value: 'TCP' },
        { label: 'HTTP', value: 'HTTP' },
        { label: 'DNS', value: 'DNS' },
        { label: 'SSH', value: 'SSH' },
        { label: 'TLS', value: 'TLS' },
      ],
    },
    {
      columnId: 'action',
      title: 'Action',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Alert', value: 'alert' },
        { label: 'Drop', value: 'drop' },
      ],
    },
  ];

  const handleClearAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast.info("Alert cleared");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSeverityFilter("all");
    setProtocolFilter("all");
    setActionFilter("all");
    toast.info("Filters cleared");
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      !searchTerm ||
      `${alert.signature} ${alert.srcIP} ${alert.destIP} ${alert.timestamp}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesProtocol = protocolFilter === "all" || alert.protocol === protocolFilter;
    const matchesAction = actionFilter === "all" || alert.action === actionFilter;

    return matchesSearch && matchesSeverity && matchesProtocol && matchesAction;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            Security Alerts
          </h1>
          <p className="text-muted-foreground">Real-time security event monitoring</p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={protocolFilter} onValueChange={setProtocolFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Protocol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Protocols</SelectItem>
                <SelectItem value="TCP">TCP</SelectItem>
                <SelectItem value="UDP">UDP</SelectItem>
                <SelectItem value="HTTP">HTTP</SelectItem>
                <SelectItem value="DNS">DNS</SelectItem>
                <SelectItem value="TLS">TLS</SelectItem>
                <SelectItem value="SSH">SSH</SelectItem>
              </SelectContent>
            </Select>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
                <SelectItem value="drop">Drop</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle>Alert Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredAlerts}
            searchKey={["signature", "srcIP", "destIP", "timestamp"]}
            filterOptions={filterOptions}
            searchPlaceholder="Search alerts by signature, IP, or timestamp..."
            pageSizeOptions={[5, 10, 20, 50]}
            rowClassName={(row) =>
              `transition-colors ${getRowTone((row.original as Alert).severity)}`
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Alerts;
