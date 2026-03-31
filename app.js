/* ============================================================
   CONFIGURATION
   ============================================================ */
const SHEET_ID = '13tKsaOj-QwE2b-3FHim0Isacq1Alfe20B8NOLfy02hM'; // conservé pour référence

// Supabase
const SUPABASE_URL = 'https://mfojoudspqeddgjswnqi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_iZWrIrqIEH22UekYIV-h4A_dVNSDSs4';

// Google Apps Script (écriture uniquement via le formulaire)
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxtG5UY3VkRrreuWJopDps99C2K7OysS1OIJu3xbjzIlrNqVRLczYAueojV0tGvsxm8ag/exec';

const SHEETS = [
  { name: 'Divers',         gid: '0',          icon: '🃏', label: 'Divers' },
  { name: 'Reverses',       gid: '826801908',   icon: '🔄', label: 'Reverses' },
  { name: 'Holo',           gid: '873497771',   icon: '✨', label: 'Holo' },
  { name: 'Evolitions',     gid: '2001298664',  icon: '🌀', label: 'Évolutions' },
  { name: 'Pikachu family', gid: '149423930',   icon: '⚡', label: 'Pikachu' },
  { name: 'Zarbi',          gid: '44965854',    icon: '❓', label: 'Zarbi' },
];

// Blocs → Séries (extrait du tableur)
const BLOCS_SERIES = {"Diamant & Perle": ["Diamant & Perle", "Diamant & Perle Aube Majestueuse", "Diamant & Perle Duels au sommet", "Diamant & Perle Merveilles Secrètes", "Diamant & Perle Tempête", "Diamant & Perle Trésors Mystérieux", "Diamant & Perle Éveil des Légendes"], "EX": ["EX Espèces Delta", "EX Fantômes Holon", "EX Forces Cachées", "EX Gardiens du Pouvoir"], "HeartGold & SoulSilver": ["HS Déchaînement", "HS Indomptable", "HS Triomphe"], "MacDonald's": ["Combat Express 2022", "Mcdo 2011", "Mcdo 2013", "Mcdo 2014", "Mcdo 2015", "Mcdo 2017", "Mcdo 2019", "Mcdo 2021"], "Mega-Evolution": ["Flammes fantasmagoriques", "Héros Transcendants", "Mega-Evolution"], "Noir & Blanc": ["Noir & Blanc Glaciation Plasma", "Noir & Blanc Nobles Victoires", "Noir & Blanc Pouvoirs Émergents"], "Platine (bloc)": ["Platine", "Platine Rivaux Émergeants", "Platinum Arceus"], "Pokémon Stadium": ["Danone"], "Promos": ["Détective Pikachu", "PCG-P", "POP 7", "POP 9", "Promo BW, pour la série Noir & Blanc", "Promo DP, pour les séries Diamant & Perle et Platine", "Promo MEP, pour le bloc Méga Evolution", "Promo Nintendo, pour la série EX", "Promo SM, pour la série Soleil et Lune", "Promo SV, pour la série Écarlate et Violet", "Promo SWSH, pour la série Épée et Bouclier", "Promo Wizards, pour la série Wizards", "Promo XY, pour la série XY"], "S8b": ["VMAX Climax"], "SV8a": ["Terastal Festival"], "Soleil et Lune": ["Destinées Occultes", "Soleil et Lune", "Soleil et Lune Duo de Choc", "Soleil et Lune Gardiens Ascendants", "Soleil et Lune Harmonie des Esprits", "Soleil et Lune Invasion Carmin", "Soleil et Lune Ombres Ardentes", "Soleil et Lune Tempête Céleste", "Soleil et Lune Ultra-Prisme", "Soleil et Lune Éclipse Cosmique"], "Séries Chinoises": ["Gem Pack vol. 1", "Gem Pack vol. 2"], "Trainer Kits": ["Diamant & Perle Kit Dresseur", "Mudkip Constructed Starter Deck", "Soleil et Lune Kit du Dresseur: Raichu d'Alola", "XY Kit du Dresseur: Latias & Latios", "XY Trainer Kit Nymphali"], "Wizards": ["Aquapolis", "Expedition", "Jungle", "Neo Destiny", "Set de Base"], "XY": ["Double Danger", "Générations", "XY", "XY Ciel Rugissant", "XY Impact des Destins", "XY Impulsion TURBO", "XY Offensive Vapeur", "XY Origines Antiques", "XY Poings Furieux", "XY Primo-Choc", "XY Rupture TURBO", "XY Vigueur Spectrale", "XY Étincelles", "XY Évolutions"], "Écarlate et Violet": ["Aventures ensemble", "Couronne stellaire", "Destinées de Paldea", "Etincelles déferlantes", "Evolutions prismatiques", "Fable nébuleuse", "Faille Paradoxe", "Flamme blanche", "Forces temporelles", "Foudre noire", "Mascarade crépusculaire", "Rivalités Destinées", "Rivalités destinées", "Écarlate et Violet", "Écarlate et Violet 151", "Écarlate et Violet Flammes Obsidiennes", "Écarlate et Violet Évolutions à Paldea"], "Épée et Bouclier": ["Célébrations", "Destinées Radieuses", "Pokémon GO", "Zénith Suprême", "Épée et Bouclier", "Épée et Bouclier Astres Radieux", "Épée et Bouclier Origine Perdue", "Épée et Bouclier Poing de Fusion", "Épée et Bouclier Règne de Glace", "Épée et Bouclier Stars Étincelantes", "Épée et Bouclier Styles de Combat", "Épée et Bouclier Tempête Argentée", "Épée et Bouclier Ténèbres Embrasées", "Épée et Bouclier Voltage Éclatant", "Épée et Bouclier Évolution Céleste"]};

