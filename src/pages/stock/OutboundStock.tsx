import { useState, useRef } from "react";
import { Upload, Download, CheckCircle, XCircle, AlertTriangle, FileText, Package } from "lucide-react";
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

const salesChannels = ["Amazon", "Takealot", "Chainstore", "PNP", "Parco", "Direct Sales"];

// Mock validation results for outbound
const mockValidationResults = [
  {
    row: 1,
    sku: "SAM-S23-128",
    product: "Samsung Galaxy S23 128GB",
    quantity: 15,
    availableStock: 45,
    status: "valid",
    message: ""
  },
  {
    row: 2,
    sku: "APL-IP14P-256", 
    product: "iPhone 14 Pro 256GB",
    quantity: 30,
    availableStock: 25,
    status: "error",
    message: "Insufficient stock (Available: 25, Requested: 30)"
  },
  {
    row: 3,
    sku: "SON-WH1000",
    product: "Sony WH-1000XM5",
    quantity: 5,
    availableStock: 8,
    status: "warning",
    message: "Will leave low stock (Remaining: 3)"
  },
  {
    row: 4,
    sku: "APL-MW-BLK",
    product: "Apple Magic Mouse",
    quantity: 8,
    availableStock: 12,
    status: "valid",
    message: ""
  }
];

const OutboundStock = () => {
  const [selectedChannel, setSelectedChannel] = useState("");
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
          description: `${errorCount} items have insufficient stock`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Validation complete",
          description: "All items validated successfully",
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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      toast({
        title: "Stock dispatched",
        description: `${validRows} items have been processed for ${selectedChannel}`,
      });
    }, 3000);
  };

  const downloadTemplate = () => {
    toast({
      title: "Template downloading",
      description: "Outbound Excel template will be downloaded shortly",
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
          <h1 className="text-3xl font-bold text-foreground">Outbound Stock</h1>
          <p className="text-muted-foreground">
            Process stock dispatches to sales channels
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
            <Package className="h-5 w-5" />
            Upload Outbound Excel File
          </CardTitle>
          <CardDescription>
            Select sales channel and upload your dispatch Excel file for processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Sales Channel</label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sales channel" />
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
                  Validating Stock...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Validate Stock
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
                    Process Dispatch
                  </>
                )}
              </Button>
            )}
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing outbound stock...</span>
                <span>60%</span>
              </div>
              <Progress value={60} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validationResults && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Stock Validation Results</CardTitle>
            <CardDescription>
              Review stock availability before processing dispatch to {selectedChannel}
            </CardDescription>
            <div className="flex gap-4 mt-2">
              <Badge variant="default">Available: {validCount}</Badge>
              <Badge variant="destructive">Insufficient: {errorCount}</Badge>
              <Badge variant="secondary">Low Stock: {warningCount}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Row</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Available</TableHead>
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
                    <TableCell className="text-destructive font-medium">
                      -{result.quantity}
                    </TableCell>
                    <TableCell className={
                      result.availableStock >= result.quantity ? "text-success" : "text-destructive"
                    }>
                      {result.availableStock}
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

      {/* Quick Stock Check */}
      <Card className="shadow-card bg-gradient-card">
        <CardHeader>
          <CardTitle>Quick Stock Check</CardTitle>
          <CardDescription>
            Current stock levels for popular items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { sku: "SAM-S23-128", product: "Samsung Galaxy S23", stock: 45, status: "high" },
              { sku: "APL-IP14P-256", product: "iPhone 14 Pro", stock: 25, status: "medium" },
              { sku: "SON-WH1000", product: "Sony WH-1000XM5", stock: 8, status: "low" }
            ].map((item) => (
              <div key={item.sku} className="p-4 rounded-lg border bg-surface">
                <div className="font-medium">{item.product}</div>
                <div className="text-sm text-muted-foreground font-mono">{item.sku}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-bold">{item.stock}</span>
                  <Badge 
                    variant={
                      item.status === "high" ? "default" : 
                      item.status === "medium" ? "secondary" : "destructive"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutboundStock;