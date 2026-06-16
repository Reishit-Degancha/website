# Changelog

All notable changes to the ראשית דגנך website.

## [Unreleased]

## [1.1.0] - 2025-06-16

### Added
- **Decap CMS Integration**: Content management system for editing 5 static pages
  - Web-based admin at `/admin`
  - Netlify Identity for authentication
  - Content stored as Markdown in `src/content/pages/`
  - Editable pages: About, Donate, Room Rental, Membership, Community
  - Homepage remains hardcoded (not editable via CMS)

### Changed
- **Hosting**: Migrated from GitHub Pages to Netlify
  - Simpler deployment: push to GitHub → Netlify auto-builds
  - Built-in CMS authentication via Netlify Identity
  - Removed GitHub Actions workflow (no longer needed)
  - Site URL: `https://rdegancha.netlify.app`

### Infrastructure
- Added `@tailwindcss/typography` plugin for Markdown content styling
- Created `src/content/config.ts` for Astro content collections
- Added `public/admin/` with Decap CMS configuration

## [1.0.0] - 2025-05-24

### Added
- Initial site launch with Astro 4
- Static pages: Home, About, Donate, Membership, Community, Room Rental
- Google Sheets integration for service times and announcements
- Hebrew RTL support with Frank Ruhl Libre font
- Custom Tailwind CSS theme with warm synagogue colors
- Google Apps Script "Publish" button for triggering rebuilds
- GitHub Actions deployment to GitHub Pages

### Features
- Responsive design with mobile support
- Sticky navigation header
- Weekly service times display
- Announcements section
- Contact information in footer
