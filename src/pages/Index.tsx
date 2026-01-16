import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ResourceList from "@/components/ResourceList";
import SiteGrid from "@/components/SiteGrid";
import Footer from "@/components/Footer";

const calculerResources = [
  { name: "Notaire.be", url: "https://www.notaire.be/calculateurs/immobilier/calcul-de-frais-dacte-dachat-dun-bien-immobilier-et/ou-dun-terrain-batir", description: "Estimer les frais de \"notaire\" d'un bien immobilier (Wallonie/Bruxelles/Flandre)" },
  { name: "Guide-épargne.be", url: "https://www.guide-epargne.be/epargner/simulation-creditlogement.html#results", description: "Simuler son prêt hypothécaire" },
  { name: "Notaire.be", url: "https://www.notaire.be/calculateurs/immobilier/calcul-de-frais-dacte-de-credit-hypothecaire", description: "Estimer les frais d'acte de crédit hypothécaire" },
  { name: "Notaire.be", url: "https://www.notaire.be/calculateurs/immobilier/calcul-de-frais-dacte-dachat-lors-dune-vente-publique-en-ligne-biddit", description: "Estimer les frais d'acte d'achat pour une vente Biddit (enchère)" },
  { name: "Guide-épargne.be", url: "https://www.guide-epargne.be/epargner/comparez/frais-refinancement.html", description: "Estimer les frais de refinancement de votre crédit" },
  { name: "Notaire.be", url: "https://www.notaire.be/calculateurs/immobilier/calcul-de-frais-dacte-de-mainlevee-hypothecaire", description: "Estimer les frais d'acte de mainlevée hypothécaire" },
  { name: "Bruxelles Logement", url: "https://loyers.brussels/#step-1", description: "Calculer le loyer de référence à Bruxelles" },
  { name: "Wallonie Logement", url: "https://loyerswallonie.be/", description: "Grille des loyers en Wallonie" },
  { name: "Immoweb", url: "https://www.immoweb.be/fr/estimation-immobiliere/simulateur-prix/address", description: "Estimer la valeur d'un bien immobilier" },
  { name: "MyPension", url: "https://www.sfpd.fgov.be/fr/montant-de-la-pension/combien", description: "Calculer le montant de sa pension" },
];

const verifierResources = [
  { name: "Banque Nationale de Belgique (BNB)", url: "https://www.nbb.be/fr/centrales-des-credits/centrale-des-credits-aux-particuliers-ccp/consulter/informations-pour-les", description: "Consulter les crédits liés à mon nom" },
  { name: "Banque Nationale de Belgique (BNB)", url: "https://www.nbb.be/fr/centrale-des-bilans/consulter/consult", description: "Consulter les comptes annuels d'une entreprise" },
  { name: "Banque-Carrefour des Entreprises (BCE)", url: "https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html", description: "Vérifier si une entreprise est toujours active (et ses activités)" },
  { name: "ONSS", url: "https://www.checkobligationderetenue.be/", description: "Vérifier si une entreprise a des dettes sociales ou fiscales" },
];

const rechercherResources = [
  { name: "CadGis", url: "https://www.minfin.fgov.be/ecad-web/#/", description: "Voir le plan parcellaire cadastral Belge" },
  { name: "WalOnMap", url: "https://geoportail.wallonie.be/walonmap#BBOX=178892.28320951056,187848.44695517136,125813.219979472,129682.75896855#SHARE=91B6CCCDD457492DE053D0AFA49DA89D", description: "Voir le plan parcellaire cadastral Wallon" },
  { name: "GeoPunt", url: "https://www.geopunt.be/", description: "Voir le plan parcellaire cadastral Flamand" },
  { name: "BruGIS", url: "https://gis.urban.brussels/brugis/#/", description: "Outil de gestion de l'aménagement du territoire de Bruxelles" },
];

