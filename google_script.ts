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
  var teach_vec = teach_original.split(", ");
  var learn_vec = learn_original.split(", ");

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


// findLastRowWithSameID
// @return find the first row with the same ID (using the email as ID). The last row with this ID
// is the last row of the cleaned_data sheet
function findLastRowWithSameID() {
  var spreadsheet = SpreadsheetApp.openById("1nRQibzFbMquGppsPTQTK0P1rmbx6WUiXhzGhxOZLE50");
  var sheet = spreadsheet.getSheetByName("Cleaned_data");
  
  var lastRow = sheet.getLastRow();
  var idColumn = 2; // mail column is our id column

  var currentID = sheet.getRange(lastRow, idColumn).getValue();
  var row = lastRow - 1;
  
  while (row >= 2 && sheet.getRange(row, idColumn).getValue() === currentID) {
    currentID = sheet.getRange(row, idColumn).getValue();
    row--;
  }
  
  return (row + 1);
}


// readDataFromSpreadsheet
// @return: read data from answers' sheet, check for matches and create the groups
function readDataFromSpreadsheet() {
  var spreadsheet = SpreadsheetApp.openById("1nRQibzFbMquGppsPTQTK0P1rmbx6WUiXhzGhxOZLE50");
  var sheet = spreadsheet.getSheetByName("Cleaned_data");

  // new entry row lines (first and last one)
  var firstRow = findLastRowWithSameID();
  var lastRow = sheet.getLastRow();

  // check for new group combinations
  for (var i = firstRow; i <= lastRow; i++) {    // person1: new entry lines
    for (var j = 2; j <= (firstRow-1); j++) {    // person2: rest of the entries
      var teach1_value = sheet.getRange("E"+i+":E"+i).getValue();  // language that person1 teaches
      var learn2_value = sheet.getRange("F"+j+":F"+j).getValue();  // language that person2 learns

      // if there's match
      if (teach1_value == learn2_value) {
        // check that the language that person1 learns is the same that person2 teaches
        learn1_value = sheet.getRange("F"+i+":F"+i).getValue();
        teach2_value = sheet.getRange("E"+j+":E"+j).getValue();

        if (learn1_value == teach2_value) {
          Logger.log("Match!: " + sheet.getRange("B"+i+":B"+i).getValue() + " ensenya " + sheet.getRange("E"+i+":E"+i).getValue() + " i " + sheet.getRange("B"+j+":B"+j).getValue() + " ensenya " + sheet.getRange("E"+j+":E"+j).getValue());
          insertDataInGroupsSheet([sheet.getRange("B"+i+":B"+i).getValue(),sheet.getRange("B"+j+":B"+j).getValue()], 
                                  [sheet.getRange("E"+i+":E"+i).getValue(),sheet.getRange("E"+j+":E"+j).getValue()],[sheet.getRange("F"+i+":F"+i).getValue(),sheet.getRange("F"+j+":F"+j).getValue()])
        }
      }
    }
  }
}


// main
// @return: clean the new entries and check for new groups
function main () {
  // send last row to "claned_data" sheat
  cleanResponses()
  // check groups again with readDataFromSpreadsheet function but using the cleaned data sheet instead of the answers one
  readDataFromSpreadsheet()
}

// TODO: do new checks to check for schedule and face-to-face/virtual preferences. Maybe create a new groups sheet based on the existing one
// TODO: create column for "group_closed" and avoid these ones when creating groups
// TODO: create multiple forms (one by language) and a google sheet to read from all of them, translate the languages, and create the groups