const ETAT_CLASS = {
  'GEM Mint':'etat-gem','Nmint/Mint':'etat-nm','Exc':'etat-exc',
  'Fine':'etat-fine','Played':'etat-played','Poor':'etat-poor','Missprint':'etat-played',
};
const ETAT_LABEL = {
  'GEM Mint':'GEM','Nmint/Mint':'NM','Exc':'EX','Fine':'GD','Played':'PL','Poor':'PO','Missprint':'MS',
};
const ETAT_CM = {
  'GEM Mint':1,'Nmint/Mint':2,'Exc':3,'Fine':4,'Played':6,'Poor':7,'Missprint':2,
};

/* ============================================================
   STATE
   ============================================================ */
let allCards = [];
let filteredCards = [];
let activeFilters = { search: '', sheet: '', bloc: '', serie: '', etat: '', sort: 'nom' };

/* ============================================================
   DATA FETCHING — Supabase (zéro CORS, multi-appareils)
   ============================================================ */
async function loadAllCards() {
  showLoading();
  try {
    // Récupérer toutes les cartes en stock depuis Supabase
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/cards?stock=gt.0&order=nom.asc&limit=2000`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        }
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();

    allCards = rows.map(r => ({
      sheet:       r.sheet,
      nom:         r.nom,
      attribut:    r.attribut || '',
      numero:      r.numero || '',
      annee:       r.annee || '',
      bloc:        r.bloc || '',
      serie:       r.serie || '',
      reverseHolo: r.reverse_holo || 'Non',
      stock:       r.stock,
      etat:        r.etat,
      prix:        parseFloat(r.prix) || 0,
      prixTotal:   parseFloat(r.prix_total) || 0,
      image:       r.image || '',
    }));

    populateFilters();
    updateStats();
    updateCatCounts();
    applyFilters();
    showMain();
  } catch (err) {
    console.error(err);
    showError(`Chargement impossible : ${err.message}`);
  }
}

/* ============================================================
   CATEGORY TABS
   ============================================================ */
function updateCatCounts() {
  const allCount = allCards.reduce((s,c) => s + c.stock, 0);
  const elAll = document.getElementById('cat-count-all');
  if (elAll) elAll.textContent = allCount;
  SHEETS.forEach(sheet => {
    const count = allCards.filter(c => c.sheet === sheet.name).reduce((s,c) => s + c.stock, 0);
    const el = document.getElementById(`cat-count-${sheet.name}`);
    if (el) el.textContent = count;
  });
}

function setActiveTab(sheetName) {
  activeFilters.sheet = sheetName;
  document.querySelectorAll('.cat-tab').forEach(tab => {
    const isActive = tab.dataset.sheet === sheetName;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-pressed', String(isActive));
  });
  const hero = document.getElementById('category-hero');
  if (sheetName) {
    const sheet = SHEETS.find(s => s.name === sheetName);
    const sheetCards = allCards.filter(c => c.sheet === sheetName);
    const count = sheetCards.reduce((s,c) => s + c.stock, 0);
    const value = sheetCards.reduce((s,c) => s + c.prixTotal, 0);
    const top   = [...sheetCards].sort((a,b) => b.prix - a.prix)[0];
    document.getElementById('cat-hero-icon').textContent  = sheet?.icon || '🃏';
    document.getElementById('cat-hero-title').textContent = sheet?.label || sheetName;
    document.getElementById('cat-hero-count').textContent = `${count} exemplaire${count > 1 ? 's' : ''}`;
    document.getElementById('cat-hero-value').textContent = formatPrix(value);
    document.getElementById('cat-hero-top').textContent   = top ? `Top : ${formatPrix(top.prix)}` : '';
    hero.hidden = false;
  } else {
    hero.hidden = true;
  }
  repopulateBlocFilter(sheetName);
  applyFilters();
}

/* ============================================================
   FILTERS
   ============================================================ */
function populateFilters() {
  repopulateBlocFilter('');
}

function repopulateBlocFilter(sheetName) {
  const blocSel  = document.getElementById('filter-bloc');
  const serieSel = document.getElementById('filter-serie');
  const prevBloc = blocSel.value;

  blocSel.innerHTML = '<option value="">Tous les blocs</option>';
  serieSel.innerHTML = '<option value="">Toutes les séries</option>';

  const source = sheetName ? allCards.filter(c => c.sheet === sheetName) : allCards;
  const blocs  = [...new Set(source.map(c => c.bloc).filter(Boolean))].sort();
  blocs.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b; opt.textContent = b;
    blocSel.appendChild(opt);
  });

  if (blocs.includes(prevBloc)) {
    blocSel.value = prevBloc;
    updateSerieFilter(prevBloc, sheetName);
  } else {
    activeFilters.bloc  = '';
    activeFilters.serie = '';
  }
}

function updateSerieFilter(bloc, sheetName) {
  const serieSel = document.getElementById('filter-serie');
  const prevSerie = serieSel.value;
  serieSel.innerHTML = '<option value="">Toutes les séries</option>';

  if (!bloc) { activeFilters.serie = ''; return; }

  const source = sheetName ? allCards.filter(c => c.sheet === sheetName) : allCards;
  const series = [...new Set(source.filter(c => c.bloc === bloc).map(c => c.serie).filter(Boolean))].sort();
  series.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    serieSel.appendChild(opt);
  });

  if (series.includes(prevSerie)) serieSel.value = prevSerie;
  else activeFilters.serie = '';
}

function applyFilters() {
  const { search, sheet, bloc, serie, etat, sort } = activeFilters;
  const q = search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  filteredCards = allCards.filter(card => {
    if (sheet && card.sheet !== sheet) return false;
    if (bloc  && card.bloc  !== bloc)  return false;
    if (serie && card.serie !== serie) return false;
    if (etat  && card.etat  !== etat)  return false;
    if (q) {
      const h = (card.nom+' '+card.serie+' '+card.numero+' '+card.attribut)
        .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (!h.includes(q)) return false;
    }
    return true;
  });

  filteredCards.sort((a, b) => {
    switch (sort) {
      case 'prix-desc':  return b.prix - a.prix;
      case 'prix-asc':   return a.prix - b.prix;
      case 'annee-desc': return (parseInt(b.annee)||0) - (parseInt(a.annee)||0);
      case 'annee-asc':  return (parseInt(a.annee)||0) - (parseInt(b.annee)||0);
      default:           return a.nom.localeCompare(b.nom, 'fr');
    }
  });

  renderCards();
  updateResultCount();
}

/* ============================================================
   RENDER
   ============================================================ */
function renderCards() {
  const grid  = document.getElementById('card-grid');
  const empty = document.getElementById('empty-state');
  grid.innerHTML = '';
  if (filteredCards.length === 0) { empty.hidden = false; return; }
  empty.hidden = true;
  const frag = document.createDocumentFragment();
  filteredCards.forEach(card => frag.appendChild(createCardEl(card)));
  grid.appendChild(frag);
}

function createCardEl(card) {
  const el = document.createElement('article');
  el.className = 'poke-card';
  el.setAttribute('role', 'listitem');
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', `${card.nom}, ${card.serie}`);

  const etatClass  = ETAT_CLASS[card.etat] || 'etat-played';
  const etatLabel  = ETAT_LABEL[card.etat] || card.etat;
  const isHighPrice = card.prix >= 50;
  const showBadge  = !activeFilters.sheet;
  const sheetInfo  = SHEETS.find(s => s.name === card.sheet);

  const placeholder = `<div class="card-image-placeholder">${svgCardIcon()}<span>${escHtml(card.numero)}</span></div>`;
  const imgContent = card.image
    ? `<img src="${escHtml(card.image)}" alt="${escHtml(card.nom)}" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false">
       <div class="card-image-placeholder" hidden>${svgCardIcon()}<span>${escHtml(card.numero)}</span></div>`
    : placeholder;

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
    </div>`;

  el.addEventListener('click', () => openModal(card));
  el.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') openModal(card); });
  return el;
}

/* ============================================================
   STATS
   ============================================================ */
function updateStats() {
  const totalCards = allCards.reduce((s,c) => s + c.stock, 0);
  const totalValue = allCards.reduce((s,c) => s + c.prixTotal, 0);
  const nmCards    = allCards.filter(c => c.etat==='Nmint/Mint'||c.etat==='GEM Mint').reduce((s,c) => s+c.stock, 0);
  const topCard    = [...allCards].sort((a,b) => b.prix-a.prix)[0];

  document.getElementById('total-cards-count').textContent = totalCards;
  document.getElementById('total-value').textContent       = formatPrix(totalValue);
  document.getElementById('stat-nm').textContent           = nmCards;
  document.getElementById('stat-sheets').textContent       = SHEETS.length;
  document.getElementById('stat-top-value').textContent    = topCard ? formatPrix(topCard.prix) : '—';
  document.getElementById('stat-last-updated').textContent = new Date().toLocaleDateString('fr-FR', {day:'2-digit',month:'short',year:'numeric'});
  document.getElementById('footer-date').textContent       = `Mis à jour le ${new Date().toLocaleDateString('fr-FR')}`;
}

function updateResultCount() {
  const total = filteredCards.reduce((s,c) => s + c.stock, 0);
  document.getElementById('results-count').textContent = `${filteredCards.length} cartes · ${total} exemplaires`;
}

/* ============================================================
   MODAL — CARTE DÉTAIL
   ============================================================ */
function openModal(card) {
  currentModalCard = card;
  document.getElementById('modal-edit-form').hidden = true;
  document.getElementById('modal-edit-btn').hidden = false;
  document.getElementById('modal-sheet').textContent = card.sheet;
  document.getElementById('modal-title').textContent = card.nom;

  const img         = document.getElementById('modal-img');
  const placeholder = document.getElementById('modal-img-placeholder');
  if (card.image) {
    img.src           = card.image;
    img.alt           = card.nom;
    img.style.display = '';
    img.hidden        = false;
    placeholder.hidden = true;
    img.onerror = () => { img.hidden = true; placeholder.hidden = false; };
  } else {
    img.hidden         = true;
    placeholder.hidden = false;
  }

  const attrsEl = document.getElementById('modal-attrs');
  attrsEl.innerHTML = '';
  [card.attribut, card.numero, card.reverseHolo].filter(x => x && x !== '/' && x !== 'Non').forEach(t => {
    const span = document.createElement('span');
    span.className   = 'modal-attr-tag';
    span.textContent = t;
    attrsEl.appendChild(span);
  });

  document.getElementById('modal-meta').innerHTML = `
    <div class="modal-meta-item"><span class="modal-meta-label">Série</span><span class="modal-meta-value">${escHtml(card.serie)}</span></div>
    <div class="modal-meta-item"><span class="modal-meta-label">Bloc</span><span class="modal-meta-value">${escHtml(card.bloc)}</span></div>
    <div class="modal-meta-item"><span class="modal-meta-label">Année</span><span class="modal-meta-value">${escHtml(card.annee)}</span></div>
    <div class="modal-meta-item"><span class="modal-meta-label">État</span><span class="modal-meta-value">${escHtml(card.etat)}</span></div>
    <div class="modal-meta-item"><span class="modal-meta-label">Stock</span><span class="modal-meta-value">${card.stock} exemplaire${card.stock>1?'s':''}</span></div>
    <div class="modal-meta-item"><span class="modal-meta-label">Holo / Reverse</span><span class="modal-meta-value">${escHtml(card.reverseHolo||'Non')}</span></div>`;

  document.getElementById('modal-price-unit').textContent  = formatPrix(card.prix);
  document.getElementById('modal-price-total').textContent = formatPrix(card.prixTotal);

  const cmEtat = ETAT_CM[card.etat] || 2;
  document.getElementById('modal-cardmarket-link').href =
    `https://www.cardmarket.com/fr/Pokemon/Products/Search?searchString=${encodeURIComponent(card.nom)}&minCondition=${cmEtat}&language=2&sortBy=price_asc`;

  document.getElementById('modal-overlay').hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('modal-close').focus(), 50);
}

