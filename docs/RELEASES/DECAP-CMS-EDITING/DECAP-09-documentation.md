# Ticket DECAP-09: Documentation Update

> **Status**: Pending
> **Estimated Time**: 30 minutes
> **Depends On**: DECAP-01, DECAP-02, DECAP-04, DECAP-05, DECAP-06, DECAP-07, DECAP-08
> **Design Reference**: `docs/SETUP.md`

---

## Goal

Add comprehensive CMS usage documentation to `docs/SETUP.md` explaining how to access the CMS, editing boundaries, and user management.

---

## Context

### The Problem
Once Decap CMS is integrated, content editors need clear documentation on:
- How to access the CMS
- What they can and cannot edit
- How to invite new users
- When to request code changes vs. use CMS

### The Solution
Add a new section to `docs/SETUP.md` covering all aspects of CMS usage.

---

## Scope

**In Scope:**
- Add "Content Management System (CMS)" section to SETUP.md
- Document access URL (`/admin`)
- Document editable pages
- Document boundaries (what requires code changes)
- Document user invitation process
- Document troubleshooting

**Out of Scope:**
- Changing existing documentation structure
- Creating separate CMS guide (keep in SETUP.md)

---

## Implementation Details

### File: `docs/SETUP.md`

Add new section before "Future TODOs":

```markdown
---

## Content Management System (CMS)

The site includes a web-based Content Management System (Decap CMS) for editing page content without touching code.

### What Can Be Edited via CMS

| Page | URL | Content |
|------|-----|---------|
| About | `/about` | About text, vision, rabbi bio |
| Donate | `/donate` | Donation instructions, payment methods |
| Room Rental | `/room-rental` | Hall info, amenities, contact |
| Membership | `/membership` | Benefits, fees, welcome text |
| Community | `/community` | Class schedule, activities |

### What Requires Code Changes

These changes **cannot** be made via CMS and require developer assistance:

- **Homepage content** — Hero, features, CTAs (hardcoded by design)
- **New pages** — Creating new routes requires code
- **Navigation links** — Header/Footer navigation
- **Page structure** — Layout changes, new sections
- **Styling changes** — Colors, fonts, spacing
- **Contact information in footer** — Email, phone, address

### How to Access the CMS

1. Visit: `https://reishit-degancha.github.io/website/admin/`
2. Click "Login with Netlify Identity"
3. Use your GitHub account or email/password

### How to Edit Content

1. **Select a page** from the "דפי תוכן" (Pages) collection
2. **Edit content** in the WYSIWYG editor (like Google Docs)
3. **Click "Publish"** to save changes immediately
4. Changes are automatically committed to git and deployed

**Note:** Changes go live immediately. There is no draft/approval workflow — make edits carefully.

### Content Formatting Guide

The editor supports Markdown formatting:

| You Type | Result |
|----------|--------|
| `## Heading` | H2 heading (large) |
| `### Heading` | H3 heading (medium) |
| `**bold**` | **bold text** |
| `- item` | Bullet list |
| `[text](url)` | [Link](url) |

### Inviting New Content Editors

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select the site: `reishit-degancha-cms`
3. Go to **Identity** → **Invite users**
4. Enter email address
5. User receives invitation email with login link

### Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't log in | Check invitation email and click link to set password |
| Changes not appearing | Wait 2-3 minutes for build, then hard refresh (Ctrl+Shift+R) |
| Page missing in CMS | Page may be code-only (homepage), contact developer |
| Edit button disabled | Refresh the page and log in again |

---
```

**Notes on placement:**
- Add this section before the existing "Future TODOs" section
- Maintain the same formatting style (tables, Hebrew text, practical tone)
- Keep it concise but comprehensive

---

## Testing

1. **Documentation renders correctly**
   - Open `docs/SETUP.md` in Markdown preview
   - Tables display correctly
   - Hebrew text is preserved

2. **Links are correct**
   - CMS URL matches actual deployment URL
   - Netlify dashboard link is correct

---

## How to Verify (PM Verification Guide)

**Verification Steps:**

1. Open `docs/SETUP.md`
2. **Expected:** New "Content Management System (CMS)" section present
3. **Expected:** 5 editable pages listed in table
4. **Expected:** Clear boundaries documented (what requires code changes)
5. **Expected:** Access instructions with correct URL
6. **Expected:** User invitation steps documented

**What you should NOT see:**
- Broken Markdown syntax
- Missing table formatting
- Inconsistent section ordering

---

## Files to Create/Modify

| File | Action | Notes |
|------|--------|-------|
| `docs/SETUP.md` | Modify | Add CMS section before "Future TODOs" |

---

## Acceptance Criteria

- [ ] CMS section added to SETUP.md
- [ ] Editable pages table with all 5 pages
- [ ] Boundaries clearly documented (homepage, new pages, navigation, etc.)
- [ ] Access instructions with correct URL
- [ ] User invitation process documented
- [ ] Troubleshooting table included
- [ ] Consistent formatting with rest of document

---

## Code Review Checklist

- [ ] Section placement is logical (before Future TODOs)
- [ ] Hebrew text preserved (דפי תוכן, etc.)
- [ ] URL matches actual deployment path (`/website/admin/`)
- [ ] Tables use proper Markdown syntax
- [ ] Tone is practical and helpful (matches existing SETUP.md style)
