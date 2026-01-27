import { useState, useRef, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// All searchable items for the search functionality
const searchableItems = [
  // Calculer
  { name: "Notaire.be - Frais d'achat", url: "https://www.notaire.be/calculateurs/immobilier/calcul-de-frais-dacte-dachat-dun-bien-immobilier-et/ou-dun-terrain-batir", category: "Calculer" },
  { name: "Guide-épargne.be - Prêt hypothécaire", url: "https://www.guide-epargne.be/epargner/simulation-creditlogement.html#results", category: "Calculer" },
  { name: "Notaire.be - Crédit hypothécaire", url: "https://www.notaire.be/calculateurs/immobilier/calcul-de-frais-dacte-de-credit-hypothecaire", category: "Calculer" },
  { name: "Notaire.be - Biddit", url: "https://www.notaire.be/calculateurs/immobilier/calcul-de-frais-dacte-dachat-lors-dune-vente-publique-en-ligne-biddit", category: "Calculer" },
  { name: "Guide-épargne.be - Refinancement", url: "https://www.guide-epargne.be/epargner/comparez/frais-refinancement.html", category: "Calculer" },
  { name: "Notaire.be - Mainlevée", url: "https://www.notaire.be/calculateurs/immobilier/calcul-de-frais-dacte-de-mainlevee-hypothecaire", category: "Calculer" },
  { name: "Bruxelles Logement - Loyer référence", url: "https://loyers.brussels/#step-1", category: "Calculer" },
  { name: "Wallonie Logement - Grille loyers", url: "https://loyerswallonie.be/", category: "Calculer" },
  { name: "Immoweb - Estimation", url: "https://www.immoweb.be/fr/estimation-immobiliere/simulateur-prix/address", category: "Calculer" },
  { name: "MyPension - Pension", url: "https://www.sfpd.fgov.be/fr/montant-de-la-pension/combien", category: "Calculer" },
  // Vérifier
  { name: "BNB - Crédits", url: "https://www.nbb.be/fr/centrales-des-credits/centrale-des-credits-aux-particuliers-ccp/consulter/informations-pour-les", category: "Vérifier" },
  { name: "Izimi - Actes notariés", url: "https://app.izimi.be/?lng=fr", category: "Vérifier" },
  { name: "BNB - Comptes annuels", url: "https://www.nbb.be/fr/centrale-des-bilans/consulter/consult", category: "Vérifier" },
  { name: "BCE - Entreprise active", url: "https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html", category: "Vérifier" },
  { name: "ONSS - Dettes sociales", url: "https://www.checkobligationderetenue.be/", category: "Vérifier" },
  { name: "SPW Energie - PEB Wallonie", url: "https://www.registrepeb.be/#/", category: "Vérifier" },
  { name: "Bruxelles environnement - PEB Bruxelles", url: "https://www.peb-epb.brussels/certificats-certificaten/", category: "Vérifier" },
  { name: "Checkdoc - Document identité", url: "https://www.checkdoc.be/CheckDoc/docstop.do", category: "Vérifier" },
  // Rechercher
  { name: "CadGis - Plan cadastral", url: "https://www.minfin.fgov.be/ecad-web/#/", category: "Rechercher" },
  { name: "WalOnMap - Cadastre Wallon", url: "https://geoportail.wallonie.be/walonmap", category: "Rechercher" },
  { name: "GeoPunt - Cadastre Flamand", url: "https://www.geopunt.be/", category: "Rechercher" },
  { name: "BruGIS - Bruxelles", url: "https://gis.urban.brussels/brugis/#/", category: "Rechercher" },
  { name: "Google Maps", url: "https://www.google.com/maps", category: "Rechercher" },
  { name: "Google Earth", url: "https://www.google.com/maps", category: "Rechercher" },
  { name: "Notaire.be - Trouver notaire", url: "https://www.notaire.be/notaire/recherchez", category: "Rechercher" },
  { name: "Statbel - Prix immobilier", url: "https://statbel.fgov.be/fr/themes/construction-logement/prix-de-limmobilier", category: "Rechercher" },
  // Ressources
  { name: "Wallonie Logement - Baux", url: "https://logement.wallonie.be/fr/bail/modeles-baux-annexes", category: "Ressources" },
  { name: "Bruxelles Logement - Baux", url: "https://be.brussels/fr/logement/location/bail-dhabitation/contrat-de-bail-modeles-et-annexe", category: "Ressources" },
  { name: "Pim.be - Modèles baux", url: "https://www.pim.be/nos-modeles-de-baux-gratuits/", category: "Ressources" },
  { name: "SPF Finances - Bail", url: "https://fin.belgium.be/fr/particuliers/habitation/louer-donner-location/contrat-bail", category: "Ressources" },
  { name: "Wallonie Logement - Primes", url: "https://logement.wallonie.be/fr/page/aides-liees-a-la-realisation-de-travaux-de-renovation-et-economies-d-energie", category: "Ressources" },
  { name: "OpenPermitsBrussels - Permis", url: "https://openpermits.brussels/", category: "Ressources" },
  { name: "Geoportail Wallonie - Permis", url: "https://geoportail.wallonie.be/catalogue/4572f901-7d5e-4fe6-931e-ac19c8fc04fe.html#Carte", category: "Ressources" },
  { name: "Wallonie Logement - Aides", url: "https://logement.wallonie.be/fr/aides", category: "Ressources" },
  { name: "Vlaanderen - Primes", url: "https://www.vlaanderen.be/premies-voor-renovatie/mijn-verbouwpremie", category: "Ressources" },
  { name: "Notaire.be - Offre achat", url: "https://www.notaire.be/actualites/modele-doffre-dachat-pour-la-wallonie-telecharger", category: "Ressources" },
  { name: "ORES - Reprise énergies", url: "https://media.ores.be/ores-cms/buyhje5t/document-de-reprise-des-energies.pdf", category: "Ressources" },
  { name: "Laboratoires mérule", url: "https://dromursec.be/traitements-humidite/traitement-merule/laboratoires/", category: "Ressources" },
  { name: "UWAIS - AIS Wallonie", url: "https://www.uwais.be/contactez-une-ais-carte/", category: "Ressources" },
  { name: "FEDAIS - AIS Bruxelles", url: "https://www.fedais.be/liste-des-ais-membres", category: "Ressources" },
  { name: "Bruxelles Environnement - Certificateurs PEB", url: "https://app.bruxellesenvironnement.be/listes/?nr_list=peb_010", category: "Ressources" },
  // Trouver mon bien
  { name: "Immoweb", url: "https://www.immoweb.be/fr", category: "Trouver mon bien" },
  { name: "Zimmo", url: "https://www.zimmo.be/fr/", category: "Trouver mon bien" },
  { name: "Immovlan", url: "https://www.immovlan.be/fr", category: "Trouver mon bien" },
  { name: "Notaire.be - Immo", url: "https://immo.notaire.be/fr/", category: "Trouver mon bien" },
  { name: "Realo", url: "https://www.realo.be/fr", category: "Trouver mon bien" },
  { name: "Biddit - Enchères", url: "https://www.biddit.be/fr/landing", category: "Trouver mon bien" },
  { name: "Finimmoweb - Enchères", url: "https://www.finimmoweb.be/fr", category: "Trouver mon bien" },
  { name: "Immoscoop", url: "https://www.immoscoop.be/fr", category: "Trouver mon bien" },
  // Médias - Podcasts
  { name: "Le Rdv Des Proprios", url: "https://open.spotify.com/show/4hq7fUqMCejfKrSn28Ickb", category: "Médias - Podcasts" },
  { name: "Chez Bertrand", url: "https://open.spotify.com/show/5C4whIosYn1EiWfEYcHgky", category: "Médias - Podcasts" },
  { name: "Conseil Immo - by We Invest", url: "https://open.spotify.com/show/5UjxSE8spkot7FTRVWC1Ri", category: "Médias - Podcasts" },
  { name: "Une brique après l'autre", url: "https://open.spotify.com/show/49ymRGXpQCPtHNvR3nMiwD", category: "Médias - Podcasts" },
  { name: "Immo Passion", url: "https://open.spotify.com/show/0n94kkyuepoo8h60FGg7Ea", category: "Médias - Podcasts" },
  { name: "Le Podcast Immobilier Belge", url: "https://open.spotify.com/show/2yIXZCRYYG8whCjvRUtqQm", category: "Médias - Podcasts" },
  { name: "L'immobilier sans filtre", url: "https://open.spotify.com/show/3rzb1IM7ZqmfXBd8B6nApd", category: "Médias - Podcasts" },
  { name: "Belgium Invest", url: "https://open.spotify.com/show/0OneRt2lDZdlrOrApBDz81", category: "Médias - Podcasts" },
  { name: "Notaires&CO", url: "https://open.spotify.com/show/3HPje2chSWx7BQWCgZISuv", category: "Médias - Podcasts" },
  { name: "Monsieur Immo", url: "https://open.spotify.com/show/1iuMweZJ2Qm6MZ5rXgoYsM", category: "Médias - Podcasts" },
  { name: "Tutos Immo de l'Echo", url: "https://open.spotify.com/show/2gno4XSFySbOcrWmbBsP7T", category: "Médias - Podcasts" },
  { name: "Unique (Piron Construction)", url: "https://open.spotify.com/show/62kWVwJUsuYdP2edDZiPiv", category: "Médias - Podcasts" },
  // Médias - Communautés
  { name: "Le Rdv Des Proprios - WhatsApp", url: "https://chat.whatsapp.com/JIyOOfIkwNiFMl2ukIt5ai", category: "Médias - Communautés" },
  { name: "Immo Passion - WhatsApp", url: "https://chat.whatsapp.com/BYwpls3CXIbKPlWUSwAPkc", category: "Médias - Communautés" },
  { name: "PIM.be - Forum", url: "https://www.forum.pim.be", category: "Médias - Communautés" },
  { name: "BricoZone.be - Forum", url: "https://www.bricozone.be", category: "Médias - Communautés" },
  // Médias - Création
  { name: "Home By Me - Plans 3D", url: "https://home.by.me/fr/", category: "Médias - Création" },
  { name: "Sweet Home 3D - Plans 3D", url: "https://www.sweethome3d.com/fr/", category: "Médias - Création" },
  { name: "Houzz - Inspiration déco", url: "https://www.houzz.fr/", category: "Médias - Création" },
  { name: "IKEA - Planification", url: "https://www.ikea.com/be/fr/planners/", category: "Médias - Création" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredResults = searchQuery.length > 0 
    ? searchableItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

          {/* Search Bar - Desktop */}
          <div ref={searchRef} className="hidden md:flex relative flex-1 max-w-xs">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="pl-9 h-9 bg-white dark:bg-black border-black dark:border-white text-black dark:text-white placeholder:text-muted-foreground"
              />
            </div>
            {isSearchFocused && filteredResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                {filteredResults.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col px-3 py-2 hover:bg-accent/50 transition-colors"
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchFocused(false);
                    }}
                  >
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.category}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

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
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white dark:bg-black border-black dark:border-white text-black dark:text-white"
              />
              {searchQuery.length > 0 && filteredResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  {filteredResults.map((item, index) => (
                    <a
                      key={index}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col px-3 py-2 hover:bg-accent/50 transition-colors"
                      onClick={() => {
                        setSearchQuery("");
                        setIsMenuOpen(false);
                      }}
                    >
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.category}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
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
