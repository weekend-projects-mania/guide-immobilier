import { Home, Search, TrendingUp } from "lucide-react";

const Hero = () => {
  return (
    <section className="hero-gradient min-h-[85vh] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container relative z-10 flex flex-col items-center justify-center min-h-[85vh] text-center px-4">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-8">
            <Home className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-primary-foreground">Your Real Estate Resource Hub</span>
          </div>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-fade-up [animation-delay:100ms] max-w-4xl leading-tight">
          Navigate Real Estate with{" "}
          <span className="text-gradient">Confidence</span>
        </h1>

        <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl animate-fade-up [animation-delay:200ms] font-light">
          Your curated guide to the best real estate resources online. From buying your first home to building an investment portfolio—we've got you covered.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-up [animation-delay:300ms]">
          <a
            href="#resources"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg accent-gradient text-accent-foreground font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <Search className="w-5 h-5" />
            Explore Resources
          </a>
          <a
            href="#categories"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground font-semibold text-lg border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all duration-300"
          >
            <TrendingUp className="w-5 h-5" />
            Browse Categories
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 md:gap-16 mt-16 animate-fade-up [animation-delay:400ms]">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-secondary mb-1">50+</div>
            <div className="text-sm text-primary-foreground/60">Resources</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-secondary mb-1">6</div>
            <div className="text-sm text-primary-foreground/60">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-secondary mb-1">Free</div>
            <div className="text-sm text-primary-foreground/60">Always</div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