function closeModal() {
  document.getElementById('modal-overlay').hidden = true;
  document.getElementById('modal-edit-form').hidden = true;
  document.body.style.overflow = '';
}

/* ============================================================
   MODAL — ÉDITION CARTE
   ============================================================ */
let currentEditCard = null;
let currentModalCard = null;

function openEditForm(card) {
  currentEditCard = card;
  document.getElementById('e-image').value = card.image || '';
  document.getElementById('e-prix').value  = card.prix || '';
  document.getElementById('e-stock').value = card.stock || 1;
  document.getElementById('e-etat').value  = card.etat || 'Nmint/Mint';
  document.getElementById('modal-edit-notice').hidden = true;
  document.getElementById('modal-edit-form').hidden = false;
  document.getElementById('modal-edit-btn').hidden = true;
}

function closeEditForm() {
  document.getElementById('modal-edit-form').hidden = true;
  document.getElementById('modal-edit-btn').hidden = false;
  currentEditCard = null;
}

async function saveEditCard() {
  if (!currentEditCard) return;

  const saveBtn = document.getElementById('modal-edit-save');
  saveBtn.disabled = true;
  saveBtn.textContent = '...';

  const image  = document.getElementById('e-image').value.trim();
  const prix   = parseFloat(document.getElementById('e-prix').value) || 0;
  const stock  = parseInt(document.getElementById('e-stock').value) || 0;
  const etat   = document.getElementById('e-etat').value;

  try {
    // Trouver l'id Supabase via nom + numero + sheet
    const searchRes = await fetch(
      `${SUPABASE_URL}/rest/v1/cards?nom=eq.${encodeURIComponent(currentEditCard.nom)}&numero=eq.${encodeURIComponent(currentEditCard.numero)}&sheet=eq.${encodeURIComponent(currentEditCard.sheet)}&select=id&limit=1`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    );
    const found = await searchRes.json();
    if (!found.length) throw new Error('Carte introuvable dans la base');

    const id = found[0].id;
    const res = await fetch(`${SUPABASE_URL}/rest/v1/cards?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey':        SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type':  'application/json',
        'Prefer':        'return=minimal',
      },
      body: JSON.stringify({ image, prix, stock, prix_total: prix * stock, etat }),
    });

    if (res.ok) {
      // Mettre à jour l'image dans le modal immédiatement
      if (image) {
        const modalImg = document.getElementById('modal-img');
        modalImg.src = image;
        modalImg.hidden = false;
        document.getElementById('modal-img-placeholder').hidden = true;
      }
      document.getElementById('modal-price-unit').textContent  = formatPrix(prix);
      document.getElementById('modal-price-total').textContent = formatPrix(prix * stock);

      // Mettre à jour dans allCards
      const idx = allCards.findIndex(c => c.nom === currentEditCard.nom && c.numero === currentEditCard.numero && c.sheet === currentEditCard.sheet);
      if (idx !== -1) {
        allCards[idx] = { ...allCards[idx], image, prix, stock, prixTotal: prix * stock, etat };
      }

      const noticeEl = document.getElementById('modal-edit-notice');
      const noticeText = document.getElementById('modal-edit-notice-text');
      noticeEl.className = 'add-notice add-notice-success';
      noticeText.textContent = '✓ Modifications enregistrées';
      noticeEl.hidden = false;
      setTimeout(() => { closeEditForm(); applyFilters(); }, 1200);
    } else {
      const err = await res.json();
      throw new Error(err.message || 'Erreur inconnue');
    }
  } catch (err) {
    const noticeEl = document.getElementById('modal-edit-notice');
    const noticeText = document.getElementById('modal-edit-notice-text');
    noticeEl.className = 'add-notice add-notice-error';
    noticeText.textContent = err.message;
    noticeEl.hidden = false;
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Enregistrer';
  }
}

/* ============================================================
   MODAL — AJOUTER UNE CARTE
   ============================================================ */
function openAddModal() {
  const warning = document.getElementById('form-script-warning');
  if (warning) warning.hidden = true; // Supabase, pas besoin d'Apps Script

  // Peupler les blocs dans le formulaire
  const blocSel = document.getElementById('f-bloc');
  blocSel.innerHTML = '<option value="">— Choisir un bloc —</option>';
  Object.keys(BLOCS_SERIES).sort().forEach(b => {
    const opt = document.createElement('option');
    opt.value = b; opt.textContent = b;
    blocSel.appendChild(opt);
  });

  document.getElementById('add-modal-notice').hidden = true;
  document.getElementById('add-card-form').reset();
  document.getElementById('f-serie').innerHTML = '<option value="">— Choisir d\'abord un bloc —</option>';

  document.getElementById('add-modal-overlay').hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('f-nom').focus(), 50);
}

function closeAddModal() {
  document.getElementById('add-modal-overlay').hidden = true;
  document.body.style.overflow = '';
}

function showAddNotice(msg, type = 'info') {
  const el   = document.getElementById('add-modal-notice');
  const text = document.getElementById('add-notice-text');
  el.className = `add-notice add-notice-${type}`;
  text.textContent = msg;
  el.hidden = false;
}

async function submitAddCard(e) {
  e.preventDefault();

  const btn     = document.getElementById('add-submit-btn');
  const label   = document.getElementById('add-submit-label');
  const spinner = document.getElementById('add-submit-spinner');

  btn.disabled   = true;
  label.hidden   = true;
  spinner.hidden = false;

  const stock = parseInt(document.getElementById('f-stock').value) || 1;
  const prix  = parseFloat(document.getElementById('f-prix').value) || 0;
  const sheet = document.getElementById('f-sheet').value;

  const newCard = {
    sheet,
    nom:          document.getElementById('f-nom').value.trim(),
    attribut:     document.getElementById('f-attribut').value.trim(),
    numero:       document.getElementById('f-numero').value.trim(),
    annee:        document.getElementById('f-annee').value.trim(),
    bloc:         document.getElementById('f-bloc').value,
    serie:        document.getElementById('f-serie').value,
    reverse_holo: document.getElementById('f-reverse').value,
    etat:         document.getElementById('f-etat').value,
    stock,
    prix,
    prix_total:   prix * stock,
    image:        document.getElementById('f-image').value.trim(),
  };

  // Vérif doublon
  const isDuplicate = allCards.some(c =>
    c.sheet === sheet &&
    c.nom.toLowerCase() === newCard.nom.toLowerCase() &&
    c.numero === newCard.numero
  );
  if (isDuplicate) {
    showAddNotice(`"${newCard.nom}" (${newCard.numero}) existe déjà dans ${sheet}.`, 'error');
    btn.disabled = false; label.hidden = false; spinner.hidden = true;
    return;
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/cards`, {
      method:  'POST',
      headers: {
        'apikey':        SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type':  'application/json',
        'Prefer':        'return=minimal',
      },
      body: JSON.stringify(newCard),
    });

    if (res.ok) {
      showAddNotice(`✓ "${newCard.nom}" ajoutée dans ${sheet} !`, 'success');
      document.getElementById('add-card-form').reset();
      setTimeout(() => { closeAddModal(); loadAllCards(); }, 1500);
    } else {
      const err = await res.json();
      showAddNotice(err.message || 'Erreur inconnue', 'error');
    }
  } catch (err) {
    showAddNotice(`Erreur réseau : ${err.message}`, 'error');
  } finally {
    btn.disabled   = false;
    label.hidden   = false;
    spinner.hidden = true;
  }
}

