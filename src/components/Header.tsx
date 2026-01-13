import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container px-4">
        <nav className="flex items-center justify-between h-14">
          <a href="/" className="text-lg font-semibold text-foreground">
            Real Estate Links
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#buying" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Buying
            </a>
            <a href="#selling" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Selling
            </a>
            <a href="#investing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Investing
            </a>
            <a href="#mortgages" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Mortgages
            </a>
            <a href="#research" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Research
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              <a href="#buying" onClick={() => setIsMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                Buying
              </a>
              <a href="#selling" onClick={() => setIsMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                Selling
              </a>
              <a href="#investing" onClick={() => setIsMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                Investing
              </a>
              <a href="#mortgages" onClick={() => setIsMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                Mortgages
              </a>
              <a href="#research" onClick={() => setIsMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                Research
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
