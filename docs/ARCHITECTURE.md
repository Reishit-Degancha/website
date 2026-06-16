# Architecture & Setup Guide

A comprehensive guide to how the ראשית דגנך website works and how to maintain it.

## Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        NETLIFY SITE                              │
│  https://rdegancha.netlify.app                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Built from GitHub repo → auto-deploys on every push       │  │
│  │ Includes: /admin/ (Decap CMS editor)                       │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
           ▲                           ▲
           │                           │
    [Developer]               [Content Editors]
    git push                   Use /admin/ to edit
           │                           │
           └───────────┬───────────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │    GitHub Repo        │
           │  (source of truth)    │
           └───────────────────────┘
                       ▲
                       │
              [Admin via Google Sheets]
              Apps Script → GitHub webhook
```

**Three update paths:**

| Who | Tool | Flow |
|-----|------|------|
| Developer | Code editor + git | Edit code → push → GitHub → Netlify auto-rebuilds |
| Content Editor | Decap CMS at `/admin/` | Edit via web UI → saves to GitHub → Netlify auto-rebuilds |
| Admin | Google Sheet + button | Edit times → click "Publish" → Apps Script → GitHub webhook → Netlify rebuilds |

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Astro 4 | Static site generation |
| **Styling** | Tailwind CSS | Utility-first CSS with custom theme |
| **Typography** | @tailwindcss/typography | Markdown content styling |
| **Font** | Frank Ruhl Libre | Hebrew serif font |
| **Hosting** | Netlify | Build, deploy, and hosting |
| **CMS** | Decap CMS | Content editing interface |
| **Auth** | Netlify Identity | User authentication |
| **Content** | Google Sheets | Service times & announcements |
| **Language** | TypeScript | Type-safe code |

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
│   ├── content/             # CMS-managed content
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
│   ├── admin/               # Decap CMS files
│   │   ├── index.html       # CMS UI entry point
│   │   └── config.yml       # CMS configuration
│   ├── hero.png             # Homepage hero image
│   └── favicon.*            # Site icons
│
├── docs/                    # Documentation
│   ├── SETUP.md             # Developer setup guide
│   ├── ARCHITECTURE.md      # This file
│   ├── CHANGELOG.md         # Version history
│   └── APPS_SCRIPT.md       # Google Sheets integration docs
│
├── astro.config.mjs         # Astro configuration
├── tailwind.config.mjs      # Tailwind theme + colors
└── package.json             # Dependencies
```

---

## How Content Flows

### Code Changes (Developer → GitHub → Netlify)

```
1. Edit file locally
2. git commit && git push
3. Netlify detects push
4. Netlify runs: pnpm install && pnpm build
5. Site deploys to https://rdegancha.netlify.app
```

### CMS Content Changes (Editor → CMS → GitHub → Netlify)

```
1. Editor visits https://rdegancha.netlify.app/admin/
2. Logs in via Netlify Identity
3. Edits page in WYSIWYG editor
4. Clicks "Publish"
5. Decap commits Markdown changes to GitHub
6. Netlify detects commit
7. Site rebuilds with new content
```

### Service Times (Google Sheets → Apps Script → GitHub → Netlify → Site)

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
3. GitHub Actions (Webhook triggered)
   ┌──────────────────────────────┐
   │ GitHub API                   │
   │ workflow_dispatch event      │
   │ → deploy.yml runs            │
   └──────────────────────────────┘
                  │
                  │ Workflow starts
                  │
                  ▼
4. Netlify Build (Rebuilds site)
   ┌──────────────────────────────┐
   │ 1. pnpm install              │
   │ 2. Fetch from Google Sheets  │
   │    (getServiceTimes)         │
   │ 3. pnpm build                │
   │ 4. Deploy dist/ to Netlify   │
   └──────────────────────────────┘
                  │
                  │ ~2 minutes
                  │
                  ▼
5. Live Site ✓
   ┌──────────────────────────────┐
   │ https://rdegancha.netlify.app│
   │ Shows updated times          │
   │                              │
   │ "Admin saw confirmation,    │
   │  changes live!"             │
   └──────────────────────────────┘
