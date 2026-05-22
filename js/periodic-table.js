/* periodic-table.js
 *
 * All interactive behaviour for the periodic table page.
 * Depends on elements-data.js, which must be loaded first.
 * The ELEMENTS array and its companion maps are defined there.
 */

'use strict';

// Maps element category keys to CSS custom property names.
const CAT_VAR = {
  'alkali-metal': '--alkali',
  'alkaline-earth': '--alkaline',
  'transition-metal': '--transition',
  'post-transition': '--post-trans',
  'metalloid': '--metalloid',
  'nonmetal': '--nonmetal',
  'halogen': '--halogen',
  'noble-gas': '--noble',
  'lanthanide': '--lanthanide',
  'actinide': '--actinide',
  'unknown': '--unknown',
};

// Maps element category keys to human-readable labels.
const CAT_LABEL = {
  'alkali-metal': 'Alkali Metal',
  'alkaline-earth': 'Alkaline Earth Metal',
  'transition-metal': 'Transition Metal',
  'post-transition': 'Post-Transition Metal',
  'metalloid': 'Metalloid',
  'nonmetal': 'Nonmetal',
  'halogen': 'Halogen',
  'noble-gas': 'Noble Gas',
  'lanthanide': 'Lanthanide',
  'actinide': 'Actinide',
  'unknown': 'Unknown',
};

// Maps element category keys to two-letter abbreviations for the non-colour
// category identifier system. Abbreviations are shown in legend dots and as
// tiny cell badges. WCAG 1.4.1. Simon sections 4.2 and 4.3.
const CAT_ABBR = {
  'alkali-metal': 'AK',
  'alkaline-earth': 'AE',
  'transition-metal': 'TM',
  'post-transition': 'PT',
  'metalloid': 'ML',
  'nonmetal': 'NM',
  'halogen': 'HG',
  'noble-gas': 'NG',
  'lanthanide': 'LA',
  'actinide': 'AC',
  'unknown': '?',
};

// Build a lookup map from atomic number to element object for fast access.
const elMap = {};
ELEMENTS.forEach(function (e) {
  elMap[e.n] = e;
});

const grid = document.getElementById('pt-grid');
const infoPanel = document.getElementById('info-panel');
const srLive = document.getElementById('sr-live');
const searchInput = document.getElementById('search');
const btnGrid = {};
const validRows = [1, 2, 3, 4, 5, 6, 7, 9, 10];

// Skip-link focus redirect for #pt-grid.
// #pt-grid has tabindex="-1" so the "Skip to periodic table" skip link can
// deliver focus to the grid wrapper. When focus arrives on the grid wrapper
// itself, we redirect it to the first focusable roving-tabindex cell, so the
// user lands on an interactive cell rather than the non-interactive wrapper.
// Simon section 13.
grid.addEventListener('focus', function () {
  const firstFocusable = document.querySelector('#pt-grid .el-btn[tabindex="0"], #pt-grid .series-btn[tabindex="0"]');
  if (firstFocusable) {
    firstFocusable.focus();
  }
});

// Returns the CSS custom property name for a given category key.
function catVar(cat) {
  return CAT_VAR[cat] || '--unknown';
}

