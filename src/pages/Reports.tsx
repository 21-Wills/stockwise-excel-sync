import { useState } from "react";
import { 
  Download, 
  FileText, 
  BarChart3, 
  Calendar,
  Filter,
  TrendingUp,
  Package,
  DollarSign,
  Users
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Date picker component will be added later
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const reportTypes = [
  { 
    id: "inventory-summary", 
    name: "Inventory Summary", 
    description: "Current stock levels by category",
    icon: Package
  },
  { 
    id: "stock-movements", 
    name: "Stock Movements", 
    description: "Inbound, outbound, and adjustments",
    icon: TrendingUp
  },
  { 
    id: "valuation-report", 
    name: "Inventory Valuation", 
    description: "Financial value of current stock",
    icon: DollarSign
  },
  { 
    id: "user-activity", 
    name: "User Activity", 
    description: "Actions performed by users",
    icon: Users
  }
];

const categories = ["All Categories", "SU", "YA", "Chainstore", "Parco", "PNP", "Parco Food"];
const formats = ["Excel", "CSV", "PDF"];

// Mock recent reports data
const recentReports = [
  {
    id: "RPT001",
    name: "Monthly Inventory Summary",
    type: "Inventory Summary", 
    generated: "2024-01-15 14:30",
    user: "John Smith",
    status: "Ready",
    fileSize: "2.4 MB"
  },
  {
    id: "RPT002", 
    name: "Amazon Stock Movements",
    type: "Stock Movements",
    generated: "2024-01-15 09:15",
    user: "Sarah Johnson", 
    status: "Ready",
    fileSize: "1.8 MB"
  },
  {
    id: "RPT003",
    name: "Q4 Inventory Valuation",
    type: "Inventory Valuation",
    generated: "2024-01-14 16:45", 
    user: "Mike Wilson",
    status: "Processing",
    fileSize: "-"
  }
];

const Reports = () => {
  const [selectedReportType, setSelectedReportType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedFormat, setSelectedFormat] = useState("Excel");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = () => {
    if (!selectedReportType) {
      toast({
        title: "Report type required",
        description: "Please select a report type to generate",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Report generated",
        description: `${reportTypes.find(r => r.id === selectedReportType)?.name} is ready for download`,
      });
    }, 3000);
  };

  const handleDownloadReport = (reportId: string) => {
    toast({
      title: "Downloading report",
      description: `Report ${reportId} will be downloaded shortly`,
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Ready": return "default";
      case "Processing": return "secondary";
      case "Failed": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate and download inventory reports for analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generation */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate New Report
            </CardTitle>
            <CardDescription>
              Create custom inventory reports with filters and date ranges
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Report Type Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">Select Report Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reportTypes.map((report) => {
                  const Icon = report.icon;
                  return (
                    <div
                      key={report.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedReportType === report.id
                          ? "border-primary bg-primary-light"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedReportType(report.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">{report.name}</div>
                          <div className="text-xs text-muted-foreground">{report.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Format</label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formats.map((format) => (
                      <SelectItem key={format} value={format}>
                        {format}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Select Date Range
                </Button>
              </div>
            </div>

            {/* Generate Button */}
            <Button 
              onClick={handleGenerateReport}
              disabled={!selectedReportType || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Report...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate & Download Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Report Statistics</CardTitle>
            <CardDescription>
              Overview of reporting activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Reports This Month</span>
                <span className="font-semibold">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Most Generated</span>
                <span className="font-semibold">Stock Movements</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Size</span>
                <span className="font-semibold">1.8 MB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Processing Queue</span>
                <span className="font-semibold">2 reports</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Download or regenerate previously created reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Generated</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-mono">{report.id}</TableCell>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {report.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {report.generated}
                  </TableCell>
                  <TableCell>{report.user}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(report.status) as any}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{report.fileSize}</TableCell>
                  <TableCell>
                    {report.status === "Ready" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadReport(report.id)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    )}
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

export default Reports;