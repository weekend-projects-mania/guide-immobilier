import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ResourceList from "@/components/ResourceList";
import Footer from "@/components/Footer";

const calculerResources = [
  { name: "Zillow", url: "https://www.zillow.com", description: "Search homes for sale with Zestimate values" },
  { name: "Realtor.com", url: "https://www.realtor.com", description: "MLS listings and home search" },
  { name: "Redfin", url: "https://www.redfin.com", description: "Real estate brokerage with low fees" },
  { name: "Trulia", url: "https://www.trulia.com", description: "Neighborhood insights and listings" },
];

const verifierResources = [
  { name: "Opendoor", url: "https://www.opendoor.com", description: "Instant cash offers for your home" },
  { name: "Offerpad", url: "https://www.offerpad.com", description: "iBuyer home selling platform" },
  { name: "FSBO.com", url: "https://www.fsbo.com", description: "For sale by owner listings" },
];

const rechercherResources = [
  { name: "BiggerPockets", url: "https://www.biggerpockets.com", description: "Real estate investing community and education" },
  { name: "Mashvisor", url: "https://www.mashvisor.com", description: "Investment property analytics" },
  { name: "Roofstock", url: "https://www.roofstock.com", description: "Buy and sell rental properties" },
  { name: "Fundrise", url: "https://www.fundrise.com", description: "Real estate crowdfunding platform" },
];

const ressourcesResources = [
  { name: "Bankrate", url: "https://www.bankrate.com/mortgages/", description: "Compare mortgage rates" },
  { name: "NerdWallet", url: "https://www.nerdwallet.com/mortgages", description: "Mortgage guides and calculators" },
  { name: "LendingTree", url: "https://www.lendingtree.com", description: "Compare lenders and rates" },
  { name: "Rocket Mortgage", url: "https://www.rocketmortgage.com", description: "Online mortgage lender" },
];

const financerResources = [
  { name: "NeighborhoodScout", url: "https://www.neighborhoodscout.com", description: "Crime, schools, and demographics data" },
  { name: "Investopedia Real Estate", url: "https://www.investopedia.com/real-estate-4427792", description: "Educational articles and guides" },
  { name: "Census Bureau", url: "https://data.census.gov", description: "Official demographic data" },
  { name: "FRED Housing Data", url: "https://fred.stlouisfed.org/categories/97", description: "Federal Reserve housing statistics" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ResourceList id="calculer" title="Calculer" resources={calculerResources} />
        <ResourceList id="verifier" title="Vérifier" resources={verifierResources} />
        <ResourceList id="rechercher" title="Rechercher" resources={rechercherResources} />
        <ResourceList id="ressources" title="Ressources" resources={ressourcesResources} />
        <ResourceList id="financer" title="Financer" resources={financerResources} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
