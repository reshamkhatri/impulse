import { Suspense } from 'react';
import Link from 'next/link';
import { isConfigured } from '@/lib/supabase/config';
import LoginForm from '@/components/admin/LoginForm';
import NotConfigured from '@/components/admin/NotConfigured';

export const metadata = { title: 'Sign in' };

export default function LoginPage() {
  if (!isConfigured) return <NotConfigured />;

  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <img src="/logo.webp" alt="Impulse" />
        <h1>Content admin</h1>
        <p>Sign in to edit the website.</p>

        {/* useSearchParams needs a suspense boundary to keep this page static */}
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <p className="adm-login-foot">
          <Link href="/">← Back to the website</Link>
        </p>
      </div>
    </div>
  );
}
