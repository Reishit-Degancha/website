# Ticket DECAP-07: Membership Page Migration

> **Status**: Pending
> **Estimated Time**: 20 minutes
> **Depends On**: DECAP-03
> **Design Reference**: `src/pages/membership.astro`

---

## Goal

Extract hardcoded content from `src/pages/membership.astro` to `src/content/pages/membership.md` and refactor the page to load content dynamically.

---

## Context

### The Problem
The Membership page contains benefits list, annual fee amount, and welcome message that may need updates.

### The Solution
Migrate content to Markdown, following established pattern. Benefits list becomes Markdown bullet list.

---

## Scope

**In Scope:**
- Create `src/content/pages/membership.md`
- Refactor `src/pages/membership.astro`
- Convert benefits list to Markdown
- Content editable via CMS

**Out of Scope:**
- CTA button styling (keep in Astro template for BASE_URL support)

---

## Implementation Details

### Current File: `src/pages/membership.astro`

Content structure:
- Intro paragraph
- Benefits list (4 items)
- Annual fee text
- CTA button linking to contact

### New File: `src/content/pages/membership.md`

```markdown
---
title: "חברות בקהילה"
description: "הצטרפו למשפחת ראשית דגנך"
---

הצטרפו למשפחת ראשית דגנך! חברות בקהילה מעניקה תחושת שייכות ותורמת לקיום הפעילות השוטפת.

## הטבות לחברי הקהילה

- מקום קבוע בבית הכנסת
- הנחה בהשכרת האולם
- עדכונים שוטפים על אירועים
- השתתפות באסיפות הקהילה

## דמי חברות

דמי החברות השנתיים: ₪XXX למשפחה

## להצטרפות

לחצו על כפתור "צרו קשר" למטה כדי להצטרף לקהילה.
```

**Note:** The CTA button is kept in the Astro template (not in Markdown) so it can use the proper link component with `import.meta.env.BASE_URL`.

### Modified File: `src/pages/membership.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
import { getEntry } from 'astro:content';

const page = await getEntry('pages', 'membership');

if (!page) {
  throw new Error('Membership page content not found');
}

const { Content } = await page.render();
---

<Layout title={`${page.data.title} - ראשית דגנך`}>
  <main class="max-w-[1100px] mx-auto px-8 py-12">
    <h1 class="text-3xl font-bold mb-6">{page.data.title}</h1>
    
    <div class="bg-surface p-8 border border-border prose prose-lg max-w-none">
      <Content />
      
      <a href={`${import.meta.env.BASE_URL}contact`} class="btn btn-primary inline-block mt-8">להצטרפות</a>
    </div>
  </main>
</Layout>
```

**Key difference:** The CTA button is kept in the template (after `<Content />`) so it can use dynamic `BASE_URL`.

---

## Testing

1. Content renders with all sections
2. Benefits show as bullet list
3. CTA button appears below content
4. Button links correctly to contact page

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/content/pages/membership.md` | Create |
| `src/pages/membership.astro` | Modify |

---

## Acceptance Criteria

- [ ] Content migrated to Markdown
- [ ] Benefits list renders via prose styling (bullets)
- [ ] CTA button preserved with correct link (in template, not Markdown)
- [ ] Page editable via CMS (content only, not CTA) (except button)
