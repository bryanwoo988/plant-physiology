/* Pure numbers behind the interactive figures. No DOM; unit-tested in
   tests/plantmath.test.js. Units: MPa, mol/L, °C, μmol m⁻² s⁻¹. */

export const R = 0.008314;   // L·MPa·mol⁻¹·K⁻¹

// van 't Hoff: Ψs = −CiRT (dilute solutions).
export const osmoticPotential = (molar, i = 1, tempC = 20) => -molar * i * R * (tempC + 273.15);

// Ψ of a water vapour atmosphere at relative humidity rh (0–1): Ψ = (RT/V̄w) ln(rh).
// V̄w = 0.018 L/mol, so RT/V̄w ≈ 135 MPa at 20 °C.
export const airWaterPotential = (rh, tempC = 20) => (R * (tempC + 273.15) / 0.018) * Math.log(Math.max(rh, 1e-6));

/* A cell with osmotic potential psiS and turgor psiP is dropped into a
   solution of water potential psiOut. Volume change is ignored (a rigid
   wall), so at equilibrium the turgor simply makes up the difference. */
export function cellInSolution({ psiS, psiP, psiOut }) {
  const psiCell = psiP + psiS;
  const diff = psiOut - psiCell;
  const flow = Math.abs(diff) < 1e-9 ? 'none' : diff > 0 ? 'in' : 'out';
  const plasmolysed = psiOut < psiS;
  return { psiCell, flow, plasmolysed, finalP: plasmolysed ? 0 : psiOut - psiS };
}

/* Non-rectangular hyperbola for the light-response of net photosynthesis.
   I = PPFD, phi = quantum yield, pmax = gross light-saturated rate,
   theta = curvature (0–1), rd = dark respiration. */
export function netPhotosynthesis(I, { phi = 0.05, pmax = 25, theta = 0.8, rd = 1.5 } = {}) {
  const a = phi * I + pmax;
  const gross = (a - Math.sqrt(a * a - 4 * theta * phi * I * pmax)) / (2 * theta);
  return gross - rd;
}

// Light at which net photosynthesis is zero (light compensation point), by bisection.
export function compensationPoint(params) {
  let lo = 0, hi = 2000;
  if (netPhotosynthesis(hi, params) < 0) return null;
  for (let k = 0; k < 60; k++) {
    const mid = (lo + hi) / 2;
    if (netPhotosynthesis(mid, params) < 0) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/* Photoperiodic flowering, idealised: a short-day plant flowers when the
   uninterrupted night is at least the critical night length; a long-day
   plant when it is shorter. A night break in the middle of the dark
   period splits the night in two. */
export function longestNight(dayHours, nightBreak = false) {
  const night = 24 - dayHours;
  return nightBreak ? night / 2 : night;
}
export function flowers(type, { dayHours, nightBreak = false, critical }) {
  const n = longestNight(dayHours, nightBreak);
  return type === 'SDP' ? n >= critical : n < critical;
}

/* Nernst: the inside concentration an ion would reach by passive movement
   alone, given the outside concentration, its charge z and the membrane
   potential E (mV, inside relative to outside, 25 °C). */
export const nernstInside = (cOut, z, E) => cOut * 10 ** (-z * E / 59);

// 'uptake' if the cell holds more than passive movement explains, 'expel' if less.
export function nernstVerdict(actual, predicted, tolerance = 0.2) {
  const r = actual / predicted;
  if (Math.abs(Math.log10(r)) <= Math.log10(1 + tolerance)) return 'passive';
  return r > 1 ? 'uptake' : 'expel';
}

// ΔG = ΔG°′ + 2.3RT log Γ (kJ/mol, 25 °C).
export const RT23 = 2.303 * 0.008314 * 298.15;
export const deltaG = (dG0, logGamma) => dG0 + RT23 * logGamma;

// Photon energy: per photon (J) and per mole (kJ/mol) at wavelength nm.
export const H = 6.626e-34, C = 2.998e8, NA = 6.022e23;
export const photonJ = nm => H * C / (nm * 1e-9);
export const photonKJmol = nm => photonJ(nm) * NA / 1000;

/* Schematic absorption bands (sums of Gaussians), peaks placed after the
   positions in Hopkins & Hüner 2009 Figs 6.8 and 6.12; shapes are drawn, not
   measured data. Returns relative absorbance 0–1. */
const g = (x, mu, sd, a) => a * Math.exp(-((x - mu) ** 2) / (2 * sd * sd));
export const SPECTRA = {
  chlA: nm => g(nm, 430, 14, 1) + g(nm, 662, 11, 0.78) + g(nm, 615, 12, 0.12) + g(nm, 410, 12, 0.5),
  chlB: nm => g(nm, 453, 13, 1) + g(nm, 642, 10, 0.62) + g(nm, 595, 14, 0.1),
  carot: nm => g(nm, 425, 11, 0.62) + g(nm, 451, 12, 1) + g(nm, 478, 11, 0.86),
};

// De-epoxidation state of the xanthophyll pool: (A/2 + Z) / (V + A + Z).
export const deps = (v, a, z) => (v + a + z > 0 ? (a / 2 + z) / (v + a + z) : 0);
