import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Package, 
  PackageOpen, 
  RotateCcw, 
  Settings2, 
  FileText, 
  Calculator, 
  MapPin, 
  Users, 
  LogOut,
  ChevronDown,
  Warehouse
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock user data - in real app this would come from auth context
const mockUser = {
  name: "John Smith",
  role: "Supervisor",
  email: "john.smith@company.com",
  avatar: ""
};

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  }
];

const stockItems = [
  {
    title: "Inbound Stock",
    url: "/stock/inbound",
    icon: Package,
  },
  {
    title: "Outbound Stock", 
    url: "/stock/outbound",
    icon: PackageOpen,
  },
  {
    title: "Returns",
    url: "/stock/returns",
    icon: RotateCcw,
  },
  {
    title: "Adjustments",
    url: "/stock/adjustments", 
    icon: Settings2,
  }
];

const systemItems = [
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
  {
    title: "Stock Mapping",
    url: "/mapping",
    icon: MapPin,
  }
];

const adminItems = [
  {
    title: "Accounting",
    url: "/accounting",
    icon: Calculator,
    role: "Accounting"
  },
  {
    title: "User Management", 
    url: "/users",
    icon: Users,
    role: "Admin"
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const getNavClassName = (path: string) => {
    const baseClasses = "w-full justify-start transition-all duration-200";
    if (isActive(path)) {
      return `${baseClasses} bg-primary text-primary-foreground shadow-sm`;
    }
    return `${baseClasses} hover:bg-accent hover:text-accent-foreground`;
  };

  const handleLogout = () => {
    // In real app, handle logout logic here
    navigate("/login");
  };

  const canAccess = (requiredRole?: string) => {
    if (!requiredRole) return true;
    // Simple role check - in real app this would be more sophisticated
    if (requiredRole === "Admin") return mockUser.role === "Admin";
    if (requiredRole === "Accounting") return ["Admin", "Accounting"].includes(mockUser.role);
    return true;
  };

  return (
    <Sidebar className="border-r border-border bg-surface">
      {/* Header */}
      <div className="flex h-14 items-center border-b border-border px-4">
        <div className="flex items-center space-x-2">
          <Warehouse className="h-6 w-6 text-primary" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm">InventoryPro</span>
              <span className="text-xs text-muted-foreground">Stock Management</span>
            </div>
          )}
        </div>
        <div className="ml-auto">
          <SidebarTrigger />
        </div>
      </div>

      <SidebarContent className="px-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Stock Management */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Stock Management</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {stockItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>System</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Administration</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems
                .filter(item => canAccess(item.role))
                .map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-start p-2 h-auto"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={mockUser.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="ml-2 flex-1 text-left">
                  <div className="text-sm font-medium">{mockUser.name}</div>
                  <div className="text-xs text-muted-foreground">{mockUser.role}</div>
                </div>
              )}
              {!collapsed && <ChevronDown className="h-4 w-4 opacity-50" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}