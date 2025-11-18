import { useState } from "react";
import {
  Target,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertCircle,
  AlertTriangle,
  Bell,
  Check,
  Filter,
  Shield,
  Layers,
  BarChart3,
  Clock,
  FileSpreadsheet,
  UploadCloud,
  Server,
  Radar,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
type Rule = {
  id: string;
  sid: string;
  name: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: 'alert' | 'drop' | 'pass';
  status: 'enabled' | 'disabled';
  triggeredCount: number;
  lastTriggered: string;
  description: string;
};

type Cluster = {
  id: string;
  name: string;
  nodes: number;
  coverage: number;
  status: 'healthy' | 'maintenance' | 'degraded';
  leadIndicator: string;
  lastSynced: string;
};

type Indicator = {
  id: string;
  indicator: string;
  type: 'ip' | 'domain' | 'hash';
  severity: Rule['severity'];
  confidence: number;
  status: 'active' | 'retired' | 'under-review';
  cluster: string;
  lastSeen: string;
};

type ImportContext = 'rules' | 'clusters' | 'indicators';

const actions = [
  { value: 'alert', label: 'Alert' },
  { value: 'drop', label: 'Drop' },
  { value: 'pass', label: 'Pass' }
];

const severities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
] as const;

const Rules = () => {
  const defaultRuleForm: Partial<Rule> = {
    sid: '',
    name: '',
    category: '',
    severity: 'medium',
    action: 'alert',
    status: 'enabled',
    description: ''
  };

  const importCopy: Record<ImportContext, { title: string; helper: string }> = {
    rules: {
      title: 'rule pack',
      helper: 'Ensure SID, severity, category, and action columns exist in the spreadsheet.'
    },
    clusters: {
      title: 'cluster inventory',
      helper: 'Include cluster name, sensor count, coverage percentage, and health status.'
    },
    indicators: {
      title: 'indicator feed',
      helper: 'Indicator, type, severity, and confidence columns are required for ingestion.'
    }
  };

  // Mock data for rules
  const [rules, setRules] = useState<Rule[]>([
    {
      id: '1',
      sid: '2000001',
      name: 'ET EXPLOIT SSH Weak Encryption Algorithms',
      category: 'exploit',
      severity: 'high',
      action: 'alert',
      status: 'enabled',
      triggeredCount: 42,
      lastTriggered: '2025-02-15T14:30:00Z',
      description: 'Detects SSH connections using deprecated or weak encryption algorithms.'
    },
    {
      id: '2',
      sid: '2000002',
      name: 'ET SCAN Nmap Scripting Engine',
      category: 'network-scan',
      severity: 'medium',
      action: 'alert',
      status: 'enabled',
      triggeredCount: 18,
      lastTriggered: '2025-02-14T09:15:00Z',
      description: 'Detects Nmap Scripting Engine activity on sensitive segments.'
    },
    {
      id: '3',
      sid: '2000003',
      name: 'ET MALWARE Suspicious Executable Download',
      category: 'malware',
      severity: 'critical',
      action: 'drop',
      status: 'enabled',
      triggeredCount: 65,
      lastTriggered: '2025-02-16T16:45:00Z',
      description: 'Detects suspicious executable downloads from untrusted hosts.'
    },
    {
      id: '4',
      sid: '2000004',
      name: 'ET POLICY Outbound TLS Without SNI',
      category: 'policy-violation',
      severity: 'medium',
      action: 'alert',
      status: 'enabled',
      triggeredCount: 12,
      lastTriggered: '2025-02-16T11:05:00Z',
      description: 'Monitors TLS sessions that omit SNI, a common evasion tactic.'
    },
    {
      id: '5',
      sid: '2000005',
      name: 'ET WEB SQL Injection Attempt',
      category: 'web-application-attack',
      severity: 'high',
      action: 'drop',
      status: 'enabled',
      triggeredCount: 33,
      lastTriggered: '2025-02-13T18:15:00Z',
      description: 'Blocks common SQL injection payloads targeting customer portals.'
    },
    {
      id: '6',
      sid: '2000006',
      name: 'ET DOS Slowloris Keep-Alive Flood',
      category: 'denial-of-service',
      severity: 'critical',
      action: 'drop',
      status: 'enabled',
      triggeredCount: 4,
      lastTriggered: '2025-02-16T05:30:00Z',
      description: 'Drops Slowloris-style keep-alive floods before saturation.'
    },
    {
      id: '7',
      sid: '2000007',
      name: 'ET POLICY P2P Bittorrent Activity',
      category: 'policy-violation',
      severity: 'low',
      action: 'alert',
      status: 'disabled',
      triggeredCount: 0,
      lastTriggered: '2025-01-25T08:45:00Z',
      description: 'Alert only rule for unauthorized P2P activity.'
    },
    {
      id: '8',
      sid: '2000008',
      name: 'ET TROJAN Possible Emotet Callback',
      category: 'trojan-activity',
      severity: 'critical',
      action: 'drop',
      status: 'enabled',
      triggeredCount: 25,
      lastTriggered: '2025-02-12T22:00:00Z',
      description: 'Signature looking for known Emotet C2 infrastructure.'
    },
    {
      id: '9',
      sid: '2000009',
      name: 'ET ATTACKKIT Metasploit Meterpreter Stage',
      category: 'attempted-admin',
      severity: 'high',
      action: 'drop',
      status: 'enabled',
      triggeredCount: 17,
      lastTriggered: '2025-02-11T03:10:00Z',
      description: 'Detects meterpreter staging traffic.'
    },
    {
      id: '10',
      sid: '2000010',
      name: 'ET CNC ShadowPad Beacon',
      category: 'trojan-activity',
      severity: 'critical',
      action: 'drop',
      status: 'enabled',
      triggeredCount: 7,
      lastTriggered: '2025-02-10T10:00:00Z',
      description: 'Looks for ShadowPad C2 beacons leveraging TLS JA3 fingerprints.'
    },
    {
      id: '11',
      sid: '2000011',
      name: 'ET INFO TLS Certificate Expired',
      category: 'policy-violation',
      severity: 'low',
      action: 'alert',
      status: 'enabled',
      triggeredCount: 53,
      lastTriggered: '2025-02-16T07:42:00Z',
      description: 'Alerts on expired certificates observed on outbound TLS.'
    },
    {
      id: '12',
      sid: '2000012',
      name: 'ET SCAN Masscan Detected',
      category: 'network-scan',
      severity: 'medium',
      action: 'alert',
      status: 'enabled',
      triggeredCount: 88,
      lastTriggered: '2025-02-16T15:20:00Z',
      description: 'Detects the very fast masscan scanner hitting perimeter services.'
    }
  ]);

  const [clusters, setClusters] = useState<Cluster[]>([
    {
      id: 'cluster-1',
      name: 'Edge perimeter cluster',
      nodes: 6,
      coverage: 92,
      status: 'healthy',
      leadIndicator: 'TLS JA3 pack',
      lastSynced: '5m ago'
    },
    {
      id: 'cluster-2',
      name: 'Cloud workload cluster',
      nodes: 4,
      coverage: 81,
      status: 'degraded',
      leadIndicator: 'Emotet callbacks',
      lastSynced: '28m ago'
    },
    {
      id: 'cluster-3',
      name: 'OT / plant sensors',
      nodes: 3,
      coverage: 68,
      status: 'maintenance',
      leadIndicator: 'Modbus anomaly set',
      lastSynced: '1h ago'
    }
  ]);

  const [indicators, setIndicators] = useState<Indicator[]>([
    {
      id: 'indicator-1',
      indicator: '45.77.23.11',
      type: 'ip',
      severity: 'critical',
      confidence: 96,
      status: 'active',
      cluster: 'Edge perimeter cluster',
      lastSeen: '2 hours ago'
    },
    {
      id: 'indicator-2',
      indicator: 'suspicious-updates.net',
      type: 'domain',
      severity: 'high',
      confidence: 82,
      status: 'under-review',
      cluster: 'Cloud workload cluster',
      lastSeen: '45 minutes ago'
    },
    {
      id: 'indicator-3',
      indicator: 'd41d8cd98f00b204e9800998ecf8427e',
      type: 'hash',
      severity: 'medium',
      confidence: 60,
      status: 'retired',
      cluster: 'OT / plant sensors',
      lastSeen: 'Yesterday'
    }
  ]);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<Rule | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importContext, setImportContext] = useState<ImportContext | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importNotes, setImportNotes] = useState('');
  const [importDryRun, setImportDryRun] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | Rule['severity']>('all');
  const [actionFilter, setActionFilter] = useState<'all' | Rule['action']>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | string>('all');
  const [recentOnly, setRecentOnly] = useState(false);

  // Form state
  const categories = [
    'exploit',
    'malware',
    'web-application-attack',
    'network-scan',
    'denial-of-service',
    'policy-violation',
    'protocol-command-decode',
    'attempted-user',
    'attempted-admin',
    'not-suspicious',
    'suspicious-filename-detect',
    'suspicious-login',
    'system-call-detect',
    'tcp-connection',
    'trojan-activity',
    'unusual-client-port-connection',
    'web-application-activity'
  ];

  const activeRules = rules.filter(rule => rule.status === 'enabled').length;
  const disabledRules = rules.filter(rule => rule.status === 'disabled').length;
  const criticalRules = rules.filter(rule => rule.severity === 'critical').length;
  const recentlyTriggered = rules.filter(rule => {
    const lastSeen = new Date(rule.lastTriggered).getTime();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return lastSeen >= sevenDaysAgo;
  }).length;
  const severityBreakdown = severities.map(({ value }) => ({
    value,
    count: rules.filter(rule => rule.severity === value).length
  }));
  const mostTriggeredRules = [...rules]
    .sort((a, b) => b.triggeredCount - a.triggeredCount)
    .slice(0, 4);
  const recentActivity = [
    {
      id: 'activity-1',
      title: 'Critical malware rule tuned',
      description: 'ShadowPad beacon rule updated with new JA3 fingerprints.',
      timestamp: '2 hours ago'
    },
    {
      id: 'activity-2',
      title: 'Policy exemptions synced',
      description: 'TLS SNI exemption list refreshed from compliance feed.',
      timestamp: '5 hours ago'
    },
    {
      id: 'activity-3',
      title: 'New exploit signatures',
      description: 'Four exploit kit signatures imported from upstream feed.',
      timestamp: 'Yesterday'
    }
  ];

  const filteredRules = rules.filter(rule => {
    if (statusFilter !== 'all' && rule.status !== statusFilter) return false;
    if (severityFilter !== 'all' && rule.severity !== severityFilter) return false;
    if (actionFilter !== 'all' && rule.action !== actionFilter) return false;
    if (categoryFilter !== 'all' && rule.category !== categoryFilter) return false;
    if (recentOnly) {
      const lastSeen = new Date(rule.lastTriggered).getTime();
      if (Date.now() - lastSeen > 72 * 60 * 60 * 1000) return false;
    }
    return true;
  });

  const [formData, setFormData] = useState<Partial<Rule>>(defaultRuleForm);

  const severityColorMap: Record<Rule['severity'], string> = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  const clusterStatusColorMap: Record<Cluster['status'], string> = {
    healthy: 'bg-emerald-100 text-emerald-700',
    degraded: 'bg-amber-100 text-amber-700',
    maintenance: 'bg-slate-200 text-slate-700'
  };

  const indicatorStatusColorMap: Record<Indicator['status'], string> = {
    active: 'bg-emerald-100 text-emerald-700',
    'under-review': 'bg-blue-100 text-blue-800',
    retired: 'bg-slate-200 text-slate-700'
  };

  const openImportModal = (context: ImportContext) => {
    setImportContext(context);
    setIsImportModalOpen(true);
  };

  const closeImportModal = () => {
    setIsImportModalOpen(false);
    setImportContext(null);
    setImportFile(null);
    setImportNotes('');
    setImportDryRun(true);
  };

  type CreateMenuButtonProps = {
    label: string;
    onCreate: () => void;
    context: ImportContext;
    size?: 'default' | 'sm';
  };

  const CreateMenuButton = ({ label, onCreate, context, size = 'default' }: CreateMenuButtonProps) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={size} className="inline-flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={(event) => {
            event.preventDefault();
            onCreate();
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Create manually
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(event) => {
            event.preventDefault();
            openImportModal(context);
          }}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" /> Import from Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const handleOpenRuleModal = () => {
    setEditingRule(null);
    setFormData(defaultRuleForm);
    setIsModalOpen(true);
  };

  const closeRuleModal = () => {
    setIsModalOpen(false);
    setEditingRule(null);
    setFormData(defaultRuleForm);
  };

  const handleImportFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImportFile(file);
  };

  const handleImportSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!importFile || !importContext) {
      toast.error('Please choose a spreadsheet to import.');
      return;
    }

    if (importContext === 'rules') {
      const importedRule: Rule = {
        id: Date.now().toString(),
        sid: `${Math.floor(100000 + Math.random() * 900000)}`,
        name: `Imported rule ${rules.length + 1}`,
        category: 'exploit',
        severity: 'medium',
        action: 'alert',
        status: 'enabled',
        triggeredCount: 0,
        lastTriggered: new Date().toISOString(),
        description: importNotes || 'Imported from spreadsheet.'
      };
      setRules(prev => [...prev, importedRule]);
    }

    if (importContext === 'clusters') {
      const importedCluster: Cluster = {
        id: `cluster-${Date.now()}`,
        name: `Imported cluster (${importFile.name})`,
        nodes: 5,
        coverage: 75,
        status: 'healthy',
        leadIndicator: 'Spreadsheet ingest',
        lastSynced: 'Just now'
      };
      setClusters(prev => [importedCluster, ...prev]);
    }

    if (importContext === 'indicators') {
      const importedIndicator: Indicator = {
        id: `indicator-${Date.now()}`,
        indicator: `ioc-${Date.now()}.imported`,
        type: 'domain',
        severity: 'high',
        confidence: 78,
        status: 'under-review',
        cluster: clusters[0]?.name || 'Edge perimeter cluster',
        lastSeen: 'Just now'
      };
      setIndicators(prev => [importedIndicator, ...prev]);
    }

    toast.success(`${importFile.name} queued for the ${importCopy[importContext].title} workflow${
      importDryRun ? ' (validation only).' : '.'
    }`);

    closeImportModal();
  };

  const handleCreateCluster = () => {
    const newCluster: Cluster = {
      id: `cluster-${Date.now()}`,
      name: `Ad-hoc cluster ${clusters.length + 1}`,
      nodes: 2,
      coverage: Math.min(100, 55 + Math.round(Math.random() * 30)),
      status: 'maintenance',
      leadIndicator: 'Custom tuning',
      lastSynced: 'Just now'
    };
    setClusters(prev => [newCluster, ...prev]);
    toast.success('Draft cluster created for manual tuning.');
  };

  const handleClusterSync = (clusterId: string) => {
    setClusters(prev =>
      prev.map(cluster =>
        cluster.id === clusterId ? { ...cluster, lastSynced: 'Just now' } : cluster
      )
    );
    toast.success('Cluster sync scheduled.');
  };

  const handleCreateIndicator = () => {
    const newIndicator: Indicator = {
      id: `indicator-${Date.now()}`,
      indicator: `ioc-${Date.now()}.example`,
      type: 'domain',
      severity: 'medium',
      confidence: 55 + Math.round(Math.random() * 30),
      status: 'under-review',
      cluster: clusters[1]?.name || clusters[0]?.name || 'Edge perimeter cluster',
      lastSeen: 'Just now'
    };
    setIndicators(prev => [newIndicator, ...prev]);
    toast.info('New indicator staged for review.');
  };

  const acknowledgeIndicator = (indicatorId: string) => {
    setIndicators(prev =>
      prev.map(indicator =>
        indicator.id === indicatorId ? { ...indicator, status: 'retired' } : indicator
      )
    );
    toast.success('Indicator acknowledged and retired.');
  };

  const escalateIndicator = (indicatorId: string) => {
    setIndicators(prev =>
      prev.map(indicator =>
        indicator.id === indicatorId
          ? { ...indicator, severity: 'critical', status: 'active' }
          : indicator
      )
    );
    toast.warning('Indicator escalated to critical coverage.');
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      status: checked ? 'enabled' : 'disabled'
    }));
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sid || !formData.name || !formData.category || !formData.description) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const normalizedRule: Rule = {
      id: editingRule?.id || Date.now().toString(),
      sid: formData.sid,
      name: formData.name,
      category: formData.category,
      severity: (formData.severity ?? 'medium') as Rule['severity'],
      action: (formData.action ?? 'alert') as Rule['action'],
      status: (formData.status ?? 'enabled') as Rule['status'],
      triggeredCount: editingRule?.triggeredCount ?? 0,
      lastTriggered: editingRule?.lastTriggered ?? new Date().toISOString(),
      description: formData.description
    };

    if (editingRule) {
      setRules(prev => prev.map(rule => (rule.id === editingRule.id ? normalizedRule : rule)));
      toast.success('Rule updated successfully');
    } else {
      setRules(prev => [...prev, normalizedRule]);
      toast.success('Rule added successfully');
    }

    closeRuleModal();
  };

  // Handle edit button click
  const handleEdit = (rule: Rule) => {
    setEditingRule(rule);
    setFormData({
      sid: rule.sid,
      name: rule.name,
      category: rule.category,
      severity: rule.severity,
      action: rule.action,
      status: rule.status,
      description: rule.description
    });
    setIsModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (rule: Rule) => {
    setRuleToDelete(rule);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (ruleToDelete) {
      setRules(rules.filter(rule => rule.id !== ruleToDelete.id));
      toast.success('Rule deleted successfully');
      setIsDeleteModalOpen(false);
      setRuleToDelete(null);
    }
  };

  // Columns definition for the data table
  const columns: ColumnDef<Rule>[] = [
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as 'enabled' | 'disabled';
        return (
          <div className="flex items-center">
            <div 
              className={`h-2.5 w-2.5 rounded-full mr-2 ${
                status === 'enabled' ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
            <span className="capitalize">{status}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'sid',
      header: 'SID',
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize">
          {row.getValue('category')}
        </Badge>
      ),
    },
    {
      accessorKey: 'severity',
      header: 'Severity',
      cell: ({ row }) => {
        const severity = row.getValue('severity') as 'low' | 'medium' | 'high' | 'critical';
        return (
          <Badge className={`capitalize ${severityColorMap[severity]}`}>
            {severity}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue('action')}
        </Badge>
      ),
    },
    {
      accessorKey: 'triggeredCount',
      header: 'Triggered',
    },
    {
      accessorKey: 'lastTriggered',
      header: 'Last Triggered',
      cell: ({ row }) => {
        const date = new Date(row.getValue('lastTriggered'));
        return date.toLocaleString();
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const rule = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(rule)}
              aria-label="Edit rule"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteClick(rule)}
              aria-label="Delete rule"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Filter options for the data table
  const filterOptions = [
    {
      columnId: 'severity',
      title: 'Severity',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Critical', value: 'critical' },
        { label: 'High', value: 'high' },
        { label: 'Medium', value: 'medium' },
        { label: 'Low', value: 'low' },
      ],
    },
    {
      columnId: 'status',
      title: 'Status',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Enabled', value: 'enabled' },
        { label: 'Disabled', value: 'disabled' },
      ],
    },
    {
      columnId: 'action',
      title: 'Action',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Alert', value: 'alert' },
        { label: 'Drop', value: 'drop' },
        { label: 'Pass', value: 'pass' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Target className="h-4 w-4" /> Adaptive rule engine
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">Rules management</h2>
          <p className="text-sm text-muted-foreground">
            Fine tune Suricata/Snort signatures sourced from IDS Tower feeds.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast.info('Baseline check scheduled')}>
            <Bell className="mr-2 h-4 w-4" /> Notify changes
          </Button>
          <CreateMenuButton label="New rule" onCreate={handleOpenRuleModal} context="rules" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Active rules</p>
              <p className="text-3xl font-semibold">{activeRules}</p>
            </div>
            <Shield className="h-10 w-10 text-emerald-500" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Disabled / staged</p>
              <p className="text-3xl font-semibold">{disabledRules}</p>
            </div>
            <Layers className="h-10 w-10 text-amber-500" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Critical coverage</p>
              <p className="text-3xl font-semibold">{criticalRules}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Triggered (72h)</p>
              <p className="text-3xl font-semibold">{recentlyTriggered}</p>
            </div>
            <Clock className="h-10 w-10 text-sky-500" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" /> Intelligent filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex flex-wrap gap-2">
                {['all', 'enabled', 'disabled'].map(option => (
                  <Button
                    key={option}
                    variant={statusFilter === option ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(option as 'all' | 'enabled' | 'disabled')}
                  >
                    <span className="capitalize">{option}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Severity</Label>
              <div className="flex flex-wrap gap-2">
                {['all', ...severities.map(severity => severity.value)].map(option => (
                  <Button
                    key={option}
                    variant={severityFilter === option ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSeverityFilter(option as typeof severityFilter)}
                  >
                    <span className="capitalize">{option}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Action</Label>
              <div className="flex flex-wrap gap-2">
                {['all', ...actions.map(action => action.value)].map(option => (
                  <Button
                    key={option}
                    variant={actionFilter === option ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActionFilter(option as typeof actionFilter)}
                  >
                    <span className="capitalize">{option}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as typeof categoryFilter)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-semibold">{filteredRules.length}</span> of{' '}
              <span className="font-semibold">{rules.length}</span> rules after contextual filters.
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="recent-only" checked={recentOnly} onCheckedChange={setRecentOnly} />
              <Label htmlFor="recent-only">Only show rules triggered in the last 72h</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredRules}
            searchKey={['name', 'sid', 'category']}
            filterOptions={filterOptions}
            onAdd={handleOpenRuleModal}
            onImport={() => openImportModal('rules')}
            addButtonLabel="Create rule"
            importButtonLabel="Import Excel"
            searchPlaceholder="Search rules by name, SID, or category..."
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" /> Severity distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {severityBreakdown.map(({ value, count }) => {
              const percentage = rules.length ? Math.round((count / rules.length) * 100) : 0;
              return (
                <div key={value}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize">{value}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full ${
                        value === 'critical'
                          ? 'bg-red-500'
                          : value === 'high'
                          ? 'bg-orange-400'
                          : value === 'medium'
                          ? 'bg-yellow-400'
                          : 'bg-blue-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top triggered rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mostTriggeredRules.map(rule => (
              <div key={rule.id} className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{rule.name}</p>
                  <p className="text-xs text-muted-foreground uppercase">SID {rule.sid}</p>
                </div>
                <Badge variant="outline">{rule.triggeredCount} hits</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Server className="h-4 w-4" /> Sensor clusters
            </CardTitle>
            <CreateMenuButton label="Cluster" onCreate={handleCreateCluster} context="clusters" size="sm" />
          </CardHeader>
          <CardContent className="space-y-4">
            {clusters.map(cluster => (
              <div key={cluster.id} className="space-y-3 rounded-lg border bg-card/40 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{cluster.name}</p>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>{cluster.nodes} sensors</span>
                      <span>{cluster.leadIndicator}</span>
                      <span>Last sync {cluster.lastSynced}</span>
                    </div>
                  </div>
                  <Badge className={`capitalize ${clusterStatusColorMap[cluster.status]}`}>
                    {cluster.status}
                  </Badge>
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="w-full md:max-w-sm">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Coverage</span>
                      <span>{cluster.coverage}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-muted">
                      <div
                        className={`h-2 rounded-full ${
                          cluster.status === 'healthy'
                            ? 'bg-emerald-500'
                            : cluster.status === 'degraded'
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${cluster.coverage}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleClusterSync(cluster.id)}>
                      <Activity className="mr-2 h-4 w-4" /> Sync
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => openImportModal('clusters')}>
                      <UploadCloud className="mr-2 h-4 w-4" /> Import
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Radar className="h-4 w-4" /> Indicator intelligence
            </CardTitle>
            <CreateMenuButton
              label="Indicator"
              onCreate={handleCreateIndicator}
              context="indicators"
              size="sm"
            />
          </CardHeader>
          <CardContent className="space-y-3">
            {indicators.map(indicator => (
              <div key={indicator.id} className="space-y-3 rounded-lg border bg-card/40 p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium break-all">{indicator.indicator}</p>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="uppercase">{indicator.type}</span>
                      <span>Confidence {indicator.confidence}%</span>
                      <span>{indicator.cluster}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 text-right">
                    <Badge className={`capitalize ${severityColorMap[indicator.severity]}`}>
                      {indicator.severity}
                    </Badge>
                    <Badge className={`capitalize ${indicatorStatusColorMap[indicator.status]}`}>
                      {indicator.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">Last seen {indicator.lastSeen}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => acknowledgeIndicator(indicator.id)}>
                      <Check className="mr-2 h-4 w-4" /> Ack
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => escalateIndicator(indicator.id)}>
                      <AlertTriangle className="mr-2 h-4 w-4" /> Escalate
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivity.map(activity => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">{activity.timestamp}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add/Edit Rule Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeRuleModal}
        title={`${editingRule ? 'Edit' : 'Add New'} Rule`}
        size="lg"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={closeRuleModal}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit" form="rule-form">
              <Save className="mr-2 h-4 w-4" />
              {editingRule ? 'Update' : 'Create'} Rule
            </Button>
          </div>
        }
      >
        <form id="rule-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Rule Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter rule name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => handleSelectChange('severity', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  {severities.map(severity => (
                    <SelectItem key={severity.value} value={severity.value}>
                      {severity.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Select
                value={formData.action}
                onValueChange={(value) => handleSelectChange('action', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  {actions.map(action => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter rule description"
              rows={4}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={formData.status === 'enabled'}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ 
                  ...prev, 
                  status: checked ? 'enabled' : 'disabled' 
                }))
              }
            />
            <Label htmlFor="status">Enable this rule</Label>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Rule"
        size="sm"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-yellow-500">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">Are you sure you want to delete this rule?</p>
          </div>
          <p className="text-sm text-muted-foreground">
            This will permanently delete the rule "{ruleToDelete?.name}". This action cannot be undone.
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={isImportModalOpen}
        onClose={closeImportModal}
        title={importContext ? `Import ${importCopy[importContext].title}` : 'Import spreadsheet'}
        size="lg"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={closeImportModal}>
              Cancel
            </Button>
            <Button type="submit" form="import-form">
              <UploadCloud className="mr-2 h-4 w-4" /> Process file
            </Button>
          </div>
        }
      >
        <form id="import-form" onSubmit={handleImportSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="import-file">Spreadsheet</Label>
            <Input
              id="import-file"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleImportFileChange}
              required
            />
            {importContext && (
              <p className="text-xs text-muted-foreground">
                {importCopy[importContext].helper}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="import-notes">Notes (optional)</Label>
            <Textarea
              id="import-notes"
              value={importNotes}
              onChange={(event) => setImportNotes(event.target.value)}
              placeholder="Document exemptions or context for this file..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="import-dry-run" checked={importDryRun} onCheckedChange={setImportDryRun} />
            <Label htmlFor="import-dry-run">Validate only (dry run)</Label>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Rules;
