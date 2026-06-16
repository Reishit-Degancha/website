# Architecture & Setup Guide

A comprehensive guide to how the ראשית דגנך website works and how to maintain it.

## Overview

```
SOURCES                                BUILD & DEPLOY           HOSTING

┌──────────────┐                   ┌──────────────┐        ┌──────────────┐
│ Google Sheet │                   │   GitHub     │        │   GitHub     │
│ (Times)      │─────→ trigger ──▶│ Actions      │──→────▶│ Pages        │
└──────────────┘  (via AppsScript) │ (Builds &    │        │ (Free static │
                                   │  deploys)    │        │  hosting)    │
                                   └──────────────┘        └──────────────┘

┌──────────────┐
│ Markdown     │──→ commit ──────▶
│ Files        │    (GitHub UI)   │
└──────────────┘                   │
```

**The flow:**

1. **Google Sheets → GitHub Actions** (left path)
   - Admin updates times in Google Sheet → clicks "פרסם לאתר" → Apps Script triggers GitHub Actions workflow

2. **Content edits → GitHub → GitHub Actions** (bottom path)
   - Edit markdown files directly in GitHub (rare) → commit triggers GitHub Actions

3. **GitHub Actions → GitHub Pages** (right side)
   - Workflow builds the Astro site
   - Fetches fresh data from Google Sheets API
   - Deploys to GitHub Pages (free, no external services)

**Result**: Everything lives in GitHub. No external hosting or identity management needed.

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Astro 4 | Static site generation |
| **Styling** | Tailwind CSS | Utility-first CSS with custom theme |
| **Typography** | @tailwindcss/typography | Markdown content styling |
| **Font** | Frank Ruhl Libre | Hebrew serif font |
| **Hosting** | GitHub Pages | Free static hosting |
| **Content** | Google Sheets | Service times & announcements |
| **Language** | TypeScript | Type-safe code |

**Note**: Content is edited directly in GitHub's web interface (rare changes). No CMS or authentication layer needed.

---

## Project Structure

```
website/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.astro     # Navigation (hardcoded links)
│   │   ├── Footer.astro     # Footer with contact info
│   │   └── ServiceTimes.astro # Dynamic service times display
│   │
│   ├── content/             # Markdown content files
│   │   ├── config.ts        # Content collection schema
│   │   └── pages/           # Editable page content
│   │       ├── about.md
│   │       ├── donate.md
│   │       ├── room-rental.md
│   │       ├── membership.md
│   │       └── community.md
│   │
│   ├── layouts/
│   │   └── Layout.astro     # Base HTML wrapper
│   │
│   ├── lib/
│   │   └── sheets.ts        # Google Sheets API integration
│   │
│   ├── pages/               # Route definitions
│   │   ├── index.astro      # Homepage (hardcoded)
│   │   ├── about.astro      # Loads from src/content/pages/
│   │   ├── donate.astro     # Loads from src/content/pages/
│   │   ├── room-rental.astro
│   │   ├── membership.astro
│   │   └── community.astro
│   │
│   └── styles/
│       └── global.css       # Tailwind imports + custom styles
│
├── public/                  # Static assets
│   ├── hero.png             # Homepage hero image
│   └── favicon.*            # Site icons
│
├── docs/                    # Documentation
│   ├── SETUP.md             # Developer setup guide
│   ├── ARCHITECTURE.md      # This file
│   ├── CHANGELOG.md         # Version history
│   └── APPS_SCRIPT.md       # Google Sheets integration docs
│
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions deployment
│
├── astro.config.mjs         # Astro configuration
├── tailwind.config.mjs      # Tailwind theme + colors
└── package.json             # Dependencies
```

---

## How Content Flows

### Code Changes (Developer → GitHub → GitHub Actions)

```
1. Edit file locally
2. git commit && git push
3. GitHub Actions workflow triggers
4. Workflow runs: pnpm install && pnpm build
5. Site deploys to GitHub Pages
```

### Content Changes (Editor → GitHub → GitHub Actions)

```
1. Go to https://github.com/Reishit-Degancha/website
2. Navigate to src/content/pages/
3. Click Edit (pencil icon) on desired file
4. Make changes in the markdown editor
5. Click "Commit changes"
6. GitHub Actions workflow triggers
7. Site rebuilds and deploys with new content
```

### Service Times (Google Sheets → Apps Script → GitHub Actions → Site)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ADMIN UPDATES SERVICE TIMES                          │
└─────────────────────────────────────────────────────────────────────────┘

