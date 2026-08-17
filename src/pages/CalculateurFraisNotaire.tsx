import React, { useState, useMemo } from "react";

/* ============================================================================
   GuideImmo — Calculateur unifié des frais d'acte
   Barèmes et règles alignés sur les simulateurs notaire.be (MAJ 01/01/2026).
   Vérifié au centime sur 19 scénarios de contrôle.
   Styles en CSS embarqué : aucune dépendance à une configuration Tailwind.
   ========================================================================== */

const r2 = (x: any) => Math.round(x * 100) / 100;

const BAREMES = {
  Jbis: { fixe: 257, tranches: [[0, 7500, 0.025], [7500, 17500, 0.025], [17500, 30000, 0.02], [30000, 45495, 0.015], [45495, 64090, 0.005], [64090, 250095, 0.00485], [250095, 500000, 0.003], [500000, 1e8, 0.002]] },
  Jnew: { fixe: 285, tranches: [[0, 7500, 0.025], [7500, 17500, 0.025], [17500, 30000, 0.0175], [30000, 45495, 0.0171], [45495, 64090, 0.0114], [64090, 250095, 0.0057], [250095, 500000, 0.002], [500000, 1e8, 0.002]] },
  Gbis: { fixe: 0, tranches: [[0, 7500, 0.01368], [7500, 17500, 0.01094], [17500, 30000, 0.0073], [30000, 45495, 0.00547], [45495, 64090, 0.00365], [64090, 250095, 0.00182], [250095, 500000, 0.00036], [500000, 1e8, 0.00036]] },
  Gnew: { fixe: 285, tranches: [[0, 7500, 0.0075], [7500, 17500, 0.0065], [17500, 30000, 0.005], [30000, 45495, 0.004], [45495, 64095, 0.004], [64095, 250095, 0.00228], [250095, 500000, 0.00046], [500000, 1e8, 0.00046]] },
  Knew: { fixe: 285, tranches: [[0, 7500, 0.0475], [7500, 17500, 0.0425], [17500, 30000, 0.0425], [30000, 45495, 0.035], [45495, 64090, 0.03], [64090, 250095, 0.0135], [250095, 500000, 0.0025], [500000, 1e8, 0.0025]] },
  Kbis: { fixe: 257, tranches: [[0, 7500, 0.045], [7500, 17500, 0.045], [17500, 30000, 0.04], [30000, 45495, 0.035], [45495, 64090, 0.0175], [64090, 250095, 0.01175], [250095, 500000, 0.005], [500000, 1e8, 0.002]] },
};

function bareme(nom: any, montant: any) {
  const b = (BAREMES as any)[nom];
  let t = b.fixe;
  for (const [de, a, pct] of b.tranches) if (montant > de) t += (Math.min(montant, a) - de) * pct;
  return t;
}

const FORF_VL = [[0, 30000, 27.5], [30001, 40000, 21.35], [40001, 50000, 19.55], [50001, 60000, 18.4], [60001, 70000, 17.6], [70001, 80000, 16.95], [80001, 90000, 16.4], [90001, 100000, 16], [100001, 110000, 15.7], [110001, 125000, 15.4], [125001, 150000, 15.1], [150001, 175000, 14.7], [175001, 200000, 14.4], [200001, 225000, 14.2], [225001, 250000, 14.05], [250001, 275000, 13.9], [275001, 300000, 13.75], [300001, 325000, 13.65], [325001, 375000, 13.55], [375001, 400000, 13.35], [400001, 425000, 13.3], [425001, 500000, 13.25], [500001, 550000, 13.1], [550001, 600000, 13], [600001, 750000, 12.95], [750001, 1000000, 12.8], [1000001, 2000000, 12.65], [2000001, 3000000, 12.45], [3000001, 4000000, 12.4], [4000001, null, 12.35]];
const FORF_BW = [[0, 30000, 28], [30001, 40000, 21.85], [40001, 50000, 20.05], [50001, 60000, 18.9], [60001, 70000, 18.1], [70001, 80000, 17.45], [80001, 90000, 16.9], [90001, 100000, 16.5], [100001, 110000, 16.2], [110001, 125000, 15.9], [125001, 150000, 15.6], [150001, 175000, 15.2], [175001, 200000, 14.9], [200001, 225000, 14.7], [225001, 250000, 14.55], [250001, 275000, 14.4], [275001, 300000, 14.25], [300001, 325000, 14.15], [325001, 375000, 14.05], [375001, 400000, 13.85], [400001, 425000, 13.8], [425001, 500000, 13.75], [500001, 550000, 13.6], [550001, 600000, 13.5], [600001, 750000, 13.45], [750001, 1000000, 13.3], [1000001, 2000000, 13.15], [2000001, 3000000, 12.95], [3000001, 4000000, 12.9], [4000001, null, 12.85]];
const FORFAITS = { VL: FORF_VL, BXL: FORF_BW, WL: FORF_BW };

function forfaitPct(region: any, montant: any) {
  const t = (FORFAITS as any)[region];
  for (const [de, a, pct] of t) if (montant >= de && (a === null || montant <= a)) return pct / 100;
  return t[t.length - 1][2] / 100;
}

