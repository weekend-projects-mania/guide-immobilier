import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import LeRdvDesPropriosLogo from "@/assets/Le_Rdv_Des_Proprios.jpg";
import ChezBertrandLogo from "@/assets/Chez_Bertrand.jpg";
import ConseilImmoLogo from "@/assets/Conseil_Immo_We_Invest.jpg";
import UneBriqueApresLautreLogo from "@/assets/Une_brique_apres_lautre.jpg";
import ImmoPassionLogo from "@/assets/Immo_Passion.jpg";
import PodcastImmobilierBelgeLogo from "@/assets/Podcast_Immobilier_Belge.jpg";
import ImmobilierSansFiltreLogo from "@/assets/Immobilier_sans_filtre.jpg";
import BelgiumInvestLogo from "@/assets/Belgium_invest.jpg";
import NotairesCOLogo from "@/assets/Notaires_CO.jpg";
import MonsieurImmoLogo from "@/assets/Monsieur_Immo.jpg";
import TutosImmoLogo from "@/assets/Tutos_Immo.jpg";
import UniquePironLogo from "@/assets/Unique_Piron_Construction.jpg";

interface Episode {
  rank: number;
  showName: string;
  episodeName: string;
  releaseDate: string;
  episodeUrl: string;
  showUrl: string;
}

interface LatestEpisodesResponse {
  episodes?: Episode[];
}

interface LatestEpisodesProps {
  limit?: number;
  showViewAllLink?: boolean;
}

const logoMap: Record<string, string> = {
  "Le Rdv Des Proprios": LeRdvDesPropriosLogo,
  "Chez Bertrand": ChezBertrandLogo,
  "Conseil Immo - by We Invest": ConseilImmoLogo,
  "Une brique après l'autre": UneBriqueApresLautreLogo,
  "Immo Passion": ImmoPassionLogo,
  "Le Podcast Immobilier Belge": PodcastImmobilierBelgeLogo,
  "L'immobilier sans filtre": ImmobilierSansFiltreLogo,
  "Belgium Invest": BelgiumInvestLogo,
  "Notaires&CO": NotairesCOLogo,
  "Monsieur Immo": MonsieurImmoLogo,
  "Tutos Immo de l'Echo": TutosImmoLogo,
  "Unique (Piron Construction)": UniquePironLogo,
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("fr-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const LatestEpisodes = ({ limit = 10, showViewAllLink = false }: LatestEpisodesProps) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchEpisodes = async () => {
      try {
        const response = await fetch("https://guideimmo.xc1.app/webhook/podcasts-latest");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data: LatestEpisodesResponse = await response.json();
        if (!cancelled) {
          setEpisodes((data.episodes || []).slice(0, limit));
          setError(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setEpisodes([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchEpisodes();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return (
    <section className="py-8">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold uppercase text-black dark:text-white">Derniers épisodes</h2>
          {showViewAllLink && (
            <Link
              to="/derniers-podcasts"
              className="text-sm font-medium text-primary hover:underline"
            >
              Voir tous les derniers épisodes →
            </Link>
          )}
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground">Chargement des derniers épisodes...</p>
        )}

        {error && !loading && (
          <p className="text-sm text-muted-foreground">
            Impossible de charger les épisodes pour le moment.
          </p>
        )}

        {!loading && !error && episodes.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun épisode disponible.</p>
        )}

        {!loading && !error && episodes.length > 0 && (
          <div className="border border-border rounded-lg divide-y divide-border bg-card">
            {episodes.map((episode, index) => {
              const isBlack = index % 2 === 0;
              const logoSrc = logoMap[episode.showName] || "/placeholder.svg";

              return (
                <a
                  key={`${episode.showName}-${episode.rank}-${index}`}
                  href={episode.episodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors group"
                >
                  <img
                    src={logoSrc}
                    alt={episode.showName}
                    className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-black dark:text-white group-hover:text-primary truncate">
                      {episode.episodeName}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {episode.showName} · {formatDate(episode.releaseDate)}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`ml-auto flex-shrink-0 hidden sm:inline-flex border transition-transform hover:scale-105 ${
                      isBlack
                        ? "bg-black text-white border-black hover:bg-black hover:text-white"
                        : "bg-white text-black border-black hover:bg-white hover:text-black"
                    }`}
                  >
                    Écouter
                  </Button>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestEpisodes;
