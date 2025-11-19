import { useState } from "react";
import {
  Server,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  Zap,
  Filter,
  RefreshCw,
  Network
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Progress } from "@/components/ui/progress";

type ClusterStatus = 'healthy' | 'maintenance' | 'degraded';

type Cluster = {
  id: string;
  name: string;
  nodes: number;
  coverage: number;
  status: ClusterStatus;
  leadIndicator: string;
  lastSynced: string;
  description: string;
  location?: string;
  capacity: number;
};

const Clusters = () => {
  const [clusters, setClusters] = useState<Cluster[]>([
    {
      id: 'cluster-1',
      name: 'Edge perimeter cluster',
      nodes: 6,
      coverage: 92,
      status: 'healthy',
      leadIndicator: 'TLS JA3 pack',
      lastSynced: '5m ago',
      description: 'Primary edge security cluster monitoring perimeter traffic',
      location: 'Data Center A',
      capacity: 100
    },
    {
      id: 'cluster-2',
      name: 'Cloud workload cluster',
      nodes: 4,
      coverage: 81,
      status: 'degraded',
      leadIndicator: 'Emotet callbacks',
      lastSynced: '28m ago',
      description: 'Cloud infrastructure monitoring and threat detection',
      location: 'AWS Region 1',
      capacity: 80
    },
    {
      id: 'cluster-3',
      name: 'OT / plant sensors',
      nodes: 3,
      coverage: 68,
      status: 'maintenance',
      leadIndicator: 'Modbus anomaly set',
      lastSynced: '1h ago',
      description: 'Operational technology network monitoring',
      location: 'Plant Floor',
      capacity: 60
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCluster, setEditingCluster] = useState<Cluster | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clusterToDelete, setClusterToDelete] = useState<Cluster | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ClusterStatus>('all');

  const [formData, setFormData] = useState<Partial<Cluster>>({
    name: '',
    nodes: 1,
    coverage: 50,
    status: 'healthy',
    leadIndicator: '',
    description: '',
    location: '',
    capacity: 100,
  });

  const getStatusColor = (status: ClusterStatus) => {
    switch (status) {
      case 'healthy':
        return 'bg-emerald-100 text-emerald-800';
      case 'degraded':
        return 'bg-amber-100 text-amber-800';
      case 'maintenance':
        return 'bg-slate-200 text-slate-800';
    }
  };

  const getStatusIcon = (status: ClusterStatus) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-slate-600" />;
    }
  };

  const clusterColumns: ColumnDef<Cluster>[] = [
    {
      accessorKey: 'name',
      header: 'Cluster',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold">{row.original.name}</p>
          {row.original.location && (
            <p className="text-xs text-muted-foreground">{row.original.location}</p>
          )}
        </div>
      )
    },
    {
      accessorKey: 'nodes',
      header: 'Nodes',
      cell: ({ row }) => <span className="font-medium">{row.original.nodes}</span>
    },
    {
      accessorKey: 'coverage',
      header: 'Coverage',
      cell: ({ row }) => (
        <div>
          <span className="text-sm font-medium">{row.original.coverage}%</span>
          <Progress value={row.original.coverage} className="mt-1 h-1.5" />
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge className={`capitalize text-xs ${getStatusColor(row.original.status)}`}>
          {row.original.status}
        </Badge>
      )
    },
    {
      accessorKey: 'leadIndicator',
      header: 'Lead Indicator',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.leadIndicator}</span>
      )
    },
    {
      accessorKey: 'lastSynced',
      header: 'Last Synced',
      cell: ({ row }) => <span className="text-sm">{row.original.lastSynced}</span>
    }
  ];

  const clusterFilterOptions = [
    {
      columnId: 'status',
      title: 'Status',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Healthy', value: 'healthy' },
        { label: 'Degraded', value: 'degraded' },
        { label: 'Maintenance', value: 'maintenance' },
      ],
    },
  ];

  const filteredClusters = clusters.filter(cluster => {
    if (statusFilter !== 'all' && cluster.status !== statusFilter) return false;
    if (searchQuery && !cluster.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleOpenModal = () => {
    setEditingCluster(null);
    setFormData({
      name: '',
      nodes: 1,
      coverage: 50,
      status: 'healthy',
      leadIndicator: '',
      description: '',
      location: '',
      capacity: 100,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCluster(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'nodes' || name === 'coverage' || name === 'capacity' ? parseInt(value) : value
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

    if (!formData.name || !formData.description) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const normalizedCluster: Cluster = {
      id: editingCluster?.id || `cluster-${Date.now()}`,
      name: formData.name,
      nodes: formData.nodes || 1,
      coverage: formData.coverage || 50,
      status: (formData.status as ClusterStatus) || 'healthy',
      leadIndicator: formData.leadIndicator || '',
      lastSynced: editingCluster?.lastSynced || 'Just now',
      description: formData.description,
      location: formData.location,
      capacity: formData.capacity || 100,
    };

    if (editingCluster) {
      setClusters(prev => prev.map(c => (c.id === editingCluster.id ? normalizedCluster : c)));
      toast.success('Cluster updated successfully');
    } else {
      setClusters(prev => [...prev, normalizedCluster]);
      toast.success('Cluster created successfully');
    }

    closeModal();
  };

  const handleEdit = (cluster: Cluster) => {
    setEditingCluster(cluster);
    setFormData(cluster);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (cluster: Cluster) => {
    setClusterToDelete(cluster);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (clusterToDelete) {
      setClusters(clusters.filter(c => c.id !== clusterToDelete.id));
      toast.success('Cluster deleted successfully');
      setIsDeleteModalOpen(false);
      setClusterToDelete(null);
    }
  };

  const handleSync = (clusterId: string) => {
    setClusters(prev =>
      prev.map(c =>
        c.id === clusterId ? { ...c, lastSynced: 'Just now' } : c
      )
    );
    toast.success('Cluster sync initiated');
  };

  const healthyCount = clusters.filter(c => c.status === 'healthy').length;
  const degradedCount = clusters.filter(c => c.status === 'degraded').length;
  const maintenanceCount = clusters.filter(c => c.status === 'maintenance').length;
  const totalNodes = clusters.reduce((sum, c) => sum + c.nodes, 0);
  const avgCoverage = Math.round(clusters.reduce((sum, c) => sum + c.coverage, 0) / clusters.length);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Server className="h-4 w-4" /> Cluster Management
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Sensor Clusters</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage and monitor your distributed sensor clusters.
          </p>
        </div>
        <Button onClick={handleOpenModal} size="sm" className="text-xs sm:text-sm">
          <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> New Cluster
        </Button>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Total Clusters</p>
              <p className="text-3xl font-semibold">{clusters.length}</p>
            </div>
            <Server className="h-10 w-10 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Healthy</p>
              <p className="text-3xl font-semibold">{healthyCount}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-500" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Total Nodes</p>
              <p className="text-3xl font-semibold">{totalNodes}</p>
            </div>
            <Network className="h-10 w-10 text-purple-500" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Avg Coverage</p>
              <p className="text-3xl font-semibold">{avgCoverage}%</p>
            </div>
            <Zap className="h-10 w-10 text-yellow-500" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" /> Filter Clusters
            </CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                placeholder="Search clusters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs sm:text-sm"
              />
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
                <SelectTrigger className="w-full sm:w-40 text-xs sm:text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="degraded">Degraded</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cluster Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={clusterColumns}
            data={filteredClusters}
            searchKey={["name", "leadIndicator", "location"]}
            filterOptions={clusterFilterOptions}
            searchPlaceholder="Search clusters by name, location, or indicator..."
            pageSizeOptions={[5, 10, 20]}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </CardContent>
      </Card>

      <div className="space-y-3 sm:space-y-4">
        {filteredClusters.map((cluster) => (
          <Card key={cluster.id} className="border-l-4 border-l-primary/20">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getStatusIcon(cluster.status)}
                      <h3 className="font-semibold text-sm sm:text-base">{cluster.name}</h3>
                      <Badge className={`capitalize text-xs ${getStatusColor(cluster.status)}`}>
                        {cluster.status}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{cluster.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(cluster)}
                      className="text-xs sm:text-sm"
                    >
                      <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(cluster)}
                      className="text-xs sm:text-sm text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Nodes</p>
                    <p className="text-lg sm:text-xl font-semibold">{cluster.nodes}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Coverage</p>
                    <p className="text-lg sm:text-xl font-semibold">{cluster.coverage}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium">{cluster.location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Synced</p>
                    <p className="text-sm font-medium">{cluster.lastSynced}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Coverage</span>
                    <span className="font-medium">{cluster.coverage}%</span>
                  </div>
                  <Progress value={cluster.coverage} className="h-2" />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {cluster.leadIndicator}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSync(cluster.id)}
                    className="text-xs sm:text-sm"
                  >
                    <RefreshCw className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Sync
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClusters.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Server className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No clusters found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first cluster'}
            </p>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={`${editingCluster ? 'Edit' : 'Create'} Cluster`}
        size="lg"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={closeModal} size="sm">
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit" form="cluster-form" size="sm">
              <Save className="mr-2 h-4 w-4" />
              {editingCluster ? 'Update' : 'Create'} Cluster
            </Button>
          </div>
        }
      >
        <form id="cluster-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Cluster Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Edge perimeter cluster"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Data Center A"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nodes">Number of Nodes</Label>
              <Input
                id="nodes"
                name="nodes"
                type="number"
                value={formData.nodes}
                onChange={handleInputChange}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverage">Coverage %</Label>
              <Input
                id="coverage"
                name="coverage"
                type="number"
                value={formData.coverage}
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
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="degraded">Degraded</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadIndicator">Lead Indicator</Label>
              <Input
                id="leadIndicator"
                name="leadIndicator"
                value={formData.leadIndicator}
                onChange={handleInputChange}
                placeholder="e.g., TLS JA3 pack"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe this cluster"
              rows={3}
              required
            />
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Cluster"
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
            <p className="font-medium">Are you sure you want to delete this cluster?</p>
          </div>
          <p className="text-sm text-muted-foreground">
            This will permanently delete the cluster "{clusterToDelete?.name}". This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Clusters;
