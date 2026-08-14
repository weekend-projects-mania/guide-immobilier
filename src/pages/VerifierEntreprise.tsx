import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CheckResult {
  success: true;
  name: string;
  status: string;
  legal_situation: string;
  legal_form: string;
  entity_type: string;
  cbe_number_formatted: string;
}

interface CheckError {
  success: false;
  error: string;
}

type ApiResponse = CheckResult | CheckError;

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

  const numero = normalizeNumber(input);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setApiError(null);
    setResult(null);
    setCopied(false);

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
      <div className="max-w-2xl mx-auto">
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
            Numéro d'entreprise ou numéro de TVA
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

                  <div className="text-sm text-gray-500 mb-4">
                    Forme juridique : <span className="font-semibold text-gray-900">{result.legal_form}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    Type d'entité : <span className="font-semibold text-gray-900">{result.entity_type}</span>
                  </div>
                </>
              )}
              {loading && (
                <div className="text-sm text-gray-500">Chargement des informations...</div>
              )}
            </div>
          )}
        </div>

        {/* Sources officielles */}
        {(result || loading) && (
          <section className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Sources officielles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* BCE */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
                <div className="text-2xl mb-3">🏢</div>
                <div className="font-bold text-gray-900 mb-1">BCE</div>
                <div className="text-sm text-gray-500 mb-4">Banque-Carrefour des Entreprises</div>
                <a
                  href={`https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html?lang=fr&nummer=${numero}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center text-sm font-semibold hover:underline"
                  style={{ color: "#1d4ed8" }}
                >
                  Ouvrir →
                </a>
              </div>

              {/* Moniteur belge */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
                <div className="text-2xl mb-3">📰</div>
                <div className="font-bold text-gray-900 mb-1">Moniteur belge</div>
                <div className="text-sm text-gray-500 mb-4">Publications officielles</div>
                <a
                  href="https://www.ejustice.just.fgov.be/cgi_tsv/rech.pl?language=fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center text-sm font-semibold hover:underline"
                  style={{ color: "#1d4ed8" }}
                >
                  Rechercher →
                </a>
              </div>

              {/* BNB */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
                <div className="text-2xl mb-3">📊</div>
                <div className="font-bold text-gray-900 mb-1">BNB</div>
                <div className="text-sm text-gray-500 mb-4">Centrale des bilans</div>
                <a
                  href={`https://consult.cbso.nbb.be/consult-enterprise/${numero}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center text-sm font-semibold hover:underline"
                  style={{ color: "#1d4ed8" }}
                >
                  Rechercher →
                </a>
              </div>

              {/* Obligation de retenue */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
                <div className="text-2xl mb-3">🧾</div>
                <div className="font-bold text-gray-900 mb-1">Obligation de retenue</div>
                <div className="text-sm text-gray-500 mb-4">Vérification des dettes sociales</div>
                <div className="mt-auto flex flex-wrap gap-2">
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
      </div>
    </div>
  );
};

export default VerifierEntreprise;
