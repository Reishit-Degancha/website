// Google Apps Script for ראשית דגנך
// This script adds a "Publish" button to the Google Sheet that triggers a site rebuild
// 
// SETUP INSTRUCTIONS:
// 1. Open the Google Sheet
// 2. Go to Extensions → Apps Script
// 3. Copy this entire file into Code.gs
// 4. Update GITHUB_TOKEN with your personal access token (see SETUP.md)
// 5. Click Project Settings (gear) → check "Show 'appsscript.json' manifest file in editor"
// 6. Replace appsscript.json with the contents below
// 7. Save and reload the Sheet
//
// You should now see an "אתר" menu with "פרסם לאתר" option

const GITHUB_OWNER = 'Reishit-Degancha';
const GITHUB_REPO = 'website';
const GITHUB_TOKEN = 'YOUR_PERSONAL_ACCESS_TOKEN_HERE'; // Replace with real token

/**
 * Creates the "אתר" menu on sheet open
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('אתר')
    .addItem('פרסם לאתר', 'publishToWebsite')
    .addToUi();
}

/**
 * Main publish function - triggered by menu button
 * Sends a webhook to GitHub to trigger the deploy workflow
 */
function publishToWebsite() {
  const ui = SpreadsheetApp.getUi();
  
  // Confirmation dialog
  const response = ui.alert(
    'פרסום לאתר',
    'האם לפרסם את השינויים לאתר?',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) return;
  
  try {
    // GitHub API endpoint for workflow dispatch
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/deploy.yml/dispatches`;
    
    // Fetch options for the webhook call
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({ ref: 'main' })
    };
    
    // Make the request
    UrlFetchApp.fetch(url, options);
    
    // Success message
    ui.alert(
      'פורסם!',
      'השינויים יופיעו באתר תוך כ-2 דקות.\n\nתוכל לעקוב אחרי ההתקדמות בـ:\nhttps://github.com/Reishit-Degancha/website/actions',
      ui.ButtonSet.OK
    );
    
  } catch (error) {
    ui.alert(
      'שגיאה',
      'לא הצלחנו לפרסם: ' + error.message,
      ui.ButtonSet.OK
    );
  }
}