const ressourcesResources = [
  { name: "Wallonie Logement", url: "https://logement.wallonie.be/fr/bail/modeles-baux-annexes", description: "Modèles de contrats de bail - Wallonie" },
  { name: "Bruxelles Logement", url: "https://be.brussels/fr/logement/location/bail-dhabitation/contrat-de-bail-modeles-et-annexe", description: "Modèles de contrats de bail - Bruxelles" },
  { name: "SPF Finances", url: "https://fin.belgium.be/fr/particuliers/habitation/louer-donner-location/contrat-bail", description: "Enregistrer (ou consulter) un contrat de bail" },
  { name: "Wallonie Logement", url: "https://logement.wallonie.be/fr/page/aides-liees-a-la-realisation-de-travaux-de-renovation-et-economies-d-energie", description: "Voir le délai de traitement des primes en Wallonie" },
  { name: "OpenPermitsBrussels", url: "https://openpermits.brussels/", description: "Voir les permis octroyés à Bruxelles (vision des projets à venir)" },
];

const trouverMonBienSites = [
  { name: "Immoweb", url: "https://www.immoweb.be/fr" },
  { name: "Zimmo", url: "https://www.zimmo.be/fr/" },
  { name: "Immovlan", url: "https://www.immovlan.be/fr" },
  { name: "Notaire.be", url: "https://immo.notaire.be/fr/" },
  { name: "Realo", url: "https://www.realo.be/fr" },
  { name: "Biddit", url: "https://www.biddit.be/fr/landing", subtitle: "(enchères)" },
  { name: "Finimmoweb", url: "https://www.finimmoweb.be/fr", subtitle: "(enchères)" },
  { name: "Immoscoop", url: "https://www.immoscoop.be/fr" },
];

const podcastsSites = [
  { name: "Le Rdv Des Proprios", url: "https://open.spotify.com/show/4hq7fUqMCejfKrSn28Ickb" },
  { name: "Chez Bertrand", url: "https://open.spotify.com/show/5C4whIosYn1EiWfEYcHgky" },
  { name: "We Invest", url: "https://open.spotify.com/show/5UjxSE8spkot7FTRVWC1Ri" },
  { name: "Une brique après l'autre", url: "https://open.spotify.com/show/49ymRGXpQCPtHNvR3nMiwD" },
  { name: "Immo Passion", url: "https://open.spotify.com/show/0n94kkyuepoo8h60FGg7Ea" },
  { name: "Le Podcast Immobilier Belge", url: "https://open.spotify.com/show/2yIXZCRYYG8whCjvRUtqQm" },
  { name: "L'immobilier sans filtre", url: "https://open.spotify.com/show/3rzb1IM7ZqmfXBd8B6nApd" },
  { name: "Belgium Invest", url: "https://open.spotify.com/show/0OneRt2lDZdlrOrApBDz81" },
];

const creationSites = [
  { name: "Home By Me", url: "https://home.by.me/fr/", description: "Plans 3D" },
  { name: "Sweet Home 3D", url: "https://www.sweethome3d.com/fr/", description: "Plans 3D" },
  { name: "Houzz", url: "https://www.houzz.fr/", description: "Inspiration déco" },
  { name: "IKEA", url: "https://www.ikea.com/be/fr/planners/#72bfd7d0-1a4d-11e9-8dfd-b5e1e20c2465", description: "Outils de planification" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ResourceList id="calculer" title="Calculer" resources={calculerResources} />
        <ResourceList id="verifier" title="Vérifier" resources={verifierResources} />
        <ResourceList id="rechercher" title="Rechercher" resources={rechercherResources} />
        <ResourceList id="ressources" title="Ressources" resources={ressourcesResources} />
        <SiteGrid id="trouver-mon-bien" title="Trouver mon bien" sites={trouverMonBienSites} />
        <SiteGrid id="podcasts" title="Podcasts" sites={podcastsSites} />
        <SiteGrid id="creation" title="Création" sites={creationSites} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
