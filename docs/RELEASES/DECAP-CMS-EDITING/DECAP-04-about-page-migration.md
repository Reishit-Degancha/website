# Ticket DECAP-04: About Page Migration

> **Status**: Pending
> **Estimated Time**: 20 minutes
> **Depends On**: DECAP-03
> **Design Reference**: `src/pages/about.astro`

---

## Goal

Extract hardcoded content from `src/pages/about.astro` to `src/content/pages/about.md` and refactor the page to load content dynamically.

---

## Context

### The Problem
The About page currently has all content hardcoded in the `.astro` file:

```astro
<p class="text-text-muted leading-relaxed mb-6">
  בית הכנסת "ראשית דגנך" הוקם בשנת תשפ"ב במטרה להקים קהילה חמה ומקבלת...
</p>
```

### The Solution
1. Create `src/content/pages/about.md` with the content
2. Refactor `src/pages/about.astro` to load from content collection
3. Use `getEntry('pages', 'about')` to fetch the content
4. Render the body using `render()` or `<Content />`

### How This Fits In
This is the first of 5 page migrations. It establishes the pattern for all subsequent migrations. The About page is simple (no lists, just paragraphs), making it a good starting point.

---

## Scope

**In Scope:**
- Create `src/content/pages/about.md` with extracted content
- Refactor `src/pages/about.astro` to use content collection
- Content editable via CMS

**Out of Scope:**
- Pixel-perfect visual parity (Markdown + prose styling replaces hand-tuned utilities)
- Adding new content sections
- Modifying the Google Sheets integration (unrelated)

---

## Implementation Details

### Current File: `src/pages/about.astro`

Current content structure (lines 10-23):
- Intro paragraph about founding
- "החזון שלנו" section with one paragraph
- "הרב" section with placeholder text

### New File: `src/content/pages/about.md`

Create this file:

```markdown
---
title: "אודות הקהילה"
description: "בית כנסת לתפילה ולקהילה בלב השכונה"
---

בית הכנסת "ראשית דגנך" הוקם בשנת תשפ"ב במטרה להקים קהילה חמה ומקבלת בלב השכונה. 
אנו מאמינים בתפילה משותפת, בלימוד תורה ובגמילות חסדים.

## החזון שלנו

ליצור מקום שבו כל יהודי ירגיש בבית. מקום שבו ניתן להתפלל, ללמוד ולחגוג יחד.

## הרב

[מידע על רב הקהילה יתווסף כאן]
```

### Modified File: `src/pages/about.astro`

Replace the file with this content:

```astro
---
import Layout from '../layouts/Layout.astro';
import { getEntry } from 'astro:content';

const page = await getEntry('pages', 'about');

if (!page) {
  throw new Error('About page content not found');
}

const { Content } = await page.render();
---

<Layout title={`${page.data.title} - ראשית דגנך`}>
  <main class="max-w-[1100px] mx-auto px-8 py-12">
    <h1 class="text-3xl font-bold mb-6">{page.data.title}</h1>
    
    <div class="bg-surface p-8 border border-border prose prose-lg max-w-none">
      <Content />
    </div>
  </main>
</Layout>
```

**Key changes from original:**
1. Added `import { getEntry } from 'astro:content'`
2. Fetch page with `await getEntry('pages', 'about')`
3. Destructure `Content` from `await page.render()`
4. Use `page.data.title` for both `<title>` and `<h1>`
5. Render body with `<Content />` component (handles Markdown → HTML)
6. Keep existing wrapper div with `prose` classes for styling

**Styling notes:**
- `prose prose-lg` — Tailwind typography plugin classes for rich text (headings, lists, spacing)
- `max-w-none` — Override prose max-width to use container max-width
- **Visual change:** Typography is handled by the prose plugin, not individual utility classes. Headings and spacing will be slightly different but consistent with Markdown content styling.

---

## Testing

### Manual Test Cases

1. **Content file loads**
   - `src/content/pages/about.md` exists
   - Run `pnpm dev`
   - No "page not found" errors

2. **Page renders correctly**
   - Visit `http://localhost:4321/website/about`
   - **Expected:** Same content as before migration
   - **Expected:** Title shows "אודות הקהילה - ראשית דגנך"
   - **Expected:** Three sections: intro, החזון שלנו, הרב

3. **Styling preserved**
   - Background is `bg-surface`
   - Border is `border-border`
   - Text has proper line-height and spacing
   - Headings (H2) are styled correctly

4. **CMS editable**
   - Visit `/admin` (after DECAP-02)
   - See "about" in pages list
   - Can edit and save content
   - Changes reflect on `/about` after rebuild

---

## How to Verify (PM Verification Guide)

**Environment Setup:**
```bash
cd /Users/eli/code/reishitdegancha-main
pnpm dev
```

**Verification Steps:**

1. **Before migration:**
   - Visit `http://localhost:4321/website/about`
   - Screenshot or note the current content

2. **After migration:**
   - Visit `http://localhost:4321/website/about`
   - **Expected:** Content preserved (same text, sections)
   - **Expected:** Typography uses prose styling (slightly different heading sizes/spacing than hand-tuned utilities)
   - **Expected:** Page title in browser tab: "אודות הקהילה - ראשית דגנך"
   - **Expected:** H1 heading: "אודות הקהילה"

3. **CMS verification (after DECAP-02):**
   - Visit `http://localhost:4321/website/admin`
   - Log in
   - **Expected:** See "about" in the Pages collection
   - Edit the body text, save
   - Refresh `/about` page
   - **Expected:** Changes appear (may need dev server restart)

**What you should NOT see:**
- 404 error on `/about`
- "page not found" errors in console
- Broken styling (missing CSS classes)
- Raw Markdown showing on page

---

## Files to Create/Modify

| File | Action | Notes |
|------|--------|-------|
| `src/content/pages/about.md` | Create | Extract content from about.astro |
| `src/pages/about.astro` | Modify | Refactor to use content collection |

---

## Acceptance Criteria

- [ ] `src/content/pages/about.md` exists with valid frontmatter and Markdown body
- [ ] `src/pages/about.astro` uses `getEntry('pages', 'about')`
- [ ] Page renders at `/about` with content preserved (styling uses prose plugin)
- [ ] Title tag shows "אודות הקהילה - ראשית דגנך"
- [ ] All three content sections render (intro, vision, rabbi)
- [ ] Wrapper styling preserved (`bg-surface`, `border`)
- [ ] Typography rendered via prose plugin (Markdown → styled HTML)
- [ ] CMS shows "about" in pages collection (after auth setup)
- [ ] Can edit content via CMS and see changes after rebuild

---

## Code Review Checklist

- [ ] Uses `getEntry()` not `getCollection()` (single page)
- [ ] Handles missing page with error (defensive)
- [ ] Uses `await page.render()` to get Content component
- [ ] Preserves existing CSS classes exactly
- [ ] Title comes from `page.data.title`
- [ ] Markdown uses ## for H2 (matches original structure)
- [ ] Frontmatter includes description for SEO

---

## Migration Pattern for Other Pages

This ticket establishes the pattern used in DECAP-05 through DECAP-08:

1. Create `src/content/pages/[slug].md` with frontmatter + Markdown
2. Update `src/pages/[page].astro` to use `getEntry('pages', '[slug]')`
3. Render with `<Content />`
4. Preserve all existing CSS classes
