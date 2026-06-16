# ראשית דגנך

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-site-id/deploy-status)](https://app.netlify.com/sites/rdegancha/deploys)

A Hebrew website for ראשית דגנך synagogue, built with Astro and hosted on Netlify.

**Live site**: [https://rdegancha.netlify.app](https://rdegancha.netlify.app)

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

Visit `http://localhost:4321` for local development.

---

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | How the site works, hosting, CMS, user management |
| [docs/SETUP.md](docs/SETUP.md) | Developer setup guide |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | Version history and changes |
| [docs/APPS_SCRIPT.md](docs/APPS_SCRIPT.md) | Google Sheets integration |

**Start here**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a complete overview.

---

## Key Features

- **Static Site**: Fast, SEO-friendly pages built with Astro
- **CMS Integration**: Decap CMS at `/admin` for content editing
- **Hebrew RTL**: Full right-to-left support with Hebrew typography
- **Responsive**: Mobile-friendly design
- **Google Sheets**: Service times and announcements from spreadsheet

---

## Project Structure

```
src/
├── components/      # UI components (Header, Footer, etc.)
├── content/         # CMS-managed content (Markdown)
├── layouts/         # Page layouts
├── lib/             # Utilities (Google Sheets API)
├── pages/           # Route definitions
└── styles/          # Global styles

public/
├── admin/           # Decap CMS files
└── static assets    # Images, favicons
```

---

## Content Editing

**For content editors**:
- Visit: `https://rdegancha.netlify.app/admin/`
- Log in with Netlify Identity
- Edit pages in the CMS
- Click "Publish" to save changes

**For developers**:
- See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for CMS setup
- Content is stored in `src/content/pages/*.md`

---

## Tech Stack

- [Astro](https://astro.build) - Static site generator
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Decap CMS](https://decapcms.org) - Content management
- [Netlify](https://netlify.com) - Hosting & Identity
- [Google Sheets API](https://developers.google.com/sheets) - Dynamic content

---

## License

© 2025 ראשית דגנך. All rights reserved.
