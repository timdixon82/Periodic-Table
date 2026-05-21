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

// Returns the CSS custom property name for a given category key.
function catVar(cat) {
  return CAT_VAR[cat] || '--unknown';
}

// Builds the periodic table grid and attaches all event listeners.
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
        btn.setAttribute('aria-rowindex', rowNum <= 7 ? rowNum : rowNum - 1);
        btn.setAttribute('aria-colindex', col);
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', (!firstBtn) ? '0' : '-1');

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
        grid.appendChild(btn);

        if (!btnGrid[rowNum]) { btnGrid[rowNum] = {}; }
        btnGrid[rowNum][col] = btn;
        if (!firstBtn) { firstBtn = btn; }

      } else if ((rowNum === 6 || rowNum === 7) && col === 3) {
        const ph = document.createElement('button');
        ph.type = 'button';
        ph.className = 'series-btn';
        ph.setAttribute('role', 'gridcell');
        ph.setAttribute('aria-rowindex', rowNum);
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
        grid.appendChild(ph);

        if (!btnGrid[rowNum]) { btnGrid[rowNum] = {}; }
        btnGrid[rowNum][col] = ph;

      } else {
        const empty = document.createElement('div');
        empty.setAttribute('role', 'none');
        // Inline style removed: transparent background and no border are the
        // default for a div, so no style attribute is needed here.
        grid.appendChild(empty);
      }
    }
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

// Implements roving tab-index: sets tabindex="0" on the target and "-1" on all others.
function setRovingTabindex(target) {
  document.querySelectorAll('#pt-grid .el-btn, #pt-grid .series-btn').forEach(function (b) {
    b.setAttribute('tabindex', b === target ? '0' : '-1');
  });
}

// Handles arrow-key, Home, and End navigation within the grid.
function handleGridKeydown(e) {
  const btn = e.currentTarget;
  const row = parseInt(btn.dataset.row || btn.getAttribute('aria-rowindex'), 10);
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

// Finds the nearest occupied cell in the given row, starting from the given column.
function findNearest(row, col, dir) {
  const b = btnGrid[row] && btnGrid[row][col];
  if (b) { return b; }

  if (dir === 'ArrowRight' || dir === 'End') {
    for (let c = col; c <= 18; c++) {
      const x = btnGrid[row] && btnGrid[row][c];
      if (x) { return x; }
    }
  } else if (dir === 'ArrowLeft' || dir === 'Home') {
    for (let c = col; c >= 1; c--) {
      const x = btnGrid[row] && btnGrid[row][c];
      if (x) { return x; }
    }
  } else {
    for (let o = 0; o <= 18; o++) {
      const x1 = btnGrid[row] && btnGrid[row][col + o];
      if (x1) { return x1; }
      const x2 = btnGrid[row] && btnGrid[row][col - o];
      if (x2) { return x2; }
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

  const nameDiv = document.createElement('div');
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

  announce(`${el.name}, ${el.sym}, atomic number ${el.n}. ${el.desc.substring(0, 120)}.`);
}

// Creates a stat box element with a label and value.
function makeStatBox(label, value) {
  const box = document.createElement('div');
  box.className = 'stat-box';

  const lbl = document.createElement('div');
  lbl.className = 's-label';
  lbl.textContent = label;

  const val = document.createElement('div');
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
    if (show) { count++; }
  });

  if (q) {
    announce(`${count} element${count !== 1 ? 's' : ''} match "${searchInput.value}".`);
  }
}

// Initialise the grid on page load.
buildGrid();
