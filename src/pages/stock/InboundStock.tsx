import { useState, useRef } from "react";
import { Upload, Download, CheckCircle, XCircle, AlertTriangle, FileText } from "lucide-react";
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

const categories = ["SU", "YA", "Chainstore", "Parco", "PNP", "Parco Food"];

// Mock validation results
const mockValidationResults = [
  {
    row: 1,
    sku: "SAM-S23-128",
    product: "Samsung Galaxy S23 128GB",
    quantity: 50,
    status: "valid",
    message: ""
  },
  {
    row: 2,
    sku: "APL-IP14P-256",
    product: "iPhone 14 Pro 256GB",
    quantity: 25,
    status: "valid",
    message: ""
  },
  {
    row: 3,
    sku: "INVALID-SKU",
    product: "Unknown Product",
    quantity: 10,
    status: "error",
    message: "SKU not found in system"
  },
  {
    row: 4,
    sku: "SON-WH1000",
    product: "Sony WH-1000XM5",
    quantity: 0,
    status: "warning",
    message: "Zero quantity detected"
  }
];

const InboundStock = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
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
    if (!uploadedFile || !selectedCategory) {
      toast({
        title: "Missing information",
        description: "Please select a file and category first",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    // Simulate validation process
    setTimeout(() => {
      setValidationResults(mockValidationResults);
      setIsValidating(false);
      toast({
        title: "Validation complete",
        description: "File has been validated. Review results before committing.",
      });
    }, 2000);
  };

  const handleCommit = async () => {
    if (!validationResults) return;

    const validRows = validationResults.filter(r => r.status === "valid").length;
    
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setUploadedFile(null);
      setValidationResults(null);
      setSelectedCategory("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      toast({
        title: "Stock updated",
        description: `${validRows} items have been added to inventory`,
      });
    }, 3000);
  };

  const downloadTemplate = () => {
    toast({
      title: "Template downloading",
      description: "Excel template will be downloaded shortly",
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
          <h1 className="text-3xl font-bold text-foreground">Inbound Stock</h1>
          <p className="text-muted-foreground">
            Upload and process incoming stock deliveries
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
          <CardTitle>Upload Inbound Excel File</CardTitle>
          <CardDescription>
            Select category and upload your inbound stock Excel file for processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Stock Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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
              disabled={!uploadedFile || !selectedCategory || isValidating}
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
                  Validate File
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
                    Commit Changes
                  </>
                )}
              </Button>
            )}
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing stock updates...</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validationResults && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Validation Results</CardTitle>
            <CardDescription>
              Review the validation results before committing changes
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
                    <TableCell>{result.quantity}</TableCell>
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
    </div>
  );
};

export default InboundStock;