import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/* Next.js calls this on every matched request before the route runs (this
   file was called middleware.js until Next 16 renamed the convention).

   Two jobs:

   1. Refresh the Supabase session cookie on every /admin request, so a long
      editing session doesn't expire mid-edit.
   2. Bounce anonymous visitors from the panel to the login screen.

   This is a convenience, not the security boundary — a request that skips it
   still can't write anything, because every table's RLS policy requires
   is_admin(). */

const PUBLIC_ADMIN_PATHS = ['/admin/login'];

export async function proxy(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Before the keys are entered there is no session to refresh; let the admin
  // layout render its "not configured yet" screen instead of redirect-looping.
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      }
    }
  });

  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  if (!user && !isPublicAdminPath) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = '/admin/login';
    redirect.searchParams.set('next', pathname);
    return NextResponse.redirect(redirect);
  }

  // Already signed in — no reason to look at the login form again.
  if (user && pathname === '/admin/login') {
    const redirect = request.nextUrl.clone();
    redirect.pathname = '/admin';
    redirect.search = '';
    return NextResponse.redirect(redirect);
  }

  return response;
}

/* Both entries on purpose: `/admin/:path*` alone is ambiguous about whether it
   covers the bare `/admin`, and that's the one route that must not slip
   through. */
export const config = {
  matcher: ['/admin', '/admin/:path*']
};
