import { ExternalLink, Star } from "lucide-react";

const resources = [
  {
    name: "Zillow",
    description: "Search millions of homes for sale and rent, plus get Zestimates and local market data.",
    category: "Home Search",
    url: "https://www.zillow.com",
    featured: true,
  },
  {
    name: "Realtor.com",
    description: "Browse homes for sale from the most accurate real estate database in America.",
    category: "Home Search",
    url: "https://www.realtor.com",
    featured: true,
  },
  {
    name: "Redfin",
    description: "Real estate brokerage with AI-powered search and low commission fees.",
    category: "Home Search",
    url: "https://www.redfin.com",
    featured: false,
  },
  {
    name: "Bankrate",
    description: "Compare mortgage rates from multiple lenders and use financial calculators.",
    category: "Mortgages",
    url: "https://www.bankrate.com/mortgages/",
    featured: true,
  },
  {
    name: "NerdWallet",
    description: "Personal finance tools and guides for mortgages, home buying, and more.",
    category: "Finance",
    url: "https://www.nerdwallet.com/mortgages",
    featured: false,
  },
  {
    name: "BiggerPockets",
    description: "The largest community of real estate investors with forums, podcasts, and education.",
    category: "Investing",
    url: "https://www.biggerpockets.com",
    featured: true,
  },
  {
    name: "Investopedia Real Estate",
    description: "Comprehensive guides and education for real estate investing basics.",
    category: "Education",
    url: "https://www.investopedia.com/real-estate-4427792",
    featured: false,
  },
  {
    name: "NeighborhoodScout",
    description: "Detailed neighborhood data including crime rates, schools, and demographics.",
    category: "Research",
    url: "https://www.neighborhoodscout.com",
    featured: false,
  },
  {
    name: "Mashvisor",
    description: "Real estate investment analytics and rental property analysis tools.",
    category: "Investing",
    url: "https://www.mashvisor.com",
    featured: false,
  },
];

const FeaturedResources = () => {
  return (
    <section id="resources" className="py-20 md:py-28 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
            Featured
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Top Real Estate Resources
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hand-picked websites and tools trusted by real estate professionals and home buyers alike.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative card-gradient rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border/50"
            >
              {resource.featured && (
                <div className="absolute -top-2 -right-2 p-1.5 rounded-full accent-gradient shadow-lg">
                  <Star className="w-3.5 h-3.5 text-accent-foreground fill-current" />
                </div>
              )}
              
              <div className="flex items-start justify-between mb-3">
                <span className="inline-block px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                  {resource.category}
                </span>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {resource.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {resource.description}
              </p>
            </a>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            More resources coming soon. Have a suggestion?{" "}
            <a href="mailto:hello@example.com" className="text-primary hover:text-secondary transition-colors font-medium">
              Let us know
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedResources;
