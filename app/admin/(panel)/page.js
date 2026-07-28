import Link from 'next/link';
import { getCounts, listPosts } from '@/lib/admin-data';
import { formatDate } from '@/lib/content';

export const metadata = { title: 'Dashboard' };

export default async function AdminDashboard() {
  const [counts, posts] = await Promise.all([getCounts(), listPosts()]);
  const recent = posts.slice(0, 5);

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Dashboard</h1>
          <p>
            Everything on the public website is edited from here. Changes go live as soon as
            you save — there is no separate publish step.
          </p>
        </div>
        <Link href="/admin/posts/new" className="adm-btn">Write an article</Link>
      </div>

      <div className="adm-stats">
        <div className="adm-stat"><strong>{counts.published}</strong><span>Published articles</span></div>
        <div className="adm-stat"><strong>{counts.drafts}</strong><span>Drafts</span></div>
        <div className="adm-stat"><strong>{counts.services}</strong><span>Services listed</span></div>
        <div className="adm-stat"><strong>{counts.board}</strong><span>Board members</span></div>
      </div>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <div>
            <h2>Recent articles</h2>
            <p>The five most recent, drafts included.</p>
          </div>
          <Link href="/admin/posts" className="adm-btn adm-btn--ghost adm-btn--sm">See all</Link>
        </div>

        {recent.length === 0 ? (
          <p className="adm-empty">
            Nothing written yet. <Link href="/admin/posts/new" style={{ color: 'var(--accent)', fontWeight: 600 }}>Start your first article →</Link>
          </p>
        ) : (
          <div className="adm-list">
            {recent.map((post) => (
              <div className="adm-list-row" key={post.id}>
                <div className="adm-list-main">
                  <div className="adm-list-title">{post.title}</div>
                  <div className="adm-list-meta">
                    <span className={`adm-pill adm-pill--${post.status === 'published' ? 'live' : 'draft'}`}>
                      {post.status}
                    </span>
                    <span>{post.category}</span>
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                </div>
                <div className="adm-list-actions">
                  <Link href={`/admin/posts/${post.id}`} className="adm-btn adm-btn--ghost adm-btn--sm">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="adm-panel">
        <div className="adm-panel-head"><h2>Jump to a section</h2></div>
        <div className="adm-panel-body">
          <div className="adm-quick">
            <Link href="/admin/posts">
              <strong>Blogs &amp; articles</strong>
              <span>Write, edit, unpublish and delete articles.</span>
            </Link>
            <Link href="/admin/services">
              <strong>Services</strong>
              <span>Headings, service cards, what each one covers, and the process steps.</span>
            </Link>
            <Link href="/admin/team">
              <strong>Board &amp; CEO</strong>
              <span>Names, roles, photographs and biographies.</span>
            </Link>
            <Link href="/admin/content">
              <strong>Page headings</strong>
              <span>Every heading and subheading across the site.</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
