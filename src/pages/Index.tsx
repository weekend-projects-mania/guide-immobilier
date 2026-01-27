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
  { name: "Izimi - par Fednot", url: "https://app.izimi.be/?lng=fr", description: "Retrouver les actes notariés liés à mon nom" },
  { name: "Banque Nationale de Belgique (BNB)", url: "https://www.nbb.be/fr/centrale-des-bilans/consulter/consult", description: "Consulter les comptes annuels d'une entreprise" },
  { name: "Banque-Carrefour des Entreprises (BCE)", url: "https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html", description: "Vérifier si une entreprise est toujours active (et ses activités)" },
  { name: "ONSS", url: "https://www.checkobligationderetenue.be/", description: "Vérifier si une entreprise a des dettes sociales ou fiscales" },
  { name: "SPW Energie", url: "https://www.registrepeb.be/#/", description: "Registre des certificats PEB - Wallonie" },
  { name: "Bruxelles environnement", url: "https://www.peb-epb.brussels/certificats-certificaten/", description: "Registre des certificats PEB - Bruxelles" },
  { name: "Checkdoc (SPF Intérieur)", url: "https://www.checkdoc.be/CheckDoc/docstop.do", description: "Voir si un document d'identité est volé, perdu, périmé ou non valide", addedAt: "2026-01-27" },
];

const rechercherResources = [
  { name: "CadGis", url: "https://www.minfin.fgov.be/ecad-web/#/", description: "Voir le plan parcellaire cadastral Belge" },
  { name: "WalOnMap", url: "https://geoportail.wallonie.be/walonmap#BBOX=178892.28320951056,187848.44695517136,125813.219979472,129682.75896855#SHARE=91B6CCCDD457492DE053D0AFA49DA89D", description: "Voir le plan parcellaire cadastral Wallon" },
  { name: "GeoPunt", url: "https://www.geopunt.be/", description: "Voir le plan parcellaire cadastral Flamand" },
  { name: "BruGIS", url: "https://gis.urban.brussels/brugis/#/", description: "Outil de gestion de l'aménagement du territoire de Bruxelles" },
  { name: "Google Maps", url: "https://www.google.com/maps", description: "Visualiser une adresse et son quartier (cartographie et StreetVue)" },
  { name: "Google Earth", url: "https://www.google.com/maps", description: "Visualiser une adresse et son quartier (vue aérienne)" },
  { name: "Notaire.be", url: "https://www.notaire.be/notaire/recherchez", description: "Trouver un notaire près de chez soi" },
  { name: "Statbel", url: "https://statbel.fgov.be/fr/themes/construction-logement/prix-de-limmobilier", description: "Statistiques sur le prix de l'immobilier par communes / provinces / régions" },
];

const ressourcesResources = [
  { name: "Wallonie Logement", url: "https://logement.wallonie.be/fr/bail/modeles-baux-annexes", description: "Modèles de contrats de bail - Wallonie" },
  { name: "Bruxelles Logement", url: "https://be.brussels/fr/logement/location/bail-dhabitation/contrat-de-bail-modeles-et-annexe", description: "Modèles de contrats de bail - Bruxelles" },
  { name: "Pim.be", url: "https://www.pim.be/nos-modeles-de-baux-gratuits/", description: "Large gamme de modèles de baux - Belgique", addedAt: "2026-01-27" },
  { name: "SPF Finances", url: "https://fin.belgium.be/fr/particuliers/habitation/louer-donner-location/contrat-bail", description: "Enregistrer (ou consulter) un contrat de bail" },
  { name: "Wallonie Logement", url: "https://logement.wallonie.be/fr/page/aides-liees-a-la-realisation-de-travaux-de-renovation-et-economies-d-energie", description: "Voir le délai de traitement des primes en Wallonie" },
  { name: "OpenPermitsBrussels", url: "https://openpermits.brussels/", description: "Voir les permis octroyés à Bruxelles (vision des projets à venir)" },
  { name: "Geoportail Wallonie", url: "https://geoportail.wallonie.be/catalogue/4572f901-7d5e-4fe6-931e-ac19c8fc04fe.html#Carte", description: "Voir les permis d'urbanisation et lotissements en Wallonie", addedAt: "2026-01-27" },
  { name: "Wallonie Logement", url: "https://logement.wallonie.be/fr/aides", description: "Aides et primes de la région Wallonne" },
  { name: "Vlaanderen", url: "https://www.vlaanderen.be/premies-voor-renovatie/mijn-verbouwpremie", description: "Aides et primes de la région Flamande" },
  { name: "Notaire.be", url: "https://www.notaire.be/actualites/modele-doffre-dachat-pour-la-wallonie-telecharger", description: "Modèle d'une offre d'achat - Wallonie" },
  { name: "ORES", url: "https://media.ores.be/ores-cms/buyhje5t/document-de-reprise-des-energies.pdf", description: "Document de reprise des énergies (gaz et/ou électricité)" },
  { name: "Dromursec.be", url: "https://dromursec.be/traitements-humidite/traitement-merule/laboratoires/", description: "Liste de laboratoires d'analyse des champignons (dont mérule)", addedAt: "2026-01-27" },
  { name: "Union Wallonne des Agences Immobilières Sociales (UWAIS)", url: "https://www.uwais.be/contactez-une-ais-carte/", description: "Liste des Agences Immobilières Sociales (AIS) en Wallonie", addedAt: "2026-01-27" },
  { name: "Fédération des Agences Immobilières Sociales de Bruxelles (FEDAIS)", url: "https://www.fedais.be/liste-des-ais-membres", description: "Liste des Agences Immobilières Sociales (AIS) à Bruxelles", addedAt: "2026-01-27" },
  { name: "Bruxelles Environnement", url: "https://app.bruxellesenvironnement.be/listes/?nr_list=peb_010", description: "Liste des certificateurs PEB à Bruxelles", addedAt: "2026-01-27" },
];

