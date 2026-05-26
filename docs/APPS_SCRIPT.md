# Google Apps Script Setup

This folder contains backup copies of important configuration and scripts for maintaining the site.

## apps-script.js

This is the Google Apps Script that powers the "פרסם לאתר" (Publish) button in the Google Sheet.

### Why we're keeping this in the repo

Google Apps Script is cloud-based and can be lost if:
- The Sheet is accidentally deleted
- Access is lost
- Google changes their UI

Having a backup here means you can recreate it if needed.

### How to set it up (or restore)

1. Open the Google Sheet
2. **Extensions → Apps Script**
3. Copy the entire contents of `apps-script.js` into the `Code.gs` file
4. Update the `GITHUB_TOKEN` constant with your personal access token
5. **Click the gear icon (Project Settings)**
6. Check **"Show 'appsscript.json' manifest file in editor"**
7. Click on **appsscript.json** and paste the manifest below:

```json
{
  "timeZone": "Asia/Jerusalem",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets.currentonly",
    "https://www.googleapis.com/auth/script.external_request"
  ]
}
```

8. Save everything (Ctrl+S)
9. **Reload the Google Sheet** - you should now see the "אתר" menu

### Creating a GitHub Personal Access Token

If you don't have one:

1. Go to https://github.com/settings/tokens?type=beta
2. Click **"Generate new token"** (fine-grained)
3. **Token name**: `sheets-publish-button`
4. **Expiration**: 1 year
5. **Repository access**: Select the `website` repo only
6. **Permissions**: Go to "Repository permissions" → set **Actions** to **Read and write**
7. Click **"Generate token"**
8. Copy the token (you only see it once!)
9. Paste it into `apps-script.js` replacing `YOUR_PERSONAL_ACCESS_TOKEN_HERE`

### How it works

When someone clicks the "פרסם לאתר" button:

1. Script asks for confirmation
2. Makes a POST request to GitHub's Actions API
3. Triggers the `deploy.yml` workflow
4. GitHub builds the site with fresh data from Sheets
5. Site deploys to GitHub Pages
6. Admin sees confirmation message

### Troubleshooting

**"Authorization: Bearer invalid"**
- Token is wrong or expired. Generate a new one.

**"Repository not found"**
- Token doesn't have access to the repository. Regenerate with correct permissions.

**"Workflow not found"**
- The `.github/workflows/deploy.yml` file is missing or misnamed in the repo.

**"Failed to fetch"**
- Network error or CORS issue. Try again or check internet connection.

---

See also: [SETUP.md](../SETUP.md) for more context on how the publish flow works.
