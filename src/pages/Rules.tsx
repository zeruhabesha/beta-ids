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
  Check
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
  // Mock data for rules
  const [rules, setRules] = useState<Rule[]>([
    {
      id: '1',
      sid: '2000001',
      name: 'ET EXPLOIT SSH Weak Encryption Algorithms',
      category: 'Exploit',
      severity: 'high',
      action: 'alert',
      status: 'enabled',
      triggeredCount: 42,
      lastTriggered: '2023-10-15T14:30:00Z',
      description: 'This rule detects SSH connections using weak encryption algorithms.'
    },
    {
      id: '2',
      sid: '2000002',
      name: 'ET SCAN Nmap Scripting Engine',
      category: 'Scan',
      severity: 'medium',
      action: 'alert',
      status: 'enabled',
      triggeredCount: 18,
      lastTriggered: '2023-10-14T09:15:00Z',
      description: 'Detects Nmap Scripting Engine activity.'
    },
    {
      id: '3',
      sid: '2000003',
      name: 'ET MALWARE Suspicious Executable Download',
      category: 'Malware',
      severity: 'critical',
      action: 'drop',
      status: 'enabled',
      triggeredCount: 5,
      lastTriggered: '2023-10-16T16:45:00Z',
      description: 'Detects suspicious executable downloads.'
    }
  ]);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<Rule | null>(null);

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

  const [formData, setFormData] = useState<Partial<Rule>>({
    sid: '',
    name: '',
    category: '',
    severity: 'medium',
    action: 'alert',
    status: 'enabled',
    description: ''
  });

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
    
    if (editingRule) {
      // Update existing rule
      setRules(rules.map(rule => 
        rule.id === editingRule.id 
          ? { ...formData, id: editingRule.id, triggeredCount: editingRule.triggeredCount, lastTriggered: editingRule.lastTriggered } 
          : rule
      ));
      toast.success('Rule updated successfully');
    } else {
      // Add new rule
      const newRule: Rule = {
        ...formData,
        id: Date.now().toString(),
        triggeredCount: 0,
        lastTriggered: new Date().toISOString()
      };
      setRules([...rules, newRule]);
      toast.success('Rule added successfully');
    }
    
    // Reset form and close modal
    setFormData({
      sid: '',
      name: '',
      category: '',
      severity: 'medium',
      action: 'alert',
      status: 'enabled',
      description: ''
    });
    setEditingRule(null);
    setIsModalOpen(false);
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
    },
    {
      accessorKey: 'severity',
      header: 'Severity',
      cell: ({ row }) => {
        const severity = row.getValue('severity') as 'low' | 'medium' | 'high' | 'critical';
        const severityMap = {
          low: 'bg-blue-100 text-blue-800',
          medium: 'bg-yellow-100 text-yellow-800',
          high: 'bg-orange-100 text-orange-800',
          critical: 'bg-red-100 text-red-800',
        };
        return (
          <Badge className={`capitalize ${severityMap[severity] || 'bg-gray-100'}`}>
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
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Rules Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage and monitor your IDS/IPS rules
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Rule
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={rules}
            searchKey={['name', 'sid', 'category']}
            filterOptions={filterOptions}
            searchPlaceholder="Search rules by name, SID, or category..."
          />
        </CardContent>
      </Card>

      {/* Add/Edit Rule Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${editingRule ? 'Edit' : 'Add New'} Rule`}
        size="lg"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
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
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Rule"
        size="sm"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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
    </div>
  );
};

export default Rules;