const trouverMonBienSites = [
  { name: "Immoweb", url: "https://www.immoweb.be/fr" },
  { name: "Zimmo", url: "https://www.zimmo.be/fr/" },
  { name: "Immovlan", url: "https://www.immovlan.be/fr", logoUrl: "https://www.immovlan.be/favicon.ico" },
  { name: "Notaire.be", url: "https://immo.notaire.be/fr/" },
  { name: "Realo", url: "https://www.realo.be/fr" },
  { name: "Biddit", url: "https://www.biddit.be/fr/landing", subtitle: "(enchères)" },
  { name: "Finimmoweb", url: "https://www.finimmoweb.be/fr", subtitle: "(enchères)" },
  { name: "Immoscoop", url: "https://www.immoscoop.be/fr" },
];

import LeRdvDesPropriosLogo from "@/assets/Le_Rdv_Des_Proprios.jpg";
import ChezBertrandLogo from "@/assets/Chez_Bertrand.jpg";
import ConseilImmoLogo from "@/assets/Conseil_Immo_We_Invest.jpg";
import UneBriqueApresLautreLogo from "@/assets/Une_brique_apres_lautre.jpg";
import ImmoPassionLogo from "@/assets/Immo_Passion.jpg";
import PodcastImmobilierBelgeLogo from "@/assets/Podcast_Immobilier_Belge.jpg";
import ImmobilierSansFiltreLogo from "@/assets/Immobilier_sans_filtre.jpg";
import BelgiumInvestLogo from "@/assets/Belgium_invest.jpg";
import SweetHome3DLogo from "@/assets/SweetHome3DLogo.png";
import NotairesCOLogo from "@/assets/Notaires_CO.jpg";
import MonsieurImmoLogo from "@/assets/Monsieur_Immo.jpg";
import TutosImmoLogo from "@/assets/Tutos_Immo.jpg";
import UniquePironLogo from "@/assets/Unique_Piron_Construction.jpg";
import ImmoPassionWhatsAppLogo from "@/assets/Immo_Passion_WhatsApp.jpg";
import BricoZoneLogo from "@/assets/Brico_Zone.jpg";