/* --- Acte d'achat (vente de gré à gré) ---------------------------------- */
function calcAchat(i: any) {
  const P = i.prix || 0, R = i.region, EF = i.typeBien;
  const AB = EF === "E" ? i.propre : undefined;
  const AABB = EF === "F" ? i.propreTerrain : undefined;
  const PQS = EF === "E" ? i.regime : "P";
  const SG = i.prixTerrain || 0, SB = i.prixBati || 0;
  const propre = AB === "A" || AABB === "AA";
  const lignes: any[] = [];

  let hono = bareme(propre ? "Jbis" : "Jnew", P);
  if (P < 20001) hono -= propre ? 86 : 85;
  hono = Math.max(hono, 8.48);
  const honoR = r2(hono);

  const w = (v: any) => ((v + 0.005) * 100) / 100; // arrondi propre à la Wallonie
  let reg = null, regLabel = "Droits d'enregistrement";
  if (R === "VL") {
    if (EF === "F") reg = P * 0.12;
    else if (PQS === "P" && AB === "A") { const s = i.villeCentre === "C" ? 240000 : 220000; reg = P > s ? P * 0.02 : P * 0.02 - 1867; }
    else if (PQS === "P") reg = P * 0.12;
    else if (PQS === "S") { reg = SG * 0.12; regLabel = "Droits d'enregistrement sur le terrain"; }
    if (reg !== null) reg = Math.max(reg, 50);
  } else if (R === "BXL") {
    if (EF === "F") reg = P <= 300000 && AABB === "AA" && i.abattementTerrain === "ZF" ? P * 0.125 - 12500 : P * 0.125;
    else if (PQS === "S") { reg = SG <= 300000 && AB === "A" && i.abattement === "Z" ? SG * 0.125 - 25000 : SG * 0.125; regLabel = "Droits d'enregistrement sur le terrain"; }
    else if (PQS === "P") reg = P <= 600000 && AB === "A" && i.abattement === "Z" ? P * 0.125 - 25000 : P * 0.125;
    if (reg !== null) reg = Math.max(reg, 50);
  } else if (R === "WL") {
    const taux = propre ? 0.03 : 0.125;
    if (EF === "F") reg = Math.max(w(P * taux), 50);
    else if (PQS === "P") reg = Math.max(w(P * taux), 50);
    else if (PQS === "S") { reg = SG * taux; regLabel = "Droits d'enregistrement sur le terrain"; }
  }
  if (reg !== null) lignes.push([regLabel, reg, "etat"]);
  if (PQS === "Q") lignes.push(["TVA sur l'achat (21 %)", P * 0.21, "etat"]);
  if (PQS === "S") lignes.push(["TVA sur le bâtiment (21 %)", SB * 0.21, "etat"]);

  lignes.push(["Droit sur les annexes", 100, "etat"]);
  lignes.push(["Honoraires du notaire", hono, "notaire"]);
  lignes.push(["Frais administratifs", 855, "notaire"]);
  lignes.push(["Débours (frais envers des tiers)", 309, "tiers"]);
  lignes.push(["Frais de transcription", 285, "etat"]);
  lignes.push(["Droit d'écriture", 100, "etat"]);
  lignes.push([PQS === "P" ? "TVA (21 %)" : "TVA sur les services (21 %)", (honoR + 855 + 309 + 100) * 0.21, "etat"]);

  return { lignes, total: lignes.reduce((s: any, l: any) => s + r2(l[1]), 0) };
}

/* --- Acte de crédit hypothécaire ---------------------------------------- */
function calcCredit(i: any) {
  const H = (i.hypotheque || 0) + (i.accessoires || 0);
  const K = i.credit || 0;
  const lignes: any[] = [];
  lignes.push(["Droits d'enregistrement (inscription 1 %)", H * 0.01, "etat"]);
  lignes.push(["Droit sur les annexes", 100, "etat"]);
  lignes.push(["Droit d'hypothèque (0,30 %)", H * 0.003, "etat"]);
  lignes.push(["Rétribution hypothécaire", H <= 300000 ? 270 : 1160, "etat"]);
  let hono;
  if (i.habUnique === "K") hono = bareme("Gbis", K);
  else { hono = bareme("Gnew", K); if (K <= 10000) hono -= 200; else if (K <= 20000) hono -= 86; }
  hono = Math.max(hono, 8.55);
  const honoR = r2(hono);
  const admin = i.actePrincipal === "B" ? 627 : 855;
  const deb = i.actePrincipal === "B" ? 55 : 309;
  lignes.push(["Honoraires du notaire", hono, "notaire"]);
  lignes.push(["Frais administratifs", admin, "notaire"]);
  lignes.push(["Débours (frais envers des tiers)", deb, "tiers"]);
  lignes.push(["Droit d'écriture", 100, "etat"]);
  lignes.push(["TVA (21 %)", (honoR + admin + deb + 100) * 0.21, "etat"]);
  return { lignes, total: lignes.reduce((s: any, l: any) => s + r2(l[1]), 0) };
}

/* --- Vente publique en ligne (Biddit) ------------------------------------ */
function calcBiddit(i: any) {
  const P = i.prix || 0, R = i.region, EF = i.typeBien;
  const AB = EF === "E" ? i.propre : undefined;
  const AABB = EF === "F" ? i.propreTerrain : undefined;
  const propre = AB === "A" || AABB === "AA";
  const pct = forfaitPct(R, P);
  const lignes: any[] = [[`Frais forfaitaires — ${(pct * 100).toFixed(2).replace(".", ",")} % du prix`, P * pct]];

  if (propre) {
    let red;
    if (P < 10000) red = 190; else if (P < 20000) red = 81;
    else red = r2(bareme("Knew", P)) - r2(bareme("Kbis", P));
    lignes.push(["Réduction des honoraires (habitation propre et unique)", -red]);
  }
  if (R === "VL") {
    if (EF === "E" && AB === "A") {
      lignes.push(["Réduction — taux réduit habitation propre et unique", -P * 0.1]);
      const s = i.villeCentre === "C" ? 240000 : 220000;
      if (P <= s) lignes.push(["Réduction — habitation modeste", -1867]);
    }
  } else if (R === "BXL") {
    const net = P - (bareme("Kbis", P) - P * pct);
    if (EF === "E" && i.abattement === "Z" && net < 600000) lignes.push(["Abattement bruxellois", -25000]);
    if (EF === "F" && i.abattementTerrain === "ZF" && net < 300000) lignes.push(["Abattement bruxellois", -12500]);
  } else if (R === "WL") {
    if (propre) lignes.push(["Réduction — taux réduit habitation propre et unique", -P * 0.095]);
  }
  return { lignes, total: lignes.reduce((s: any, l: any) => s + r2(l[1]), 0) };
}

/* --- Montant à emprunter : résolution du crédit « 105 / 125 % » ----------
   Quand le crédit doit aussi couvrir les frais d'acte, le montant emprunté
   dépend des frais... qui dépendent eux-mêmes du montant emprunté.
   On résout par itération : la suite converge en quelques passes.        */
