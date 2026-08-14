import { useState } from "react";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2 } from "lucide-react";

interface EnterpriseResult {
  success: true;
  name: string;
  status: string;
  legal_form: string;
  entity_type: string;
  cbe_number_formatted: string;
}

interface EnterpriseError {
  success: false;
  error: string;
}

type EnterpriseResponse = EnterpriseResult | EnterpriseError;

const cleanEnterpriseNumber = (value: string): string =>
  value.toUpperCase().replace(/BE/g, "").replace(/[\s.]/g, "");

const enterpriseNumberSchema = z
  .string()
  .transform(cleanEnterpriseNumber)
  .refine((val) => /^\d{10}$/.test(val), {
    message: "Le numéro doit contenir exactement 10 chiffres.",
  })
  .refine((val) => /^[01]/.test(val), {
    message: "Le numéro doit commencer par 0 ou 1.",
  })
  .refine(
    (val) => {
      const first8 = parseInt(val.slice(0, 8), 10);
      const last2 = parseInt(val.slice(8), 10);
      const expected = 97 - (first8 % 97);
      return last2 === expected;
    },
    {
      message: "Clé de contrôle invalide. Vérifiez le numéro.",
    }
  );

const VerifierEntreprise = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EnterpriseResult | null>(null);

  const handleVerify = async () => {
    setError(null);
    setResult(null);

    const validation = enterpriseNumberSchema.safeParse(input);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    const numero = validation.data;
    setLoading(true);

    try {
      const response = await fetch(
        `https://guideimmo.xc1.app/webhook/entreprise-check?numero=${encodeURIComponent(numero)}`
      );
      const data: EnterpriseResponse = await response.json();

      if (data.success === false) {
        setError(data.error || "Aucune entreprise trouvée pour ce numéro.");
        return;
      }

      setResult(data);
    } catch (err) {
      setError("Impossible de contacter le service de vérification. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const sources = result
    ? [
        {
          name: "Banque-Carrefour des Entreprises (BCE)",
          url: `https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html?lang=fr&nummer=${encodeURIComponent(
            cleanEnterpriseNumber(result.cbe_number_formatted)
          )}`,
          description: "Vérifier si l'entreprise est toujours active",
        },
        {
          name: "Moniteur belge",
          url: "https://www.ejustice.just.fgov.be/cgi_tsv/rech.pl?language=fr",
          description: "Consulter les actes officiels de la société",
        },
        {
          name: "Banque Nationale de Belgique (BNB) — comptes annuels",
          url: `https://consult.cbso.nbb.be/consult-enterprise/${encodeURIComponent(
            cleanEnterpriseNumber(result.cbe_number_formatted)
          )}`,
          description: "Consulter les comptes annuels de l'entreprise",
        },
        {
          name: "ONSS — obligation de retenue",
          url: "https://www.checkobligationderetenue.be/",
          description: "Vérifier si l'entreprise a des dettes sociales ou fiscales",
        },
      ]
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4 max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="h-5 w-5 text-black dark:text-white" />
            <h1 className="text-lg font-bold uppercase text-black dark:text-white">
              Vérifier une entreprise
            </h1>
          </div>

          <div className="border border-border rounded-lg bg-card p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                placeholder="BE 0123.456.789"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleVerify();
                }}
                className="flex-1 bg-white dark:bg-black border-black dark:border-white text-black dark:text-white placeholder:text-muted-foreground rounded-full text-sm"
                aria-label="Numéro d'entreprise ou de TVA belge"
              />
              <Button
                onClick={handleVerify}
                disabled={loading}
                className="bg-black text-white border border-black hover:bg-black hover:text-white rounded-full transition-transform hover:scale-105 disabled:opacity-70"
              >
                {loading ? "Vérification..." : "Vérifier"}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-destructive mt-3" role="alert">
                {error}
              </p>
            )}
          </div>

          {result && (
            <>
              <div className="border border-border rounded-lg bg-card p-4 mb-6">
                <h2 className="text-base font-semibold text-foreground mb-4">
                  {result.name}
                </h2>
                <div className="divide-y divide-border">
                  <div className="flex justify-between py-3 text-sm">
                    <span className="text-muted-foreground">Numéro d'entreprise</span>
                    <span className="font-medium text-foreground">{result.cbe_number_formatted}</span>
                  </div>
                  <div className="flex justify-between py-3 text-sm">
                    <span className="text-muted-foreground">Statut</span>
                    <span className="font-medium text-foreground">{result.status}</span>
                  </div>
                  <div className="flex justify-between py-3 text-sm">
                    <span className="text-muted-foreground">Forme juridique</span>
                    <span className="font-medium text-foreground">{result.legal_form}</span>
                  </div>
                  <div className="flex justify-between py-3 text-sm">
                    <span className="text-muted-foreground">Type d'entité</span>
                    <span className="font-medium text-foreground">{result.entity_type}</span>
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-bold uppercase text-black dark:text-white mb-4">
                Sources officielles
              </h3>
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
                        <div className="font-medium text-black dark:text-white group-hover:text-primary transition-colors flex items-center gap-2">
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
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifierEntreprise;