const podcastsSites = [
  { name: "Le Rdv Des Proprios", url: "https://open.spotify.com/show/4hq7fUqMCejfKrSn28Ickb", logoUrl: LeRdvDesPropriosLogo },
  { name: "Chez Bertrand", url: "https://open.spotify.com/show/5C4whIosYn1EiWfEYcHgky", logoUrl: ChezBertrandLogo },
  { name: "Conseil Immo - by We Invest", url: "https://open.spotify.com/show/5UjxSE8spkot7FTRVWC1Ri", logoUrl: ConseilImmoLogo },
  { name: "Une brique après l'autre", url: "https://open.spotify.com/show/49ymRGXpQCPtHNvR3nMiwD", logoUrl: UneBriqueApresLautreLogo },
  { name: "Immo Passion", url: "https://open.spotify.com/show/0n94kkyuepoo8h60FGg7Ea", logoUrl: ImmoPassionLogo },
  { name: "Le Podcast Immobilier Belge", url: "https://open.spotify.com/show/2yIXZCRYYG8whCjvRUtqQm", logoUrl: PodcastImmobilierBelgeLogo },
  { name: "L'immobilier sans filtre", url: "https://open.spotify.com/show/3rzb1IM7ZqmfXBd8B6nApd", logoUrl: ImmobilierSansFiltreLogo },
  { name: "Belgium Invest", url: "https://open.spotify.com/show/0OneRt2lDZdlrOrApBDz81", logoUrl: BelgiumInvestLogo },
  { name: "Notaires&CO", url: "https://open.spotify.com/show/3HPje2chSWx7BQWCgZISuv", logoUrl: NotairesCOLogo, addedAt: "2026-01-27" },
  { name: "Monsieur Immo", url: "https://open.spotify.com/show/1iuMweZJ2Qm6MZ5rXgoYsM", logoUrl: MonsieurImmoLogo, addedAt: "2026-01-27" },
  { name: "Tutos Immo de l'Echo", url: "https://open.spotify.com/show/2gno4XSFySbOcrWmbBsP7T", logoUrl: TutosImmoLogo, addedAt: "2026-01-27" },
  { name: "Unique (Piron Construction)", url: "https://open.spotify.com/show/62kWVwJUsuYdP2edDZiPiv", logoUrl: UniquePironLogo, addedAt: "2026-01-27" },
];

import PIMbeLogo from "@/assets/PIM_be.jpg";

const communautesSites = [
  { name: "Le Rdv Des Proprios", url: "https://chat.whatsapp.com/JIyOOfIkwNiFMl2ukIt5ai", subtitle: "(WhatsApp)", logoUrl: LeRdvDesPropriosLogo, addedAt: "2026-01-27" },
  { name: "Immo Passion", url: "https://chat.whatsapp.com/BYwpls3CXIbKPlWUSwAPkc", subtitle: "(WhatsApp)", logoUrl: ImmoPassionWhatsAppLogo, addedAt: "2026-01-27" },
  { name: "PIM.be", url: "https://www.forum.pim.be", subtitle: "(Forum web)", logoUrl: PIMbeLogo, addedAt: "2026-01-27" },
  { name: "BricoZone.be", url: "https://www.bricozone.be", subtitle: "(Forum web)", logoUrl: BricoZoneLogo, addedAt: "2026-01-27" },
];

const creationSites = [
  { name: "Home By Me", url: "https://home.by.me/fr/", subtitle: "(Plans 3D)" },
  { name: "Sweet Home 3D", url: "https://www.sweethome3d.com/fr/", subtitle: "(Plans 3D)", logoUrl: SweetHome3DLogo },
  { name: "Houzz", url: "https://www.houzz.fr/", subtitle: "(Inspiration déco)" },
  { name: "IKEA", url: "https://www.ikea.com/be/fr/planners/#72bfd7d0-1a4d-11e9-8dfd-b5e1e20c2465", subtitle: "(Outils de planification)" },
];

const aVenirItems = [
  { name: "Articles" },
  { name: "Lexique" },
  { name: "Livres" },
  { name: "Outils" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <main>
        <ResourceList id="calculer" title="Calculer" resources={calculerResources} />
        <ResourceList id="verifier" title="Vérifier" resources={verifierResources} />
        <ResourceList id="rechercher" title="Rechercher" resources={rechercherResources} />
        <ResourceList id="ressources" title="Ressources" resources={ressourcesResources} />
        <SiteGrid id="trouver-mon-bien" title="Trouver mon bien" sites={trouverMonBienSites} />
        
        {/* Médias Section */}
        <div id="medias">
          <SiteGrid id="medias-podcasts" title="Médias - Podcasts" sites={podcastsSites} />
          <SiteGrid id="medias-communautes" title="Médias - Communautés" sites={communautesSites} />
          <SiteGrid id="medias-creation" title="Médias - Création" sites={creationSites} />
        </div>
        
        {/* Section À venir */}
        <section id="a-venir" className="py-8">
          <div className="container px-4">
            <h2 className="text-lg font-bold uppercase text-black dark:text-white mb-4">À venir</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {aVenirItems.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col items-center justify-center p-6 border border-border rounded-lg bg-card opacity-60"
                >
                  <span className="text-sm font-medium text-foreground text-center">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;