function resoudreCredit({ base, inclureFrais, totalActe, tauxAccessoires, habUnique, actePrincipal }: any) {
  if (!inclureFrais) return { montant: Math.ceil(base), fraisActe: 0 };
  let c = base;
  for (let n = 0; n < 60; n++) {
    const fraisCredit = calcCredit({
      credit: c, hypotheque: c, accessoires: r2(c * tauxAccessoires), habUnique, actePrincipal,
    }).total;
    const suivant = base + totalActe + fraisCredit;
    const stable = Math.abs(suivant - c) < 0.005;
    c = suivant;
    if (stable) break;
  }
  return { montant: Math.ceil(c), fraisActe: c - base };
}

/* ---------------------------------------------------------------------- */

const eur = (n: any) => new Intl.NumberFormat("fr-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + " €";
const eur0 = (n: any) => new Intl.NumberFormat("fr-BE", { maximumFractionDigits: 0 }).format(n) + " €";

const CSS = `
.gi{--blue:#1D4ED8;--blue-soft:#EFF4FF;--ink:#0F172A;--body:#475569;
    --muted:#64748B;--line:#E2E8F0;--line-2:#CBD5E1;--bg:#F8FAFC;--red:#B91C1C;
    font-family:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--ink);
    background:var(--bg);min-height:100%;padding:32px 16px;-webkit-font-smoothing:antialiased}
.gi *,.gi *::before,.gi *::after{box-sizing:border-box}
.gi-wrap{max-width:1040px;margin:0 auto}

.gi-eyebrow{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--blue);font-weight:600;margin:0 0 8px}
.gi h1{font-size:32px;line-height:1.12;letter-spacing:-.028em;font-weight:700;margin:0;max-width:20ch}
.gi-lead{font-size:15px;color:var(--body);margin:12px 0 0;max-width:62ch;line-height:1.6}
@media(min-width:640px){.gi h1{font-size:38px}}

.gi-grid{display:grid;gap:20px;margin-top:28px}
@media(min-width:1024px){.gi-grid{grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);align-items:start}}

.gi-card{background:#fff;border:1px solid var(--line);border-radius:8px;padding:20px}
@media(min-width:640px){.gi-card{padding:24px}}
.gi-sect{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--muted);font-weight:600;margin:0 0 16px}

.gi-field{margin-bottom:20px}
.gi-label{font-size:13px;font-weight:600;letter-spacing:-.01em;margin-bottom:8px;color:var(--ink)}
.gi-hint{font-size:12px;color:var(--muted);margin-top:6px;line-height:1.45}

.gi-opts{display:grid;gap:8px}
@media(min-width:640px){.gi-opts.c2{grid-template-columns:1fr 1fr}.gi-opts.c3{grid-template-columns:1fr 1fr 1fr}}
.gi-opt{position:relative;text-align:left;padding:10px 14px 10px 36px;border-radius:6px;
  border:1px solid var(--line);background:#fff;color:var(--body);font:inherit;font-size:13.5px;
  line-height:1.35;cursor:pointer;transition:border-color .12s,background-color .12s,color .12s}
.gi-opt:hover{border-color:var(--line-2);background:var(--bg)}
.gi-opt:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.gi-opt[aria-pressed="true"]{background:var(--blue);border-color:var(--blue);color:#fff;font-weight:600;
  box-shadow:0 1px 2px rgba(15,23,42,.12)}
.gi-dot{position:absolute;left:12px;top:50%;transform:translateY(-50%);width:16px;height:16px;
  border-radius:50%;border:1px solid var(--line-2);background:#fff;display:flex;align-items:center;justify-content:center}
.gi-opt[aria-pressed="true"] .gi-dot{border-color:#fff}
.gi-dot i{width:8px;height:8px;border-radius:50%;background:var(--blue);display:block}

.gi-money{display:flex;align-items:center;border:1px solid var(--line);border-radius:6px;background:#fff}
.gi-money:focus-within{border-color:var(--blue);box-shadow:0 0 0 3px rgba(29,78,216,.12)}
.gi-money>span{padding:0 4px 0 14px;color:var(--muted);font-size:15px}
.gi-money input{width:100%;padding:10px 14px 10px 0;border:0;outline:0;background:transparent;
  font-family:'IBM Plex Mono',monospace;font-variant-numeric:tabular-nums;font-size:16px;color:var(--ink)}
.gi-money.ro{background:var(--blue-soft);border-color:#C7D7FE}
.gi-money.ro input{color:var(--blue);font-weight:600}

.gi-box{background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:16px;margin-bottom:20px}
.gi-box-2{display:grid;gap:14px}
@media(min-width:640px){.gi-box-2{grid-template-columns:1fr 1fr}}
.gi-note{font-size:12px;color:var(--muted);line-height:1.45;margin:12px 0 0}
.gi-warn{color:var(--red);font-weight:600}

.gi-sep{border:0;border-top:1px solid var(--line);margin:24px 0 20px}
.gi-switch{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:none;
  border:0;padding:0;cursor:pointer;font:inherit}
.gi-switch:focus-visible{outline:2px solid var(--blue);outline-offset:3px;border-radius:4px}
.gi-track{width:38px;height:21px;border-radius:999px;background:var(--line-2);position:relative;
  flex:0 0 auto;transition:background-color .15s}
.gi-switch[aria-pressed="true"] .gi-track{background:var(--blue)}
.gi-knob{position:absolute;top:2px;left:2px;width:17px;height:17px;border-radius:50%;background:#fff;
  transition:left .15s;box-shadow:0 1px 2px rgba(15,23,42,.25)}
.gi-switch[aria-pressed="true"] .gi-knob{left:19px}
.gi-switch-l{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--muted);font-weight:600}
.gi-switch[aria-pressed="true"] .gi-switch-l{color:var(--ink)}

.gi-check{display:flex;align-items:flex-start;gap:10px;width:100%;text-align:left;padding:10px 12px;
  border:1px solid var(--line);border-radius:6px;background:#fff;cursor:pointer;font:inherit;
  font-size:13.5px;color:var(--body);line-height:1.35;margin-bottom:8px;
  transition:border-color .12s,background-color .12s}
.gi-check:hover:not(:disabled){border-color:var(--line-2)}
.gi-check:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.gi-check[aria-pressed="true"]{border-color:var(--blue);background:var(--blue-soft)}
.gi-check:disabled{cursor:default}
.gi-tick{width:17px;height:17px;border-radius:4px;border:1px solid var(--line-2);background:#fff;
  flex:0 0 auto;margin-top:1px;display:flex;align-items:center;justify-content:center;
  color:#fff;font-size:11px;line-height:1;font-weight:700}
.gi-check[aria-pressed="true"] .gi-tick{background:var(--blue);border-color:var(--blue)}
.gi-check b{display:block;font-weight:600;color:var(--ink)}
.gi-check em{font-style:normal;display:block;font-size:12px;color:var(--muted);margin-top:2px;font-weight:400}

.gi-total{background:var(--ink);color:#fff;border-radius:8px;padding:20px}
@media(min-width:640px){.gi-total{padding:24px}}
.gi-total .gi-sect{color:#94A3B8;margin-bottom:12px}
.gi-big{font-family:'IBM Plex Mono',monospace;font-variant-numeric:tabular-nums;font-size:34px;
  font-weight:600;line-height:1;letter-spacing:-.02em}
@media(min-width:640px){.gi-big{font-size:42px}}
.gi-sub{font-size:13.5px;color:#CBD5E1;margin-top:12px;line-height:1.5}
.gi-bar{display:flex;height:8px;border-radius:999px;overflow:hidden;margin:0 0 12px}
.gi-legend{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:12px}
.gi-legend span{display:flex;align-items:center;gap:6px;color:#CBD5E1}
.gi-legend i{width:8px;height:8px;border-radius:50%;display:block;flex:0 0 auto}
.gi-legend b{font-family:'IBM Plex Mono',monospace;font-weight:500;color:#fff;display:block;margin-top:2px}
.gi-total-sep{border:0;border-top:1px solid #1E293B;margin:20px 0}

.gi-dec{border-left:2px solid var(--blue);padding-left:16px}
@media(min-width:640px){.gi-dec{padding-left:20px}}
.gi-dec-h{display:flex;align-items:baseline;justify-content:space-between;gap:12px}
.gi-dec-h h3{font-size:18px;font-weight:700;letter-spacing:-.02em;margin:0}
.gi-dec-h b{font-family:'IBM Plex Mono',monospace;font-variant-numeric:tabular-nums;
  font-size:15px;font-weight:600;white-space:nowrap}
.gi-dec-s{font-size:12px;color:var(--muted);margin-top:4px}
.gi-dl{margin:10px 0 0}
.gi-row{display:flex;align-items:baseline;gap:8px;padding:7px 0;border-bottom:1px dashed var(--line)}
.gi-row:last-child{border-bottom:0}
.gi-row dt{font-size:13.5px;line-height:1.35;color:var(--body);margin:0}
.gi-row .fill{flex:1;border-bottom:1px dotted var(--line-2);transform:translateY(-3px)}
.gi-row dd{margin:0;font-family:'IBM Plex Mono',monospace;font-variant-numeric:tabular-nums;
  font-size:13.5px;white-space:nowrap;color:var(--ink)}
.gi-row.neg dt,.gi-row.neg dd{color:var(--red)}
.gi-stack{display:flex;flex-direction:column;gap:28px}
.gi-stack.tight{gap:20px}
.gi-disc{font-size:12px;color:var(--muted);line-height:1.6;margin:0}
@media(prefers-reduced-motion:reduce){.gi *{transition:none!important}}

.gi-actions{display:flex;gap:8px;justify-content:flex-end}
.gi-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 14px;border-radius:6px;
  font:inherit;font-size:13px;font-weight:600;cursor:pointer;border:1px solid var(--line);
  background:#fff;color:var(--body);transition:border-color .12s,background-color .12s,color .12s}
.gi-btn:hover{border-color:var(--line-2);background:var(--bg);color:var(--ink)}
.gi-btn:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.gi-btn.primary{background:var(--blue);border-color:var(--blue);color:#fff}
.gi-btn.primary:hover{background:#1E40AF;border-color:#1E40AF;color:#fff}
.gi-btn svg{width:15px;height:15px;flex:0 0 auto}
@media(max-width:640px){.gi-actions{justify-content:stretch}.gi-btn{flex:1;justify-content:center}}

.gi-linked{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;color:var(--blue);
  background:var(--blue-soft);border-radius:4px;padding:2px 7px;font-weight:600;margin-left:8px;
  vertical-align:middle;letter-spacing:0}

.gi-empty{border:1px dashed var(--line-2);border-radius:8px;background:#fff;padding:40px 24px;
  text-align:center;color:var(--muted)}
.gi-empty svg{width:34px;height:34px;color:var(--line-2);margin-bottom:14px}
.gi-empty b{display:block;font-size:15px;font-weight:600;color:var(--ink);margin-bottom:6px}
.gi-empty span{display:block;font-size:13.5px;line-height:1.5;max-width:38ch;margin:0 auto}

.gi-print{display:none}
.gi-recap dl{display:grid;grid-template-columns:auto 1fr;gap:4px 16px;margin:12px 0 0;font-size:12px}
.gi-recap dt{color:var(--muted)}
.gi-recap dd{margin:0;color:var(--ink);font-weight:600}
.gi-recap h2{font-size:17px;margin:0;font-weight:700;letter-spacing:-.02em}
.gi-recap p{margin:4px 0 0;font-size:12px;color:var(--muted)}

@page{margin:15mm}
@media print{
  .gi{background:#fff;padding:0}
  .gi-noprint{display:none!important}
  .gi-print{display:block}
  .gi-grid{display:block;margin-top:0}
  .gi-stack.tight{gap:16px}
  .gi-card,.gi-total{border-radius:0;page-break-inside:avoid;box-shadow:none}
  .gi-total{background:#fff!important;color:var(--ink)!important;border:1px solid var(--ink)}
  .gi-total .gi-sect{color:var(--muted)!important}
  .gi-sub{color:var(--body)!important}
  .gi-legend span{color:var(--body)!important}
  .gi-legend b{color:var(--ink)!important}
  .gi-total-sep{border-top-color:var(--line-2)!important}
  .gi-bar,.gi-legend i{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .gi-big{font-size:30px}
}
`;

function Field({ label, hint, children }: any) {
  return (
    <div className="gi-field">
      <div className="gi-label">{label}</div>
      {children}
      {hint && <div className="gi-hint">{hint}</div>}
    </div>
  );
}

function Choice({ value, onChange, options, cols = 2 }: any) {
  return (
    <div className={`gi-opts c${cols}`}>
      {options.map((o: any) => {
        const on = value === o.v;
        return (
          <button key={o.v} type="button" aria-pressed={on} className="gi-opt" onClick={() => onChange(o.v)}>
            <span className="gi-dot">{on ? <i /> : null}</span>
            {o.l}
          </button>
        );
      })}
    </div>
  );
}

function Check({ on, onToggle, title, desc, locked }: any) {
  return (
    <button type="button" aria-pressed={on} className="gi-check" disabled={locked} onClick={onToggle}>
      <span className="gi-tick">{on ? "✓" : ""}</span>
      <span>
        <b>{title}</b>
        {desc ? <em>{desc}</em> : null}
      </span>
    </button>
  );
}

function Money({ value, onChange, placeholder, readOnly }: any) {
  return (
    <div className={readOnly ? "gi-money ro" : "gi-money"}>
      <span>€</span>
      <input
        type={readOnly ? "text" : "number"}
        inputMode="numeric"
        readOnly={readOnly}
        value={readOnly ? new Intl.NumberFormat("fr-BE").format(Math.round(value)) : value === 0 ? "" : value}
        placeholder={placeholder}
        onChange={(e) => !readOnly && onChange(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)))}
      />
    </div>
  );
}

