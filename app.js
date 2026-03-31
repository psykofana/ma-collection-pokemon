/* ============================================================
   CONFIGURATION
   ============================================================ */
const SHEET_ID = '13tKsaOj-QwE2b-3FHim0Isacq1Alfe20B8NOLfy02hM';
const SHEETS = [
  { name: 'Divers',         gid: '0',          icon: '🃏', label: 'Divers' },
  { name: 'Reverses',       gid: '826801908',   icon: '🔄', label: 'Reverses' },
  { name: 'Holo',           gid: '873497771',   icon: '✨', label: 'Holo' },
  { name: 'Evolitions',     gid: '2001298664',  icon: '🌀', label: 'Évolutions' },
  { name: 'Pikachu family', gid: '149423930',   icon: '⚡', label: 'Pikachu' },
  { name: 'Zarbi',          gid: '44965854',    icon: '❓', label: 'Zarbi' },
];

// Correspondance état → classe CSS
const ETAT_CLASS = {
  'GEM Mint':   'etat-gem',
  'Nmint/Mint': 'etat-nm',
  'Exc':        'etat-exc',
  'Fine':       'etat-fine',
  'Played':     'etat-played',
  'Poor':       'etat-poor',
  'Missprint':  'etat-played',
};

const ETAT_LABEL = {
  'GEM Mint':   'GEM',
  'Nmint/Mint': 'NM',
  'Exc':        'EX',
  'Fine':       'GD',
  'Played':     'PL',
  'Poor':       'PO',
  'Missprint':  'MS',
};

// Correspondance état tableur → état Cardmarket pour l'URL
const ETAT_CM = {
  'GEM Mint':   1,
  'Nmint/Mint': 2,
  'Exc':        3,
  'Fine':       4,
  'Played':     6,
  'Poor':       7,
  'Missprint':  2,
};

/* ============================================================
   STATE
   ============================================================ */
let allCards = [];
let filteredCards = [];
let activeFilters = { search: '', sheet: '', bloc: '', etat: '', sort: 'nom' };

/* ============================================================
   DATA FETCHING
   ============================================================ */
