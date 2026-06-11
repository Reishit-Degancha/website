# Ticket DECAP-05: Donate Page Migration

> **Status**: Pending
> **Estimated Time**: 20 minutes
> **Depends On**: DECAP-03
> **Design Reference**: `src/pages/donate.astro`

---

## Goal

Extract hardcoded content from `src/pages/donate.astro` to `src/content/pages/donate.md` and refactor the page to load content dynamically.

---

## Context

### The Problem
The Donate page has content hardcoded that changes occasionally (bank details, Bit number, PayPal link). Making these changes requires editing code.

### The Solution
Extract content to Markdown, refactor page to use content collection. The structured payment methods (bank transfer, Bit, PayPal) will become a Markdown list that's rendered with prose styling.

### How This Fits In
Second page migration, following pattern from DECAP-04. This page has structured content (payment method cards) that will become a Markdown list with headings.

---

## Scope

**In Scope:**
- Create `src/content/pages/donate.md` with extracted content
- Refactor `src/pages/donate.astro` to use content collection
- Content editable via CMS

**Out of Scope:**
- Preserving card styling (payment methods become Markdown sections)
- Adding new payment methods (content editors can do this in Markdown)

---

## Implementation Details

### Current File: `src/pages/donate.astro`

Content structure (lines 10-33):
- Intro paragraph about donations
- Three payment method sections with details
- HTML structure with `div` wrappers for each method

### New File: `src/content/pages/donate.md`

```markdown
---
title: "תרומות"
description: "תרומות לקהילה ראשית דגנך"
---

תרומתכם מסייעת לנו להמשיך לקיים את פעילות בית הכנסת, לתחזק את המבנה ולארגן אירועים לקהילה.

## דרכי תרומה

### העברה בנקאית

**בנק:** [שם הבנק]  
**סניף:** [מספר סניף]  
**חשבון:** [מספר חשבון]

### Bit / PayBox

**טלפון:** 054-1234567

### PayPal

[לתרומה דרך PayPal](#)
```

**Notes on Markdown structure:**
- Use `###` (H3) for payment method headers (matches visual hierarchy)
- Use `**bold**` for labels
- Use two spaces at end of line for line breaks in bank details
- PayPal link uses placeholder `#` (content editor can update)

### Modified File: `src/pages/donate.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
import { getEntry } from 'astro:content';

const page = await getEntry('pages', 'donate');

if (!page) {
  throw new Error('Donate page content not found');
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

**Styling considerations:**
- The original had styled cards (`p-4 bg-background border border-border-light`) for each payment method
- With prose, these become simple sections with H3 headers
- **Visual change accepted:** Payment methods are simpler but still clear and readable

---

## Testing

### Manual Test Cases

1. **Content renders**
   - Visit `/donate`
   - See intro paragraph
   - See three payment method sections

2. **Formatting preserved**
   - Bank details show on separate lines
   - Bold labels are visually distinct
   - PayPal link is clickable

3. **Editable via CMS**
   - Can update bank account numbers
   - Can change phone number for Bit
   - Can update PayPal URL

---

## How to Verify (PM Verification Guide)

**Verification Steps:**

1. Visit `http://localhost:4321/website/donate`
2. **Expected:** Title shows "תרומות - ראשית דגנך"
3. **Expected:** Intro text about donations appears
4. **Expected:** Three payment methods listed
5. **Expected:** Bank details formatted with line breaks
6. **Expected:** PayPal link is clickable

**What you should NOT see:**
- Missing line breaks in bank details
- Raw Markdown showing (e.g., `### העברה בנקאית`)
- Missing content sections

---

## Files to Create/Modify

| File | Action | Notes |
|------|--------|-------|
| `src/content/pages/donate.md` | Create | Extract content with Markdown structure |
| `src/pages/donate.astro` | Modify | Refactor to use content collection |

---

## Acceptance Criteria

- [ ] `src/content/pages/donate.md` exists with frontmatter and Markdown
- [ ] Page renders at `/donate` with all payment methods
- [ ] Bank details formatted correctly (line breaks)
- [ ] PayPal link is clickable
- [ ] Editable via CMS

---

## Code Review Checklist

- [ ] Follows same pattern as DECAP-04
- [ ] Markdown structure is clear for content editors
- [ ] Alternative structured data approach documented (if needed)