// Builds the periodic table grid and attaches all event listeners.
// ARIA grid pattern requires grid > row > gridcell. Each data row's cells are
// wrapped in a div with role="row" and aria-rowindex. The gap-spacer div with
// role="presentation" is a direct child of the grid, between row wrappers.
// Carol re-test N1 (WCAG 4.1.2). 2026-05-21.
function buildGrid() {
  const allRows = [1, 2, 3, 4, 5, 6, 7, 'gap', 9, 10];
  let firstBtn = null;

  allRows.forEach(function (rowNum) {
    if (rowNum === 'gap') {
      const s = document.createElement('div');
      s.className = 'gap-spacer';
      s.setAttribute('role', 'presentation');
      grid.appendChild(s);
      return;
    }

    // Create a row wrapper. aria-rowindex sits on the row, not on individual cells.
    const rowWrapper = document.createElement('div');
    rowWrapper.setAttribute('role', 'row');
    rowWrapper.setAttribute('aria-rowindex', rowNum);

    for (let col = 1; col <= 18; col++) {
      const el = ELEMENTS.find(function (e) { return e.row === rowNum && e.col === col; });

      if (el) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'el-btn';
        btn.dataset.n = el.n;
        btn.dataset.row = rowNum;
        btn.dataset.col = col;
        btn.dataset.cat = el.cat;
        btn.setAttribute('role', 'gridcell');
        btn.setAttribute('aria-colindex', col);
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', (!firstBtn) ? '0' : '-1');

        // data-cat-abbr provides the two-letter category abbreviation for the
        // CSS ::after pseudo-element cell badge. aria-hidden in CSS via the
        // pseudo-element itself; the aria-label already names the category.
        // WCAG 1.4.1. Simon section 4.3.
        btn.dataset.catAbbr = CAT_ABBR[el.cat] || '';

        const stStr = el.state !== 'Unknown' ? `, ${el.state} at room temperature` : '';
        btn.setAttribute('aria-label', `${el.name}, symbol ${el.sym}, atomic number ${el.n}, ${CAT_LABEL[el.cat]}${stStr}, atomic mass ${el.mass}`);
        btn.style.setProperty('--el-color', `var(${catVar(el.cat)})`);

        // Build cell content with DOM methods instead of innerHTML to avoid
        // creating an injection sink that future data-source changes could exploit.
        const numSpan = document.createElement('span');
        numSpan.className = 'el-num';
        numSpan.setAttribute('aria-hidden', 'true');
        numSpan.textContent = el.n;

        const symSpan = document.createElement('span');
        symSpan.className = 'el-sym';
        symSpan.setAttribute('aria-hidden', 'true');
        symSpan.textContent = el.sym;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'el-name';
        nameSpan.setAttribute('aria-hidden', 'true');
        nameSpan.textContent = el.name;

        btn.appendChild(numSpan);
        btn.appendChild(symSpan);
        btn.appendChild(nameSpan);

        btn.addEventListener('click', function () { selectElement(el.n); });
        btn.addEventListener('keydown', handleGridKeydown);
        rowWrapper.appendChild(btn);

        if (!btnGrid[rowNum]) { btnGrid[rowNum] = {}; }
        btnGrid[rowNum][col] = btn;
        if (!firstBtn) { firstBtn = btn; }

      } else if ((rowNum === 6 || rowNum === 7) && col === 3) {
        const ph = document.createElement('button');
        ph.type = 'button';
        ph.className = 'series-btn';
        ph.setAttribute('role', 'gridcell');
        ph.setAttribute('aria-colindex', col);
        ph.setAttribute('tabindex', '-1');

        if (rowNum === 6) {
          ph.setAttribute('aria-label', 'Lanthanides 57 to 71. Activate to jump to the lanthanide series below.');
          ph.textContent = 'La–Lu';
          ph.addEventListener('click', function () { jumpToRow(9); });
        } else {
          ph.setAttribute('aria-label', 'Actinides 89 to 103. Activate to jump to the actinide series below.');
          ph.textContent = 'Ac–Lr';
          ph.addEventListener('click', function () { jumpToRow(10); });
        }

        ph.addEventListener('keydown', handleGridKeydown);
        rowWrapper.appendChild(ph);

        if (!btnGrid[rowNum]) { btnGrid[rowNum] = {}; }
        btnGrid[rowNum][col] = ph;

      } else {
        const empty = document.createElement('div');
        empty.setAttribute('role', 'none');
        // Inline style removed: transparent background and no border are the
        // default for a div, so no style attribute is needed here.
        rowWrapper.appendChild(empty);
      }
    }

    grid.appendChild(rowWrapper);
  });
}

// Moves keyboard focus to the first element button in the given row.
function jumpToRow(row) {
  const rowBtns = btnGrid[row];
  if (!rowBtns) { return; }
  const firstCol = Math.min(...Object.keys(rowBtns).map(Number));
  const btn = rowBtns[firstCol];
  if (btn) {
    btn.focus();
    setRovingTabindex(btn);
  }
}

// Returns true when a button may receive focus under the current navigation
// rules. A button is navigable when it exists and is not dimmed by an active
// filter or search. Series-btn cells (Lanthanide / Actinide jump buttons) are
// never dimmed by applyFilters, so they remain navigable whenever visible.
function isNavigable(btn) {
  return btn && !btn.classList.contains('dimmed');
}

// Implements roving tab-index: sets tabindex="0" on the target and "-1" on
// all others. The navigable set is every grid button that passes isNavigable.
// When a filter is active, dimmed buttons receive tabindex="-1", ensuring
// exactly one navigable button holds tabindex="0".
function setRovingTabindex(target) {
  document.querySelectorAll('#pt-grid .el-btn, #pt-grid .series-btn').forEach(function (b) {
    b.setAttribute('tabindex', b === target ? '0' : '-1');
  });
}

