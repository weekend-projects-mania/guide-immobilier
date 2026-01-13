import { Home, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="container px-4">
        <nav className="flex items-center justify-between py-5">
          <a href="/" className="flex items-center gap-2">
            <div className="p-2 rounded-lg accent-gradient shadow-soft">
              <Home className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-serif text-xl font-bold text-primary-foreground">
              PropGuide
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#categories" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium">
              Categories
            </a>
            <a href="#resources" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium">
              Resources
            </a>
            <a
              href="#resources"
              className="px-5 py-2.5 rounded-lg accent-gradient text-accent-foreground font-semibold shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-primary-foreground"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-primary/95 backdrop-blur-lg border-t border-primary-foreground/10 animate-fade-in">
            <div className="container px-4 py-6 flex flex-col gap-4">
              <a
                href="#categories"
                onClick={() => setIsMenuOpen(false)}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium py-2"
              >
                Categories
              </a>
              <a
                href="#resources"
                onClick={() => setIsMenuOpen(false)}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-medium py-2"
              >
                Resources
              </a>
              <a
                href="#resources"
                onClick={() => setIsMenuOpen(false)}
                className="px-5 py-3 rounded-lg accent-gradient text-accent-foreground font-semibold text-center"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
