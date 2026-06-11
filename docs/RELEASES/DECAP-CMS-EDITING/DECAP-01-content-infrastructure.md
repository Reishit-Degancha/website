# Ticket DECAP-01: Content Infrastructure

> **Status**: Pending
> **Estimated Time**: 30 minutes
> **Depends On**: —
> **Design Reference**: —

---

## Goal

Add Decap CMS dependency and create the admin interface files that serve as the CMS entry point.

---

## Context

### The Problem
Decap CMS is a client-side React application that needs to be loaded in a browser. It requires:
1. The Decap CMS JavaScript package
2. An HTML entry point (`/admin/index.html`)
3. A configuration file (`/admin/config.yml`) defining editable content

### The Solution
Install `decap-cms-app` via npm and create the admin files in `public/admin/`. These files will be served statically at `/website/admin/` (matching the existing base path configuration).

### How This Fits In
This is the foundation ticket. Without these files, the CMS cannot be accessed. The config.yml defines what content is editable (5 pages) and connects to Netlify Identity for authentication.

---

## Scope

**In Scope:**
- Install `decap-cms-app` npm package
- Create `public/admin/index.html` - CMS UI entry point
- Create `public/admin/config.yml` - CMS configuration

**Out of Scope:**
- Netlify Identity setup (covered in DECAP-02)
- Page content migration (covered in DECAP-04 through DECAP-08)
- Styling customizations beyond default Decap theme

---

## Implementation Details

### File: `package.json`

Add the dependency:

```json
{
  "dependencies": {
    "astro": "^4.15.0",
    "@astrojs/tailwind": "^5.1.0",
    "tailwindcss": "^3.4.0",
    "@tailwindcss/typography": "^0.5.0"
  }
}
```

Run `pnpm install` after modifying.

**Note:** We load Decap CMS from CDN (not npm) for simpler setup. The `@tailwindcss/typography` plugin is required for the `prose` classes to style Markdown content.

### File: `public/admin/index.html`

Create this HTML file that loads Decap CMS:

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>מערכת ניהול תוכן - ראשית דגנך</title>
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</head>
<body>
  <!-- Decap CMS will mount here -->
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  <script>
    // Initialize Netlify Identity
    if (window.netlifyIdentity) {
      window.netlifyIdentity.on('init', user => {
        if (!user) {
          window.netlifyIdentity.on('login', () => {
            document.location.href = '/website/admin/';
          });
        }
      });
    }
  </script>
</body>
</html>
```

**Note:** We load Decap CMS from CDN for simplicity. The Netlify Identity widget is required for authentication. The redirect uses `/website/admin/` to match the `base: '/website/'` configuration in `astro.config.mjs`.

### File: `public/admin/config.yml`

Create the CMS configuration:

```yaml
backend:
  name: git-gateway
  branch: main

# Site URLs for subdirectory hosting
site_url: https://reishit-degancha.github.io/website
display_url: https://reishit-degancha.github.io/website

media_folder: "public/uploads"
public_folder: "/website/uploads"

# Disable new page creation (pages are defined in code)
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

**Important configuration notes:**
- `create: false` — Content editors cannot create new pages
- `delete: false` — Content editors cannot delete pages
- `editor.preview: false` — Disable live preview (we'll see changes after publish)
- Widgets use Hebrew labels for editor clarity

---

## Testing

### Manual Test Cases

1. **Package installs correctly**
   - Run `pnpm install`
   - No errors in terminal
   - `node_modules/decap-cms-app` exists

2. **Admin files are served**
   - Run `pnpm dev`
   - Visit `http://localhost:4321/website/admin/`
   - See Decap CMS login screen (may show "Login with Netlify Identity" button)

3. **CMS loads without JavaScript errors**
   - Open browser DevTools console
   - No red errors (warnings about Netlify Identity not configured are expected at this stage)

---

## How to Verify (PM Verification Guide)

**Environment Setup:**
```bash
cd /Users/eli/code/reishitdegancha-main
pnpm install
pnpm dev
```

**Verification Steps:**
1. Visit `http://localhost:4321/website/admin/`
2. **Expected:** See Decap CMS interface with a "Login" button or identity widget
3. **Expected:** Page title shows "מערכת ניהול תוכן - ראשית דגנך" (Hebrew title)

**What you should NOT see:**
- 404 error (files not found)
- Blank white screen (CMS failed to load)
- Console errors about missing config.yml

---

## Files to Create/Modify

| File | Action | Notes |
|------|--------|-------|
| `package.json` | Modify | Add `decap-cms-app` dependency |
| `public/admin/index.html` | Create | CMS entry point with Netlify Identity |
| `public/admin/config.yml` | Create | CMS configuration defining pages collection |

---

## Acceptance Criteria

- [ ] `pnpm install` completes without errors
- [ ] `public/admin/index.html` exists and contains valid HTML
- [ ] `public/admin/config.yml` exists with correct configuration
- [ ] CMS loads at `http://localhost:4321/website/admin/` during development
- [ ] CMS shows Hebrew labels as configured
- [ ] Pages collection is defined with 3 fields (title, description, body)
- [ ] `create: false` and `delete: false` are set in config

---

## Code Review Checklist

- [ ] Decap CMS version is latest stable (v3.x)
- [ ] CDN URLs use HTTPS
- [ ] Netlify Identity script is loaded before CMS initialization
- [ ] Config.yml uses `git-gateway` backend (correct for Netlify Identity)
- [ ] RTL direction is set in HTML tag for Hebrew interface
