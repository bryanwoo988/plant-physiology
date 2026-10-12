import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as pm from '../js/plantmath.js';

const near = (a, b, tol) => assert.ok(Math.abs(a - b) <= tol, `${a} not within ${tol} of ${b}`);

test('van ’t Hoff: 0.1 M sucrose ≈ −0.24 MPa, NaCl twice that (20 °C)', () => {
  near(pm.osmoticPotential(0.1, 1, 20), -0.244, 0.005);
  near(pm.osmoticPotential(0.1, 2, 20), -0.487, 0.005);
  assert.equal(pm.osmoticPotential(0), -0);
});

test('air water potential matches Hopkins & Hüner Table 2.2', () => {
  near(pm.airWaterPotential(0.95), -6.9, 0.1);
  near(pm.airWaterPotential(0.5), -93.5, 0.6);
  assert.equal(pm.airWaterPotential(1), 0);
});

test('a cell in a solution: direction and plasmolysis', () => {
  const inPure = pm.cellInSolution({ psiS: -0.8, psiP: 0.2, psiOut: 0 });
  assert.equal(inPure.flow, 'in'); assert.equal(inPure.plasmolysed, false); near(inPure.finalP, 0.8, 1e-9);
  const strong = pm.cellInSolution({ psiS: -0.8, psiP: 0.2, psiOut: -1.2 });
  assert.equal(strong.flow, 'out'); assert.equal(strong.plasmolysed, true); assert.equal(strong.finalP, 0);
});

test('Nernst: K⁺ at −118 mV accumulates 100-fold passively', () => {
  near(pm.nernstInside(1, 1, -118), 100, 0.5);
  near(pm.nernstInside(1, -1, -118), 0.01, 1e-4);
  assert.equal(pm.nernstVerdict(100, 100), 'passive');
  assert.equal(pm.nernstVerdict(500, 100), 'uptake');
  assert.equal(pm.nernstVerdict(5, 100), 'expel');
});

test('ATP at Γ = 10⁻⁴ releases about −55 kJ/mol', () => {
  near(pm.deltaG(-32.2, -4), -55, 1);
  near(pm.deltaG(-32.2, 32.2 / pm.RT23), 0, 1e-9);
});

test('photon energies: 660 nm ≈ 181, 435 nm ≈ 275 kJ/mol', () => {
  near(pm.photonKJmol(660), 181, 1.5);
  near(pm.photonKJmol(435), 275, 1.5);
  near(pm.photonJ(660) * 1e19, 3.01, 0.02);
});

test('light response: negative in the dark, positive in bright light', () => {
  assert.ok(pm.netPhotosynthesis(0) < 0);
  assert.ok(pm.netPhotosynthesis(1500) > 15);
  const lcp = pm.compensationPoint();
  near(pm.netPhotosynthesis(lcp), 0, 1e-6);
  assert.ok(pm.compensationPoint({ pmax: 7, rd: 0.4 }) < lcp, 'shade leaf compensates at lower light');
});

test('photoperiod: Xanthium (critical night 8.5 h) and a night break', () => {
  assert.equal(pm.flowers('SDP', { dayHours: 14, critical: 8.5 }), true);
  assert.equal(pm.flowers('SDP', { dayHours: 16, critical: 8.5 }), false);
  assert.equal(pm.flowers('SDP', { dayHours: 14, nightBreak: true, critical: 8.5 }), false);
  assert.equal(pm.flowers('LDP', { dayHours: 14, critical: 13 }), true);
  assert.equal(pm.flowers('LDP', { dayHours: 8, nightBreak: true, critical: 13 }), true);
});

test('DEPS = (A/2 + Z)/(V + A + Z)', () => {
  assert.equal(pm.deps(10, 10, 20), 0.625);
  assert.equal(pm.deps(0, 0, 0), 0);
});