1. Google Sheet (בדוק שינויים בגיליון)
   ┌──────────────────────────────┐
   │ Google Sheet                 │
   │ - times tab (מקטע, אירוע...)  │
   │ - announcements tab          │
   └──────────────────────────────┘
                  │
                  │ Admin edits sheet
                  │
                  ▼
   ┌──────────────────────────────┐
   │ Clicks "אתר" → "פרסם לאתר"   │ (Publish to Site button)
   └──────────────────────────────┘
                  │
                  │ Menu item triggers function
                  │
                  ▼
2. Google Apps Script (פרסום לאתר)
   ┌──────────────────────────────┐
   │ publishToWebsite()           │
   │ - Confirmation dialog        │
   │ - Makes POST request to API  │
   │ - Sends GitHub token         │
   └──────────────────────────────┘
                  │
                  │ HTTP POST to GitHub
                  │
                  ▼
3. GitHub Actions (Workflow triggered)
   ┌──────────────────────────────┐
   │ GitHub API                   │
   │ workflow_dispatch event      │
   │ → deploy.yml runs            │
   └──────────────────────────────┘
                  │
                  │ Workflow starts
                  │
                  ▼
4. GitHub Actions Build
   ┌──────────────────────────────┐
   │ 1. pnpm install              │
   │ 2. Fetch from Google Sheets  │
   │    (getServiceTimes)         │
   │ 3. pnpm build                │
   │ 4. Deploy to GitHub Pages    │
   └──────────────────────────────┘
                  │
                  │ ~2 minutes
                  │
                  ▼
5. Live Site ✓
   ┌──────────────────────────────┐
   │ https://reishit-degancha.    │
   │   github.io/website          │
   │ Shows updated times          │
   │                              │
   │ "Admin saw confirmation,     │
   │  changes live!"              │
   └──────────────────────────────┘
```

**Flow Summary**:
- Admin edits Google Sheet
- Clicks "פרסם לאתר" in the Sheet
- Google Apps Script authenticates with GitHub
- GitHub Actions workflow triggers
- Workflow builds the site (fetches fresh data from Sheets)
- Deploys to GitHub Pages
- **Total time: ~2 minutes**

---

## Content Editing

### What Can Be Edited

| Page | URL | File Location | How to Edit |
|------|-----|---------------|-------------|
| About | `/about` | `src/content/pages/about.md` | Edit on GitHub |
| Donate | `/donate` | `src/content/pages/donate.md` | Edit on GitHub |
| Room Rental | `/room-rental` | `src/content/pages/room-rental.md` | Edit on GitHub |
| Membership | `/membership` | `src/content/pages/membership.md` | Edit on GitHub |
| Community | `/community` | `src/content/pages/community.md` | Edit on GitHub |
| Service Times | `/` (homepage) | Google Sheet → click "פרסם לאתר" | Sheet button |

### How to Edit Content on GitHub

1. Go to `https://github.com/Reishit-Degancha/website`
2. Navigate to `src/content/pages/[page].md`
3. Click the **Edit** (pencil) icon
4. Make changes in the markdown editor
5. Click **Commit changes** → write a brief description
6. Changes go live within 2 minutes

### What Requires Code Changes

These are hardcoded in `.astro` files and require a developer:

- Homepage content (hero, features, CTAs)
- Navigation links in Header
- Footer contact information
- Styling (colors, fonts, spacing)
- New pages or layout changes

**Tip**: The preview tab in GitHub's editor shows how markdown will render.

---

## Repository Access

Since all content lives in GitHub, editors need GitHub access:

### Giving Someone Edit Access

1. Go to `https://github.com/Reishit-Degancha/website`
2. Settings → Manage access → Invite a collaborator
3. Enter their GitHub username or email
4. They receive an invitation email
5. Once accepted, they can edit files directly

### Content Editing Workflow

```
1. Go to https://github.com/Reishit-Degancha/website
2. Navigate to src/content/pages/
3. Click the file to edit (e.g., about.md)
4. Click the pencil (✎) icon
5. Make changes
6. Scroll down, write a commit message (e.g., "Update rabbi bio")
7. Click "Commit changes"
8. Site rebuilds and deploys automatically (~2 min)
```

---

## Google Sheets Integration

Service times and announcements are pulled from Google Sheets at build time.

### Environment Variables

```
GOOGLE_SHEETS_API_KEY=your_api_key
GOOGLE_SHEET_ID=your_sheet_id
```

These are set as GitHub repository secrets: Settings → Secrets and variables → Actions

### Sheet Structure