// Returns the row index for any grid button, including series-btn elements.
// Element buttons carry data-row directly. Series buttons carry neither
// data-row nor aria-rowindex on themselves; their row is recorded on the
// nearest ancestor with role="row", so we walk up to find it.
function rowOf(btn) {
  if (btn.dataset.row) { return parseInt(btn.dataset.row, 10); }
  const rowEl = btn.closest('[role="row"]');
  if (rowEl) { return parseInt(rowEl.getAttribute('aria-rowindex'), 10); }
  return NaN;
}

// Handles arrow-key, Home, and End navigation within the grid.
// Arrow navigation skips dimmed cells by delegating to findNearest, which
// honours isNavigable. For ArrowUp/ArrowDown, if the target row contains no
// navigable cell the move is silently cancelled (focus stays put).
function handleGridKeydown(e) {
  const btn = e.currentTarget;
  const row = rowOf(btn);
  const col = parseInt(btn.dataset.col || btn.getAttribute('aria-colindex'), 10);
  let tr = row;
  let tc = col;
  let handled = false;

  if (e.key === 'ArrowRight') { tc = col + 1; handled = true; }
  else if (e.key === 'ArrowLeft') { tc = col - 1; handled = true; }
  else if (e.key === 'ArrowDown') {
    const ri = validRows.indexOf(row);
    tr = ri < validRows.length - 1 ? validRows[ri + 1] : row;
    handled = true;
  } else if (e.key === 'ArrowUp') {
    const ri = validRows.indexOf(row);
    tr = ri > 0 ? validRows[ri - 1] : row;
    handled = true;
  } else if (e.key === 'Home') { tc = 1; handled = true; }
  else if (e.key === 'End') { tc = 18; handled = true; }

  if (!handled) { return; }

  e.preventDefault();
  tc = Math.max(1, Math.min(18, tc));
  const found = findNearest(tr, tc, e.key);
  if (found) {
    found.focus();
    setRovingTabindex(found);
  }
}

// Finds the nearest navigable (non-dimmed, occupied) cell in the given row,
// starting from the given column. Direction controls the search order:
//   ArrowRight: scan right from col.
//   ArrowLeft:  scan left from col.
//   Home:       scan right from col 1 (find the leftmost navigable cell).
//   End:        scan left from col 18 (find the rightmost navigable cell).
//   ArrowUp / ArrowDown / other: scan outward from col in both directions.
// Dimmed cells are skipped in every search path.
function findNearest(row, col, dir) {
  const b = btnGrid[row] && btnGrid[row][col];
  if (isNavigable(b)) { return b; }

  if (dir === 'ArrowRight') {
    for (let c = col; c <= 18; c++) {
      const x = btnGrid[row] && btnGrid[row][c];
      if (isNavigable(x)) { return x; }
    }
  } else if (dir === 'ArrowLeft') {
    for (let c = col; c >= 1; c--) {
      const x = btnGrid[row] && btnGrid[row][c];
      if (isNavigable(x)) { return x; }
    }
  } else if (dir === 'Home') {
    // Scan right from col 1 to find the leftmost navigable cell in the row.
    for (let c = 1; c <= 18; c++) {
      const x = btnGrid[row] && btnGrid[row][c];
      if (isNavigable(x)) { return x; }
    }
  } else if (dir === 'End') {
    // Scan left from col 18 to find the rightmost navigable cell in the row.
    for (let c = 18; c >= 1; c--) {
      const x = btnGrid[row] && btnGrid[row][c];
      if (isNavigable(x)) { return x; }
    }
  } else {
    for (let o = 0; o <= 18; o++) {
      const x1 = btnGrid[row] && btnGrid[row][col + o];
      if (isNavigable(x1)) { return x1; }
      const x2 = btnGrid[row] && btnGrid[row][col - o];
      if (isNavigable(x2)) { return x2; }
    }
  }

  return null;
}

// Selects an element by atomic number, updates aria-selected, and renders the detail panel.
function selectElement(n) {
  // Guard: parse n as a base-10 integer and verify it is a finite number.
  // This prevents a malformed data-n attribute from reaching the querySelector
  // template string and throwing a SyntaxError. (Jed code review, Finding 4.)
  n = parseInt(n, 10);
  if (!Number.isFinite(n)) { return; }

  const el = elMap[n];
  if (!el) { return; }

  document.querySelectorAll('#pt-grid .el-btn[aria-selected="true"]').forEach(function (b) {
    b.setAttribute('aria-selected', 'false');
  });

  const btn = document.querySelector(`#pt-grid .el-btn[data-n="${n}"]`);
  if (btn) { btn.setAttribute('aria-selected', 'true'); }

  renderInfo(el);
}

