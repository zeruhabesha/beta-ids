import { useState } from "react";
import { Target, ToggleLeft, ToggleRight, Search, Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { StatsCard } from "@/components/StatsCard";

const rulesData = [
  { id: 1, sid: 2100498, name: "ET MALWARE Possible Trojan Download", category: "Malware", enabled: true, triggered: 156 },
  { id: 2, sid: 2100499, name: "ET SCAN Port Scan Detected", category: "Reconnaissance", enabled: true, triggered: 89 },
  { id: 3, sid: 2100500, name: "ET INFO HTTP Request to Suspicious Domain", category: "Policy", enabled: true, triggered: 67 },
  { id: 4, sid: 2100501, name: "ET POLICY DNS Query to Malicious Domain", category: "Policy", enabled: true, triggered: 54 },
  { id: 5, sid: 2100502, name: "ET EXPLOIT Attempted Buffer Overflow", category: "Exploit", enabled: true, triggered: 43 },
  { id: 6, sid: 2100503, name: "ET INFO TLS Certificate Expired", category: "Policy", enabled: false, triggered: 0 },
  { id: 7, sid: 2100504, name: "ET SCAN SSH Brute Force Attempt", category: "Reconnaissance", enabled: true, triggered: 32 },
  { id: 8, sid: 2100505, name: "ET WEB SQL Injection Attempt", category: "Web Attack", enabled: true, triggered: 28 },
  { id: 9, sid: 2100506, name: "ET DOS Potential DDoS Attack", category: "DoS", enabled: true, triggered: 21 },
  { id: 10, sid: 2100507, name: "ET POLICY Cryptocurrency Mining Activity", category: "Policy", enabled: false, triggered: 0 },
];

const Rules = () => {
  const [rules, setRules] = useState(rulesData);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleRule = (id: number) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
    const rule = rules.find(r => r.id === id);
    toast.success(`Rule ${rule?.enabled ? 'disabled' : 'enabled'}`, {
      description: rule?.name,
    });
  };

  const deleteRule = (id: number) => {
    const rule = rules.find(r => r.id === id);
    setRules(rules.filter(r => r.id !== id));
    toast.error("Rule deleted", {
      description: rule?.name,
    });
  };

  const filteredRules = rules.filter(rule =>
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.sid.toString().includes(searchTerm)
  );

  const activeRules = rules.filter(r => r.enabled).length;
  const totalTriggered = rules.reduce((sum, r) => sum + r.triggered, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            Rules Management
          </h1>
          <p className="text-muted-foreground">Configure and manage Suricata detection rules</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Rule
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard
          title="Active Rules"
          value={activeRules}
          icon={ToggleRight}
          variant="success"
        />
        <StatsCard
          title="Total Rules"
          value={rules.length}
          icon={Target}
          variant="info"
        />
        <StatsCard
          title="Total Triggers"
          value={totalTriggered.toLocaleString()}
          icon={Target}
          variant="default"
        />
      </div>

      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Rules
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, category, or SID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Showing {filteredRules.length} of {rules.length} rules
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SID</TableHead>
                <TableHead>Rule Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Triggered</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRules.map((rule) => (
                <TableRow key={rule.id} className="hover:bg-accent/50 transition-colors">
                  <TableCell className="font-mono font-medium">{rule.sid}</TableCell>
                  <TableCell className="max-w-md">{rule.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{rule.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-primary">{rule.triggered}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                      <Badge variant={rule.enabled ? "success" : "secondary"}>
                        {rule.enabled ? "Active" : "Disabled"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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

export default Rules;
