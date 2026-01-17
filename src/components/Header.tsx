import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container px-4">
        <nav className="flex items-center justify-between h-14">
          <a href="/" className="text-lg font-semibold text-foreground">
            Le Guide Immobilier <span role="img" aria-label="Drapeau belge">🇧🇪</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center divide-x divide-border">
            <a href="#calculer" className="text-sm font-bold uppercase text-black dark:text-white hover:scale-105 hover:font-extrabold hover:bg-orange-400/40 px-3 py-2 rounded-md transition-all">
              Calculer
            </a>
            <a href="#verifier" className="text-sm font-bold uppercase text-black dark:text-white hover:scale-105 hover:font-extrabold hover:bg-orange-400/40 px-3 py-2 rounded-md transition-all">
              Vérifier
            </a>
            <a href="#rechercher" className="text-sm font-bold uppercase text-black dark:text-white hover:scale-105 hover:font-extrabold hover:bg-orange-400/40 px-3 py-2 rounded-md transition-all">
              Rechercher
            </a>
            <a href="#ressources" className="text-sm font-bold uppercase text-black dark:text-white hover:scale-105 hover:font-extrabold hover:bg-orange-400/40 px-3 py-2 rounded-md transition-all">
              Ressources
            </a>
            <a href="#trouver-mon-bien" className="text-sm font-bold uppercase text-black dark:text-white hover:scale-105 hover:font-extrabold hover:bg-orange-400/40 px-3 py-2 rounded-md transition-all">
              Trouver mon bien
            </a>
            <a href="#podcasts" className="text-sm font-bold uppercase text-black dark:text-white hover:scale-105 hover:font-extrabold hover:bg-orange-400/40 px-3 py-2 rounded-md transition-all">
              Podcasts
            </a>
            <a href="#creation" className="text-sm font-bold uppercase text-black dark:text-white hover:scale-105 hover:font-extrabold hover:bg-orange-400/40 px-3 py-2 rounded-md transition-all">
              Création
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
              <a href="#calculer" className="text-sm font-bold uppercase text-black dark:text-white hover:bg-orange-400/40 px-3 py-2 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                Calculer
              </a>
              <a href="#verifier" className="text-sm font-bold uppercase text-black dark:text-white hover:bg-orange-400/40 px-3 py-2 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                Vérifier
              </a>
              <a href="#rechercher" className="text-sm font-bold uppercase text-black dark:text-white hover:bg-orange-400/40 px-3 py-2 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                Rechercher
              </a>
              <a href="#ressources" className="text-sm font-bold uppercase text-black dark:text-white hover:bg-orange-400/40 px-3 py-2 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                Ressources
              </a>
              <a href="#trouver-mon-bien" className="text-sm font-bold uppercase text-black dark:text-white hover:bg-orange-400/40 px-3 py-2 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                Trouver mon bien
              </a>
              <a href="#podcasts" className="text-sm font-bold uppercase text-black dark:text-white hover:bg-orange-400/40 px-3 py-2 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                Podcasts
              </a>
              <a href="#creation" className="text-sm font-bold uppercase text-black dark:text-white hover:bg-orange-400/40 px-3 py-2 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                Création
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
