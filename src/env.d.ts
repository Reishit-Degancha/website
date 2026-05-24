/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly GOOGLE_SHEETS_API_KEY: string;
  readonly GOOGLE_SHEET_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
