import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container px-4">
        <nav className="flex items-center justify-between h-14 gap-4">
          <a href="/" className="text-lg font-semibold text-foreground flex items-center gap-1 flex-shrink-0">
            Le <span className="bg-black text-white px-1">Guide</span> Immobilier
            <svg
              aria-label="Drapeau belge"
              className="inline-block w-5 h-4"
              viewBox="0 0 900 600"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="300" height="600" fill="#000" />
              <rect x="300" width="300" height="600" fill="#FAE042" />
              <rect x="600" width="300" height="600" fill="#ED2939" />
            </svg>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center divide-x divide-border flex-shrink-0">
            <a href="#calculer" className="text-sm font-medium text-black dark:text-white hover:scale-105 hover:font-bold hover:bg-orange-400/40 px-3 py-2 rounded-md transition-all">
              Calculer
            </a>
            <a href="#verifier" className="text-sm font-medium text-black dark:text-white hover:scale-105 hover:font-bold hover:bg-orange-400/40 px-3 py-2 rounded-md transition-all">
              Vérifier
            </a>
            <a href="#rechercher" className="text-sm font-medium text-black dark:text-white hover:scale-105 hover:font-bold hover:bg-orange-400/40 px-3 py-2 rounded-md transition-all">
              Rechercher
            </a>
            <a href="#ressources" className="text-sm font-medium text-black dark:text-white hover:scale-105 hover:font-bold hover:bg-orange-400/40 px-3 py-2 rounded-md transition-all">
              Ressources
            </a>
            <a href="#trouver-mon-bien" className="text-sm font-medium text-black dark:text-white hover:scale-105 hover:font-bold hover:bg-orange-400/40 px-3 py-2 rounded-md transition-all">
              Trouver mon bien
            </a>
            <a href="#medias" className="text-sm font-medium text-black dark:text-white hover:scale-105 hover:font-bold hover:bg-orange-400/40 px-3 py-2 rounded-md transition-all">
              Médias
            </a>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              <a href="#calculer" className="text-sm font-medium text-black dark:text-white hover:bg-orange-400/40 px-3 py-2 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                Calculer
              </a>
              <a href="#verifier" className="text-sm font-medium text-black dark:text-white hover:bg-orange-400/40 px-3 py-2 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                Vérifier
              </a>
              <a href="#rechercher" className="text-sm font-medium text-black dark:text-white hover:bg-orange-400/40 px-3 py-2 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                Rechercher
              </a>
              <a href="#ressources" className="text-sm font-medium text-black dark:text-white hover:bg-orange-400/40 px-3 py-2 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                Ressources
              </a>
              <a href="#trouver-mon-bien" className="text-sm font-medium text-black dark:text-white hover:bg-orange-400/40 px-3 py-2 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                Trouver mon bien
              </a>
              <a href="#medias" className="text-sm font-medium text-black dark:text-white hover:bg-orange-400/40 px-3 py-2 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                Médias
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
