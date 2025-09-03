import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import Dashboard from "@/pages/Dashboard";
import InboundStock from "@/pages/stock/InboundStock";
import OutboundStock from "@/pages/stock/OutboundStock";
import Returns from "@/pages/stock/Returns";
import Reports from "@/pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="stock/inbound" element={<InboundStock />} />
            <Route path="stock/outbound" element={<OutboundStock />} />
            <Route path="stock/returns" element={<Returns />} />
            <Route path="reports" element={<Reports />} />
            {/* Placeholder routes for remaining pages */}
            <Route path="stock/adjustments" element={<Dashboard />} />
            <Route path="mapping" element={<Dashboard />} />
            <Route path="accounting" element={<Dashboard />} />
            <Route path="users" element={<Dashboard />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
