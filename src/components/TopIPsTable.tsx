import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
const topIPs = [
  { ip: "192.168.1.45", alerts: 156, severity: "high", location: "Internal" },
  { ip: "10.0.0.23", alerts: 89, severity: "medium", location: "DMZ" },
  { ip: "172.16.0.12", alerts: 67, severity: "medium", location: "Internal" },
  { ip: "203.0.113.42", alerts: 54, severity: "high", location: "External" },
  { ip: "198.51.100.7", alerts: 43, severity: "low", location: "External" },
];

export const TopIPsTable = () => {
  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="col-span-2 bg-gradient-card border-border">
      <CardHeader>
        <CardTitle>Top Source IPs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IP Address</TableHead>
              <TableHead>Alerts</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topIPs.map((item) => (
              <TableRow key={item.ip} className="hover:bg-accent/50 transition-colors">
                <TableCell className="font-mono font-medium">{item.ip}</TableCell>
                <TableCell>
                  <span className="text-primary font-semibold">{item.alerts}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={getSeverityVariant(item.severity)} className="capitalize">
                    {item.severity}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
