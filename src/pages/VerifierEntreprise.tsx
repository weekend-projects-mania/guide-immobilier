import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CheckResult {
  success: true;
  name: string;
  status: string;
  legal_situation: string;
  entity_type: string;
  cbe_number_formatted: string;
  start_date: string;
  nace_activities: { code: string; description: string; classification: string }[];
}


interface CheckError {
  success: false;
  error: string;
}

type ApiResponse = CheckResult | CheckError;

interface PublicationEvent {
  event_type: string;
  summary?: string | null;
}

interface Publication {
  publication_date: string;
  publication_type: string;
  document_url: string;
  event: PublicationEvent | null;
}

interface PublicationsResponse {
  success: boolean;
  count?: number;
  total_count?: number;
  publications?: Publication[];
}

interface BnbLatestDeposit {
  referenceNumber: string;
  depositDate: string;
  exerciseStart: string | null;
  exerciseEnd: string | null;
  language: string;
  depositType: string;
  pdfUrl: string;
}

interface BnbResponse {
  hasDeposits: boolean;
  latest: BnbLatestDeposit | null;
  totalDeposits: number;
}

const EVENT_LABELS: Record<string, string> = {
  CREATION: "Création",
  NOMINATION: "Nomination",
  DEMISSION: "Démission",
  CHANGEMENT_SIEGE: "Changement de siège",
  MODIFICATION_STATUTS: "Modification des statuts",
  CAPITAL: "Capital",
  TRANSFORMATION: "Transformation",
  FUSION: "Fusion",
  SCISSION: "Scission",
  DISSOLUTION: "Dissolution",
  LIQUIDATION: "Liquidation",
  CESSATION: "Cessation",
  AUTRE: "Autre publication",
};

const normalizeNumber = (raw: string): string => {
  let cleaned = raw.trim().toUpperCase();
  if (cleaned.startsWith("BE")) {
    cleaned = cleaned.slice(2);
  }
  return cleaned.replace(/[\s.]/g, "");
};

const isValidBelgianNumber = (value: string): { valid: boolean; error?: string } => {
  if (!/^\d{10}$/.test(value)) {
    return { valid: false, error: "Le numéro doit contenir exactement 10 chiffres après le préfixe BE." };
  }
  if (!/^[01]\d{9}$/.test(value)) {
    return { valid: false, error: "Le numéro doit commencer par 0 ou 1." };
  }
  const prefix = parseInt(value.slice(0, 8), 10);
  const control = parseInt(value.slice(8), 10);
  const expectedControl = 97 - (prefix % 97);
  if (control !== expectedControl) {
    return { valid: false, error: "La clé de contrôle (mod 97) est invalide." };
  }
  return { valid: true };
};

const getStatusStyle = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes("active") && !s.includes("inactive")) {
    return { bg: "#DCFCE7", text: "#15803D", dot: "#15803D" };
  }
  if (["inactive", "radiée", "radiee", "cessée", "cessee", "stopped"].some((term) => s.includes(term))) {
    return { bg: "#F3F4F6", text: "#4B5563", dot: "#6B7280" };
  }
  if (["faillite", "bankrupt", "liquidation"].some((term) => s.includes(term))) {
    return { bg: "#FEE2E2", text: "#B91C1C", dot: "#B91C1C" };
  }
  return { bg: "#F3F4F6", text: "#4B5563", dot: "#6B7280" };
};

