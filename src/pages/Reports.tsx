import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  Shield,
  AlertTriangle,
  Clock,
  FileSpreadsheet,
  FileJson,
  Plus,
  File
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

type ReportType = 'security' | 'performance' | 'compliance' | 'traffic';
type ReportFormat = 'pdf' | 'excel' | 'json' | 'csv';
type ReportStatus = 'completed' | 'generating' | 'scheduled' | 'failed';

type Report = {
  id: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  status: ReportStatus;
  createdAt: string;
  size: string;
  period: string;
};

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      name: 'Weekly Security Summary',
      type: 'security',
      format: 'pdf',
      status: 'completed',
      createdAt: '2025-02-16 14:30',
      size: '2.4 MB',
      period: 'Feb 9 - Feb 16, 2025'
    },
    {
      id: '2',
      name: 'Monthly Traffic Analysis',
      type: 'traffic',
      format: 'excel',
      status: 'completed',
      createdAt: '2025-02-15 09:15',
      size: '5.8 MB',
      period: 'January 2025'
    },
    {
      id: '3',
      name: 'Compliance Audit Report',
      type: 'compliance',
      format: 'pdf',
      status: 'generating',
      createdAt: '2025-02-16 16:00',
      size: '-',
      period: 'Q1 2025'
    },
    {
      id: '4',
      name: 'System Performance Metrics',
      type: 'performance',
      format: 'json',
      status: 'completed',
      createdAt: '2025-02-14 11:20',
      size: '1.2 MB',
      period: 'Feb 1 - Feb 14, 2025'
    },
    {
      id: '5',
      name: 'Daily Security Digest',
      type: 'security',
      format: 'pdf',
      status: 'scheduled',
      createdAt: '2025-02-17 00:00',
      size: '-',
      period: 'Feb 16, 2025'
    },
  ]);

  const [selectedType, setSelectedType] = useState<'all' | ReportType>('all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | ReportFormat>('all');

  const getTypeColor = (type: ReportType) => {
    switch (type) {
      case 'security':
        return 'bg-red-100 text-red-800';
      case 'performance':
        return 'bg-blue-100 text-blue-800';
      case 'compliance':
        return 'bg-purple-100 text-purple-800';
      case 'traffic':
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'generating':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
    }
  };

  const getFormatIcon = (format: ReportFormat) => {
    switch (format) {
      case 'pdf':
        return <File className="h-5 w-5 text-red-500" />;
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case 'json':
        return <FileJson className="h-5 w-5 text-blue-500" />;
      case 'csv':
        return <FileSpreadsheet className="h-5 w-5 text-orange-500" />;
    }
  };

  const filteredReports = reports.filter(report => {
    if (selectedType !== 'all' && report.type !== selectedType) return false;
    if (selectedFormat !== 'all' && report.format !== selectedFormat) return false;
    return true;
  });

  const downloadReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report?.status === 'completed') {
      toast.success(`Downloading ${report.name}...`);
    } else {
      toast.error('Report is not ready for download');
    }
  };

  const generateNewReport = () => {
    toast.success('Report generation started. You will be notified when it\'s ready.');
  };

  const reportStats = {
    total: reports.length,
    completed: reports.filter(r => r.status === 'completed').length,
    generating: reports.filter(r => r.status === 'generating').length,
    scheduled: reports.filter(r => r.status === 'scheduled').length,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4" /> Report Center
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Security Reports</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Generate, schedule, and download comprehensive security and compliance reports.
          </p>
        </div>
        <Button onClick={generateNewReport} size="sm" className="text-xs sm:text-sm">
          <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Generate Report
        </Button>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Total Reports</p>
              <p className="text-3xl font-semibold">{reportStats.total}</p>
            </div>
            <FileText className="h-10 w-10 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-semibold">{reportStats.completed}</p>
            </div>
            <Shield className="h-10 w-10 text-green-500" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Generating</p>
              <p className="text-3xl font-semibold">{reportStats.generating}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-yellow-500" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <p className="text-3xl font-semibold">{reportStats.scheduled}</p>
            </div>
            <Clock className="h-10 w-10 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" /> Filter Reports
            </CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value as typeof selectedType)}>
                <SelectTrigger className="w-full sm:w-40 text-xs sm:text-sm">
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="traffic">Traffic</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as typeof selectedFormat)}>
                <SelectTrigger className="w-full sm:w-40 text-xs sm:text-sm">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Formats</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-2 sm:space-y-3">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="mt-1">{getFormatIcon(report.format)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="font-semibold text-base">{report.name}</h3>
                      <Badge className={`capitalize w-fit ${getStatusColor(report.status)}`}>
                        {report.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className={`capitalize text-xs ${getTypeColor(report.type)}`}>
                        {report.type}
                      </Badge>
                      <Badge variant="secondary" className="text-xs uppercase">
                        {report.format}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {report.createdAt}
                      </span>
                      {report.size !== '-' && (
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {report.size}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {report.status === 'completed' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => downloadReport(report.id)}
                    >
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  )}
                  {report.status === 'generating' && (
                    <Button variant="outline" size="sm" disabled>
                      Generating...
                    </Button>
                  )}
                  {report.status === 'scheduled' && (
                    <Button variant="outline" size="sm" disabled>
                      Scheduled
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No reports found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or generate a new report
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Quick Generate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="security">Security Summary</SelectItem>
                  <SelectItem value="performance">Performance Metrics</SelectItem>
                  <SelectItem value="compliance">Compliance Audit</SelectItem>
                  <SelectItem value="traffic">Traffic Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time Period</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Format</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                  <SelectItem value="csv">CSV File</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="invisible">Action</Label>
              <Button className="w-full" onClick={generateNewReport}>
                <Plus className="mr-2 h-4 w-4" /> Generate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
