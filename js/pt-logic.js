/* pt-logic.js
 *
 * Pure, DOM-free lookup, filter, and search logic for the periodic table,
 * extracted from periodic-table.js so it can be unit tested independently
 * of the browser. periodic-table.js imports these functions rather than
 * reimplementing them.
 */

'use strict';

/**
 * Builds a lookup map from atomic number to element object.
 * @param {Array<object>} elements
 * @returns {Object<number, object>}
 */
function buildElementMap(elements) {
  const map = {};
  elements.forEach(function (e) {
    map[e.n] = e;
  });
  return map;
}

/**
 * Looks up an element by atomic number. Accepts a number or a numeric
 * string; returns undefined for anything that does not parse to a finite
 * integer, or that does not match any element.
 * @param {Array<object>} elements
 * @param {number|string} n
 * @returns {object|undefined}
 */
function getElementByNumber(elements, n) {
  const parsed = parseInt(n, 10);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }
  return elements.find(function (e) {
    return e.n === parsed;
  });
}

/**
 * Looks up the element occupying a given grid row and column. Returns
 * undefined when no element sits at that position (an empty cell).
 * @param {Array<object>} elements
 * @param {number} row
 * @param {number} col
 * @returns {object|undefined}
 */
function getElementAt(elements, row, col) {
  return elements.find(function (e) {
    return e.row === row && e.col === col;
  });
}

/**
 * Tests whether an element matches a free-text search query. A match is
 * case-insensitive and succeeds when the query is a substring of the
 * element's name, a prefix of its symbol, or an exact match of its atomic
 * number. An empty or whitespace-only query matches everything.
 * @param {object} el
 * @param {string} query
 * @returns {boolean}
 */
function elementMatchesQuery(el, query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) {
    return true;
  }
  return el.name.toLowerCase().includes(q)
    || el.sym.toLowerCase().startsWith(q)
    || el.n.toString() === q;
}

/**
 * Tests whether an element matches an active category filter. A null or
 * empty filter matches every element.
 * @param {object} el
 * @param {string|null} activeFilter
 * @returns {boolean}
 */
function elementMatchesFilter(el, activeFilter) {
  return !activeFilter || el.cat === activeFilter;
}

/**
 * Returns the subset of elements that match both the active category
 * filter and the free-text search query.
 * @param {Array<object>} elements
 * @param {string|null} activeFilter
 * @param {string} query
 * @returns {Array<object>}
 */
function filterElements(elements, activeFilter, query) {
  return elements.filter(function (el) {
    return elementMatchesFilter(el, activeFilter) && elementMatchesQuery(el, query);
  });
}

export {
  buildElementMap,
  getElementByNumber,
  getElementAt,
  elementMatchesQuery,
  elementMatchesFilter,
  filterElements,
};