/* ============================================================
   UI STATE HELPERS
   ============================================================ */
function showLoading() {
  document.getElementById('loading-state').style.display = '';
  document.getElementById('main-content').hidden = true;
}
function showMain() {
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('main-content').hidden = false;
}
function showError(msg) {
  console.warn('Erreur chargement:', msg);
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('main-content').hidden = false;
}

/* ============================================================
   UTILS
   ============================================================ */
function formatPrix(n) {
  if (!n && n !== 0) return '—';
  return n.toLocaleString('fr-FR', { style:'currency', currency:'EUR', minimumFractionDigits:2, maximumFractionDigits:2 });
}
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function svgCardIcon() {
  return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="2" width="18" height="20" rx="2"/><circle cx="12" cy="11" r="3"/></svg>`;
}

/* ============================================================
   DARK MODE
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
    t.setAttribute('aria-label', `Passer en mode ${d==='dark'?'clair':'sombre'}`);
  }
  updateIcon();
  if (t) t.addEventListener('click', () => { d = d==='dark'?'light':'dark'; r.setAttribute('data-theme',d); updateIcon(); });
})();

/* ============================================================
   EVENT LISTENERS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  loadAllCards();

  // Category tabs
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => setActiveTab(tab.dataset.sheet));
  });

  // Search
  const searchInput = document.getElementById('search-input');
  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => { activeFilters.search = searchInput.value; applyFilters(); }, 200);
  });

  // Filtre Bloc → met à jour Série
  document.getElementById('filter-bloc').addEventListener('change', e => {
    activeFilters.bloc  = e.target.value;
    activeFilters.serie = '';
    updateSerieFilter(e.target.value, activeFilters.sheet);
    document.getElementById('filter-serie').value = '';
    applyFilters();
  });
  document.getElementById('filter-serie').addEventListener('change', e => {
    activeFilters.serie = e.target.value; applyFilters();
  });
  document.getElementById('filter-etat').addEventListener('change', e => {
    activeFilters.etat = e.target.value; applyFilters();
  });
  document.getElementById('filter-sort').addEventListener('change', e => {
    activeFilters.sort = e.target.value; applyFilters();
  });

  // Reset
  function resetFilters() {
    activeFilters = { search:'', sheet:activeFilters.sheet, bloc:'', serie:'', etat:'', sort:'nom' };
    document.getElementById('search-input').value   = '';
    document.getElementById('filter-bloc').value    = '';
    document.getElementById('filter-serie').value   = '';
    document.getElementById('filter-etat').value    = '';
    document.getElementById('filter-sort').value    = 'nom';
    repopulateBlocFilter(activeFilters.sheet);
    applyFilters();
  }
  document.getElementById('reset-filters')?.addEventListener('click', resetFilters);
  document.getElementById('reset-filters-2')?.addEventListener('click', resetFilters);

  // Modal carte
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-overlay')?.addEventListener('click', e => { if (e.target===e.currentTarget) closeModal(); });
  document.getElementById('modal-edit-btn')?.addEventListener('click', () => openEditForm(currentModalCard));
  document.getElementById('modal-edit-cancel')?.addEventListener('click', closeEditForm);
  document.getElementById('modal-edit-save')?.addEventListener('click', saveEditCard);

  // Modal ajouter
  document.getElementById('add-card-btn')?.addEventListener('click', openAddModal);
  document.getElementById('add-modal-close')?.addEventListener('click', closeAddModal);
  document.getElementById('add-modal-cancel')?.addEventListener('click', closeAddModal);
  document.getElementById('add-modal-overlay')?.addEventListener('click', e => { if (e.target===e.currentTarget) closeAddModal(); });
  document.getElementById('add-card-form')?.addEventListener('submit', submitAddCard);

  // Cascade Bloc → Série dans le formulaire
  document.getElementById('f-bloc')?.addEventListener('change', e => {
    const bloc    = e.target.value;
    const serieSel = document.getElementById('f-serie');
    serieSel.innerHTML = '<option value="">— Choisir une série —</option>';
    if (bloc && BLOCS_SERIES[bloc]) {
      BLOCS_SERIES[bloc].forEach(s => {
        const opt = document.createElement('option');
        opt.value = s; opt.textContent = s;
        serieSel.appendChild(opt);
      });
    }
  });

  // Escape ferme les modals
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeAddModal(); }
  });
});
