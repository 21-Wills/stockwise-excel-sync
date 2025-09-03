import { useState, useRef } from "react";
import { Upload, Download, CheckCircle, XCircle, AlertTriangle, FileText, RotateCcw, Package2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const returnReasons = ["Defective", "Customer Return", "Damage in Transit", "Wrong Item", "Quality Issue", "Overstock"];
const salesChannels = ["Amazon", "Takealot", "Chainstore", "PNP", "Parco", "Direct Sales"];

// Mock validation results for returns
const mockValidationResults = [
  {
    row: 1,
    sku: "SAM-S23-128",
    product: "Samsung Galaxy S23 128GB",
    quantity: 3,
    reason: "Customer Return",
    condition: "Good",
    status: "valid",
    message: ""
  },
  {
    row: 2,
    sku: "APL-IP14P-256", 
    product: "iPhone 14 Pro 256GB",
    quantity: 1,
    reason: "Defective",
    condition: "Damaged", 
    status: "warning",
    message: "Damaged items require quality inspection"
  },
  {
    row: 3,
    sku: "UNKNOWN-SKU",
    product: "Unknown Product",
    quantity: 2,
    reason: "Wrong Item",
    condition: "Good",
    status: "error",
    message: "SKU not found in system"
  },
  {
    row: 4,
    sku: "SON-WH1000",
    product: "Sony WH-1000XM5",
    quantity: 1,
    reason: "Quality Issue",
    condition: "Refurbish",
    status: "valid",
    message: ""
  }
];

const Returns = () => {
  const [selectedChannel, setSelectedChannel] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<typeof mockValidationResults | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setValidationResults(null);
      toast({
        title: "File uploaded",
        description: `${file.name} ready for validation`,
      });
    }
  };

  const handleValidation = async () => {
    if (!uploadedFile || !selectedChannel) {
      toast({
        title: "Missing information", 
        description: "Please select a file and sales channel first",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    // Simulate validation process
    setTimeout(() => {
      setValidationResults(mockValidationResults);
      setIsValidating(false);
      
      const errorCount = mockValidationResults.filter(r => r.status === "error").length;
      if (errorCount > 0) {
        toast({
          title: "Validation issues found",
          description: `${errorCount} items have errors`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Validation complete", 
          description: "Returns file validated successfully",
        });
      }
    }, 2000);
  };

  const handleCommit = async () => {
    if (!validationResults) return;

    const validRows = validationResults.filter(r => r.status === "valid" || r.status === "warning").length;
    
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setUploadedFile(null);
      setValidationResults(null);
      setSelectedChannel("");
      setSelectedReason("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      toast({
        title: "Returns processed",
        description: `${validRows} returned items have been added to inventory`,
      });
    }, 3000);
  };

  const downloadTemplate = () => {
    toast({
      title: "Template downloading",
      description: "Returns Excel template will be downloaded shortly",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return null;
    }
  };

  const getConditionBadgeVariant = (condition: string) => {
    switch (condition) {
      case "Good": return "default";
      case "Damaged": return "destructive";
      case "Refurbish": return "secondary";
      default: return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "valid": return "default";
      case "error": return "destructive";
      case "warning": return "secondary";
      default: return "outline";
    }
  };

  const validCount = validationResults?.filter(r => r.status === "valid").length || 0;
  const errorCount = validationResults?.filter(r => r.status === "error").length || 0;
  const warningCount = validationResults?.filter(r => r.status === "warning").length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Returns Processing</h1>
          <p className="text-muted-foreground">
            Process returned stock from sales channels and customer returns
          </p>
        </div>
        <Button variant="outline" onClick={downloadTemplate}>
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </Button>
      </div>

      {/* Upload Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Upload Returns Excel File
          </CardTitle>
          <CardDescription>
            Select return source and upload your returns Excel file for processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Return Source</label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {salesChannels.map((channel) => (
                    <SelectItem key={channel} value={channel}>
                      {channel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Return Reason (Optional)</label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {returnReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Excel File</label>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadedFile ? uploadedFile.name : "Choose File"}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleValidation}
              disabled={!uploadedFile || !selectedChannel || isValidating}
              className="flex-1"
            >
              {isValidating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Validating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Validate Returns
                </>
              )}
            </Button>

            {validationResults && (
              <Button 
                onClick={handleCommit}
                disabled={errorCount > 0 || isProcessing}
                variant={errorCount > 0 ? "destructive" : "default"}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Process Returns
                  </>
                )}
              </Button>
            )}
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing returns...</span>
                <span>80%</span>
              </div>
              <Progress value={80} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validationResults && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Returns Validation Results</CardTitle>
            <CardDescription>
              Review return items and their condition before processing
            </CardDescription>
            <div className="flex gap-4 mt-2">
              <Badge variant="default">Valid: {validCount}</Badge>
              <Badge variant="destructive">Errors: {errorCount}</Badge>
              <Badge variant="secondary">Warnings: {warningCount}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Row</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validationResults.map((result) => (
                  <TableRow key={result.row}>
                    <TableCell>{result.row}</TableCell>
                    <TableCell className="font-mono">{result.sku}</TableCell>
                    <TableCell>{result.product}</TableCell>
                    <TableCell className="text-success font-medium">
                      +{result.quantity}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {result.reason}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getConditionBadgeVariant(result.condition) as any}>
                        {result.condition}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <Badge variant={getStatusBadgeVariant(result.status) as any}>
                          {result.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {result.message}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Recent Returns Summary */}
      <Card className="shadow-card bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package2 className="h-5 w-5" />
            Recent Returns Summary
          </CardTitle>
          <CardDescription>
            Latest return statistics by channel and reason
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { channel: "Amazon", count: 45, status: "high" },
              { channel: "Takealot", count: 23, status: "medium" },
              { channel: "Direct", count: 12, status: "low" },
              { channel: "Chainstore", count: 8, status: "low" }
            ].map((item) => (
              <div key={item.channel} className="p-4 rounded-lg border bg-surface">
                <div className="font-medium text-sm">{item.channel}</div>
                <div className="text-2xl font-bold mt-1">{item.count}</div>
                <div className="text-xs text-muted-foreground">returns this month</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Returns;