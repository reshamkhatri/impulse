/* Shown instead of the panel when NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY are
   missing. The whole site still builds and serves in that state — the public
   pages fall back to lib/fallback.js — so this is the one place that has to
   explain what's left to do. */

export default function NotConfigured() {
  return (
    <div className="adm-setup">
      <h1>Almost there</h1>
      <p className="adm-hint" style={{ fontSize: '.95rem', marginTop: '.5rem' }}>
        The admin panel needs your Supabase keys before it can sign anyone in. The public
        site is unaffected and is currently serving its built-in copy.
      </p>

      <ol>
        <li>
          Create a project at <code>supabase.com</code>, then open{' '}
          <strong>Project Settings → API Keys</strong>.
        </li>
        <li>
          Create a file called <code>.env.local</code> in the project root containing your
          project URL and publishable (anon) key:
          <code className="adm-code adm-code--block">
            NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co{'\n'}
            NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-PUBLISHABLE-KEY
          </code>
        </li>
        <li>
          In the Supabase dashboard open <strong>SQL Editor</strong>, paste in{' '}
          <code>supabase/schema.sql</code> and run it.
        </li>
        <li>
          Optionally add your <code>CLOUDINARY_URL</code> to the same file, to upload images
          from the panel. Without it, image fields still accept a pasted link.
        </li>
        <li>
          Under <strong>Authentication → Users</strong> choose <strong>Add user</strong> and
          create your account. The first account created becomes the administrator
          automatically.
        </li>
        <li>Restart the dev server and reload this page.</li>
      </ol>

      <p className="adm-hint" style={{ marginTop: '1.5rem' }}>
        The full walkthrough, including the one setting you should change for security, is in{' '}
        <code>SETUP.md</code>.
      </p>
    </div>
  );
}
