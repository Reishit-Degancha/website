# ראשית דגנך - Setup & Maintenance Guide

Welcome! This guide covers everything you need to know to develop, maintain, and update the ראשית דגנך synagogue website.

## Table of Contents

1. [What This Site Is](#what-this-site-is)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Local Development](#local-development)
5. [Project Structure](#project-structure)
6. [How Content Updates Work](#how-content-updates-work)
7. [Deployment & Publish Flow](#deployment--publish-flow)
8. [Common Tasks](#common-tasks)
9. [Troubleshooting](#troubleshooting)
10. [Future TODOs](#future-todos)

---

## What This Site Is

ראשית דגנך is a static Hebrew website for a synagogue in Jerusalem (העומר 9). It serves as a digital home for the congregation with:

- **Static pages**: Home, About, Donate, Membership, Community, Room Rental
- **Dynamic content**: Weekly service times (pulled from Google Sheets)
- **Announcements**: Weekly announcements (pulled from Google Sheets)

**Key design philosophy**: Keep it simple. The only regularly-changing content is service times and announcements, everything else is relatively static.

---

## Tech Stack

| Component | Technology | Why |
|-----------|-----------|-----|
| Static site generator | Astro 4 | Fast, simple, great DX |
| Styling | Tailwind CSS | Utility-first, RTL-friendly |
| Font | Frank Ruhl Libre | Hebrew serif, elegant |
| Content source | Google Sheets | Non-technical admins can edit |
| Hosting | GitHub Pages | Free, integrates with repo |
| Deployment | GitHub Actions | Auto-deploys on push |
| Publish trigger | Google Apps Script | "Publish" button in Sheets triggers rebuilds |

---

## Prerequisites

### Required

- **Node.js** 20+ ([install](https://nodejs.org/))
- **pnpm** package manager ([install](https://pnpm.io/))
- **Git** ([install](https://git-scm.com/))
- **GitHub account** (to push code and deploy)
- **Google account** (to manage the content sheet)

### Recommended

- A code editor (VS Code, Cursor, etc.)
- Basic familiarity with HTML/CSS/JavaScript
- Understanding of Git basics

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/Reishit-Degancha/website.git
cd website
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the repo root:

```
GOOGLE_SHEETS_API_KEY=your_api_key_here
GOOGLE_SHEET_ID=your_sheet_id_here
```

**Where to get these:**
- **API Key**: From [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
- **Sheet ID**: From your Google Sheet URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`

**Important**: `.env` is in `.gitignore` — it will never be committed to GitHub. This keeps your secrets safe.

### 4. Start the dev server

```bash
pnpm dev
```

Visit `http://localhost:4321` (or the port shown in terminal).

Hot reload is enabled — changes save instantly.

### 5. Build for production

```bash
pnpm build
```

This generates a `dist/` folder with the compiled site.

### 6. Preview the production build

```bash
pnpm preview
```

---

## Project Structure

```
reishit-degancha/
├── src/
│   ├── pages/                 # Route pages (each becomes a URL)
│   │   ├── index.astro        # Homepage (/)
│   │   ├── about.astro        # /about
│   │   ├── donate.astro       # /donate
│   │   ├── membership.astro   # /membership
│   │   ├── community.astro    # /community
│   │   └── room-rental.astro  # /room-rental
│   │
│   ├── components/            # Reusable Astro components
│   │   ├── Header.astro       # Navigation header
│   │   ├── Footer.astro       # Footer
│   │   └── ServiceTimes.astro # Renders times from Sheets
│   │
│   ├── layouts/
│   │   └── Layout.astro       # Base layout (RTL, meta tags, etc.)
│   │
│   ├── lib/
│   │   └── sheets.ts          # Google Sheets API functions
│   │
│   ├── styles/
│   │   └── global.css         # Tailwind + custom styles
│   │
│   └── env.d.ts               # TypeScript env variable types
│
├── public/
│   ├── hero.png               # Hero image (building photo)
│   ├── favicon.ico
│   └── favicon.svg
│
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions deploy workflow
│
├── astro.config.mjs           # Astro configuration
├── tailwind.config.mjs        # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies
├── .env                       # Environment variables (local only, not committed)
└── README.md
```

### Key file explanations

**`src/lib/sheets.ts`**: Fetches data from Google Sheets at build time
- `getServiceTimes()` → Returns service times from the "times" tab
- `getAnnouncements()` → Returns announcements from the "announcements" tab
- Uses Google Sheets API v4 with your API key

**`src/components/ServiceTimes.astro`**: Renders the times and announcements
- Calls `getServiceTimes()` and `getAnnouncements()` 
- Falls back to hardcoded data if sheet fetch fails
- Formats the data into visual cards

**`.github/workflows/deploy.yml`**: GitHub Actions workflow
- Triggers on: git push to `main` OR manual trigger via "Run workflow" button
- Builds the site with `pnpm build`
- Deploys the `dist/` folder to GitHub Pages

**`astro.config.mjs`**: Astro configuration
- `base: '/website/'` — tells Astro the site is at `/website/` path (GitHub Pages requirement)
- `integrations: [tailwind()]` — enables Tailwind CSS

---

## How Content Updates Work

### The Three Types of Content

#### 1. **Static Pages** (rarely change)
- Files: `src/pages/*.astro`
- How to update: Edit the `.astro` file directly
- Example: Updating the "About" page → Edit `src/pages/about.astro` → Commit → Push → Auto-deploys

#### 2. **Service Times** (weekly)
- Source: Google Sheet "times" tab
- Columns: `מקטע` (section), `אירוע` (event), `שעה` (time), `הערות` (notes)
- How to update: Edit the sheet → Click "פרסם לאתר" button → Site rebuilds in ~2 min

#### 3. **Announcements** (weekly)
- Source: Google Sheet "announcements" tab
- Columns: `כותרת` (title), `תוכן` (content)
- How to update: Edit the sheet → Click "פרסם לאתר" button → Site rebuilds in ~2 min

### Google Sheet Structure

Your sheet has two tabs:

**Tab 1: "times"**
```
| מקטע | אירוע | שעה | הערות |
|------|-------|-----|-------|
| שבת פרשת וירא | | | ט״ו-ט״ז חשון |
| | פתח ניב שפת | 19:00 | |
| | קבלת שבת | 19:15 | |
```

Logic:
- If `מקטע` (first column) has text → starts a new card
- If `מקטע` is empty but `אירוע` has text → it's an item in the current card
- Empty rows are ignored

**Tab 2: "announcements"**
```
| כותרת | תוכן |
|-------|------|
| שיעור תורה | השבוע יתקיים... |
```

Each row = one announcement. Empty rows ignored.

---

## Deployment & Publish Flow

### Architecture

```
You edit code
    ↓
git push to main
    ↓
GitHub Actions triggers (deploy.yml)
    ↓
Builds site: pnpm build
    ↓
Deploys dist/ to GitHub Pages
    ↓
Live at: https://reishit-degancha.github.io/website/
```

```
Admin edits Google Sheet
    ↓
Clicks "פרסם לאתר" button
    ↓
Google Apps Script runs
    ↓
Sends webhook to GitHub
    ↓
GitHub Actions workflow_dispatch triggers
    ↓
Fetches fresh data from Sheets
    ↓
Builds site
    ↓
Deploys
    ↓
Live in ~2 minutes
```

### Setting up the "Publish" button (Admin side)

This is already set up, but if you need to recreate it:

1. Open the Google Sheet
2. **Extensions → Apps Script**
3. Replace all code with:

```javascript
const GITHUB_OWNER = 'Reishit-Degancha';
const GITHUB_REPO = 'website';
const GITHUB_TOKEN = 'your_personal_access_token'; // See step 4

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('אתר')
    .addItem('פרסם לאתר', 'publishToWebsite')
    .addToUi();
}

function publishToWebsite() {
  const ui = SpreadsheetApp.getUi();
  
  const response = ui.alert(
    'פרסום לאתר',
    'האם לפרסם את השינויים לאתר?',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) return;
  
  try {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/deploy.yml/dispatches`;
    
    UrlFetchApp.fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      payload: JSON.stringify({ ref: 'main' })
    });
    
    ui.alert('פורסם!', 'השינויים יופיעו באתר תוך כ-2 דקות.', ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('שגיאה', 'לא הצלחנו לפרסם: ' + error.message, ui.ButtonSet.OK);
  }
}
```

4. **Create a GitHub Personal Access Token**:
   - Go to [github.com/settings/tokens](https://github.com/settings/tokens?type=beta)
   - Generate new fine-grained token
   - Repository: `website`
   - Permissions: Actions (read & write)
   - Copy token and paste into the Apps Script above

5. In Apps Script, click **Project Settings** (gear) → Check "Show appsscript.json manifest"

6. Click **appsscript.json** and ensure it has:

```json
{
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets.currentonly",
    "https://www.googleapis.com/auth/script.external_request"
  ]
}
```

7. Save and reload the Sheet. You'll now see **"אתר"** menu with **"פרסם לאתר"** option.

---

## Common Tasks

### Task 1: Update a static page (e.g., About)

1. Edit `src/pages/about.astro`
2. Commit: `git add src/pages/about.astro && git commit -m "Update about page"`
3. Push: `git push`
4. GitHub Actions deploys automatically (~1-2 min)

### Task 2: Update service times (Admin via Sheet)

1. Open the Google Sheet
2. Edit the "times" tab
3. Click **"אתר"** → **"פרסם לאתר"**
4. Confirm the dialog
5. Site rebuilds in ~2 minutes

### Task 3: Add a new announcement

1. Open the Google Sheet
2. Go to "announcements" tab
3. Add a new row: `[title] | [content]`
4. Click **"אתר"** → **"פרסם לאתר"**
5. Live in ~2 minutes

### Task 4: Change contact info

Contact info appears in multiple places. Update all of these:

1. **Footer**: `src/components/Footer.astro` (email, phone, address)
2. **Donation page**: `src/pages/donate.astro` (bank details, payment methods)

Then: `git add . && git commit -m "Update contact info" && git push`

### Task 5: Change the hero image

1. Replace `public/hero.png` with a new image
2. Name it `hero.png` (or update the filename in `src/pages/index.astro` if different)
3. Commit and push
4. Deploy automatically

### Task 6: Add a new page

1. Create `src/pages/new-page.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Page Title - ראשית דגנך">
  <main class="max-w-[1100px] mx-auto px-8 py-12">
    <h1 class="text-3xl font-bold mb-6">Page Title</h1>
    <p>Content here...</p>
  </main>
</Layout>
```

2. Add a link to it in `src/components/Header.astro` (Header nav)
3. Commit and push

The page will be accessible at `/website/new-page` (replace dashes with your URL).

---

## Troubleshooting

### Problem: Hero image not loading

**Symptoms**: Image doesn't appear in the hero section

**Cause**: Base URL path issue with GitHub Pages

**Solution**:
1. Check `astro.config.mjs` has `base: '/website/'`
2. Check `src/pages/index.astro` uses `${import.meta.env.BASE_URL}hero.png`
3. Ensure `hero.png` exists in `public/` folder
4. Rebuild: `pnpm build && pnpm preview`

### Problem: Navigation links are broken

**Symptoms**: Clicking "About" goes to `/aboutpage` instead of `/website/about`

**Cause**: Links not using BASE_URL

**Solution**: All links should use `${import.meta.env.BASE_URL}` prefix. Check:
- `src/components/Header.astro`
- `src/components/Footer.astro`
- Any other `.astro` files with links

### Problem: Google Sheets data not updating

**Symptoms**: Changed sheet but site still shows old data

**Causes**:
1. Didn't click "פרסם לאתר" button
2. Sheet API key is wrong or expired
3. Sheet is private (not shared)

**Solutions**:
1. Make sure you clicked the button and got the "פורסם!" confirmation
2. Verify `GOOGLE_SHEETS_API_KEY` in `.env` is valid
3. Check sheet is shared: File → Share → "Anyone with link can view"
4. Check sheet tab names match exactly: "times" and "announcements"

### Problem: "Deploy to GitHub Pages" workflow failed

**Symptoms**: Push to main but site doesn't update, GitHub Actions shows red X

**Solution**:
1. Go to repo → **Actions** tab
2. Click the failed workflow
3. Click the failed job to see the error
4. Common issues:
   - `GOOGLE_SHEETS_API_KEY` or `GOOGLE_SHEET_ID` missing from GitHub Secrets
   - Node version incompatible
   - Syntax error in code

**To add missing secrets**:
1. Go to repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add `GOOGLE_SHEETS_API_KEY` and `GOOGLE_SHEET_ID`
4. Rerun workflow: Actions → workflow → **Run workflow**

### Problem: Local dev server won't start

**Symptoms**: `pnpm dev` fails with error

**Solutions**:
1. Clear cache: `rm -rf node_modules .astro && pnpm install`
2. Check Node version: `node --version` (should be 20+)
3. Check `.env` file exists with valid API key and Sheet ID
4. Check port 4321 isn't in use: `lsof -i :4321`

### Problem: Styling looks weird / colors are wrong

**Symptoms**: Colors don't match, text isn't centered, etc.

**Causes**: Tailwind build issue or RTL not applied

**Solutions**:
1. Check `src/styles/global.css` is imported in `src/layouts/Layout.astro`
2. Ensure HTML has `lang="he" dir="rtl"`
3. Rebuild: `pnpm build`

---

## Future TODOs

- [ ] Create `/contact` page (currently just a placeholder link)
- [ ] Add actual contact form (email integration needed)
- [ ] Add Hebrew date display alongside Gregorian dates
- [ ] Implement auto-calculating candle lighting times (HebCal API integration)
- [ ] Add multi-language support (English option)
- [ ] Mobile menu hamburger (currently hidden on mobile)
- [ ] Update placeholder contact info:
  - Email: `shalom@reishit-degancha.org.il` (update if different)
  - Phone: `054-1234567` (update with real number)
  - Address: `העומר 9` (already correct)
  - Donation methods: bank details, PayPal, Bit (fill in real details)
- [ ] Create a PDF/printable announcements sheet
- [ ] Add Google Analytics or other analytics
- [ ] Set up custom domain (currently at `reishit-degancha.github.io/website/`)

---

## Quick Reference

| What | Where | How |
|------|-------|-----|
| Change a static page | `src/pages/[name].astro` | Edit file → commit → push |
| Update service times | Google Sheet "times" tab | Edit → click "פרסם לאתר" |
| Add announcement | Google Sheet "announcements" tab | Add row → click "פרסם לאתר" |
| Change colors/fonts | `src/styles/global.css` or `tailwind.config.mjs` | Edit → commit → push |
| Change header/footer | `src/components/Header.astro` or `Footer.astro` | Edit → commit → push |
| Deploy manually | GitHub Actions | Go to Actions → Run workflow |
| View live site | Browser | https://reishit-degancha.github.io/website/ |

---

## Getting Help

If something breaks:

1. **Check the logs**: `pnpm dev` shows errors in terminal
2. **GitHub Actions**: repo → Actions tab shows deploy errors
3. **Browser console**: F12 → Console tab shows runtime errors
4. **Google Apps Script**: Extensions → Apps Script → Executions tab shows publish errors

Good luck! 🙏
