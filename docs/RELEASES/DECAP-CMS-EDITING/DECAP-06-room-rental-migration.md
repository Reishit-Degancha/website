# Ticket DECAP-06: Room Rental Page Migration

> **Status**: Pending
> **Estimated Time**: 20 minutes
> **Depends On**: DECAP-03
> **Design Reference**: `src/pages/room-rental.astro`

---

## Goal

Extract hardcoded content from `src/pages/room-rental.astro` to `src/content/pages/room-rental.md` and refactor the page to load content dynamically.

---

## Context

### The Problem
The Room Rental page contains information about hall capacity, amenities, and contact details that may change over time.

### The Solution
Migrate content to Markdown, following the established pattern. The amenities list will become a Markdown bullet list.

### How This Fits In
Third page migration, following DECAP-04 and DECAP-05 patterns.

---

## Scope

**In Scope:**
- Create `src/content/pages/room-rental.md`
- Refactor `src/pages/room-rental.astro`
- Convert amenities list to Markdown
- Content editable via CMS

**Out of Scope:**
- Adding image gallery (future enhancement)

---

## Implementation Details

### Current File: `src/pages/room-rental.astro`

Content structure (lines 10-28):
- Intro paragraph about hall events
- Amenities list (ul with 5 items)
- Contact section with phone and email

### New File: `src/content/pages/room-rental.md`

```markdown
---
title: "השכרת האולם"
description: "השכרת אולם לאירועים בבית כנסת ראשית דגנך"
---

האולם שלנו מתאים לאירועים משפחתיים ולשמחות. ברית מילה, בר/בת מצווה, שבע ברכות, ואירועים קהילתיים.

## פרטי האולם

- קיבולת: עד 120 איש
- מטבח מאובזר (חלבי/פרווה)
- מערכת הגברה
- חנייה צמודה
- נגישות לנכים

## ליצירת קשר ותיאום

**טלפון:** 054-1234567  
**אימייל:** events@reishit-degancha.org.il
```

### Modified File: `src/pages/room-rental.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
import { getEntry } from 'astro:content';

const page = await getEntry('pages', 'room-rental');

if (!page) {
  throw new Error('Room rental page content not found');
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

### Manual Test Cases

1. **Content renders**
   - Visit `/room-rental`
   - See intro paragraph
   - See amenities as bullet list
   - See contact info section

2. **List formatting**
   - Amenities show as bullet points
   - Proper RTL bullet alignment (for Hebrew)

3. **Contact info**
   - Phone number is visible
   - Email address is visible

---

## How to Verify (PM Verification Guide)

**Verification Steps:**

1. Visit `http://localhost:4321/website/room-rental`
2. **Expected:** Title shows "השכרת האולם - ראשית דגנך"
3. **Expected:** 5 amenities in bullet list
4. **Expected:** Contact section with phone and email

---

## Files to Create/Modify

| File | Action | Notes |
|------|--------|-------|
| `src/content/pages/room-rental.md` | Create | Markdown with amenities list |
| `src/pages/room-rental.astro` | Modify | Content collection pattern |

---

## Acceptance Criteria

- [ ] Content migrated to Markdown
- [ ] Amenities list renders via prose styling (bullets)
- [ ] Contact info visible and formatted
- [ ] Page editable via CMS