| Tab | Purpose | Columns |
|-----|---------|---------|
| `times` | Service times | day, time, event |
| `announcements` | Announcements | title, content |

### Fallback Data

If API fails, `ServiceTimes.astro` and `index.astro` have hardcoded fallback data.

---

## Development Workflow

### Local Development

```bash
# 1. Clone repo
git clone https://github.com/Reishit-Degancha/website.git
cd website

# 2. Install dependencies
pnpm install

# 3. Create .env file
echo "GOOGLE_SHEETS_API_KEY=your_key" > .env
echo "GOOGLE_SHEET_ID=your_sheet_id" >> .env

# 4. Start dev server
pnpm dev

# 5. Visit http://localhost:4321
```

### Deploying Changes

```bash
# Standard git workflow
git add .
git commit -m "Description of changes"
git push

# GitHub Actions automatically builds and deploys to GitHub Pages
```

**Live Site**: `https://reishit-degancha.github.io/website` (or your custom domain)

---

## Troubleshooting

### Site Won't Build

1. Check GitHub Actions log: Repository → Actions → [Failed workflow run]
2. Common issues:
   - Missing environment variables (check repository secrets)
   - TypeScript errors
   - Google Sheets API rate limit

### Content Editing Issues

| Problem | Solution |
|---------|----------|
| Can't find edit button | Make sure you're logged into GitHub and have repository access |
| Changes not appearing | Wait 2 minutes for build, then hard refresh (Ctrl+Shift+R) |
| Build failed | Check GitHub Actions tab for error details |
| Can't commit | Ensure you have write permissions to the repository |

### Content Not Updating

1. Check if change was committed to GitHub (should show in commit history)
2. Check GitHub Actions log for build errors
3. Hard refresh browser (Ctrl+Shift+R)
4. Check if content is in markdown files vs hardcoded in .astro files

---

## Key Configuration Files

| File | Purpose | Key Settings |
|------|---------|--------------|
| `astro.config.mjs` | Astro settings | Site URL, base path, integrations |
| `tailwind.config.mjs` | Theme | Colors, fonts, spacing |
| `src/content/config.ts` | Content schema | Zod validation for frontmatter |
| `.env` | Secrets | Google Sheets credentials |
| `.github/workflows/deploy.yml` | Deployment | GitHub Pages build and deploy |

---

## Quick Reference: Who Does What

| Task | Who | How |
|------|-----|-----|
| Edit page text | Content Editor | GitHub → `src/content/pages/` → Edit |
| Update service times | Admin | Google Sheet → "פרסם לאתר" button |
| Change homepage | Developer | Edit `src/pages/index.astro` |
| Add new page | Developer | Create `.astro` + `.md` files |
| Change colors/fonts | Developer | Edit `tailwind.config.mjs` |
| Give edit access | Admin | GitHub Settings → Manage access |
| Deploy site | Automatic | Push to GitHub → GitHub Actions builds |

---

## Migration Notes

### From GitHub Pages + Netlify to Pure GitHub Pages

**Completed simplification (June 2026):**
- ✅ Hosting moved from Netlify to GitHub Pages
- ✅ GitHub Actions workflow created for deployment
- ✅ Decap CMS removed (public/admin/ deleted)
- ✅ Netlify Identity dependency removed
- ✅ Content stays in `src/content/pages/` (edited directly on GitHub)
- ✅ Google Sheets "Publish" button updated to trigger GitHub Actions

**Result**: Everything lives in GitHub. No external services except Google Sheets API.

---

## Google Apps Script Details

The "פרסם לאתר" button is powered by Google Apps Script.

### Key Variables

```javascript
const GITHUB_OWNER = 'Reishit-Degancha';
const GITHUB_REPO = 'website';
const GITHUB_TOKEN = 'your_personal_access_token';
```

### What It Does

1. **onOpen()** - Creates the "אתר" menu when sheet is opened
2. **publishToWebsite()** - Main function that:
   - Shows confirmation dialog
   - Makes POST request to GitHub Actions
   - Shows success/error message

### Required Permissions

The script needs:
- `https://www.googleapis.com/auth/spreadsheets.currentonly` - Access to this sheet only
- `https://www.googleapis.com/auth/script.external_request` - Make external HTTP requests

### Backup & Recovery

The complete script is backed up at `docs/APPS_SCRIPT.md` with setup instructions.

If you need to recreate it:
1. Extensions → Apps Script
2. Copy code from `docs/apps-script.js`
3. Update GITHUB_TOKEN with a new personal access token
4. Save and reload the sheet

---

*Last updated: June 16, 2026*
