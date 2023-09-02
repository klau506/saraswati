// insertDataInGroupsSheet
// @return: insert given data in the groups' sheet computing the group id
// @mail_vec: vector of mails (position 0 = person1, position 1 = person 2)
// @teach_vec: vector of languages to teach (position 0 = person1, position 1 = person 2)
// @learn_vec: vector of languages to learn (position 0 = person1, position 1 = person 2)
function insertDataInGroupsSheet(mail_vec, teach_vec, learn_vec) {
  var spreadsheet = SpreadsheetApp.openById("1nRQibzFbMquGppsPTQTK0P1rmbx6WUiXhzGhxOZLE50");
  var sheet = spreadsheet.getSheetByName("Groups");

  // last row of groups' sheet
  var lastRow = sheet.getLastRow();

  // compute id of the new group
  var id = sheet.getRange("A"+lastRow).getValue() + 1

  // desing dataset to introduce
  var data = [
    [id, mail_vec[0], teach_vec[0], learn_vec[0]],
    [id, mail_vec[1], teach_vec[1], learn_vec[1]],
  ];

  // insert data in the groups' sheet
  sheet.getRange(lastRow + 1, 1, data.length, data[0].length).setValues(data);
}


// cleanResponses
// @return: copy last entry of the answers' sheet to the cleaned_data sheet. In case
// a person introduces more than one language to learn or to teach, create multiple
// columns with only one of the possible combinations
function cleanResponses () {
  var spreadsheet = SpreadsheetApp.openById("1nRQibzFbMquGppsPTQTK0P1rmbx6WUiXhzGhxOZLE50");
  var sheet = spreadsheet.getSheetByName("Respostes al formulari 1");   // answers sheet
  var cd_sheet = spreadsheet.getSheetByName("Cleaned_data");    // cleaned_data sheet

  // last row of answers' sheet
  var lastRow = sheet.getLastRow()

  var teach_original = sheet.getRange("E"+lastRow).getValue()
  var learn_original = sheet.getRange("F"+lastRow).getValue()
  var teach_vec = teach_original.split(",");
  var learn_vec = learn_original.split(",");

  // get the data from the current row
  var tmp_row = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
  // create all possible combinations of teach-learn language
  for (var i = 0; i < teach_vec.length; i++) {
    for (var j = 0; j < learn_vec.length; j++) {
      // modify row with the current teaching and learning languages
      tmp_row[4] = teach_vec[i];
      tmp_row[5] = learn_vec[j];

      // insert cleaned row to the cleaned_data sheet
      var cd_lastRow = cd_sheet.getLastRow()
      cd_sheet.getRange(cd_lastRow + 1, 1, 1, tmp_row.length).setValues([tmp_row]);
    }
  }
}

// readDataFromSpreadsheet
// @return: read data from answers' sheet, check for matches and create the groups
function readDataFromSpreadsheet() {
  var spreadsheet = SpreadsheetApp.openById("1nRQibzFbMquGppsPTQTK0P1rmbx6WUiXhzGhxOZLE50");
  var sheet = spreadsheet.getSheetByName("Respostes al formulari 1");

  // TODO: make it automatic to read from the second row to the last one with text
  var mails = sheet.getRange("B2:B4").getValues();
  var teach = sheet.getRange("E2:E4").getValues();
  var learn = sheet.getRange("F2:F4").getValues();

  for (var i = 0; i < teach.length; i++) {
    for (var j = i + 1; j < learn.length; j++) {
      var teach1_value = teach[i][0];  // language that person1 teaches
      var learn2_value = learn[j][0];  // language that person2 learns

      // if there's match
      if (teach1_value == learn2_value) {
        // check that the language that person1 learns is the same that person2 teaches
        learn1_value = learn[i][0];
        teach2_value = teach[j][0];

        if (learn1_value == teach2_value) {
          Logger.log("Match!: " + mails[i][0] + " ensenya " + teach1_value + " i " + mails[j][0] + " ensenya " + teach2_value);
          insertDataInSheet2([mails[j][0],mails[i][0]], [teach[j][0],teach[i][0]], [learn[j][0],learn[i][0]])
        }
      }
    }
  }
}

// TODO
function main () {
  // send last row to "claned_data" sheat
  // check groups again with readDataFromSpreadsheet function but using the cleaned data sheet instead of the answers one
}