import { useState } from "react";
import { AlertTriangle, Download, Filter, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const alertsData = [
  { id: 1, timestamp: "2025-11-04 14:23:45", signature: "ET MALWARE Possible Trojan Download", srcIP: "192.168.1.45", destIP: "203.0.113.42", severity: "high", protocol: "TCP", action: "drop" },
  { id: 2, timestamp: "2025-11-04 14:22:18", signature: "ET SCAN Port Scan Detected", srcIP: "10.0.0.23", destIP: "172.16.0.12", severity: "medium", protocol: "TCP", action: "alert" },
  { id: 3, timestamp: "2025-11-04 14:20:03", signature: "ET INFO HTTP Request to Suspicious Domain", srcIP: "192.168.1.67", destIP: "198.51.100.7", severity: "low", protocol: "HTTP", action: "alert" },
  { id: 4, timestamp: "2025-11-04 14:18:56", signature: "ET POLICY DNS Query to Malicious Domain", srcIP: "172.16.0.8", destIP: "8.8.8.8", severity: "high", protocol: "DNS", action: "drop" },
  { id: 5, timestamp: "2025-11-04 14:15:32", signature: "ET EXPLOIT Attempted Buffer Overflow", srcIP: "203.0.113.88", destIP: "192.168.1.10", severity: "high", protocol: "TCP", action: "drop" },
  { id: 6, timestamp: "2025-11-04 14:12:45", signature: "ET INFO TLS Certificate Expired", srcIP: "192.168.1.99", destIP: "1.1.1.1", severity: "low", protocol: "TLS", action: "alert" },
  { id: 7, timestamp: "2025-11-04 14:10:22", signature: "ET SCAN SSH Brute Force Attempt", srcIP: "198.51.100.99", destIP: "192.168.1.5", severity: "medium", protocol: "SSH", action: "drop" },
  { id: 8, timestamp: "2025-11-04 14:08:15", signature: "ET WEB SQL Injection Attempt", srcIP: "203.0.113.15", destIP: "192.168.1.80", severity: "high", protocol: "HTTP", action: "drop" },
];

const Alerts = () => {
  const [alerts, setAlerts] = useState(alertsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [protocolFilter, setProtocolFilter] = useState("all");

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.signature.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.srcIP.includes(searchTerm) ||
                         alert.destIP.includes(searchTerm);
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesProtocol = protocolFilter === "all" || alert.protocol === protocolFilter;
    return matchesSearch && matchesSeverity && matchesProtocol;
  });

  const handleExport = () => {
    toast.success("Alerts exported successfully!", {
      description: `${filteredAlerts.length} alerts exported to CSV`,
    });
  };

  const handleClearAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast.info("Alert cleared");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSeverityFilter("all");
    setProtocolFilter("all");
    toast.info("Filters cleared");
  };

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
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Signature</TableHead>
                <TableHead>Source IP</TableHead>
                <TableHead>Dest IP</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Protocol</TableHead>
                <TableHead>Action</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id} className="hover:bg-accent/50 transition-colors">
                  <TableCell className="font-mono text-xs">{alert.timestamp}</TableCell>
                  <TableCell className="max-w-xs truncate">{alert.signature}</TableCell>
                  <TableCell className="font-mono text-sm">{alert.srcIP}</TableCell>
                  <TableCell className="font-mono text-sm">{alert.destIP}</TableCell>
                  <TableCell>
                    <Badge variant={getSeverityVariant(alert.severity)} className="capitalize">
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{alert.protocol}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={alert.action === "drop" ? "destructive" : "secondary"}>
                      {alert.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleClearAlert(alert.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Alerts;
