import Link from 'next/link';
import { listPosts } from '@/lib/admin-data';
import { formatDate } from '@/lib/content';
import { togglePostStatus } from '@/app/admin/actions';
import SubmitButton from '@/components/admin/SubmitButton';

export const metadata = { title: 'Blogs & articles' };

export default async function PostsPage() {
  const posts = await listPosts();

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Blogs &amp; articles</h1>
          <p>
            Published articles appear on <code className="adm-code">/blog</code> newest first.
            Drafts stay invisible to visitors until you publish them.
          </p>
        </div>
        <Link href="/admin/posts/new" className="adm-btn">New article</Link>
      </div>

      <section className="adm-panel">
        {posts.length === 0 ? (
          <p className="adm-empty">No articles yet.</p>
        ) : (
          <div className="adm-list">
            {posts.map((post) => (
              <div className="adm-list-row" key={post.id}>
                <div className="adm-list-main">
                  <div className="adm-list-title">{post.title}</div>
                  <div className="adm-list-meta">
                    <span className={`adm-pill adm-pill--${post.status === 'published' ? 'live' : 'draft'}`}>
                      {post.status}
                    </span>
                    <span>{post.category}</span>
                    <span>{formatDate(post.published_at)}</span>
                    <span>{post.read_time}</span>
                  </div>
                </div>

                <div className="adm-list-actions">
                  {/* Fast path for taking something down without opening it */}
                  <form action={togglePostStatus}>
                    <input type="hidden" name="id" value={post.id} />
                    <input type="hidden" name="status" value={post.status} />
                    <SubmitButton className="adm-btn adm-btn--ghost adm-btn--sm" pendingLabel="…">
                      {post.status === 'published' ? 'Unpublish' : 'Publish'}
                    </SubmitButton>
                  </form>

                  {post.status === 'published' && (
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="adm-btn adm-btn--ghost adm-btn--sm"
                    >
                      View
                    </a>
                  )}

                  <Link href={`/admin/posts/${post.id}`} className="adm-btn adm-btn--sm">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
