import { Home, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="hero-gradient py-16">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg accent-gradient shadow-soft">
              <Home className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-serif text-xl font-bold text-primary-foreground">
              PropGuide
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a href="#categories" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Categories
            </a>
            <a href="#resources" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Resources
            </a>
            <a href="mailto:hello@example.com" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-secondary fill-current" /> for home seekers everywhere
          </p>
          <p className="text-primary-foreground/40 text-xs mt-2">
            © {new Date().getFullYear()} PropGuide. All external links are property of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