async function fetchSheet(sheet) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${sheet.gid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erreur HTTP ${res.status} pour ${sheet.name}`);
  const text = await res.text();
  // Google wraps JSON in google.visualization.Query.setResponse({...});
  // The response also starts with /*O_o*/ — find the first { and last }
  const start = text.indexOf('{');
  const end   = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error(`Réponse invalide pour ${sheet.name}`);
  const json = JSON.parse(text.substring(start, end + 1));
  return parseSheetData(json, sheet.name);
}

function cellVal(c) {
  // Extract raw value from a gviz cell object
  // Numbers arrive as {v: 3.0, f: "3,00 €"}, strings as {v: "text"}, null cells as null
  if (!c || c.v === null || c.v === undefined) return '';
  return c.v; // Return raw value (number or string)
}

function parseSheetData(json, sheetName) {
  const rows = json.table?.rows || [];
  const cards = [];

  for (const row of rows) {
    if (!row.c) continue;
    // Get raw values from cells (numbers stay as numbers, strings as strings)
    const raw = row.c.map(cellVal);

    // Colonnes: [0]=index, [1]=Nom, [2]=Attribut, [3]=Numéro, [4]=Année,
    //           [5]=Bloc, [6]=Série, [7]=Reverse/Holo, [8]=Stock, [9]=Etat, [10]=Prix/u, [11]=PrixVente, [12]=Image
    const nom = (raw[1] !== '' ? String(raw[1]).trim() : '');
    if (!nom || nom === 'Nom' || nom === 'Attribut supp.') continue; // skip headers & empty

    // Stock — gviz returns float (e.g. 1.0), convert to int
    const stockRaw = raw[8];
    const stock = (typeof stockRaw === 'number') ? Math.round(stockRaw) : (parseInt(String(stockRaw)) || 0);

    // État
    const etat = raw[9] !== '' ? String(raw[9]).trim() : '';

    // Prix unitaire — gviz returns float already (e.g. 3.0)
    const prixRaw = raw[10];
    let prix = 0;
    if (typeof prixRaw === 'number') {
      prix = prixRaw;
    } else if (prixRaw !== '') {
      prix = parseFloat(String(prixRaw).replace('€','').replace(',','.').replace(/\s/g,'').trim()) || 0;
    }

    // Image URL (column M, index 12)
    const image = raw[12] !== '' ? String(raw[12]).trim() : '';

    // Skip lignes fantômes (pas de nom réel)
    if (!nom) continue;

    cards.push({
      sheet:       sheetName,
      nom:         nom,
      attribut:    raw[2] !== '' ? String(raw[2]).trim() : '',
      numero:      raw[3] !== '' ? String(raw[3]).trim() : '',
      annee:       raw[4] !== '' ? String(raw[4]).trim() : '',
      bloc:        raw[5] !== '' ? String(raw[5]).trim() : '',
      serie:       raw[6] !== '' ? String(raw[6]).trim() : '',
      reverseHolo: raw[7] !== '' ? String(raw[7]).trim() : '',
      stock:       stock,
      etat:        etat,
      prix:        prix,
      prixTotal:   prix * stock,
      image:       image,
    });
  }
  return cards;
}

async function loadAllCards() {
  showLoading();
  try {
    const results = await Promise.all(SHEETS.map(s => fetchSheet(s)));
    allCards = results.flat().filter(c => c.stock > 0); // seulement les cartes en stock
    populateFilters();
    updateStats();
    updateCatCounts();
    applyFilters();
    showMain();
  } catch (err) {
    console.error(err);
    showError('Impossible de charger la collection.\nVérifie que le tableur est bien partagé en lecture.');
  }
}

/* ============================================================
   CATEGORY TABS
   ============================================================ */
function updateCatCounts() {
  // Total
  const allCount = allCards.reduce((s, c) => s + c.stock, 0);
  const elAll = document.getElementById('cat-count-all');
  if (elAll) elAll.textContent = allCount;

  // Par feuille
  SHEETS.forEach(sheet => {
    const sheetCards = allCards.filter(c => c.sheet === sheet.name);
    const count = sheetCards.reduce((s, c) => s + c.stock, 0);
    const el = document.getElementById(`cat-count-${sheet.name}`);
    if (el) el.textContent = count;
  });
}

function setActiveTab(sheetName) {
  activeFilters.sheet = sheetName;

  // Update tab states
  document.querySelectorAll('.cat-tab').forEach(tab => {
    const isActive = tab.dataset.sheet === sheetName;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  // Update category hero
  const hero = document.getElementById('category-hero');
  if (sheetName) {
    const sheet = SHEETS.find(s => s.name === sheetName);
    const sheetCards = allCards.filter(c => c.sheet === sheetName);
    const count = sheetCards.reduce((s, c) => s + c.stock, 0);
    const value = sheetCards.reduce((s, c) => s + c.prixTotal, 0);
    const top = [...sheetCards].sort((a, b) => b.prix - a.prix)[0];

    document.getElementById('cat-hero-icon').textContent = sheet?.icon || '🃏';
    document.getElementById('cat-hero-title').textContent = sheet?.label || sheetName;
    document.getElementById('cat-hero-count').textContent = `${count} exemplaire${count > 1 ? 's' : ''}`;
    document.getElementById('cat-hero-value').textContent = formatPrix(value);
    document.getElementById('cat-hero-top').textContent = top ? `Top : ${formatPrix(top.prix)}` : '';
    hero.hidden = false;
  } else {
    hero.hidden = true;
  }

  // Reset bloc filter options for this sheet
  repopulateBlocFilter(sheetName);
  applyFilters();
}

function repopulateBlocFilter(sheetName) {
  const blocSel = document.getElementById('filter-bloc');
  const currentVal = blocSel.value;
  blocSel.innerHTML = '<option value="">Tous les blocs</option>';
  const source = sheetName ? allCards.filter(c => c.sheet === sheetName) : allCards;
  const blocs = [...new Set(source.map(c => c.bloc).filter(Boolean))].sort();
  blocs.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b; opt.textContent = b;
    blocSel.appendChild(opt);
  });
  // Restore value if still valid
  if (blocs.includes(currentVal)) blocSel.value = currentVal;
  else { blocSel.value = ''; activeFilters.bloc = ''; }
}

/* ============================================================
   FILTERS
   ============================================================ */
function populateFilters() {
  repopulateBlocFilter('');
}

function applyFilters() {
  const { search, sheet, bloc, etat, sort } = activeFilters;
  const q = search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  filteredCards = allCards.filter(card => {
    if (sheet && card.sheet !== sheet) return false;
    if (bloc  && card.bloc  !== bloc)  return false;
    if (etat  && card.etat  !== etat)  return false;
    if (q) {
      const haystack = (card.nom + ' ' + card.serie + ' ' + card.numero + ' ' + card.attribut)
        .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  // Sort
  filteredCards.sort((a, b) => {
    switch (sort) {
      case 'prix-desc':   return b.prix - a.prix;
      case 'prix-asc':    return a.prix - b.prix;
      case 'annee-desc':  return (parseInt(b.annee) || 0) - (parseInt(a.annee) || 0);
      case 'annee-asc':   return (parseInt(a.annee) || 0) - (parseInt(b.annee) || 0);
      default:            return a.nom.localeCompare(b.nom, 'fr');
    }
  });

  renderCards();
  updateResultCount();
}

/* ============================================================
   RENDER
   ============================================================ */
function renderCards() {
  const grid = document.getElementById('card-grid');
  const empty = document.getElementById('empty-state');
  grid.innerHTML = '';

  if (filteredCards.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  const frag = document.createDocumentFragment();
  filteredCards.forEach(card => {
    frag.appendChild(createCardEl(card));
  });
  grid.appendChild(frag);
}

function createCardEl(card) {
  const el = document.createElement('article');
  el.className = 'poke-card';
  el.setAttribute('role', 'listitem');
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', `${card.nom}, ${card.serie}`);

  const etatClass = ETAT_CLASS[card.etat] || 'etat-played';
  const etatLabel = ETAT_LABEL[card.etat] || card.etat;
  const isHighPrice = card.prix >= 50;

  // Only show sheet badge when viewing "Tout" (all sheets)
  const showBadge = !activeFilters.sheet;
  const sheetInfo = SHEETS.find(s => s.name === card.sheet);

  const imgContent = card.image
    ? `<img src="${escHtml(card.image)}" alt="${escHtml(card.nom)}" loading="lazy" onerror="this.parentElement.innerHTML=getPlaceholderSvg()">`
    : `<div class="card-image-placeholder">${svgCardIcon()}<span>${escHtml(card.numero)}</span></div>`;

  el.innerHTML = `
    <div class="card-image-wrap">
      ${imgContent}
      ${showBadge ? `<span class="card-sheet-badge">${sheetInfo ? sheetInfo.icon + ' ' + escHtml(sheetInfo.label) : escHtml(card.sheet)}</span>` : ''}
    </div>
    <div class="card-body">
      <div class="card-name" title="${escHtml(card.nom)}">${escHtml(card.nom)}</div>
      <div class="card-meta">${escHtml(card.serie || card.bloc)}</div>
    </div>
    <div class="card-footer">
      <span class="card-etat-badge ${etatClass}">${etatLabel}</span>
      <span class="card-price ${isHighPrice ? 'is-high' : ''}">${formatPrix(card.prix)}</span>
      ${card.stock > 1 ? `<span class="card-stock-badge">×${card.stock}</span>` : ''}
    </div>
  `;

  el.addEventListener('click', () => openModal(card));
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(card); });
  return el;
}

/* ============================================================
   STATS
   ============================================================ */
function updateStats() {
  const totalCards = allCards.reduce((s, c) => s + c.stock, 0);
  const totalValue = allCards.reduce((s, c) => s + c.prixTotal, 0);
  const nmCards = allCards.filter(c => c.etat === 'Nmint/Mint' || c.etat === 'GEM Mint').reduce((s,c) => s+c.stock, 0);
  const topCard = [...allCards].sort((a,b) => b.prix - a.prix)[0];

  document.getElementById('total-cards-count').textContent = totalCards;
  document.getElementById('total-value').textContent = formatPrix(totalValue);
  document.getElementById('stat-nm').textContent = nmCards;
  document.getElementById('stat-sheets').textContent = SHEETS.length;
  document.getElementById('stat-top-value').textContent = topCard ? formatPrix(topCard.prix) : '—';
  document.getElementById('stat-last-updated').textContent = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  document.getElementById('footer-date').textContent = `Mis à jour le ${new Date().toLocaleDateString('fr-FR')}`;
}

function updateResultCount() {
  const el = document.getElementById('results-count');
  const total = filteredCards.reduce((s, c) => s + c.stock, 0);
  el.textContent = `${filteredCards.length} cartes · ${total} exemplaires`;
}

/* ============================================================
   MODAL
   ============================================================ */
function openModal(card) {
  document.getElementById('modal-sheet').textContent = card.sheet;
  document.getElementById('modal-title').textContent = card.nom;

  // Image
  const img = document.getElementById('modal-img');
  img.src = card.image || '';
  img.alt = card.nom;
  img.style.display = card.image ? '' : 'none';

  // Attributs
  const attrsEl = document.getElementById('modal-attrs');
  attrsEl.innerHTML = '';
  const tags = [card.attribut, card.numero, card.reverseHolo].filter(x => x && x !== '/' && x !== 'Non');
  tags.forEach(t => {
    const span = document.createElement('span');
    span.className = 'modal-attr-tag';
    span.textContent = t;
    attrsEl.appendChild(span);
  });

  // Méta
  const metaEl = document.getElementById('modal-meta');
  metaEl.innerHTML = `
    <div class="modal-meta-item">
      <span class="modal-meta-label">Série</span>
      <span class="modal-meta-value">${escHtml(card.serie)}</span>
    </div>
    <div class="modal-meta-item">
      <span class="modal-meta-label">Bloc</span>
      <span class="modal-meta-value">${escHtml(card.bloc)}</span>
    </div>
    <div class="modal-meta-item">
      <span class="modal-meta-label">Année</span>
      <span class="modal-meta-value">${escHtml(card.annee)}</span>
    </div>
    <div class="modal-meta-item">
      <span class="modal-meta-label">État</span>
      <span class="modal-meta-value">${escHtml(card.etat)}</span>
    </div>
    <div class="modal-meta-item">
      <span class="modal-meta-label">Stock</span>
      <span class="modal-meta-value">${card.stock} exemplaire${card.stock > 1 ? 's' : ''}</span>
    </div>
    <div class="modal-meta-item">
      <span class="modal-meta-label">Holo / Reverse</span>
      <span class="modal-meta-value">${escHtml(card.reverseHolo || 'Non')}</span>
    </div>
  `;

  // Prix
  document.getElementById('modal-price-unit').textContent = formatPrix(card.prix);
  document.getElementById('modal-price-total').textContent = formatPrix(card.prixTotal);

  // Lien Cardmarket
  const cmLink = document.getElementById('modal-cardmarket-link');
  const cmQuery = encodeURIComponent(card.nom);
  const cmEtat = ETAT_CM[card.etat] || 2;
  cmLink.href = `https://www.cardmarket.com/fr/Pokemon/Products/Search?searchString=${cmQuery}&minCondition=${cmEtat}&language=2&sortBy=price_asc`;

  // Ouvrir
  const overlay = document.getElementById('modal-overlay');
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('modal-close').focus(), 50);
}

