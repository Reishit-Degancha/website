# Ticket DECAP-02: Authentication Setup

> **Status**: Pending
> **Estimated Time**: 30 minutes
> **Depends On**: DECAP-01
> **Design Reference**: —

---

## Goal

Configure Netlify Identity for authentication so content editors can log in to the CMS.

---

## Context

### The Problem
Decap CMS needs to authenticate users and commit changes to GitHub on their behalf. Since the site is hosted on GitHub Pages (not Netlify), we need to use Netlify Identity + Netlify's Git Gateway service to handle authentication and git operations.

### The Solution
1. Create a Netlify site (can be a "dummy" site just for Identity)
2. Enable Netlify Identity with GitHub as external provider
3. Enable Git Gateway to allow CMS to commit to the repo
4. The site stays on GitHub Pages — Netlify only handles auth

### How This Fits In
This ticket enables the login flow for the CMS. Without this, the CMS interface from DECAP-01 will show but editors cannot log in or save changes.

---

## Scope

**In Scope:**
- Create Netlify site (free tier)
- Enable Netlify Identity service
- Configure GitHub as authentication provider
- Enable Git Gateway
- Update `public/admin/config.yml` to use git-gateway backend

**Out of Scope:**
- Moving site hosting to Netlify (stays on GitHub Pages)
- Inviting content editors (post-implementation task)
- Customizing email templates

---

## Implementation Details

### Step 1: Create Netlify Site

1. Go to [netlify.com](https://netlify.com) and log in with GitHub
2. Click "Add new site" → "Import from Git" → Select `Reishit-Degancha/website`
3. Site name: `reishit-degancha-cms` (or similar)
4. **Important:** Go to **Site settings** → **Build & deploy** → **Build settings**
5. Click **Stop builds** (or set Build command to `exit 0`)
   - We need the repo linked for Git Gateway, but GitHub Actions handles deployment
   - This prevents duplicate deploys

### Step 2: Enable Identity

1. In your Netlify site dashboard, go to **Identity**
2. Click **Enable Identity**
3. Click **Settings** → **Registration**
4. Set "Registration preferences" to **Invite only** (recommended for security)
5. Go to **External providers** → Enable **GitHub**
6. You'll need a GitHub OAuth app — create one at github.com/settings/applications/new:
   - Application name: "Reishit Degancha CMS"
   - Homepage URL: `https://reishit-degancha.github.io/website/`
   - Authorization callback URL: `https://reishit-degancha-cms.netlify.app/.netlify/identity/github/callback`
   - Copy the Client ID and Client Secret to Netlify Identity settings

### Step 3: Enable Git Gateway

1. In Identity settings, scroll to **Git Gateway**
2. Click **Enable Git Gateway**
3. This generates a token that lets the CMS commit to your repo

### Step 4: Update CMS Config

### File: `public/admin/config.yml`

Update the backend configuration:

```yaml
backend:
  name: git-gateway
  branch: main
  # Add these lines for identity widget integration
  identity_url: "https://reishit-degancha-cms.netlify.app/.netlify/identity"
  gateway_url: "https://reishit-degancha-cms.netlify.app/.netlify/git"

media_folder: "public/uploads"
public_folder: "/website/uploads"

collections:
  - name: "pages"
    label: "דפי תוכן"
    folder: "src/content/pages"
    create: false
    delete: false
    slug: "{{slug}}"
    editor:
      preview: false
    fields:
      - label: "כותרת"
        name: "title"
        widget: "string"
        required: true
      - label: "תיאור (ל-SEO)"
        name: "description"
        widget: "string"
        required: false
      - label: "תוכן"
        name: "body"
        widget: "markdown"
        required: true
```

**Note:** Replace `reishit-degancha-cms` with your actual Netlify site name.

---

## Testing

### Manual Test Cases

1. **Netlify site created**
   - Site appears in Netlify dashboard
   - Has a `.netlify.app` subdomain

2. **Identity enabled**
   - Identity tab shows as "Enabled"
   - GitHub provider shows as enabled

3. **CMS login works**
   - Visit `/admin` on local dev server
   - Click "Login with Netlify Identity"
   - See login modal with GitHub option

4. **Authentication flow**
   - Log in with your GitHub account
   - Return to CMS with authenticated session
   - See list of pages (currently empty until DECAP-03)

---

## How to Verify (PM Verification Guide)

**Environment Setup:**
```bash
cd /Users/eli/code/reishitdegancha-main
pnpm dev
```

Also ensure Netlify site is configured per steps above.

**Verification Steps:**
1. Visit `http://localhost:4321/website/admin/`
2. Click "Login" or identity widget
3. **Expected:** Netlify Identity modal appears with GitHub option
4. Click "Continue with GitHub"
5. **Expected:** GitHub OAuth flow, then return to CMS
6. **Expected:** CMS shows "Pages" collection (currently empty collection view)

**What you should NOT see:**
- "Authentication failed" error
- "Git Gateway not configured" error
- Infinite redirect loops

---

## Files to Create/Modify

| File | Action | Notes |
|------|--------|-------|
| Netlify Dashboard | Configure | Create site, enable Identity + Git Gateway |
| GitHub Settings | Configure | Create OAuth app with callback URL |
| `public/admin/config.yml` | Modify | Add identity_url and gateway_url |

---

## Acceptance Criteria

- [ ] Netlify site created and visible in dashboard
- [ ] Netlify Identity enabled
- [ ] GitHub OAuth app created with correct callback URL
- [ ] Git Gateway enabled in Netlify Identity settings
- [ ] CMS config.yml updated with identity_url and gateway_url
- [ ] Can log in to CMS via GitHub OAuth
- [ ] Authenticated session persists across page refresh

---

## Code Review Checklist

- [ ] Identity URL matches Netlify site subdomain
- [ ] Git Gateway URL matches Netlify site subdomain
- [ ] Branch is set to `main` (matches repo default)
- [ ] OAuth callback URL is correctly configured in GitHub app
- [ ] Registration is set to "Invite only" (security)

---

## Post-Implementation Notes

Once this is complete, content editors can be invited:
1. Netlify Dashboard → Identity → Invite users
2. Enter email addresses
3. They receive invitation email with login link
4. First login sets their password (or they can use GitHub)