// Renders the element detail panel using DOM methods instead of innerHTML.
// Building the DOM tree with createElement and textContent prevents any
// element property from being interpreted as HTML, even if a future data
// source introduces unexpected characters. (Jed code review, Finding 1.)
function renderInfo(el) {
  const cv = catVar(el.cat);
  infoPanel.style.setProperty('--el-color', `var(${cv})`);

  const st = el.state !== 'Unknown' ? el.state : 'Unknown';
  const period = el.row <= 7 ? el.row : el.row - 2;

  // Clear the panel.
  while (infoPanel.firstChild) {
    infoPanel.removeChild(infoPanel.firstChild);
  }

  // Symbol box (decorative, hidden from assistive technology).
  const symbolBox = document.createElement('div');
  symbolBox.className = 'info-symbol-box';
  symbolBox.setAttribute('aria-hidden', 'true');

  const iNum = document.createElement('span');
  iNum.className = 'i-num';
  iNum.textContent = el.n;

  const iSym = document.createElement('span');
  iSym.className = 'i-sym';
  iSym.textContent = el.sym;

  const iMass = document.createElement('span');
  iMass.className = 'i-mass';
  iMass.textContent = el.mass;

  symbolBox.appendChild(iNum);
  symbolBox.appendChild(iSym);
  symbolBox.appendChild(iMass);

  // Content area.
  const content = document.createElement('div');
  content.className = 'info-content';

  // info-name changed from div to h2. The page h1 is "Periodic Table of
  // Elements"; the element name is the primary heading of the selected-element
  // detail section, so h2 is the correct level. Simon section 6.
  const nameDiv = document.createElement('h2');
  nameDiv.className = 'info-name';
  nameDiv.textContent = el.name;

  const tagsDiv = document.createElement('div');
  tagsDiv.className = 'info-tags';

  const tagCat = document.createElement('span');
  tagCat.className = 'info-tag';
  tagCat.textContent = CAT_LABEL[el.cat];

  const tagState = document.createElement('span');
  tagState.className = 'info-tag';
  tagState.textContent = st;

  const tagPeriod = document.createElement('span');
  tagPeriod.className = 'info-tag';
  tagPeriod.textContent = `Period ${period}`;

  tagsDiv.appendChild(tagCat);
  tagsDiv.appendChild(tagState);
  tagsDiv.appendChild(tagPeriod);

  if (el.col > 2) {
    const tagGroup = document.createElement('span');
    tagGroup.className = 'info-tag';
    tagGroup.textContent = `Group ${el.col}`;
    tagsDiv.appendChild(tagGroup);
  }

  const statsDiv = document.createElement('div');
  statsDiv.className = 'info-stats';

  statsDiv.appendChild(makeStatBox('Atomic No.', el.n));
  statsDiv.appendChild(makeStatBox('Atomic Mass', el.mass));
  statsDiv.appendChild(makeStatBox('Symbol', el.sym));
  statsDiv.appendChild(makeStatBox('State', st));

  const descP = document.createElement('p');
  descP.className = 'info-desc';
  descP.textContent = el.desc;

  content.appendChild(nameDiv);
  content.appendChild(tagsDiv);
  content.appendChild(statsDiv);
  content.appendChild(descP);

  infoPanel.appendChild(symbolBox);
  infoPanel.appendChild(content);

  // Full description announced; .substring(0, 120) removed. Element descriptions
  // are a few sentences each. Announcing the full text serves WCAG 4.1.3.
  // The live region is polite so it will not interrupt ongoing speech.
  // Simon sections 12 and 17.
  announce(`${el.name}, ${el.sym}, atomic number ${el.n}. ${el.desc}.`);
}

// Creates a stat box element with a label and value as a description list.
// The dl/dt/dd pattern provides a native semantic association between label
// and value, which all screen readers understand. Previously used div/div
// with no programmatic relationship. Simon section 6.
function makeStatBox(label, value) {
  const box = document.createElement('dl');
  box.className = 'stat-box';

  const lbl = document.createElement('dt');
  lbl.className = 's-label';
  lbl.textContent = label;

  const val = document.createElement('dd');
  val.className = 's-val';
  val.textContent = value;

  box.appendChild(lbl);
  box.appendChild(val);
  return box;
}

