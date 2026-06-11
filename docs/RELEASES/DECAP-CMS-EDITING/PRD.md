# Decap CMS Integration

> **Status**: In Planning
> **Last Updated**: June 11, 2026
> **Purpose**: Enable non-technical content editing of synagogue website pages via web-based CMS with version control

---

## The Problem

The ראשית דגנך website currently has all content hardcoded in `.astro` files. Making any content change requires:

1. Cloning the repository locally
2. Understanding Git and Astro
3. Editing code files
4. Committing and pushing changes

This creates a bottleneck where only technical users can update content. Even simple text changes (updating the rabbi's bio, changing donation instructions, updating contact details) require developer intervention.

The current Google Sheets integration handles service times and announcements well, but all other page content is locked in code.

---

## The Vision

A content editor can visit `yoursite.com/admin`, log in with email/password or GitHub, and edit page content using a familiar WYSIWYG interface. Changes are saved directly to the Git repository with full version history, triggering an automatic rebuild and deployment.

**Key boundaries:**
- Homepage remains hardcoded (not editable via CMS)
- New page creation requires code changes
- Page structure/layout changes require code changes
- CMS is strictly for editing content of existing pages

---

## What's Changing

### 1. Content Infrastructure (DECAP-01)
Add Decap CMS dependency and create admin interface files (`public/admin/index.html` and `public/admin/config.yml`).

### 2. Authentication Setup (DECAP-02)
Configure Netlify Identity service for GitHub-based authentication. Site remains on GitHub Pages; Netlify only handles login.

### 3. Content Collections Setup (DECAP-03)
Create Astro content collections configuration and directory structure (`src/content/pages/`).

### 4. About Page Migration (DECAP-04)
Extract content from `src/pages/about.astro` to `src/content/pages/about.md` and refactor page to load from content.

### 5. Donate Page Migration (DECAP-05)
Extract content from `src/pages/donate.astro` to `src/content/pages/donate.md` and refactor page to load from content.

### 6. Room Rental Page Migration (DECAP-06)
Extract content from `src/pages/room-rental.astro` to `src/content/pages/room-rental.md` and refactor page to load from content.

### 7. Membership Page Migration (DECAP-07)
Extract content from `src/pages/membership.astro` to `src/content/pages/membership.md` and refactor page to load from content.

### 8. Community Page Migration (DECAP-08)
Extract content from `src/pages/community.astro` to `src/content/pages/community.md` and refactor page to load from content.

### 9. Documentation Update (DECAP-09)
Add CMS usage section to `docs/SETUP.md` including access instructions, editing boundaries, and user management.

---

## Success Criteria

- [ ] CMS accessible at `/admin` path on the site
- [ ] Content editor can log in via Netlify Identity
- [ ] All 5 content pages appear in CMS interface
- [ ] Editing a page and clicking "Publish" commits changes to git
- [ ] Commits trigger GitHub Actions rebuild (existing flow)
- [ ] Changes appear on site within 2 minutes of publishing
- [ ] Full edit history visible in GitHub commit log
- [ ] Content editor can use WYSIWYG editor without knowing Markdown

---

## Tickets

| # | Ticket | Size | Depends On | File |
|---|--------|------|------------|------|
| 1 | Content Infrastructure | Small | — | `DECAP-01-content-infrastructure.md` |
| 2 | Authentication Setup | Small | 1 | `DECAP-02-authentication-setup.md` |
| 3 | Content Collections Setup | Small | — | `DECAP-03-content-collections.md` |
| 4 | About Page Migration | Medium | 3 | `DECAP-04-about-page-migration.md` |
| 5 | Donate Page Migration | Medium | 3 | `DECAP-05-donate-page-migration.md` |
| 6 | Room Rental Page Migration | Medium | 3 | `DECAP-06-room-rental-migration.md` |
| 7 | Membership Page Migration | Medium | 3 | `DECAP-07-membership-migration.md` |
| 8 | Community Page Migration | Medium | 3 | `DECAP-08-community-migration.md` |
| 9 | Documentation Update | Small | 1-8 | `DECAP-09-documentation.md` |

---

## Dependencies

- Netlify account (free tier sufficient)
- Netlify Identity service enabled
- GitHub OAuth application credentials (or use Netlify's default)
- `decap-cms-app` npm package

---

## Impact & Risk

| Risk | Level | Mitigation |
|------|-------|------------|
| Content editors confused about boundaries | Low | Clear documentation in SETUP.md |
| Netlify Identity service dependency | Low | Can migrate to alternative auth later; content files remain portable |
| Build failures from bad content | Low | Astro's type-safe content collections validate at build time |
| Content editors uncomfortable with CMS | Low | WYSIWYG editor resembles familiar tools (Google Docs) |

**Overall Risk**: Low — this is a well-established pattern with Decap CMS.

---

## Timeline

| Phase | Tickets | Estimated Time |
|-------|---------|----------------|
| Foundation | 1-3 | 1-2 hours |
| Page Migrations | 4-8 | 2-3 hours |
| Documentation | 9 | 30 min |
| **Total** | | **3.5-5.5 hours** |

---

## Out of Scope

- Homepage editing (remains hardcoded by design)
- New page creation via CMS (requires code changes)
- Navigation structure editing (remains in code)
- Footer contact info editing (requires design decision on scope)
- Media upload management (can be added later if needed)
- Multi-language content management
- Workflow/approval process (single publish button)

---

## Technical Context

### Current Architecture
- **Framework**: Astro 4 with static output
- **Hosting**: GitHub Pages
- **Deployment**: GitHub Actions on push to main
- **Content**: Google Sheets for service times/announcements, hardcoded for pages

### Target Architecture
- Same Astro/GitHub Pages/GitHub Actions setup
- New: Decap CMS at `/admin` for page content editing
- Same: Google Sheets for service times/announcements

### Content Model

```yaml
# Each page has:
title: string
description: string (optional)
body: markdown
```

Pages managed via CMS:
- `about` → `/about`
- `donate` → `/donate`
- `room-rental` → `/room-rental`
- `membership` → `/membership`
- `community` → `/community`

---

## User Workflow

1. Content editor visits `yoursite.com/admin`
2. Logs in via Netlify Identity (email/password or GitHub OAuth)
3. Sees list of 5 editable pages in CMS
4. Selects page, edits content in WYSIWYG editor
5. Clicks "Publish" → saves to git → triggers deploy
6. Site updates within 2 minutes

---

## Post-Implementation Tasks

- [ ] Invite content editor(s) via Netlify Identity dashboard
- [ ] Provide 5-minute walkthrough of CMS interface
- [ ] Document escalation path (when to request code changes vs. using CMS)
