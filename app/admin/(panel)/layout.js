import { redirect } from 'next/navigation';
import { isConfigured } from '@/lib/supabase/config';
import { getUser, isAdmin } from '@/lib/supabase/server';
import { signOut } from '@/app/admin/actions';
import AdminNav from '@/components/admin/AdminNav';
import NotConfigured from '@/components/admin/NotConfigured';

/* The panel's own guard.

   The middleware already turns anonymous visitors away, but it runs on the
   edge and can be bypassed by a misconfigured deployment, so the check is
   repeated here where the pages are actually rendered. Neither one is what
   keeps the data safe — that's the is_admin() clause on every RLS policy. */

export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }) {
  if (!isConfigured) return <NotConfigured />;

  const user = await getUser();
  if (!user) redirect('/admin/login');

  // Signed in, but not in the `admins` table — a real state, since a second
  // Supabase account gets an authenticated session and nothing else.
  if (!(await isAdmin())) {
    return (
      <div className="adm-setup">
        <h1>No editing access</h1>
        <p className="adm-hint" style={{ fontSize: '.95rem', marginTop: '.5rem' }}>
          You are signed in as <strong>{user.email}</strong>, but this account is not an
          administrator, so it cannot see or change any content.
        </p>
        <p className="adm-hint" style={{ marginTop: '1rem' }}>
          The first account created in the Supabase project becomes the administrator. To
          add this one as well, run the following in the Supabase SQL editor:
        </p>
        <code className="adm-code adm-code--block">
          insert into public.admins (user_id, email){'\n'}
          select id, email from auth.users where email = '{user.email}';
        </code>
        <form action={signOut} style={{ marginTop: '1.5rem' }}>
          <button type="submit" className="adm-btn adm-btn--ghost">Sign out</button>
        </form>
      </div>
    );
  }

  return (
    <div className="adm-shell">
      <aside className="adm-sidebar">
        <div className="adm-brand">
          <img src="/logo.webp" alt="" />
          <span>Admin</span>
        </div>

        <AdminNav />

        <div className="adm-sidebar-foot">
          <p className="adm-who">{user.email}</p>
          <form action={signOut}>
            <button type="submit" className="adm-btn adm-btn--ghost adm-btn--sm">Sign out</button>
          </form>
        </div>
      </aside>

      <main className="adm-main">{children}</main>
    </div>
  );
}
