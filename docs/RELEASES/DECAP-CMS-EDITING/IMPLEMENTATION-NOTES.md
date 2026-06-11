# Decap CMS Integration — Implementation Notes

> **Epic:** Decap CMS Integration  
> **Status:** Complete (Code) - Pending (Netlify Setup)  
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
| `package.json` | Add `@tailwindcss/typography` plugin |
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
| 1 | Content Infrastructure | ✅ Complete | dad03c6 | Typography plugin, admin files created |
| 2 | Authentication Setup | ⚠️ Pending Dashboard | dad03c6 | Code ready, needs Netlify setup |
| 3 | Content Collections Setup | ✅ Complete | dad03c6 | Schema created |
| 4 | About Page Migration | ✅ Complete | dad03c6 | Markdown created |
| 5 | Donate Page Migration | ✅ Complete | dad03c6 | Markdown created |
| 6 | Room Rental Page Migration | ✅ Complete | dad03c6 | Markdown created |
| 7 | Membership Page Migration | ✅ Complete | dad03c6 | CTA preserved in template |
| 8 | Community Page Migration | ✅ Complete | dad03c6 | Markdown created |
| 9 | Documentation Update | ✅ Complete | dad03c6 | SETUP.md updated |

**Status legend:** ⬜ Not started | 🟡 In progress | ✅ Complete | ⚠️ Blocked

---

## Ticket-by-Ticket Notes

### Ticket 1: Content Infrastructure

**Status:** ✅ Complete

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

**Status:** ⚠️ Code Complete, Dashboard Pending

**Implementation:**
- Config.yml includes `site_url`, `display_url`, `identity_url`, `gateway_url`
- Netlify Identity widget loaded in admin/index.html

**Netlify Setup Steps:**

1. **Create site**: Add new site → Import from Git → Select `Reishit-Degancha/website`
   - This links the repo (required for Git Gateway)
   
2. **DISABLE BUILDS** (critical - site is already on GitHub Pages):
   - Site settings → Build & deploy → Build settings
   - Click **Stop builds** (or set Build command to `exit 0`)
   - This prevents Netlify from deploying (GitHub Actions handles that)
   
3. **Enable Identity**: Site settings → Identity → Enable Identity

4. **Enable Git Gateway**: Identity settings → Git Gateway → Enable

5. **Configure OAuth** (optional): Identity → External providers → GitHub
   - Create GitHub OAuth app at github.com/settings/applications/new
   - Homepage URL: `https://reishit-degancha.github.io/website/`
   - Callback URL: `https://[your-site-name].netlify.app/.netlify/identity/github/callback`

6. **Invite users**: Identity → Invite users

**Note**: Netlify is only for authentication/Git Gateway. All hosting remains on GitHub Pages.

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

**Status:** ✅ Complete

**Implementation:**
- Created `src/content/config.ts` with Zod schema
- Schema: title (required string), description (optional string)
- Type: 'content' for Markdown files
- All 5 page content files created in `src/content/pages/`

**Summary:** Configure Astro content collections with Zod schema.

**Key decisions / tradeoffs:**
- Simple schema: title (required), description (optional), body (Markdown)
- Using `type: 'content'` for Markdown files (not 'data' for JSON)

**Known issues / gotchas:**
- Content config must be at `src/content/config.ts` (not in subdirectory)
- Zod validation errors will fail the build if frontmatter is malformed

---

### Ticket 4-8: Page Migrations

**Status:** ✅ Complete

**Summary:** Extract content from 5 Astro pages to Markdown files.

**Implementation:**
- All 5 pages migrated: about, donate, room-rental, membership, community
- Pages use `getEntry('pages', 'slug')` to load content
- Content rendered with `<Content />` inside `prose prose-lg max-w-none` wrapper
- Membership page CTA button kept in template (not in Markdown)

**Visual Changes:**
- Card layouts (donate, community) became Markdown sections with H3 headings
- Styling handled by @tailwindcss/typography prose plugin
- Content preserved; presentation simplified (acceptable tradeoff per PRD)

**Known issues / gotchas:**
- `getEntry('pages', 'slug')` uses slug without file extension (e.g., 'room-rental')
- `await page.render()` returns `{ Content }` component for `<Content />`
- Wrapper divs preserve `bg-surface`, `border`, `border-border` styling

---

### Ticket 9: Documentation Update

**Status:** ✅ Complete

**Implementation:**
- Added CMS section to docs/SETUP.md before "Future TODOs"
- Documented: editable pages, boundaries, access URL, editing workflow
- Updated Quick Reference table to include CMS path
- Hebrew labels preserved (דפי תוכן)

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
| DECAP-01 | Added `@tailwindcss/typography` instead of `decap-cms-app` | Typography plugin is required for prose classes; Decap loaded from CDN |
| DECAP-05/06/08 | Card layouts → Markdown sections | Simpler, acceptable per PRD decision |
| All | Visual styling via prose plugin | Slightly different from hand-tuned utilities, but consistent |
| DECAP-09 | Added CMS section + updated Quick Reference | More complete than minimal addition |

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

**Local CMS Testing (without Netlify):**
```bash
# 1. Add local_backend: true to config.yml (one-time)
# 2. Start Astro dev server
pnpm dev

# 3. In another terminal, start Decap local server
npx decap-server

# 4. Visit http://localhost:4321/website/admin/
#    - Login is bypassed in local mode
#    - Edits save directly to local files (no git commits)
#    - Refresh browser to see changes
```

**Netlify Identity Testing (production auth):**
```bash
# After Netlify dashboard setup:
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

*Last updated: June 11, 2026 - Implementation Complete*
