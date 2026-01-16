import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container px-4">
        <nav className="flex items-center justify-between h-14">
          <a href="/" className="text-lg font-semibold text-foreground">
            Le Guide Immobilier 🇧🇪
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center divide-x divide-border">
            <a href="#calculer" className="text-sm text-muted-foreground hover:text-foreground hover:font-bold hover:scale-105 hover:bg-amber-100 dark:hover:bg-amber-900/30 px-3 py-2 transition-all">
              Calculer
            </a>
            <a href="#verifier" className="text-sm text-muted-foreground hover:text-foreground hover:font-bold hover:scale-105 hover:bg-amber-100 dark:hover:bg-amber-900/30 px-3 py-2 transition-all">
              Vérifier
            </a>
            <a href="#rechercher" className="text-sm text-muted-foreground hover:text-foreground hover:font-bold hover:scale-105 hover:bg-amber-100 dark:hover:bg-amber-900/30 px-3 py-2 transition-all">
              Rechercher
            </a>
            <a href="#ressources" className="text-sm text-muted-foreground hover:text-foreground hover:font-bold hover:scale-105 hover:bg-amber-100 dark:hover:bg-amber-900/30 px-3 py-2 transition-all">
              Ressources
            </a>
            <a href="#trouver-mon-bien" className="text-sm text-muted-foreground hover:text-foreground hover:font-bold hover:scale-105 hover:bg-amber-100 dark:hover:bg-amber-900/30 px-3 py-2 transition-all">
              Trouver mon bien
            </a>
            <a href="#podcasts" className="text-sm text-muted-foreground hover:text-foreground hover:font-bold hover:scale-105 hover:bg-amber-100 dark:hover:bg-amber-900/30 px-3 py-2 transition-all">
              Podcasts
            </a>
            <a href="#creation" className="text-sm text-muted-foreground hover:text-foreground hover:font-bold hover:scale-105 hover:bg-amber-100 dark:hover:bg-amber-900/30 px-3 py-2 transition-all">
              Création
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
            <div className="flex flex-col divide-y divide-border">
              <a href="#calculer" onClick={() => setIsMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground hover:font-bold hover:scale-105 hover:bg-amber-100 dark:hover:bg-amber-900/30 px-3 py-2 transition-all">
                Calculer
              </a>
              <a href="#verifier" onClick={() => setIsMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground hover:font-bold hover:scale-105 hover:bg-amber-100 dark:hover:bg-amber-900/30 px-3 py-2 transition-all">
                Vérifier
              </a>
              <a href="#rechercher" onClick={() => setIsMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground hover:font-bold hover:scale-105 hover:bg-amber-100 dark:hover:bg-amber-900/30 px-3 py-2 transition-all">
                Rechercher
              </a>
              <a href="#ressources" onClick={() => setIsMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground hover:font-bold hover:scale-105 hover:bg-amber-100 dark:hover:bg-amber-900/30 px-3 py-2 transition-all">
                Ressources
              </a>
              <a href="#trouver-mon-bien" onClick={() => setIsMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground hover:font-bold hover:scale-105 hover:bg-amber-100 dark:hover:bg-amber-900/30 px-3 py-2 transition-all">
                Trouver mon bien
              </a>
              <a href="#podcasts" onClick={() => setIsMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground hover:font-bold hover:scale-105 hover:bg-amber-100 dark:hover:bg-amber-900/30 px-3 py-2 transition-all">
                Podcasts
              </a>
              <a href="#creation" onClick={() => setIsMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground hover:font-bold hover:scale-105 hover:bg-amber-100 dark:hover:bg-amber-900/30 px-3 py-2 transition-all">
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