const VerifierEntreprise = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pubLoading, setPubLoading] = useState(false);
  const [pubError, setPubError] = useState(false);
  const [publications, setPublications] = useState<Publication[] | null>(null);
  const [pubTotalCount, setPubTotalCount] = useState(0);
  const [bnbLoading, setBnbLoading] = useState(false);
  const [bnbError, setBnbError] = useState(false);
  const [bnbData, setBnbData] = useState<BnbResponse | null>(null);

  const numero = normalizeNumber(input);

  const fetchPublications = async (num: string) => {
    setPubLoading(true);
    setPubError(false);
    setPublications(null);
    setPubTotalCount(0);
    try {
      const response = await fetch(
        `https://guideimmo.xc1.app/webhook/moniteur-belge-publications?numero=${encodeURIComponent(num)}&limit=10`
      );
      const data: PublicationsResponse = await response.json();
      if (!data || data.success === false) {
        setPubError(true);
      } else {
        setPublications(data.publications || []);
        setPubTotalCount(data.total_count ?? data.count ?? (data.publications?.length || 0));
      }
    } catch {
      setPubError(true);
    } finally {
      setPubLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setApiError(null);
    setResult(null);
    setCopied(false);
    setPublications(null);
    setPubError(false);
    setPubLoading(false);

    const validation = isValidBelgianNumber(numero);
    if (!validation.valid) {
      setError(validation.error || "Numéro invalide.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://guideimmo.xc1.app/webhook/entreprise-check?numero=${encodeURIComponent(numero)}`
      );
      const data: ApiResponse = await response.json();
      if (data.success === false) {
        setApiError(data.error || "Une erreur est survenue lors de la vérification.");
      } else {
        setResult(data);
        void fetchPublications(numero);
      }
    } catch (err) {
      setApiError("Impossible de contacter le service de vérification. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(numero);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleNewSearch = () => {
    setInput("");
    setResult(null);
    setError(null);
    setApiError(null);
    setCopied(false);
    setPublications(null);
    setPubError(false);
    setPubLoading(false);
    setPubTotalCount(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const formatDisplayNumber = (n: string) => {
    if (n.length === 10) {
      return `${n.slice(0, 4)}.${n.slice(4, 7)}.${n.slice(7)}`;
    }
    return n;
  };


  const resultTitle = result?.name || "Numéro d'entreprise";
  const resultNumber = result?.cbe_number_formatted || formatDisplayNumber(numero);

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: "#F4F6F9", fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header text */}
        <div className="text-center mb-10">
          <div
            className="text-xs font-bold tracking-[0.15em] mb-3"
            style={{ color: "#1d4ed8" }}
          >
            <span className="uppercase">Entreprise Check</span>
            <span className="italic font-normal"> — un outil Guide Immo</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#111827] mb-3">
            Passez l'entreprise au crible
          </h1>
          <p className="text-base text-gray-500 max-w-lg mx-auto">
            Les informations clés — en une recherche, gratuit, sans compte.
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Numéro d'entreprise ou de TVA
          </label>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-3">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="BE 0123.456.789"
              className="flex-1 h-11 border-gray-300 focus-visible:ring-[#1d4ed8]"
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-11 px-6 font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#1d4ed8" }}
            >
              {loading ? "Recherche..." : "Rechercher"}
            </Button>
          </form>


          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: "#FEE2E2", color: "#B91C1C" }}>
              {error}
            </div>
          )}

          {apiError && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: "#FEE2E2", color: "#B91C1C" }}>
              {apiError}
            </div>
          )}

          {/* Why verify block */}
          {!result && !loading && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Pourquoi vérifier avant de vous engager
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Trois moments clés d'un achat immobilier où se renseigner sur une entreprise peut vous éviter une mauvaise surprise.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#1d4ed8] mb-2">
                    Avant un compromis
                  </div>
                  <div className="font-bold text-gray-900 mb-2">
                    Le vendeur professionnel existe-t-il vraiment ?
                  </div>
                  <p className="text-sm text-gray-500">
                    Vérifiez que le promoteur ou la société venderesse est bien active et dans une situation juridique normale avant de verser un acompte.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#1d4ed8] mb-2">
                    Avant un devis chantier
                  </div>
                  <div className="font-bold text-gray-900 mb-2">
                    L'entrepreneur est-il en règle ?
                  </div>
                  <p className="text-sm text-gray-500">
                    Une entreprise criblée de dettes (sociales et/ou fiscales), en faillite ou en liquidation peut encore démarcher. Un contrôle rapide du statut BCE ou de ses cotisations ONSS vous protège.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#1d4ed8] mb-2">
                    Avant un mandat de syndic
                  </div>
                  <div className="font-bold text-gray-900 mb-2">
                    La société de gestion est-elle solide ?
                  </div>
                  <p className="text-sm text-gray-500">
                    Consultez la forme juridique et les publications au Moniteur belge avant de confier la gestion de votre copropriété.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Result block */}
          {(result || loading) && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="text-sm text-gray-500 mb-4">
                Entreprise :{" "}
                <span className="text-lg font-bold text-gray-900">
                  {loading ? "Recherche en cours..." : resultTitle}
                </span>
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Numéro : <span className="font-semibold text-gray-900">{resultNumber}</span>
              </div>

              {result && (
                <>
                  <div className="text-sm text-gray-500 mb-4">
                    Statut :{" "}
                    {(() => {
                      const style = getStatusStyle(result.status);
                      return (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: style.bg, color: style.text }}>
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: style.dot }} />
                          {result.status}
                        </span>
                      );
                    })()}
                  </div>

                  {result.legal_situation && (
                    <div className="text-sm text-gray-500 mb-4">
                      Situation juridique :{" "}
                      {(() => {
                        const style = getStatusStyle(result.legal_situation);
                        return (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: style.bg, color: style.text }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: style.dot }} />
                            {result.legal_situation}
                          </span>
                        );
                      })()}
                    </div>
                  )}

                  <div className="text-sm text-gray-500 mb-4">
                    Type d'entité : <span className="font-semibold text-gray-900">{result.entity_type}</span>
                  </div>
                  {result.start_date && (
                    <div className="text-sm text-gray-500 mb-4">
                      Date de création :{" "}
                      <span className="font-semibold text-gray-900">
                        {new Date(result.start_date).toLocaleDateString("fr-BE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}

                  {result.nace_activities && result.nace_activities.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                        Activités (NACE)
                      </h3>
                      {result.nace_activities.filter((a) => a.classification === "main").length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Activité principale</h4>
                          <div className="space-y-2">
                            {result.nace_activities
                              .filter((a) => a.classification === "main")
                              .map((activity, index) => (
                                <div key={index} className="flex items-start gap-3">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-gray-100 text-gray-700 flex-shrink-0">
                                    {activity.code}
                                  </span>
                                  <span className="text-sm text-gray-900">{activity.description}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                      {result.nace_activities.filter((a) => a.classification === "secondary").length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Activités secondaires</h4>
                          <div className="space-y-2">
                            {result.nace_activities
                              .filter((a) => a.classification === "secondary")
                              .map((activity, index) => (
                                <div key={index} className="flex items-start gap-3">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-gray-100 text-gray-700 flex-shrink-0">
                                    {activity.code}
                                  </span>
                                  <span className="text-sm text-gray-900">{activity.description}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
              {loading && (
                <div className="text-sm text-gray-500">Chargement des informations...</div>
              )}
            </div>
          )}
        </div>

        {/* Dernières publications au Moniteur belge */}
        {(result || loading) && (
          <section className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Dernières publications au Moniteur belge
            </h2>

            {pubLoading && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-gray-500">
                Chargement des publications...
              </div>
            )}

            {!pubLoading && pubError && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-gray-500">
                Publications au Moniteur belge indisponibles pour le moment.
              </div>
            )}

            {!pubLoading && !pubError && publications && publications.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-gray-500">
                Aucune publication récente trouvée au Moniteur belge pour cette entreprise.
              </div>
            )}

            {!pubLoading && !pubError && publications && publications.length > 0 && (
              <div className="space-y-4">
                {publications.map((pub, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {pub.publication_date
                          ? new Date(pub.publication_date).toLocaleDateString("fr-BE", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "Date inconnue"}
                      </span>
                      {pub.event ? (
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: "#E0E7FF", color: "#1d4ed8" }}
                        >
                          {EVENT_LABELS[pub.event.event_type] || "Autre publication"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          Analyse en cours
                        </span>
                      )}
                    </div>

                    {pub.publication_type && (
                      <p className="text-sm italic text-gray-700 mb-3">
                        « {pub.publication_type} »
                      </p>
                    )}

                    {pub.event?.summary && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-900">{pub.event.summary}</p>
                        <p className="text-xs text-gray-400 mt-1">Résumé généré automatiquement</p>
                      </div>
                    )}

                    {pub.document_url && (
                      <a
                        href={pub.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold hover:underline"
                        style={{ color: "#1d4ed8" }}
                      >
                        Voir le document original →
                      </a>
                    )}
                  </div>
                ))}

                {pubTotalCount > publications.length && (
                  <div className="text-sm text-gray-500">
                    {pubTotalCount} publications au total pour cette entreprise.{" "}
                    <a
                      href="https://www.ejustice.just.fgov.be/cgi_tsv/rech.pl?language=fr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold hover:underline"
                      style={{ color: "#1d4ed8" }}
                    >
                      Consulter la recherche officielle du Moniteur belge →
                    </a>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Sources officielles */}
        {(result || loading) && (
          <section className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Sources officielles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* BCE */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="text-2xl">🏢</div>
                  <a
                    href={`https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html?lang=fr&nummer=${numero}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#1d4ed8" }}
                  >
                    Ouvrir →
                  </a>
                </div>
                <div className="font-bold text-gray-900 mb-1">BCE</div>
                <div className="text-sm text-gray-500">Banque-Carrefour des Entreprises</div>
              </div>

              {/* Moniteur belge */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="text-2xl">📰</div>
                  <a
                    href="https://www.ejustice.just.fgov.be/cgi_tsv/rech.pl?language=fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#1d4ed8" }}
                  >
                    Rechercher →
                  </a>
                </div>
                <div className="font-bold text-gray-900 mb-1">Moniteur belge</div>
                <div className="text-sm text-gray-500">Publications officielles</div>
              </div>

              {/* BNB */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="text-2xl">📊</div>
                  <a
                    href={`https://consult.cbso.nbb.be/consult-enterprise/${numero}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#1d4ed8" }}
                  >
                    Rechercher →
                  </a>
                </div>
                <div className="font-bold text-gray-900 mb-1">BNB</div>
                <div className="text-sm text-gray-500">Centrale des bilans</div>
              </div>

              {/* Obligation de retenue */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="text-2xl">🧾</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleCopyNumber}
                      className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-semibold border hover:bg-gray-50 transition-colors"
                      style={{ color: "#1d4ed8", borderColor: "#1d4ed8" }}
                    >
                      {copied ? "Copié !" : "Copier n°"}
                    </button>
                    <a
                      href="https://www.checkobligationderetenue.be/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: "#1d4ed8" }}
                    >
                      Vérifier →
                    </a>
                  </div>
                </div>
                <div className="font-bold text-gray-900 mb-1">Obligation de retenue</div>
                <div className="text-sm text-gray-500">Vérification des dettes sociales</div>
              </div>
            </div>
          </section>
        )}

        {/* Autres sources */}
        {(result || loading) && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Autres sources
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="text-2xl">📁</span>
                <div>
                  <div className="font-bold text-gray-900 mb-1">Pappers.be</div>
                  <div className="text-sm text-gray-500">Informations juridiques et financières complémentaires</div>
                </div>
              </div>
              <a
                href={`https://www.pappers.be/fr/search?q=${numero}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold text-white hover:opacity-90 transition-opacity sm:flex-shrink-0"
                style={{ backgroundColor: "#1d4ed8" }}
              >
                Consulter →
              </a>
            </div>
          </section>
        )}

        {/* Nouvelle recherche */}
        {(result || loading) && (
          <section className="mt-8">
            <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-500 text-sm mb-3">
              Les liens ouvrent les sites tiers. L'outil ne collecte ni ne modifie les données de ces sites.
            </div>
            <button
              type="button"
              onClick={handleNewSearch}
              className="w-full h-11 px-6 font-semibold text-white rounded-md hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#1d4ed8" }}
            >
              ← Nouvelle recherche
            </button>
          </section>
        )}

      </div>
    </div>
  );
};

export default VerifierEntreprise;