function Decompte({ titre, res, sousTitre }: any) {
  return (
    <div className="gi-dec">
      <div className="gi-dec-h">
        <h3>{titre}</h3>
        <b>{eur(res.total)}</b>
      </div>
      {sousTitre ? <div className="gi-dec-s">{sousTitre}</div> : null}
      <dl className="gi-dl">
        {res.lignes.map(([label, val]: any, k: any) => (
          <div key={k} className={val < 0 ? "gi-row neg" : "gi-row"}>
            <dt>{label}</dt>
            <span className="fill" />
            <dd>{eur(r2(val))}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const DEFAUTS = {
  vente: "gre", region: "WL", prix: 0, typeBien: "E", propreUnique: "oui",
  regime: "P", villeCentre: "D", abattement: "Z", abattementTerrain: "ZF",
  prixTerrain: 0, prixBati: 0, avecCredit: true, avecTravaux: false, travaux: 0,
  inclureFrais: false, modeCredit: "auto", creditManuel: 0, garantieAuto: true,
  hypoManuel: 0, accManuel: 0, actePrincipal: "A",
};

const LibelleRegion = { WL: "Wallonie", BXL: "Bruxelles", VL: "Flandre" };
const LibelleRegime = { P: "Droits d'enregistrement", Q: "TVA 21 %", S: "Mixte (droits + TVA)" };

export default function CalculateurFraisNotaire() {
  const [vente, setVente] = useState(DEFAUTS.vente);
  const [region, setRegion] = useState(DEFAUTS.region);
  const [prix, setPrix] = useState(DEFAUTS.prix);
  const [typeBien, setTypeBien] = useState(DEFAUTS.typeBien);
  // Une seule source de vérité : la question « habitation propre et unique »
  // est posée sous trois formulations, mais ne peut avoir qu'une seule réponse.
  const [propreUnique, setPropreUnique] = useState(DEFAUTS.propreUnique);
  const [regime, setRegime] = useState(DEFAUTS.regime);
  const [villeCentre, setVilleCentre] = useState(DEFAUTS.villeCentre);
  const [abattement, setAbattement] = useState(DEFAUTS.abattement);
  const [abattementTerrain, setAbattementTerrain] = useState(DEFAUTS.abattementTerrain);
  const [prixTerrain, setPrixTerrain] = useState(DEFAUTS.prixTerrain);
  const [prixBati, setPrixBati] = useState(DEFAUTS.prixBati);

  const [avecCredit, setAvecCredit] = useState(DEFAUTS.avecCredit);
  const [avecTravaux, setAvecTravaux] = useState(DEFAUTS.avecTravaux);
  const [travaux, setTravaux] = useState(DEFAUTS.travaux);
  const [inclureFrais, setInclureFrais] = useState(DEFAUTS.inclureFrais);
  const [modeCredit, setModeCredit] = useState(DEFAUTS.modeCredit);
  const [creditManuel, setCreditManuel] = useState(DEFAUTS.creditManuel);
  const [garantieAuto, setGarantieAuto] = useState(DEFAUTS.garantieAuto);
  const [hypoManuel, setHypoManuel] = useState(DEFAUTS.hypoManuel);
  const [accManuel, setAccManuel] = useState(DEFAUTS.accManuel);
  const [actePrincipal, setActePrincipal] = useState(DEFAUTS.actePrincipal);

  const oui = propreUnique === "oui";
  const propre = oui ? "A" : "B";
  const propreTerrain = oui ? "AA" : "BB";
  const habUnique = oui ? "K" : "L";
  const setPropreUniqueFrom = (v: any) => setPropreUnique(v === "A" || v === "AA" || v === "K" ? "oui" : "non");

  const reinitialiser = () => {
    setVente(DEFAUTS.vente); setRegion(DEFAUTS.region); setPrix(DEFAUTS.prix);
    setTypeBien(DEFAUTS.typeBien); setPropreUnique(DEFAUTS.propreUnique); setRegime(DEFAUTS.regime);
    setVilleCentre(DEFAUTS.villeCentre); setAbattement(DEFAUTS.abattement);
    setAbattementTerrain(DEFAUTS.abattementTerrain); setPrixTerrain(DEFAUTS.prixTerrain);
    setPrixBati(DEFAUTS.prixBati); setAvecCredit(DEFAUTS.avecCredit);
    setAvecTravaux(DEFAUTS.avecTravaux); setTravaux(DEFAUTS.travaux);
    setInclureFrais(DEFAUTS.inclureFrais); setModeCredit(DEFAUTS.modeCredit);
    setCreditManuel(DEFAUTS.creditManuel); setGarantieAuto(DEFAUTS.garantieAuto);
    setHypoManuel(DEFAUTS.hypoManuel); setAccManuel(DEFAUTS.accManuel);
    setActePrincipal(DEFAUTS.actePrincipal);
  };

  const inp = {
    region, prix, typeBien, propre, propreTerrain,
    regime: typeBien === "E" ? regime : "P",
    villeCentre, abattement, abattementTerrain, prixTerrain, prixBati,
  };

  const acte = useMemo(
    () => (vente === "gre" ? calcAchat(inp) : calcBiddit(inp)),
    [vente, region, prix, typeBien, propreUnique, regime, villeCentre, abattement, abattementTerrain, prixTerrain, prixBati]
  );

  const base = prix + (avecTravaux ? travaux : 0);
  const resolu = useMemo(
    () => resoudreCredit({ base, inclureFrais, totalActe: acte.total, tauxAccessoires: 0.1, habUnique, actePrincipal }),
    [base, inclureFrais, acte.total, habUnique, actePrincipal]
  );

  const credit = modeCredit === "auto" ? resolu.montant : creditManuel;
  const hypotheque = garantieAuto ? credit : hypoManuel;
  const accessoires = garantieAuto ? Math.round(credit * 0.1) : accManuel;

  const cred = useMemo(
    () => calcCredit({ credit, hypotheque, accessoires, habUnique, actePrincipal }),
    [credit, hypotheque, accessoires, habUnique, actePrincipal]
  );

  // Tant qu'aucun prix n'est saisi, on n'affiche aucun chiffre : un résultat
  // calculé sur un prix de 0 € n'aurait aucun sens pour la personne.
  const actif = prix > 0;

  const totalFrais = acte.total + (avecCredit ? cred.total : 0);
  const pctPrix = prix > 0 ? (totalFrais / prix) * 100 : 0;
  const quotite = prix > 0 && avecCredit ? (credit / prix) * 100 : 0;
  const apport = base + totalFrais - (avecCredit ? credit : 0);

  const repartition = useMemo(() => {
    if (vente !== "gre") return null;
    const acc = { etat: 0, notaire: 0, tiers: 0 };
    acte.lignes.forEach((l: any) => ((acc as any)[l[2]] += r2(l[1])));
    if (avecCredit) cred.lignes.forEach((l: any) => ((acc as any)[l[2]] += r2(l[1])));
    return acc;
  }, [acte, cred, avecCredit, vente]);

  const showAbattement = region === "BXL" && typeBien === "E" && propre === "A" && prix <= 600000 && (vente === "biddit" || regime === "P" || (regime === "S" && prixTerrain <= 300000));
  const showAbattementT = region === "BXL" && typeBien === "F" && propreTerrain === "AA" && prix <= 300000;
  const showVilleCentre = region === "VL" && typeBien === "E" && propre === "A" && (vente === "biddit" || regime === "P");
  const showRegime = vente === "gre" && typeBien === "E";
  const showMixte = showRegime && regime === "S";

  return (
    <div className="gi">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');${CSS}`}</style>

      <div className="gi-wrap">
        <header className="gi-noprint">
          <p className="gi-eyebrow">Outil gratuit · barèmes officiels au 01.01.2026</p>
          <h1>Combien coûte votre acte d'achat&nbsp;?</h1>
          <p className="gi-lead">
            Achat de gré à gré, vente publique en ligne (Biddit) et acte de crédit — y compris les crédits qui financent
            les travaux ou les frais. Le décompte complet dans un seul écran, ligne par ligne.
          </p>
        </header>

        <div className="gi-grid">
          {/* ---------------------------- Saisie ---------------------------- */}
          <div className="gi-card gi-noprint">
            <p className="gi-sect">Le bien</p>

            <Field label="Comment achetez-vous ?">
              <Choice value={vente} onChange={setVente} options={[{ v: "gre", l: "De gré à gré" }, { v: "biddit", l: "Vente publique (Biddit)" }]} />
            </Field>

            <Field label="Région">
              <Choice value={region} onChange={setRegion} cols={3} options={[{ v: "WL", l: "Wallonie" }, { v: "BXL", l: "Bruxelles" }, { v: "VL", l: "Flandre" }]} />
            </Field>

            <Field label={vente === "biddit" ? "Montant de l'enchère" : "Prix d'acquisition"}>
              <Money value={prix} onChange={setPrix} />
            </Field>

            <Field label="Type de bien">
              <Choice value={typeBien} onChange={setTypeBien} options={[{ v: "E", l: "Maison / appartement" }, { v: "F", l: "Terrain à bâtir" }]} />
            </Field>

            {typeBien === "E" ? (
              <Field label="Est-ce votre habitation propre et unique ?" hint="Vous ne possédez aucun autre logement et vous vous y installerez.">
                <Choice value={propre} onChange={setPropreUniqueFrom} options={[{ v: "A", l: "Oui" }, { v: "B", l: "Non" }]} />
              </Field>
            ) : (
              <Field label="Comptez-vous y bâtir votre habitation propre et unique ?">
                <Choice value={propreTerrain} onChange={setPropreUniqueFrom} options={[{ v: "AA", l: "Oui" }, { v: "BB", l: "Non" }]} />
              </Field>
            )}

            {showVilleCentre && (
              <Field label="Le bien se situe-t-il dans une ville-centre flamande ?" hint="Fixe le plafond de la réduction « habitation modeste » : 240 000 € en ville-centre, 220 000 € ailleurs.">
                <Choice value={villeCentre} onChange={setVilleCentre} options={[{ v: "C", l: "Oui" }, { v: "D", l: "Non / je ne sais pas" }]} />
              </Field>
            )}

            {showRegime && (
              <Field label="Régime fiscal de l'achat">
                <Choice
                  value={regime}
                  onChange={setRegime}
                  cols={1}
                  options={[
                    { v: "P", l: "Droits d'enregistrement (bien existant)" },
                    { v: "Q", l: "TVA 21 % (neuf, vendu par un promoteur)" },
                    { v: "S", l: "Mixte — terrain aux droits + bâtiment à la TVA" },
                  ]}
                />
              </Field>
            )}

            {showMixte && (
              <div className="gi-box">
                <div className="gi-box-2">
                  <div>
                    <div className="gi-label">Part terrain</div>
                    <Money value={prixTerrain} onChange={setPrixTerrain} />
                  </div>
                  <div>
                    <div className="gi-label">Part bâtiment</div>
                    <Money value={prixBati} onChange={setPrixBati} />
                  </div>
                </div>
                <p className="gi-note">
                  Le total des deux parts doit correspondre au prix d'acquisition ({eur0(prix)}).
                  {prixTerrain + prixBati !== prix && prix > 0 ? (
                    <span className="gi-warn"> Écart actuel : {eur0(prix - prixTerrain - prixBati)}.</span>
                  ) : null}
                </p>
              </div>
            )}

            {showAbattement && (
              <Field label="Abattement bruxellois de 200 000 € ?" hint="Premier achat, résidence principale pendant 3 ans minimum.">
                <Choice value={abattement} onChange={setAbattement} options={[{ v: "Z", l: "Oui, j'y ai droit" }, { v: "X", l: "Non / je ne sais pas" }]} />
              </Field>
            )}
            {showAbattementT && (
              <Field label="Abattement bruxellois de 100 000 € (terrain) ?">
                <Choice value={abattementTerrain} onChange={setAbattementTerrain} options={[{ v: "ZF", l: "Oui, j'y ai droit" }, { v: "X", l: "Non / je ne sais pas" }]} />
              </Field>
            )}

            <hr className="gi-sep" />

            <button type="button" aria-pressed={avecCredit} className="gi-switch" onClick={() => setAvecCredit(!avecCredit)}>
              <span className="gi-track"><span className="gi-knob" /></span>
              <span className="gi-switch-l">J'emprunte pour financer cet achat</span>
            </button>

            {avecCredit && (
              <div style={{ marginTop: 22 }}>
                <p className="gi-sect">Le crédit</p>

                <Field label="Que doit couvrir le crédit ?">
                  <Check locked on title="Le prix d'acquisition" desc={eur0(prix)} onToggle={() => {}} />
                  <Check
                    on={avecTravaux}
                    onToggle={() => setAvecTravaux(!avecTravaux)}
                    title="Des travaux de rénovation"
                    desc="Le montant emprunté dépasse alors le prix d'achat."
                  />
                  <Check
                    on={inclureFrais}
                    onToggle={() => setInclureFrais(!inclureFrais)}
                    title="Les frais d'acte"
                    desc="Le crédit dit « à 105 % » ou « à 125 % » : vous empruntez aussi de quoi payer le notaire."
                  />
                </Field>

                {avecTravaux && (
                  <Field label="Montant des travaux">
                    <Money value={travaux} onChange={setTravaux} />
                  </Field>
                )}

                <Field label="Montant du crédit">
                  <Choice
                    value={modeCredit}
                    onChange={setModeCredit}
                    options={[{ v: "auto", l: "Calculé pour moi" }, { v: "manuel", l: "Je saisis le montant" }]}
                  />
                  <div style={{ marginTop: 10 }}>
                    {modeCredit === "auto" ? (
                      <Money value={resolu.montant} readOnly onChange={() => {}} />
                    ) : (
                      <Money value={creditManuel} onChange={setCreditManuel} />
                    )}
                  </div>
                  {modeCredit === "auto" && (
                    <div className="gi-hint">
                      {eur0(prix)} de prix
                      {avecTravaux ? ` + ${eur0(travaux)} de travaux` : ""}
                      {inclureFrais ? ` + ${eur0(resolu.fraisActe)} de frais d'acte` : ""}
                      {inclureFrais ? " — les frais de l'acte de crédit gonflant eux-mêmes le montant emprunté, le calcul est résolu par itération." : ""}
                    </div>
                  )}
                  {prix > 0 && <div className="gi-hint">Quotité : {quotite.toFixed(0)} % du prix d'acquisition.</div>}
                </Field>

                <Field
                  label={<>Ce crédit finance-t-il votre habitation propre et unique ?<span className="gi-linked">↕ lié</span></>}
                  hint="Même question que plus haut : les deux réponses restent toujours identiques."
                >
                  <Choice value={habUnique} onChange={setPropreUniqueFrom} options={[{ v: "K", l: "Oui" }, { v: "L", l: "Non" }]} />
                </Field>

                <Field label="L'acte de crédit est-il l'acte principal ?" hint="Non s'il est signé le même jour que l'acte d'achat chez le même notaire : les frais administratifs et les débours sont alors réduits.">
                  <Choice value={actePrincipal} onChange={setActePrincipal} options={[{ v: "A", l: "Oui / je ne sais pas" }, { v: "B", l: "Non" }]} />
                </Field>

                <button type="button" aria-pressed={!garantieAuto} className="gi-switch" onClick={() => setGarantieAuto(!garantieAuto)}>
                  <span className="gi-track"><span className="gi-knob" /></span>
                  <span className="gi-switch-l">Ajuster la garantie hypothécaire</span>
                </button>

                {garantieAuto ? (
                  <p className="gi-hint" style={{ marginTop: 10 }}>
                    Inscription sur {eur0(hypotheque)} en principal + {eur0(accessoires)} d'accessoires (10 %), l'usage courant.
                  </p>
                ) : (
                  <div className="gi-box" style={{ marginTop: 16, marginBottom: 0 }}>
                    <div className="gi-box-2">
                      <div>
                        <div className="gi-label">Principal de l'hypothèque</div>
                        <Money value={hypoManuel} onChange={setHypoManuel} />
                      </div>
                      <div>
                        <div className="gi-label">Accessoires</div>
                        <Money value={accManuel} onChange={setAccManuel} />
                      </div>
                    </div>
                    <p className="gi-note">Les accessoires couvrent les intérêts et frais garantis par l'hypothèque.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ---------------------------- Résultat ---------------------------- */}
          <div className="gi-stack tight">
            {!actif && (
              <div className="gi-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 7h6" /><path d="M9 11h6" /><path d="M9 15h3" />
                  <rect x="4" y="3" width="16" height="18" rx="2" />
                </svg>
                <b>Indiquez d'abord un prix</b>
                <span>
                  Le décompte s'affichera dès que vous aurez saisi le{" "}
                  {vente === "biddit" ? "montant de votre enchère" : "prix d'acquisition"}.
                </span>
              </div>
            )}

            {actif && (
              <>
            <div className="gi-card gi-print gi-recap">
              <h2>Estimation des frais d'acte</h2>
              <p>
                guideimmo.be — document généré le{" "}
                {new Date().toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <dl>
                <dt>Type de vente</dt>
                <dd>{vente === "gre" ? "De gré à gré" : "Vente publique en ligne (Biddit)"}</dd>
                <dt>Région</dt>
                <dd>{(LibelleRegion as any)[region]}</dd>
                <dt>{vente === "biddit" ? "Montant de l'enchère" : "Prix d'acquisition"}</dt>
                <dd>{eur0(prix)}</dd>
                <dt>Type de bien</dt>
                <dd>{typeBien === "E" ? "Maison / appartement" : "Terrain à bâtir"}</dd>
                <dt>Habitation propre et unique</dt>
                <dd>{oui ? "Oui" : "Non"}</dd>
                {showRegime && (<><dt>Régime fiscal</dt><dd>{(LibelleRegime as any)[regime]}</dd></>)}
                {showMixte && (<><dt>Répartition</dt><dd>{eur0(prixTerrain)} terrain / {eur0(prixBati)} bâtiment</dd></>)}
                {showVilleCentre && (<><dt>Ville-centre flamande</dt><dd>{villeCentre === "C" ? "Oui" : "Non"}</dd></>)}
                {showAbattement && (<><dt>Abattement bruxellois</dt><dd>{abattement === "Z" ? "Appliqué (200 000 €)" : "Non appliqué"}</dd></>)}
                {showAbattementT && (<><dt>Abattement bruxellois</dt><dd>{abattementTerrain === "ZF" ? "Appliqué (100 000 €)" : "Non appliqué"}</dd></>)}
                {avecCredit && (
                  <>
                    <dt>Montant du crédit</dt>
                    <dd>{eur0(credit)} ({quotite.toFixed(0)} % du prix)</dd>
                    <dt>Le crédit couvre</dt>
                    <dd>
                      Le prix
                      {avecTravaux ? `, les travaux (${eur0(travaux)})` : ""}
                      {inclureFrais ? ", les frais d'acte" : ""}
                    </dd>
                    <dt>Garantie hypothécaire</dt>
                    <dd>{eur0(hypotheque)} + {eur0(accessoires)} d'accessoires</dd>
                    <dt>Acte de crédit</dt>
                    <dd>{actePrincipal === "B" ? "Acte secondaire" : "Acte principal"}</dd>
                  </>
                )}
              </dl>
            </div>

            <div className="gi-total">
              <p className="gi-sect">Frais à prévoir en plus du prix</p>
              <div className="gi-big">{eur(totalFrais)}</div>
              <div className="gi-sub">
                soit {pctPrix.toFixed(1).replace(".", ",")} % du prix
                {avecCredit
                  ? ` · quotité ${quotite.toFixed(0)} % · apport nécessaire ${eur0(Math.max(apport, 0))}`
                  : ` · budget total ${eur0(prix + totalFrais)}`}
              </div>

              {repartition && totalFrais > 0 && (
                <>
                  <hr className="gi-total-sep" />
                  <div className="gi-bar">
                    <div style={{ width: `${(repartition.etat / totalFrais) * 100}%`, background: "#3B82F6" }} />
                    <div style={{ width: `${(repartition.notaire / totalFrais) * 100}%`, background: "#F59E0B" }} />
                    <div style={{ width: `${(repartition.tiers / totalFrais) * 100}%`, background: "#64748B" }} />
                  </div>
                  <div className="gi-legend">
                    {[["État & Région", repartition.etat, "#3B82F6"], ["Notaire", repartition.notaire, "#F59E0B"], ["Tiers", repartition.tiers, "#64748B"]].map((x: any) => (
                      <div key={x[0]}>
                        <span><i style={{ background: x[2] }} />{x[0]}</span>
                        <b>{eur0(x[1])}</b>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="gi-card">
              <div className="gi-stack">
                <Decompte
                  titre={vente === "gre" ? "Acte d'achat" : "Vente publique (Biddit)"}
                  sousTitre={vente === "biddit" ? "En vente publique, les frais sont un forfait calculé sur l'enchère, dont on déduit les réductions applicables." : undefined}
                  res={acte}
                />
                {avecCredit && <Decompte titre="Acte de crédit hypothécaire" sousTitre={`Sur un crédit de ${eur0(credit)}`} res={cred} />}
              </div>
            </div>

            <div className="gi-actions gi-noprint">
              <button type="button" className="gi-btn" onClick={reinitialiser}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" />
                </svg>
                Réinitialiser
              </button>
              <button type="button" className="gi-btn primary" onClick={() => window.print()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3v12" /><path d="m7 12 5 5 5-5" /><path d="M5 21h14" />
                </svg>
                Télécharger en PDF
              </button>
            </div>

            <p className="gi-disc">
              Estimation indicative fondée sur les barèmes en vigueur au 1<sup>er</sup> janvier 2026 (honoraires fixés par
              arrêté royal, identiques chez tous les notaires belges). De nombreuses situations particulières peuvent
              modifier le résultat — reportabilité des droits, mobilier valorisé séparément, conditions suspensives.
              Un crédit couvrant les travaux ou les frais reste soumis à l'accord de la banque et à ses règles de quotité.
              Le décompte définitif est établi par votre notaire.
            </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