```

**Flow Summary**:
- Admin edits Google Sheet
- Clicks "פרסם לאתר" in the Sheet
- Google Apps Script authenticates with GitHub
- GitHub Actions workflow triggers
- Netlify builds the site (fetches fresh data from Sheets)
- Site deplooys with new times
- **Total time: ~2 minutes**

---

## Content Management System (CMS)

### What Can Be Edited via CMS

| Page | URL | Editable Content |
|------|-----|------------------|
| About | `/about` | About text, vision, rabbi bio |
| Donate | `/donate` | Donation instructions, payment methods |
| Room Rental | `/room-rental` | Hall info, amenities, contact |
| Membership | `/membership` | Benefits, fees, welcome text |
| Community | `/community` | Class schedule, activities |

### What Requires Code Changes

These are hardcoded in `.astro` files and require a developer:

- Homepage content (hero, features, CTAs)
- Navigation links in Header
- Footer contact information
- Styling (colors, fonts, spacing)
- New pages or layout changes

### CMS Access

**URL**: `https://rdegancha.netlify.app/admin/`

**Login**: Via Netlify Identity (GitHub or email/password)

**User Management**:
1. Go to Netlify Dashboard → Site → Identity
2. Invite users by email
3. Users receive invitation link
4. First login sets password

---

## User Management

### Netlify Identity Setup

Located in: Netlify Dashboard → Site → Identity

**Settings**:
- Registration: Invite only (security)
- External providers: GitHub enabled
- Git Gateway: Enabled (required for CMS commits)

**Inviting Users**:
```
1. Netlify Dashboard → Identity → Invite users
2. Enter email address
3. User receives invitation email
4. Click link → set password → logged in
```

**Note**: Invite links expire. If expired, resend from dashboard.

---

## Google Sheets Integration

Service times and announcements are pulled from Google Sheets at build time.

### Environment Variables

```
GOOGLE_SHEETS_API_KEY=your_api_key
GOOGLE_SHEET_ID=your_sheet_id
```

These are set in Netlify: Site settings → Environment variables

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

### Testing CMS Locally

```bash
# Terminal 1: Start Astro
pnpm dev

# Terminal 2: Start Decap local server
npx decap-server

# Visit http://localhost:4321/admin/
# No login required in local mode
```

### Deploying Changes

```bash
# Standard git workflow
git add .
git commit -m "Description of changes"
git push

# Netlify automatically builds and deploys
```

---

## Troubleshooting

### Site Won't Build

1. Check Netlify deploy log: Dashboard → Deploys → [Failed build]
2. Common issues:
   - Missing environment variables
   - TypeScript errors
   - Google Sheets API rate limit

### CMS Login Issues

| Problem | Solution |
|---------|----------|
| "Authentication failed" | Check Git Gateway is enabled in Netlify |
| Invite link expired | Resend invite from Netlify Dashboard |
| "Page not found" on admin | Wait for deploy to complete, clear cache |
| Can't save edits | Check user has write access in Netlify Identity |

### Content Not Updating

1. Check if change was committed to GitHub (should show in commit history)
2. Check Netlify deploy log for build errors
3. Hard refresh browser (Ctrl+Shift+R)
4. Check if page is CMS-editable vs hardcoded

---

## Key Configuration Files

| File | Purpose | Key Settings |
|------|---------|--------------|
| `astro.config.mjs` | Astro settings | Site URL, integrations |
| `tailwind.config.mjs` | Theme | Colors, fonts, spacing |
| `public/admin/config.yml` | CMS config | Collections, fields, backend |
| `src/content/config.ts` | Content schema | Zod validation for frontmatter |
| `.env` | Secrets | Google Sheets credentials |

---

## Quick Reference: Who Does What

| Task | Who | How |
|------|-----|-----|
| Edit page text | Content Editor | CMS at `/admin` |
| Update service times | Admin | Google Sheet → Publish button |
| Change homepage | Developer | Edit `src/pages/index.astro` |
| Add new page | Developer | Create `.astro` + `.md` files |
| Change colors/fonts | Developer | Edit `tailwind.config.mjs` |
| Add CMS user | Admin | Netlify Dashboard → Identity |
| Deploy site | Automatic | Push to GitHub → Netlify builds |

---

## Migration Notes

### From GitHub Pages to Netlify

- ✅ Hosting moved to Netlify
- ✅ GitHub Actions workflow removed
- ✅ CMS added with Decap + Netlify Identity
- ✅ Content migrated to `src/content/pages/`
- ✅ Google Sheets "Publish" button updated to use Netlify build hooks

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

*Last updated: June 16, 2025*
