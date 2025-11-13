import { Settings as SettingsIcon, Save, RotateCcw, Bell, Shield, Network, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Settings = () => {
  const handleSave = () => {
    toast.success("Settings saved successfully!", {
      description: "All configuration changes have been applied",
    });
  };

  const handleReset = () => {
    toast.info("Settings reset to defaults", {
      description: "All configuration has been restored to default values",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <SettingsIcon className="h-8 w-8 text-primary" />
            System Settings
          </h1>
          <p className="text-muted-foreground">Configure system parameters and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Detection Settings
          </CardTitle>
          <CardDescription>Configure IDS/IPS detection parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="detection-mode">Detection Mode</Label>
              <Select defaultValue="ips">
                <SelectTrigger id="detection-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ids">IDS Only (Passive)</SelectItem>
                  <SelectItem value="ips">IPS Active (Block)</SelectItem>
                  <SelectItem value="monitor">Monitor Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alert-threshold">Alert Threshold</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="alert-threshold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Sensitivity</SelectItem>
                  <SelectItem value="medium">Medium Sensitivity</SelectItem>
                  <SelectItem value="high">High Sensitivity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Block Threats</Label>
              <p className="text-sm text-muted-foreground">Automatically block detected threats</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Protocol Analysis</Label>
              <p className="text-sm text-muted-foreground">Enable deep packet inspection</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Network Configuration
          </CardTitle>
          <CardDescription>Configure network interfaces and monitoring</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="interface">Monitor Interface</Label>
              <Select defaultValue="eth0">
                <SelectTrigger id="interface">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eth0">eth0 (Primary)</SelectItem>
                  <SelectItem value="eth1">eth1 (Secondary)</SelectItem>
                  <SelectItem value="all">All Interfaces</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capture-buffer">Capture Buffer Size</Label>
              <Input id="capture-buffer" type="text" defaultValue="128 MB" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="home-network">Home Network CIDR</Label>
            <Input id="home-network" type="text" defaultValue="192.168.0.0/16" placeholder="e.g., 10.0.0.0/8" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure alert notifications and reporting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Send alerts via email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Notification Email</Label>
            <Input id="email" type="email" defaultValue="admin@example.com" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Slack Integration</Label>
              <p className="text-sm text-muted-foreground">Send alerts to Slack channel</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Daily Reports</Label>
              <p className="text-sm text-muted-foreground">Generate daily summary reports</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Retention
          </CardTitle>
          <CardDescription>Configure log storage and retention policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="log-retention">Log Retention Period</Label>
              <Select defaultValue="30">
                <SelectTrigger id="log-retention">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="compression">Log Compression</Label>
              <Select defaultValue="gzip">
                <SelectTrigger id="compression">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="gzip">GZIP</SelectItem>
                  <SelectItem value="zstd">ZSTD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Archive</Label>
              <p className="text-sm text-muted-foreground">Automatically archive old logs</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
