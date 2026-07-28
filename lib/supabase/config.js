/* The two values you paste into .env.local, in one place.

   `isConfigured` exists so the site can still be built and served before the
   keys are entered: every reader in lib/content.js falls back to the copy in
   lib/fallback.js when this is false, rather than throwing at build time. */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
