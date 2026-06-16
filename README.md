# ראשית דגנך

[![Deploy to GitHub Pages](https://github.com/Reishit-Degancha/website/actions/workflows/deploy.yml/badge.svg)](https://github.com/Reishit-Degancha/website/actions/workflows/deploy.yml)

A Hebrew website for ראשית דגנך synagogue, built with Astro and hosted on GitHub Pages.

**Live site**: [https://reishit-degancha.github.io/website](https://reishit-degancha.github.io/website)

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
- **Content in Git**: Markdown content stored in repository, edited on GitHub
- **Hebrew RTL**: Full right-to-left support with Hebrew typography
- **Responsive**: Mobile-friendly design
- **Google Sheets**: Service times and announcements from spreadsheet

---

## Project Structure

```
src/
├── components/      # UI components (Header, Footer, etc.)
├── content/         # Markdown content pages
├── layouts/         # Page layouts
├── lib/             # Utilities (Google Sheets API)
├── pages/           # Route definitions
└── styles/          # Global styles

public/
└── static assets    # Images, favicons, etc.

.github/workflows/
└── deploy.yml       # GitHub Actions deployment
```

---

## Content Editing

**For content editors**:
- Go to [github.com/Reishit-Degancha/website](https://github.com/Reishit-Degancha/website)
- Navigate to `src/content/pages/`
- Click Edit (pencil icon) on the desired file
- Make changes and click "Commit changes"
- Changes go live within ~2 minutes

**For developers**:
- See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for complete overview
- Content is stored in `src/content/pages/*.md`

---

## Tech Stack

- [Astro](https://astro.build) - Static site generator
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [GitHub Pages](https://pages.github.com) - Hosting
- [GitHub Actions](https://github.com/features/actions) - Build & deployment
- [Google Sheets API](https://developers.google.com/sheets) - Dynamic content

---

## License

© 2026 ראשית דגנך. All rights reserved.
