import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container px-4">
        <nav className="flex items-center justify-between h-14">
          <a href="/" className="text-lg font-semibold text-foreground">
            Guide Immobilier
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#calculer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Calculer
            </a>
            <a href="#verifier" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Vérifier
            </a>
            <a href="#rechercher" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Rechercher
            </a>
            <a href="#ressources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Ressources
            </a>
            <a href="#financer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Financer
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
              <a href="#calculer" onClick={() => setIsMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                Calculer
              </a>
              <a href="#verifier" onClick={() => setIsMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                Vérifier
              </a>
              <a href="#rechercher" onClick={() => setIsMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                Rechercher
              </a>
              <a href="#ressources" onClick={() => setIsMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                Ressources
              </a>
              <a href="#financer" onClick={() => setIsMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                Financer
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
