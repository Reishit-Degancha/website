# Ticket DECAP-03: Content Collections Setup

> **Status**: Pending
> **Estimated Time**: 30 minutes
> **Depends On**: —
> **Design Reference**: —

---

## Goal

Configure Astro content collections to load Markdown content with TypeScript type safety.

---

## Context

### The Problem
Astro content collections provide a structured way to manage Markdown/MDX content with:
- TypeScript type safety (Zod schema validation)
- Automatic slug generation
- Content query API (`getEntry()`, `getCollection()`)
- Build-time validation

Without content collections, we'd have to manually parse Markdown files.

### The Solution
Create the `src/content/` directory structure and define a Zod schema for page content. This enables type-safe access to content in Astro pages.

### How This Fits In
This is the Astro-side foundation. Tickets DECAP-04 through DECAP-08 will create actual content files that use this schema. The schema ensures all page content has consistent frontmatter structure.

---

## Scope

**In Scope:**
- Create `src/content/config.ts` with Zod schema
- Create `src/content/pages/` directory
- Define `pages` collection with title, description, and body fields

**Out of Scope:**
- Creating actual page content files (covered in DECAP-04 through DECAP-08)
- Modifying existing .astro pages to use content (covered in migration tickets)

---

## Implementation Details

### File: `src/content/config.ts`

Create the content collections configuration:

```typescript
import { defineCollection, z } from 'astro:content';

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = {
  pages: pagesCollection,
};
```

**Explanation:**
- `type: 'content'` — Treats files as Markdown/MDX with frontmatter
- `schema` — Zod validation for frontmatter fields
- `title` — Required string for page title (used in `<title>` tag and H1)
- `description` — Optional string for SEO meta description

### Directory Structure

Create the following directory:

```
src/content/
└── pages/
    └── (empty for now — will be populated in DECAP-04 through DECAP-08)
```

**Note:** The `src/content/` directory is special in Astro. It cannot contain `config.ts` in a subdirectory; the config must be at `src/content/config.ts`.

---

## Testing

### Manual Test Cases

1. **Config loads without errors**
   - Run `pnpm dev`
   - No TypeScript errors in console
   - No "Failed to load content config" errors

2. **TypeScript types are generated**
   - Open `.astro/types.d.ts` (generated file)
   - See `pages` collection types defined

3. **Empty collection is valid**
   - Query the collection in a test file:
   ```typescript
   import { getCollection } from 'astro:content';
   const pages = await getCollection('pages');
   console.log(pages); // Should be empty array []
   ```

---

## How to Verify (PM Verification Guide)

**Environment Setup:**
```bash
cd /Users/eli/code/reishitdegancha-main
# Ensure directory exists
mkdir -p src/content/pages
pnpm dev
```

**Verification Steps (no visible UI changes):**

1. Check dev server starts:
   ```bash
   pnpm dev
   # Should start without "content config" errors
   ```

2. Check types are generated:
   ```bash
   ls -la src/content/
   # Should see: config.ts  pages/
   ```

3. Verify Astro recognizes the collection:
   - Create temporary test in any `.astro` file:
   ```astro
   ---
   import { getCollection } from 'astro:content';
   const pages = await getCollection('pages');
   console.log('Pages collection:', pages);
   ---
   ```
   - Check dev server console output
   - **Expected:** `Pages collection: []` (empty but no error)

**What you should NOT see:**
- "Cannot find module 'astro:content'" errors
- Zod validation errors
- TypeScript errors about collection not existing

---

## Files to Create/Modify

| File | Action | Notes |
|------|--------|-------|
| `src/content/config.ts` | Create | Zod schema for pages collection |
| `src/content/pages/` | Create | Directory for page content files |

---

## Acceptance Criteria

- [ ] `src/content/config.ts` exists with valid TypeScript
- [ ] `src/content/pages/` directory exists
- [ ] `pnpm dev` starts without content-related errors
- [ ] Astro recognizes the `pages` collection
- [ ] Zod schema validates `title` (required) and `description` (optional)
- [ ] TypeScript types are generated (check `.astro/types.d.ts`)

---

## Code Review Checklist

- [ ] Uses `defineCollection` from `astro:content`
- [ ] Schema uses Zod with proper types (string, optional)
- [ ] `type: 'content'` is specified (not 'data')
- [ ] Collection is exported in `collections` object
- [ ] Config file is at root of `src/content/` (not in subdirectory)

---

## Dependencies

None — Astro content collections are built into Astro 4.
