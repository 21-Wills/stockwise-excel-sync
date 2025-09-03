import { useState } from "react";
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  Search,
  Filter,
  Download,
  Eye
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// Mock data
const statsData = [
  {
    title: "Total Stock Value",
    value: "R 2,456,890",
    description: "+12% from last month",
    icon: Package,
    trend: "up"
  },
  {
    title: "Low Stock Items",
    value: "23",
    description: "Requires attention",
    icon: AlertTriangle,
    trend: "warning"
  },
  {
    title: "Recent Movements",
    value: "156",
    description: "Last 24 hours",
    icon: Activity,
    trend: "neutral"
  },
  {
    title: "Stock Accuracy",
    value: "98.2%",
    description: "+0.3% this week",
    icon: TrendingUp,
    trend: "up"
  }
];

const recentMovements = [
  {
    id: "INV001", 
    product: "Samsung Galaxy S23",
    sku: "SAM-S23-128",
    category: "SU",
    type: "Inbound",
    quantity: 50,
    user: "John Smith",
    timestamp: "2 hours ago"
  },
  {
    id: "INV002",
    product: "iPhone 14 Pro",
    sku: "APL-IP14P-256", 
    category: "YA",
    type: "Outbound",
    quantity: -25,
    user: "Sarah Johnson",
    timestamp: "4 hours ago"
  },
  {
    id: "INV003",
    product: "Airpods Pro 2nd Gen",
    sku: "APL-APP2-WHT",
    category: "Chainstore", 
    type: "Return",
    quantity: 3,
    user: "Mike Wilson",
    timestamp: "6 hours ago"
  }
];

const lowStockItems = [
  {
    sku: "SAM-TAB-S9",
    product: "Samsung Tab S9",
    category: "PNP",
    current: 5,
    minimum: 20,
    status: "critical"
  },
  {
    sku: "APL-MW-BLK",
    product: "Apple Magic Mouse",
    category: "Parco",
    current: 12,
    minimum: 25,
    status: "low"
  },
  {
    sku: "SON-WH1000",
    product: "Sony WH-1000XM5",
    category: "SU",
    current: 8,
    minimum: 15,
    status: "low"
  }
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getStockBadgeColor = (status: string) => {
    switch (status) {
      case "critical": return "destructive";
      case "low": return "warning";
      default: return "secondary";
    }
  };

  const getMovementBadgeColor = (type: string) => {
    switch (type) {
      case "Inbound": return "success";
      case "Outbound": return "info";
      case "Return": return "warning";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your stock levels and recent activity
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Live View
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.trend === 'up' ? 'text-success' : stat.trend === 'warning' ? 'text-warning' : 'text-muted-foreground'}`}>
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Stock Movements */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle>Recent Stock Movements</CardTitle>
            <CardDescription>
              Latest inventory transactions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMovements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{movement.product}</div>
                        <Badge variant="outline" className="text-xs">
                          {movement.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {movement.sku}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getMovementBadgeColor(movement.type) as any}>
                        {movement.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={movement.quantity > 0 ? "text-success" : "text-destructive"}>
                      {movement.quantity > 0 ? "+" : ""}{movement.quantity}
                    </TableCell>
                    <TableCell>{movement.user}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {movement.timestamp}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Stock Alerts</CardTitle>
            <CardDescription>
              Items requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-surface-variant">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.product}</div>
                  <div className="text-sm text-muted-foreground font-mono">
                    {item.sku}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Current: {item.current} | Min: {item.minimum}
                  </div>
                </div>
                <div className="ml-2">
                  <Badge variant={getStockBadgeColor(item.status) as any}>
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used inventory operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Package className="h-6 w-6 mb-2" />
              Add Inbound
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Activity className="h-6 w-6 mb-2" />
              Process Outbound
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Stock Adjustment
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;