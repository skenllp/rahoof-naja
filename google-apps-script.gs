// Google Apps Script — paste into Extensions > Apps Script in your Google Sheet.
// RSVPs are saved to a tab named "RSVP".

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('RSVP') || ss.insertSheet('RSVP');
  if (sheet.getLastRow() === 0) sheet.appendRow(['Timestamp', 'Attending', 'Name', 'Mobile', 'Guests', 'Message']);
  sheet.appendRow([new Date(), data.attendance, data.name, data.mobile, data.guests, data.message]);
  return ContentService.createTextOutput('ok');
}
