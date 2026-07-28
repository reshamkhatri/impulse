import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_ANON_KEY, isConfigured } from './config';

/* Server-side client bound to the request's cookies, so RLS sees the logged-in
   admin. Use this in server components and server actions under /admin.

   Note this opts the calling route out of static rendering, which is why the
   public pages use lib/supabase/public.js instead. */
export async function createClient() {
  if (!isConfigured) return null;

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          /* Called from a server component, where cookies are read-only. The
             middleware refreshes the session on every request, so nothing is
             lost by ignoring this. */
        }
      }
    }
  });
}

/** The signed-in user, or null. Never throws when Supabase isn't configured. */
export async function getUser() {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user ?? null;
}

/* Whether the signed-in user may edit content. Mirrors the is_admin() check
   the database itself enforces — this is for showing the right screen, not for
   security. RLS is what actually stops a write. */
export async function isAdmin() {
  const supabase = await createClient();
  if (!supabase) return false;

  const { data, error } = await supabase.rpc('is_admin');
  if (error) return false;
  return data === true;
}
