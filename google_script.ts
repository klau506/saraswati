function insertDataInSheet2(mail_vec, ensenyar_vec, aprendre_vec) {
  var spreadsheet = SpreadsheetApp.openById("1nRQibzFbMquGppsPTQTK0P1rmbx6WUiXhzGhxOZLE50"); // Replace with your spreadsheet ID
  var sheet = spreadsheet.getSheetByName("Groups"); // Replace with your sheet name

  // Get the last row with content in the sheet
  var lastRow = sheet.getLastRow();
  var id = sheet.getRange("A"+lastRow).getValue() + 1

  var data = [
    [id, mail_vec[0], ensenyar_vec[0], aprendre_vec[0]],
    [id, mail_vec[1], ensenyar_vec[1], aprendre_vec[1]],
  ];

  // Insert the data starting from the next row
  sheet.getRange(lastRow + 1, 1, data.length, data[0].length).setValues(data);
}

function cleanResponses () {
  var spreadsheet = SpreadsheetApp.openById("1nRQibzFbMquGppsPTQTK0P1rmbx6WUiXhzGhxOZLE50");
  var sheet = spreadsheet.getSheetByName("Respostes al formulari 1");
  var cd_sheet = spreadsheet.getSheetByName("Cleaned_data");

  var lastRow = sheet.getLastRow()

  var teach_original = sheet.getRange("E"+lastRow).getValue()
  var learn_original = sheet.getRange("F"+lastRow).getValue()

  var teach_vec = teach_original.split(",");
  var learn_vec = learn_original.split(",");

  // Get the data from the row to duplicate
  var tmp_row = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
  for (var i = 0; i < teach_vec.length; i++) {
    for (var j = 0; j < learn_vec.length; j++) {
      // modify row with the current teaching and learning languages
      tmp_row[4] = teach_vec[i];
      tmp_row[5] = learn_vec[j];

      var cd_lastRow = cd_sheet.getLastRow()
      cd_sheet.getRange(cd_lastRow + 1, 1, 1, tmp_row.length).setValues([tmp_row]);
    }
  }
}

function readDataFromSpreadsheet() {
  var spreadsheet = SpreadsheetApp.openById("1nRQibzFbMquGppsPTQTK0P1rmbx6WUiXhzGhxOZLE50"); // Replace with your spreadsheet ID
  var sheet = spreadsheet.getSheetByName("Respostes al formulari 1"); // Replace with your sheet name

  var mails = sheet.getRange("B2:B4").getValues(); // Read data from columns A and B
  var ensenyar = sheet.getRange("E2:E4").getValues(); // Read data from columns A and B
  var aprendre = sheet.getRange("F2:F4").getValues(); // Read data from columns A and B

  for (var e = 0; e < ensenyar.length; e++) {
    for (var a = e + 1; a < aprendre.length; a++) {
      var ensenyar1Value = ensenyar[e][0];  // idioma q ensenya la persona 1
      var aprendre2Value = aprendre[a][0];  // idioma q aprèn la persona 2

      // si hi ha match
      if (ensenyar1Value == aprendre2Value) {
        // comprovem que la persona 1 vulgui aprendre el mateix idioma que el que ensenya la persona 2
        aprendre1Value = aprendre[e][0];
        ensenyar2Value = ensenyar[a][0];

        if (aprendre1Value == ensenyar2Value) {
          Logger.log("Match!: " + mails[e][0] + " ensenya " + ensenyar1Value + " i " + mails[a][0] + " ensenya " + ensenyar2Value);
          insertDataInSheet2([mails[a][0],mails[e][0]], [ensenyar[a][0],ensenyar[e][0]], [aprendre[a][0],aprendre[e][0]])
        }
      }
    }
  }
}


function main () {
  // send last row to "claned_data" sheat
  // check groups again
}