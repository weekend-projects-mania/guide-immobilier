import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CheckResult {
  success: true;
  name: string;
  status: string;
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

const VerifierEntreprise = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const numero = normalizeNumber(input);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setApiError(null);
    setResult(null);

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

  const sources = [
    {
      name: "Banque-Carrefour des Entreprises (BCE)",
      url: `https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html?lang=fr&nummer=${numero}`,
      description: "Vérifier si une entreprise est toujours active (et ses activités)",
    },
    {
      name: "Moniteur belge",
      url: "https://www.ejustice.just.fgov.be/cgi_tsv/rech.pl?language=fr",
      description: "Consulter les actes officiels d'une société (création, démissions, dissolutions, etc.)",
    },
    {
      name: "Banque Nationale de Belgique (BNB) - comptes annuels",
      url: `https://consult.cbso.nbb.be/consult-enterprise/${numero}`,
      description: "Consulter les comptes annuels d'une entreprise",
    },
    {
      name: "ONSS - Obligation de retenue",
      url: "https://www.checkobligationderetenue.be/",
      description: "Vérifier si une entreprise a des dettes sociales ou fiscales",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-8 md:py-12">
          <div className="container px-4 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
              Vérifier une entreprise
            </h1>
            <p className="bg-black text-white px-3 py-2 inline-block max-w-xl mb-8">
              Saisis un numéro d'entreprise ou de TVA belge pour en obtenir les informations officielles.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="BE 0123.456.789"
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-black text-white hover:bg-black/90 transition-transform hover:scale-105"
              >
                {loading ? "Vérification..." : "Vérifier"}
              </Button>
            </form>

            {error && (
              <div className="mb-6 p-4 border border-destructive/30 bg-destructive/10 text-destructive rounded-lg">
                {error}
              </div>
            )}

            {apiError && (
              <div className="mb-6 p-4 border border-destructive/30 bg-destructive/10 text-destructive rounded-lg">
                {apiError}
              </div>
            )}

            {result && (
              <div className="border border-border rounded-lg divide-y divide-border bg-card mb-12">
                <div className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Nom</div>
                  <div className="font-medium text-foreground">{result.name}</div>
                </div>
                <div className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Numéro formaté</div>
                  <div className="font-medium text-foreground">{result.cbe_number_formatted}</div>
                </div>
                <div className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Statut</div>
                  <div className="font-medium text-foreground">{result.status}</div>
                </div>
                <div className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Forme juridique</div>
                  <div className="font-medium text-foreground">{result.legal_form}</div>
                </div>
                <div className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Type d'entité</div>
                  <div className="font-medium text-foreground">{result.entity_type}</div>
                </div>
              </div>
            )}

            {result && (
              <section className="mb-12">
                <h2 className="text-lg font-bold uppercase text-black dark:text-white mb-4">
                  Sources officielles
                </h2>
                <div className="border border-border rounded-lg divide-y divide-border bg-card">
                  {sources.map((source, index) => {
                    const isBlack = index % 2 === 0;
                    return (
                      <a
                        key={source.name}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-black dark:text-white group-hover:text-primary transition-colors">
                            {source.description}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {source.name}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`ml-4 flex-shrink-0 border transition-transform hover:scale-105 ${
                            isBlack
                              ? "bg-black text-white border-black hover:bg-black hover:text-white"
                              : "bg-white text-black border-black hover:bg-white hover:text-black"
                          }`}
                        >
                          Ouvrir
                        </Button>
                      </a>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VerifierEntreprise;
