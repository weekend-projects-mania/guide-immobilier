import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import VerifierEntreprise from "./pages/VerifierEntreprise";
import CalculateurFraisNotaire from "./pages/CalculateurFraisNotaire";
import DerniersPodcasts from "./pages/DerniersPodcasts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/verifier-entreprise" element={<VerifierEntreprise />} />
          <Route path="/calculateur-frais-notaire" element={<CalculateurFraisNotaire />} />
          <Route path="/derniers-podcasts" element={<DerniersPodcasts />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
