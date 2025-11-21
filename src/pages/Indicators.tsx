import { useState } from "react";
import {
  Radar,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  TrendingUp,
  Star,
  Archive,
  AlertTriangle,
  Search,
  Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";

type IndicatorType = 'ip' | 'domain' | 'hash' | 'url';
type IndicatorSeverity = 'low' | 'medium' | 'high' | 'critical';
type IndicatorStatus = 'active' | 'retired' | 'under-review';

type Indicator = {
  id: string;
  indicator: string;
  type: IndicatorType;
  severity: IndicatorSeverity;
  confidence: number;
  status: IndicatorStatus;
  cluster: string;
  lastSeen: string;
  description?: string;
  source?: string;
};

const Indicators = () => {
  const [indicators, setIndicators] = useState<Indicator[]>([
    {
      id: 'indicator-1',
      indicator: '45.77.23.11',
      type: 'ip',
      severity: 'critical',
      confidence: 96,
      status: 'active',
      cluster: 'Edge perimeter cluster',
      lastSeen: '2 hours ago',
      description: 'Known C2 server associated with APT group',
      source: 'Threat Intel Feed'
    },
    {
      id: 'indicator-2',
      indicator: 'suspicious-updates.net',
      type: 'domain',
      severity: 'high',
      confidence: 82,
      status: 'under-review',
      cluster: 'Cloud workload cluster',
      lastSeen: '45 minutes ago',
      description: 'Domain used for malware distribution',
      source: 'Internal Analysis'
    },
    {
      id: 'indicator-3',
      indicator: 'd41d8cd98f00b204e9800998ecf8427e',
      type: 'hash',
      severity: 'medium',
      confidence: 60,
      status: 'retired',
      cluster: 'OT / plant sensors',
      lastSeen: 'Yesterday',
      description: 'Suspicious file hash detected in network traffic',
      source: 'Sandbox Analysis'
    },
    {
      id: 'indicator-4',
      indicator: 'http://malicious-site.com/payload',
      type: 'url',
      severity: 'high',
      confidence: 88,
      status: 'active',
      cluster: 'Edge perimeter cluster',
      lastSeen: '1 hour ago',
      description: 'Phishing URL targeting credentials',
      source: 'Threat Intel Feed'
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [indicatorToDelete, setIndicatorToDelete] = useState<Indicator | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | IndicatorType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | IndicatorStatus>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | IndicatorSeverity>('all');

  const [formData, setFormData] = useState<Partial<Indicator>>({
    indicator: '',
    type: 'ip',
    severity: 'medium',
    confidence: 50,
    status: 'under-review',
    cluster: '',
    description: '',
    source: '',
  });

  const getSeverityColor = (severity: IndicatorSeverity) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusColor = (status: IndicatorStatus) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'under-review':
        return 'bg-blue-100 text-blue-800';
      case 'retired':
        return 'bg-slate-200 text-slate-800';
    }
  };

  const getTypeIcon = (type: IndicatorType) => {
    switch (type) {
      case 'ip':
        return '🌐';
      case 'domain':
        return '🔗';
      case 'hash':
        return '#️⃣';
      case 'url':
        return '📎';
    }
  };

  const indicatorColumns: ColumnDef<Indicator>[] = [
    {
      accessorKey: 'indicator',
      header: 'Indicator',
      cell: ({ row }) => (
        <div>
          <p className="font-mono font-semibold text-sm break-all">{row.original.indicator}</p>
          <p className="text-xs text-muted-foreground capitalize">{row.original.type}</p>
        </div>
      )
    },
    {
      accessorKey: 'severity',
      header: 'Severity',
      cell: ({ row }) => (
        <Badge className={`capitalize text-xs ${getSeverityColor(row.original.severity)}`}>
          {row.original.severity}
        </Badge>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge className={`capitalize text-xs ${getStatusColor(row.original.status)}`}>
          {row.original.status.replace('-', ' ')}
        </Badge>
      )
    },
    {
      accessorKey: 'confidence',
      header: 'Confidence',
      cell: ({ row }) => (
        <span className="text-sm font-medium">{row.original.confidence}%</span>
      )
    },
    {
      accessorKey: 'cluster',
      header: 'Cluster',
      cell: ({ row }) => <span className="text-sm">{row.original.cluster}</span>
    },
    {
      accessorKey: 'lastSeen',
      header: 'Last Seen',
      cell: ({ row }) => <span className="text-sm">{row.original.lastSeen}</span>
    },
  ];

  const indicatorFilterOptions = [
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
        { label: 'Active', value: 'active' },
        { label: 'Under Review', value: 'under-review' },
        { label: 'Retired', value: 'retired' },
      ],
    },
    {
      columnId: 'type',
      title: 'Type',
      options: [
        { label: 'All', value: 'all' },
        { label: 'IP', value: 'ip' },
        { label: 'Domain', value: 'domain' },
        { label: 'Hash', value: 'hash' },
        { label: 'URL', value: 'url' },
      ],
    },
  ];

  const getIndicatorRowTone = (severity: IndicatorSeverity) => {
    switch (severity) {
      case 'critical':
        return 'border-l-4 border-destructive/60 bg-destructive/5';
      case 'high':
        return 'border-l-4 border-warning/50 bg-warning/5';
      case 'medium':
        return 'border-l-4 border-info/40 bg-info/5';
      case 'low':
      default:
        return 'border-l-4 border-muted/40 bg-muted/10';
    }
  };

  const filteredIndicators = indicators.filter(indicator => {
    if (typeFilter !== 'all' && indicator.type !== typeFilter) return false;
    if (statusFilter !== 'all' && indicator.status !== statusFilter) return false;
    if (severityFilter !== 'all' && indicator.severity !== severityFilter) return false;
    if (searchQuery && !indicator.indicator.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleOpenModal = () => {
    setEditingIndicator(null);
    setFormData({
      indicator: '',
      type: 'ip',
      severity: 'medium',
      confidence: 50,
      status: 'under-review',
      cluster: '',
      description: '',
      source: '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndicator(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'confidence' ? parseInt(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.indicator || !formData.cluster) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const normalizedIndicator: Indicator = {
      id: editingIndicator?.id || `indicator-${Date.now()}`,
      indicator: formData.indicator,
      type: (formData.type as IndicatorType) || 'ip',
      severity: (formData.severity as IndicatorSeverity) || 'medium',
      confidence: formData.confidence || 50,
      status: (formData.status as IndicatorStatus) || 'under-review',
      cluster: formData.cluster,
      lastSeen: editingIndicator?.lastSeen || 'Just now',
      description: formData.description,
      source: formData.source,
    };

    if (editingIndicator) {
      setIndicators(prev => prev.map(i => (i.id === editingIndicator.id ? normalizedIndicator : i)));
      toast.success('Indicator updated successfully');
    } else {
      setIndicators(prev => [...prev, normalizedIndicator]);
      toast.success('Indicator created successfully');
    }

    closeModal();
  };

  const handleEdit = (indicator: Indicator) => {
    setEditingIndicator(indicator);
    setFormData(indicator);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (indicator: Indicator) => {
    setIndicatorToDelete(indicator);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (indicatorToDelete) {
      setIndicators(indicators.filter(i => i.id !== indicatorToDelete.id));
      toast.success('Indicator deleted successfully');
      setIsDeleteModalOpen(false);
      setIndicatorToDelete(null);
    }
  };

  const acknowledgeIndicator = (indicatorId: string) => {
    setIndicators(prev =>
      prev.map(i =>
        i.id === indicatorId ? { ...i, status: 'retired' as IndicatorStatus } : i
      )
    );
    toast.success('Indicator acknowledged and retired');
  };

  const escalateIndicator = (indicatorId: string) => {
    setIndicators(prev =>
      prev.map(i =>
        i.id === indicatorId
          ? { ...i, severity: 'critical' as IndicatorSeverity, status: 'active' as IndicatorStatus }
          : i
      )
    );
    toast.warning('Indicator escalated to critical');
  };

  const activeCount = indicators.filter(i => i.status === 'active').length;
  const criticalCount = indicators.filter(i => i.severity === 'critical').length;
  const underReviewCount = indicators.filter(i => i.status === 'under-review').length;
  const avgConfidence = Math.round(indicators.reduce((sum, i) => sum + i.confidence, 0) / indicators.length);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Radar className="h-4 w-4" /> Threat Intelligence
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Indicators of Compromise</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Track and manage threat indicators across your network.
          </p>
        </div>
        <Button onClick={handleOpenModal} size="sm" className="text-xs sm:text-sm">
          <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> New Indicator
        </Button>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Total Indicators</p>
              <p className="text-3xl font-semibold">{indicators.length}</p>
            </div>
            <Radar className="h-10 w-10 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-3xl font-semibold">{activeCount}</p>
            </div>
            <Shield className="h-10 w-10 text-green-500" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-3xl font-semibold">{criticalCount}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Avg Confidence</p>
              <p className="text-3xl font-semibold">{avgConfidence}%</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" /> Filter Indicators
            </CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search indicators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs sm:text-sm"
                />
              </div>
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as typeof typeFilter)}>
                <SelectTrigger className="w-full sm:w-32 text-xs sm:text-sm">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ip">IP Address</SelectItem>
                  <SelectItem value="domain">Domain</SelectItem>
                  <SelectItem value="hash">Hash</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
                <SelectTrigger className="w-full sm:w-32 text-xs sm:text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Indicator Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={indicatorColumns}
            data={filteredIndicators}
            searchKey={["indicator", "cluster", "description"]}
            filterOptions={indicatorFilterOptions}
            searchPlaceholder="Search indicators by value, cluster, or description..."
            pageSizeOptions={[5, 10, 20]}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            rowClassName={(row) =>
              `transition-colors ${getIndicatorRowTone((row.original as Indicator).severity)}`
            }
          />
        </CardContent>
      </Card>

      {filteredIndicators.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Radar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No indicators found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first indicator'}
            </p>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={`${editingIndicator ? 'Edit' : 'Create'} Indicator`}
        size="lg"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={closeModal} size="sm">
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit" form="indicator-form" size="sm">
              <Save className="mr-2 h-4 w-4" />
              {editingIndicator ? 'Update' : 'Create'} Indicator
            </Button>
          </div>
        }
      >
        <form id="indicator-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="indicator">Indicator Value *</Label>
              <Input
                id="indicator"
                name="indicator"
                value={formData.indicator}
                onChange={handleInputChange}
                placeholder="e.g., 192.168.1.1 or malicious.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ip">IP Address</SelectItem>
                  <SelectItem value="domain">Domain</SelectItem>
                  <SelectItem value="hash">Hash</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select value={formData.severity} onValueChange={(value) => handleSelectChange('severity', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confidence">Confidence %</Label>
              <Input
                id="confidence"
                name="confidence"
                type="number"
                value={formData.confidence}
                onChange={handleInputChange}
                min="0"
                max="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cluster">Cluster *</Label>
              <Input
                id="cluster"
                name="cluster"
                value={formData.cluster}
                onChange={handleInputChange}
                placeholder="e.g., Edge perimeter cluster"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                placeholder="e.g., Threat Intel Feed"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe this indicator"
              rows={3}
            />
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Indicator"
        size="sm"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} size="sm">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-yellow-500">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">Are you sure you want to delete this indicator?</p>
          </div>
          <p className="text-sm text-muted-foreground">
            This will permanently delete the indicator "{indicatorToDelete?.indicator}". This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Indicators;