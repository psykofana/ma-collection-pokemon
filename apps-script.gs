// ============================================================
// GOOGLE APPS SCRIPT — Ma Collection Pokémon
// À coller dans : Extensions > Apps Script de ton Google Sheets
// Puis : Déployer > Nouveau déploiement > Application Web
//   - Exécuter en tant que : Moi
//   - Accès : Tout le monde
// Copier l'URL générée et la coller dans app.js (APPS_SCRIPT_URL)
// ============================================================

const SHEET_NAMES = ['Divers', 'Reverses', 'Holo', 'Evolitions', 'Pikachu family', 'Zarbi'];

// Répondre aux requêtes OPTIONS (CORS preflight)
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
}

function doPost(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === 'addCard') {
      const result = addCard(data.card, data.sheet);
      return respond({ success: true, message: result }, headers);
    }

    return respond({ success: false, error: 'Action inconnue' }, headers);

  } catch (err) {
    return respond({ success: false, error: err.message }, headers);
  }
}

function doGet(e) {
  const headers = { 'Access-Control-Allow-Origin': '*' };
  const action = e.parameter.action;

  if (action === 'ping') {
    return respond({ success: true, message: 'OK' }, headers);
  }

  return respond({ success: false, error: 'Action inconnue' }, headers);
}

function respond(data, headers) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  // Note: setHeaders n'existe pas sur ContentService, CORS géré via doOptions
  return output;
}

function addCard(card, sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName || 'Divers');

  if (!sheet) throw new Error(`Feuille "${sheetName}" introuvable`);

  // Trouver le dernier index utilisé (colonne A)
  const lastRow = sheet.getLastRow();
  let maxIndex = 0;
  if (lastRow > 4) {
    const indices = sheet.getRange(5, 1, lastRow - 4, 1).getValues();
    for (const [v] of indices) {
      const n = parseInt(v);
      if (!isNaN(n) && n > maxIndex) maxIndex = n;
    }
  }
  const newIndex = maxIndex + 1;

  // Vérifier les doublons (même nom + numéro + feuille)
  if (lastRow > 4) {
    const noms    = sheet.getRange(5, 2, lastRow - 4, 1).getValues().flat();
    const numeros = sheet.getRange(5, 4, lastRow - 4, 1).getValues().flat();
    for (let i = 0; i < noms.length; i++) {
      if (
        String(noms[i]).trim().toLowerCase() === String(card.nom).trim().toLowerCase() &&
        String(numeros[i]).trim() === String(card.numero).trim()
      ) {
        throw new Error(`Doublon détecté : "${card.nom}" (${card.numero}) existe déjà dans "${sheetName}"`);
      }
    }
  }

  // Construire la ligne
  // Colonnes: A=index, B=Nom, C=Attribut, D=Numéro, E=Année, F=Bloc, G=Série, H=Reverse/Holo, I=Stock, J=Etat, K=Prix/u (formule), L=PrixVente, M=Image
  const insertRow = lastRow + 1;
  const prixValue = parseFloat(card.prix) || 0;

  // Formule prix = prix_unitaire * stock (structure à conserver selon les instructions)
  const stockCell = `I${insertRow}`;
  const prixFormule = prixValue > 0 ? `=${prixValue}*${stockCell}` : 0;

  const newRow = [
    newIndex,              // A - Index
    card.nom || '',        // B - Nom
    card.attribut || '',   // C - Attribut supp.
    card.numero || '',     // D - Numéro
    card.annee || '',      // E - Année
    card.bloc || '',       // F - Bloc
    card.serie || '',      // G - Série
    card.reverseHolo || 'Non', // H - Reverse/Holo
    parseInt(card.stock) || 1, // I - Stock
    card.etat || 'Nmint/Mint', // J - Etat
    prixFormule,           // K - Prix/u (formule ou 0)
    '',                    // L - Prix de vente
    card.image || '',      // M - Image URL
  ];

  sheet.appendRow(newRow);

  // Formater la cellule prix comme monnaie si elle contient une valeur
  if (prixValue > 0) {
    sheet.getRange(insertRow, 11).setNumberFormat('# ##0.00 €');
  }

  return `Carte "${card.nom}" ajoutée avec succès dans "${sheetName}" (ligne ${insertRow})`;
}
