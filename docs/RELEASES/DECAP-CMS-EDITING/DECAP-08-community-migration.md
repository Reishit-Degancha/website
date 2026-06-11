# Ticket DECAP-08: Community Page Migration

> **Status**: Pending
> **Estimated Time**: 20 minutes
> **Depends On**: DECAP-03
> **Design Reference**: `src/pages/community.astro`

---

## Goal

Extract hardcoded content from `src/pages/community.astro` to `src/content/pages/community.md` and refactor the page to load content dynamically.

---

## Context

### The Problem
The Community page contains class schedules and activity descriptions that may change seasonally or need updates.

### The Solution
Migrate content to Markdown. The class schedule cards become Markdown sections with headings.

---

## Scope

**In Scope:**
- Create `src/content/pages/community.md`
- Refactor `src/pages/community.astro`
- Convert class schedule to Markdown
- Content editable via CMS

**Out of Scope:**
- Preserving card styling (class schedules become Markdown sections)

---

## Implementation Details

### Current File: `src/pages/community.astro`

Content structure:
- H1 title
- "שיעורים קבועים" section with 3 class cards (each has title + time)
- "פעילויות נוספות" section with description

### New File: `src/content/pages/community.md`

```markdown
---
title: "קהילה ושיעורים"
description: "שיעורים ופעילויות קהילתיות בראשית דגנך"
---

## שיעורים קבועים

### דף יומי

כל יום בשעה 06:15, לפני תפילת שחרית

### פרשת השבוע

יום שישי בשעה 09:00

### הלכה יומית

בין מנחה לערבית

## פעילויות נוספות

סעודות שבת משותפות, ארוחות חג, פעילויות לילדים בשבתות מיוחדות, ועוד.
```

### Modified File: `src/pages/community.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
import { getEntry } from 'astro:content';

const page = await getEntry('pages', 'community');

if (!page) {
  throw new Error('Community page content not found');
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

---

## Testing

1. All three classes render with times
2. "פעילויות נוספות" section visible
3. Content editable via CMS

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/content/pages/community.md` | Create |
| `src/pages/community.astro` | Modify |

---

## Acceptance Criteria

- [ ] Content migrated to Markdown
- [ ] All 3 classes listed with times (via prose styling)
- [ ] Additional activities section present
- [ ] Page editable via CMS
- [ ] Tab title intentionally updated from "קהילה" to "קהילה ושיעורים" (aligns with H1)
