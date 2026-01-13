import { Home, DollarSign, TrendingUp, Building2, FileText, BarChart3 } from "lucide-react";

const categories = [
  {
    icon: Home,
    title: "Buying a Home",
    description: "First-time buyer guides, mortgage calculators, and home search platforms",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: DollarSign,
    title: "Selling Property",
    description: "Listing services, pricing tools, and seller resources",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: TrendingUp,
    title: "Real Estate Investing",
    description: "Investment analysis, rental property tools, and REIT information",
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    icon: Building2,
    title: "Mortgages & Financing",
    description: "Lender comparisons, rate trackers, and loan calculators",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: FileText,
    title: "Legal & Compliance",
    description: "Contract templates, legal guides, and regulatory resources",
    color: "bg-rose-500/10 text-rose-600",
  },
  {
    icon: BarChart3,
    title: "Market Data & Research",
    description: "Market trends, neighborhood stats, and price analysis",
    color: "bg-cyan-500/10 text-cyan-600",
  },
];

const Categories = () => {
  return (
    <section id="categories" className="py-20 md:py-28">
      <div className="container px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-medium mb-4">
            Categories
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Find What You Need
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our carefully curated categories to find the perfect resources for your real estate journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <a
              key={category.title}
              href="#resources"
              className="group card-gradient rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex p-3 rounded-lg ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {category.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
