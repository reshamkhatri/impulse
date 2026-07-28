import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, isConfigured } from './config';

/* A cookie-less client for the public pages.

   Reading published content doesn't need a session, and reading cookies would
   force every marketing page into dynamic rendering. This client keeps them
   cacheable; the admin's server actions call revalidatePath() after a save, so
   an edit still shows up immediately. */

let cached = null;

export function publicClient() {
  if (!isConfigured) return null;
  if (!cached) {
    cached = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  }
  return cached;
}
