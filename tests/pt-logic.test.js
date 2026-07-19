// Unit tests for the pure lookup, filter, and search logic in
// js/pt-logic.js, run against the real element data in
// js/elements-data.js.
//
// These tests assert against INDEPENDENT chemistry facts (element symbols,
// atomic numbers, and category membership as taught in general chemistry),
// not against whatever pt-logic.js happens to compute. For example,
// Hydrogen is symbol H and atomic number 1, Iron is symbol Fe and atomic
// number 26, and Gold is symbol Au and atomic number 79 — these are checked
// directly, independent of the code under test.

import { describe, it, expect } from 'vitest';
import { ELEMENTS } from '../js/elements-data.js';
import {
  buildElementMap,
  getElementByNumber,
  getElementAt,
  elementMatchesQuery,
  elementMatchesFilter,
  filterElements,
} from '../js/pt-logic.js';

describe('getElementByNumber', () => {
  it('finds Hydrogen at atomic number 1', () => {
    const el = getElementByNumber(ELEMENTS, 1);
    expect(el.sym).toBe('H');
    expect(el.name).toBe('Hydrogen');
  });

  it('finds Iron at atomic number 26', () => {
    const el = getElementByNumber(ELEMENTS, 26);
    expect(el.sym).toBe('Fe');
    expect(el.name).toBe('Iron');
  });

  it('finds Gold at atomic number 79', () => {
    const el = getElementByNumber(ELEMENTS, 79);
    expect(el.sym).toBe('Au');
    expect(el.name).toBe('Gold');
  });

  it('accepts a numeric string for the atomic number', () => {
    const el = getElementByNumber(ELEMENTS, '26');
    expect(el.sym).toBe('Fe');
  });

  it('returns undefined for an atomic number with no element', () => {
    expect(getElementByNumber(ELEMENTS, 0)).toBeUndefined();
    expect(getElementByNumber(ELEMENTS, 200)).toBeUndefined();
  });

  it('returns undefined for a non-numeric input, without throwing', () => {
    expect(getElementByNumber(ELEMENTS, 'not-a-number')).toBeUndefined();
    expect(getElementByNumber(ELEMENTS, null)).toBeUndefined();
    expect(getElementByNumber(ELEMENTS, undefined)).toBeUndefined();
  });
});

describe('buildElementMap', () => {
  it('builds a map keyed by atomic number covering all 118 elements', () => {
    const map = buildElementMap(ELEMENTS);
    expect(Object.keys(map)).toHaveLength(118);
    expect(map[1].sym).toBe('H');
    expect(map[118].sym).toBe('Og');
  });
});

describe('getElementAt', () => {
  it('finds Hydrogen at grid row 1, column 1', () => {
    const el = getElementAt(ELEMENTS, 1, 1);
    expect(el.sym).toBe('H');
  });

  it('finds Helium at grid row 1, column 18 (top-right corner)', () => {
    const el = getElementAt(ELEMENTS, 1, 18);
    expect(el.sym).toBe('He');
  });

  it('returns undefined for an empty grid cell', () => {
    // Row 1, column 2 is empty on the standard periodic table layout:
    // only Hydrogen (column 1) and Helium (column 18) occupy period 1.
    expect(getElementAt(ELEMENTS, 1, 2)).toBeUndefined();
  });
});

describe('elementMatchesQuery', () => {
  const hydrogen = getElementByNumber(ELEMENTS, 1);

  it('matches a name substring', () => {
    expect(elementMatchesQuery(hydrogen, 'hydro')).toBe(true);
  });

  it('matches case-insensitively', () => {
    expect(elementMatchesQuery(hydrogen, 'HYDROGEN')).toBe(true);
    expect(elementMatchesQuery(hydrogen, 'HyDrO')).toBe(true);
  });

  it('matches a symbol prefix, case-insensitively', () => {
    expect(elementMatchesQuery(hydrogen, 'h')).toBe(true);
    expect(elementMatchesQuery(hydrogen, 'H')).toBe(true);
  });

  it('does not match a symbol that is only a substring, not a prefix', () => {
    // Iron's symbol is "Fe"; "e" is not a prefix of "Fe", and "iron" (the
    // name) contains no letter "e" either, so this query should not match.
    const iron = getElementByNumber(ELEMENTS, 26);
    expect(elementMatchesQuery(iron, 'e')).toBe(false);
  });

  it('matches an exact atomic number', () => {
    expect(elementMatchesQuery(hydrogen, '1')).toBe(true);
  });

  it('does not match an unrelated atomic number', () => {
    expect(elementMatchesQuery(hydrogen, '2')).toBe(false);
  });

  it('does not match an unrelated name or symbol', () => {
    expect(elementMatchesQuery(hydrogen, 'gold')).toBe(false);
    expect(elementMatchesQuery(hydrogen, 'xyz')).toBe(false);
  });

  it('treats an empty or whitespace-only query as matching everything', () => {
    expect(elementMatchesQuery(hydrogen, '')).toBe(true);
    expect(elementMatchesQuery(hydrogen, '   ')).toBe(true);
  });
});

describe('elementMatchesFilter', () => {
  it('matches when the element category equals the active filter', () => {
    const gold = getElementByNumber(ELEMENTS, 79);
    expect(elementMatchesFilter(gold, 'transition-metal')).toBe(true);
  });

  it('does not match a different category', () => {
    const gold = getElementByNumber(ELEMENTS, 79);
    expect(elementMatchesFilter(gold, 'noble-gas')).toBe(false);
  });

  it('matches everything when no filter is active', () => {
    const gold = getElementByNumber(ELEMENTS, 79);
    expect(elementMatchesFilter(gold, null)).toBe(true);
    expect(elementMatchesFilter(gold, '')).toBe(true);
  });
});

describe('filterElements', () => {
  it('filtering by the noble-gas category returns exactly the known noble gases', () => {
    // Independent reference: the noble gases are Helium, Neon, Argon,
    // Krypton, Xenon, Radon, and Oganesson.
    const result = filterElements(ELEMENTS, 'noble-gas', '');
    const symbols = result.map((el) => el.sym).sort();
    expect(symbols).toEqual(['Ar', 'He', 'Kr', 'Ne', 'Og', 'Rn', 'Xe']);
  });

  it('filtering by the halogen category returns exactly the known halogens', () => {
    // Independent reference: the halogens are Fluorine, Chlorine, Bromine,
    // Iodine, Astatine, and Tennessine.
    const result = filterElements(ELEMENTS, 'halogen', '');
    const symbols = result.map((el) => el.sym).sort();
    expect(symbols).toEqual(['At', 'Br', 'Cl', 'F', 'I', 'Ts']);
  });

  it('combines a category filter with a search query', () => {
    // Of the alkali metals (Lithium, Sodium, Potassium, Rubidium, Caesium,
    // Francium), only Sodium's symbol ("Na") starts with "na", and none of
    // the other names contain "na" as a substring.
    const result = filterElements(ELEMENTS, 'alkali-metal', 'na');
    expect(result.map((el) => el.sym)).toEqual(['Na']);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterElements(ELEMENTS, 'noble-gas', 'iron')).toEqual([]);
  });

  it('returns all elements when no filter and no query are active', () => {
    expect(filterElements(ELEMENTS, null, '')).toHaveLength(118);
  });
});
