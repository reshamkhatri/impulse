'use client';

import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_ANON_KEY, isConfigured } from './config';

/* Browser-side client. Used by the login form and by the image uploader —
   everything else writes through a server action, so the session cookie never
   has to be trusted client-side. */
export function createClient() {
  if (!isConfigured) {
    throw new Error(
      'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and ' +
        'NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and restart the dev server.'
    );
  }
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