function closeModal() {
  document.getElementById('modal-overlay').hidden = true;
  document.body.style.overflow = '';
}

/* ============================================================
   UI STATE HELPERS
   ============================================================ */
function showLoading() {
  document.getElementById('loading-state').style.display = '';
  document.getElementById('error-state').hidden = true;
  document.getElementById('main-content').hidden = true;
}
function showMain() {
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('error-state').hidden = true;
  document.getElementById('main-content').hidden = false;
}
function showError(msg) {
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('error-state').hidden = false;
  document.getElementById('error-message').textContent = msg;
}

/* ============================================================
   UTILS
   ============================================================ */
function formatPrix(n) {
  if (!n && n !== 0) return '—';
  return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function svgCardIcon() {
  return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="2" width="18" height="20" rx="2"/><circle cx="12" cy="11" r="3"/></svg>`;
}
window.getPlaceholderSvg = () => `<div class="card-image-placeholder">${svgCardIcon()}<span>—</span></div>`;

/* ============================================================
   DARK MODE TOGGLE
   ============================================================ */
(function(){
  const t = document.querySelector('[data-theme-toggle]');
  const r = document.documentElement;
  let d = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  r.setAttribute('data-theme', d);
  function updateIcon() {
    if (!t) return;
    t.innerHTML = d === 'dark'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    t.setAttribute('aria-label', `Passer en mode ${d === 'dark' ? 'clair' : 'sombre'}`);
  }
  updateIcon();
  if (t) t.addEventListener('click', () => {
    d = d === 'dark' ? 'light' : 'dark';
    r.setAttribute('data-theme', d);
    updateIcon();
  });
})();

/* ============================================================
   EVENT LISTENERS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Chargement
  loadAllCards();
  document.getElementById('retry-btn')?.addEventListener('click', loadAllCards);

  // Category tabs
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const sheet = tab.dataset.sheet;
      setActiveTab(sheet);
    });
  });

  // Recherche
  const searchInput = document.getElementById('search-input');
  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      activeFilters.search = searchInput.value;
      applyFilters();
    }, 200);
  });

  // Filtres selects
  document.getElementById('filter-bloc').addEventListener('change', e => {
    activeFilters.bloc = e.target.value; applyFilters();
  });
  document.getElementById('filter-etat').addEventListener('change', e => {
    activeFilters.etat = e.target.value; applyFilters();
  });
  document.getElementById('filter-sort').addEventListener('change', e => {
    activeFilters.sort = e.target.value; applyFilters();
  });

  // Reset filters
  function resetFilters() {
    activeFilters = { search: '', sheet: activeFilters.sheet, bloc: '', etat: '', sort: 'nom' };
    document.getElementById('search-input').value = '';
    document.getElementById('filter-bloc').value = '';
    document.getElementById('filter-etat').value = '';
    document.getElementById('filter-sort').value = 'nom';
    applyFilters();
  }
  document.getElementById('reset-filters')?.addEventListener('click', resetFilters);
  document.getElementById('reset-filters-2')?.addEventListener('click', resetFilters);

  // Modal
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-overlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
});
