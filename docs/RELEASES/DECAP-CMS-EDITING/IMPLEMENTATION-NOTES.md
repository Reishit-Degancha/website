# Decap CMS Integration — Implementation Notes

> **Epic:** Decap CMS Integration  
> **Status:** Pending  
> **Last Updated:** June 11, 2026  
> **Code:** reishitdegancha-main  
> **Tickets:** See PRD.md for ticket index

This document is the durable engineering record for the Decap CMS integration work: what shipped, why certain choices were made, and what to watch out for when maintaining or extending it.

---

## Summary

Enable non-technical content editing for the ראשית דגנך synagogue website using Decap CMS with Netlify Identity for authentication. Content editors can edit 5 static pages via a web interface at `/admin`, with changes saved as git commits and automatically deployed via GitHub Actions.

**Key design decision:** Homepage remains hardcoded (not editable via CMS) to prevent confusion about what's editable. CMS is strictly for page content; structural changes require code updates.

---

## Files Touched

| Path | Change |
|------|--------|
| `package.json` | Add `decap-cms-app` dependency |
| `public/admin/index.html` | Create - CMS UI entry point |
| `public/admin/config.yml` | Create - CMS configuration |
| `src/content/config.ts` | Create - Astro content collection schema |
| `src/content/pages/about.md` | Create - Page content |
| `src/content/pages/donate.md` | Create - Page content |
| `src/content/pages/room-rental.md` | Create - Page content |
| `src/content/pages/membership.md` | Create - Page content |
| `src/content/pages/community.md` | Create - Page content |
| `src/pages/about.astro` | Modify - Load from content collection |
| `src/pages/donate.astro` | Modify - Load from content collection |
| `src/pages/room-rental.astro` | Modify - Load from content collection |
| `src/pages/membership.astro` | Modify - Load from content collection |
| `src/pages/community.astro` | Modify - Load from content collection |
| `docs/SETUP.md` | Modify - Add CMS documentation section |

---

## Progress Tracker

| # | Ticket | Status | Commit | Notes |
|---|--------|--------|--------|-------|
| 1 | Content Infrastructure | ⬜ Not started | — | |
| 2 | Authentication Setup | ⬜ Not started | — | |
| 3 | Content Collections Setup | ⬜ Not started | — | |
| 4 | About Page Migration | ⬜ Not started | — | |
| 5 | Donate Page Migration | ⬜ Not started | — | |
| 6 | Room Rental Page Migration | ⬜ Not started | — | |
| 7 | Membership Page Migration | ⬜ Not started | — | |
| 8 | Community Page Migration | ⬜ Not started | — | |
| 9 | Documentation Update | ⬜ Not started | — | |

**Status legend:** ⬜ Not started | 🟡 In progress | ✅ Complete | ⚠️ Blocked

---

## Ticket-by-Ticket Notes

### Ticket 1: Content Infrastructure

**Status:** ⬜ Not started

**Summary:** Install Decap CMS and create admin interface files (`index.html`, `config.yml`).

**Key decisions / tradeoffs:**
- Using CDN-loaded Decap CMS (simpler than bundling)
- `create: false` and `delete: false` in config to prevent page creation/deletion
- Hebrew labels in CMS for editor clarity

**Known issues / gotchas:**
- Config.yml must use `git-gateway` backend (not direct GitHub) for Netlify Identity
- Media uploads require `public/uploads/` directory to exist

---

### Ticket 2: Authentication Setup

**Status:** ⬜ Not started

**Summary:** Configure Netlify Identity service for CMS authentication.

**Key decisions / tradeoffs:**
- Site stays on GitHub Pages; Netlify only handles auth (no hosting migration)
- GitHub OAuth preferred for users who already have GitHub accounts
- "Invite only" registration for security

**Known issues / gotchas:**
- Netlify site name must match the `identity_url` and `gateway_url` in config.yml
- GitHub OAuth app callback URL must exactly match Netlify's pattern
- Free tier: 1,000 active users (sufficient for this use case)

---

### Ticket 3: Content Collections Setup

**Status:** ⬜ Not started

**Summary:** Configure Astro content collections with Zod schema.

**Key decisions / tradeoffs:**
- Simple schema: title (required), description (optional), body (Markdown)
- Using `type: 'content'` for Markdown files (not 'data' for JSON)

**Known issues / gotchas:**
- Content config must be at `src/content/config.ts` (not in subdirectory)
- Zod validation errors will fail the build if frontmatter is malformed

---

### Ticket 4-8: Page Migrations

**Status:** ⬜ Not started

**Summary:** Extract content from 5 Astro pages to Markdown files.

**Key decisions / tradeoffs:**
- Simple Markdown structure vs. structured YAML frontmatter
- Chose Markdown for simplicity; structured data would preserve more styling but adds complexity
- CTA buttons (membership page) kept in Astro template to use `BASE_URL` correctly

**Known issues / gotchas:**
- `getEntry('pages', 'slug')` uses slug without file extension
- `await page.render()` returns `{ Content }` component for `<Content />`
- Must preserve existing CSS classes (`prose`, `bg-surface`, etc.)

---

### Ticket 9: Documentation Update

**Status:** ⬜ Not started

**Summary:** Add CMS usage section to SETUP.md.

**Key decisions / tradeoffs:**
- Keep documentation in existing SETUP.md (not separate file)
- Clear boundaries table: what can/can't be edited
- Hebrew/English bilingual where appropriate

**Known issues / gotchas:**
- URL must include `/website/` base path for GitHub Pages deployment

---

## Deviations from Spec

| Ticket | Deviation | Reason |
|--------|-----------|--------|
| *(none yet)* | | |

---

## Commands Reference

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview build
pnpm preview
```

**Netlify Identity Testing:**
```bash
# Local development with Netlify Identity
# Visit: http://localhost:4321/website/admin/
# Click login, complete OAuth flow
```

---

## Post-Implementation Checklist

- [ ] Content editor invited via Netlify Identity
- [ ] Content editor tested editing a page
- [ ] Build/deploy flow verified (edit → commit → deploy)
- [ ] Documentation reviewed with content editor
- [ ] Escalation path documented (when to request code changes)

---

*Last updated: June 11, 2026*
