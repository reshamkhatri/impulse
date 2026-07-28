'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/* Password sign-in against Supabase Auth.

   This runs in the browser on purpose: signInWithPassword sets the session
   cookie the middleware and every server action then read. On success we hand
   over with router.refresh() so the server re-renders with the new cookie
   rather than trusting client state. */

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  // Where the middleware wanted to send them before it asked who they were.
  const next = searchParams.get('next') || '/admin';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setPending(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (signInError) {
        setError(
          signInError.message === 'Invalid login credentials'
            ? 'That email and password combination was not recognised.'
            : signInError.message
        );
        setPending(false);
        return;
      }

      router.replace(next.startsWith('/admin') ? next : '/admin');
      router.refresh();
    } catch (caught) {
      setError(caught.message ?? 'Could not reach Supabase. Check your keys and try again.');
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label className="adm-field">
        <span className="adm-label">Email</span>
        <input
          className="adm-input"
          type="email"
          name="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label className="adm-field">
        <span className="adm-label">Password</span>
        <input
          className="adm-input"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      {error && <p className="adm-note adm-note--bad" role="alert">{error}</p>}

      <button type="submit" className="adm-btn" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