// Announces a message to screen readers via the live region.
// IMPORTANT: This function must always assign to srLive.textContent and never
// to srLive.innerHTML. The message may contain the user's raw search input,
// which would become an XSS sink if assigned as HTML. (Jed code review, Finding 5.)
function announce(msg) {
  srLive.textContent = '';
  requestAnimationFrame(function () {
    srLive.textContent = msg;
  });
}

// Tracks the currently active category filter key, or null when none is active.
let activeFilter = null;

searchInput.addEventListener('input', applyFilters);

searchInput.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const first = document.querySelector('#pt-grid .el-btn:not(.dimmed)');
    if (first) {
      first.focus();
      setRovingTabindex(first);
    }
  }
});

document.querySelectorAll('.filter-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    const cat = btn.dataset.cat;
    const wasPressed = btn.getAttribute('aria-pressed') === 'true';

    document.querySelectorAll('.filter-btn').forEach(function (b) {
      b.setAttribute('aria-pressed', 'false');
    });

    if (!wasPressed) {
      btn.setAttribute('aria-pressed', 'true');
      activeFilter = cat;
      announce(`Showing ${btn.textContent} only.`);
    } else {
      activeFilter = null;
      announce('Filter cleared. Showing all elements.');
    }

    applyFilters();
  });
});

// Applies the active search term and category filter to the grid.
// After updating the dimmed classes, checks whether the element that currently
// holds tabindex="0" (the roving focus owner) has become dimmed. If it has,
// the roving tab-index and focus move to the nearest navigable element so that
// the keyboard user is never left on a filtered-out cell.
//
// aria-hidden is toggled alongside the dimmed class. Setting aria-hidden="true"
// on a filtered-out button removes it from the accessibility tree, so VoiceOver
// and JAWS reading-cursor navigation (VO+Right, linear reading mode, and the
// element rotor) skip it entirely. tabindex="-1" alone only removes a button
// from Tab order; it does not prevent screen-reader linear traversal of the DOM.
// WCAG 1.3.1, 4.1.2. Tim screen-reader re-check, 2026-05-22.
function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();
  let count = 0;

  document.querySelectorAll('#pt-grid .el-btn').forEach(function (btn) {
    const n = parseInt(btn.dataset.n, 10);
    const el = elMap[n];
    if (!el) { return; }

    let show = true;
    if (activeFilter && el.cat !== activeFilter) { show = false; }

    if (q) {
      const ok = el.name.toLowerCase().includes(q)
        || el.sym.toLowerCase().startsWith(q)
        || el.n.toString() === q;
      if (!ok) { show = false; }
    }

    btn.classList.toggle('dimmed', !show);

    // Remove filtered-out buttons from the accessibility tree so VoiceOver and
    // JAWS linear reading skips them. removeAttribute is used for the visible
    // state to keep the DOM clean (aria-hidden="false" is redundant noise).
    if (show) {
      btn.removeAttribute('aria-hidden');
    } else {
      btn.setAttribute('aria-hidden', 'true');
    }

    if (show) { count++; }
  });

  if (q) {
    announce(`${count} element${count !== 1 ? 's' : ''} match "${searchInput.value}".`);
  }

  // Edge case: if the current roving-tabindex owner has become dimmed by the
  // filter, move the roving tab-index (and focus when the grid is active) to
  // the nearest navigable element. This keeps exactly one navigable element at
  // tabindex="0" and prevents a keyboard user from being stranded on a dimmed
  // cell after applying a filter while the grid is focused.
  const currentOwner = document.querySelector('#pt-grid .el-btn[tabindex="0"], #pt-grid .series-btn[tabindex="0"]');
  if (currentOwner && currentOwner.classList.contains('dimmed')) {
    const row = rowOf(currentOwner);
    const col = parseInt(currentOwner.dataset.col || currentOwner.getAttribute('aria-colindex'), 10);
    // Search outward from the dimmed cell's position to find the nearest
    // navigable cell. Try the same row first; findNearest with no direction
    // searches outward in both column directions.
    let nearest = findNearest(row, col, 'other');
    if (!nearest) {
      // If no navigable cell exists in that row, scan all rows for any
      // navigable cell and use the first one found.
      for (let ri = 0; ri < validRows.length; ri++) {
        nearest = findNearest(validRows[ri], col, 'other');
        if (nearest) { break; }
      }
    }
    if (nearest) {
      setRovingTabindex(nearest);
      // Move real focus only when a grid cell currently has focus, so that
      // applying a filter from the filter-button toolbar does not unexpectedly
      // steal focus away from the toolbar.
      if (document.activeElement === currentOwner) {
        nearest.focus();
      }
    }
  }
}

// Initialise the grid on page load.
buildGrid();
