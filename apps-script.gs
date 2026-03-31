// ============================================================
// GOOGLE APPS SCRIPT — Ma Collection Pokémon
// À coller dans : Extensions > Apps Script de ton Google Sheets
// Puis : Déployer > Gérer les déploiements > Créer une nouvelle version
//   - Exécuter en tant que : Moi
//   - Accès : Tout le monde
// ============================================================

const SHEET_NAMES = ['Divers', 'Reverses', 'Holo', 'Evolitions', 'Pikachu family', 'Zarbi'];

// Colonnes par feuille : index 0-based dans le tableur
// A=0 index, B=1 nom, C=2 attribut, D=3 numéro, E=4 année,
// F=5 bloc, G=6 série, H=7 reverse, I=8 stock, J=9 état, K=10 prix/u
// L=11 prix vente OU image (selon feuille), M=12 image OU vide

function doGet(e) {
  const action = e.parameter.action;

  if (action === 'getCards') {
    try {
      const cards = getAllCards();
      return jsonResponse({ success: true, cards });
    } catch (err) {
      return jsonResponse({ success: false, error: err.message });
    }
  }

  if (action === 'ping') {
    return jsonResponse({ success: true, message: 'OK' });
  }

  return jsonResponse({ success: false, error: 'Action inconnue' });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === 'addCard') {
      const result = addCard(data.card, data.sheet);
      return jsonResponse({ success: true, message: result });
    }

    return jsonResponse({ success: false, error: 'Action inconnue' });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// LECTURE — renvoie toutes les cartes de toutes les feuilles
// ============================================================
function getAllCards() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const allCards = [];

  for (const sheetName of SHEET_NAMES) {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) continue;

    const lastRow = sheet.getLastRow();
    if (lastRow < 5) continue; // pas de données

    const data = sheet.getRange(5, 1, lastRow - 4, 13).getValues();

    for (const row of data) {
      const nom = String(row[1] || '').trim();
      if (!nom) continue;

      const stock = parseInt(row[8]) || 0;
      if (stock <= 0) continue; // on n'affiche que les cartes en stock

      // Prix : peut être une formule calculée, on récupère la valeur calculée
      let prix = 0;
      const prixRaw = row[10];
      if (typeof prixRaw === 'number') {
        prix = prixRaw;
      } else {
        prix = parseFloat(String(prixRaw).replace('€','').replace(',','.').replace(/\s/g,'')) || 0;
      }

      // Image : col[11] ou col[12] selon la feuille
      const c11 = String(row[11] || '').trim();
      const c12 = String(row[12] || '').trim();
      const image = c11.startsWith('http') ? c11 : (c12.startsWith('http') ? c12 : '');

      allCards.push({
        sheet:       sheetName,
        nom,
        attribut:    String(row[2] || '').trim(),
        numero:      String(row[3] || '').trim(),
        annee:       String(row[4] || '').trim(),
        bloc:        String(row[5] || '').trim(),
        serie:       String(row[6] || '').trim(),
        reverseHolo: String(row[7] || '').trim(),
        stock,
        etat:        String(row[9] || '').trim(),
        prix,
        prixTotal:   prix * stock,
        image,
      });
    }
  }

  return allCards;
}

// ============================================================
// ÉCRITURE — ajoute une carte dans la bonne feuille
// ============================================================
function addCard(card, sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName || 'Divers');
  if (!sheet) throw new Error(`Feuille "${sheetName}" introuvable`);

  const lastRow = sheet.getLastRow();
  let maxIndex = 0;

  if (lastRow >= 5) {
    const indices = sheet.getRange(5, 1, lastRow - 4, 1).getValues();
    for (const [v] of indices) {
      const n = parseInt(v);
      if (!isNaN(n) && n > maxIndex) maxIndex = n;
    }

    // Vérification doublons (nom + numéro)
    const noms    = sheet.getRange(5, 2, lastRow - 4, 1).getValues().flat();
    const numeros = sheet.getRange(5, 4, lastRow - 4, 1).getValues().flat();
    for (let i = 0; i < noms.length; i++) {
      if (
        String(noms[i]).trim().toLowerCase() === String(card.nom).trim().toLowerCase() &&
        String(numeros[i]).trim() === String(card.numero).trim()
      ) {
        throw new Error(`Doublon : "${card.nom}" (${card.numero}) existe déjà dans "${sheetName}"`);
      }
    }
  }

  const insertRow = lastRow + 1;
  const prixValue = parseFloat(card.prix) || 0;
  const stockCell = `I${insertRow}`;
  const prixFormule = prixValue > 0 ? `=${prixValue}*${stockCell}` : 0;

  sheet.appendRow([
    maxIndex + 1,
    card.nom || '',
    card.attribut || '',
    card.numero || '',
    card.annee || '',
    card.bloc || '',
    card.serie || '',
    card.reverseHolo || 'Non',
    parseInt(card.stock) || 1,
    card.etat || 'Nmint/Mint',
    prixFormule,
    '',
    card.image || '',
  ]);

  if (prixValue > 0) {
    sheet.getRange(insertRow, 11).setNumberFormat('# ##0.00 €');
  }

  return `"${card.nom}" ajoutée dans "${sheetName}" (ligne ${insertRow})`;
}
