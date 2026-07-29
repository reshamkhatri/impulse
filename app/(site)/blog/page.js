import Link from 'next/link';
import { getAllPosts, getSection, formatDate } from '@/lib/content';

export const revalidate = 300;

export async function generateMetadata() {
  const head = await getSection('blog.index');
  return {
    title: 'Blogs & Articles',
    description:
      head.subheading ||
      'Practical guidance on tax, VAT, company compliance, accounting, and business advisory for growing businesses in Nepal.'
  };
}

export default async function BlogIndex() {
  const [posts, head] = await Promise.all([getAllPosts(), getSection('blog.index')]);
  const [lead, ...rest] = posts;

  return (
    <main>
      <section className="blog-index" aria-labelledby="blog-heading">
        <div className="blog-container">

          <header className="blog-head">
            <h1 className="blog-headline" id="blog-heading">{head.heading}</h1>
            {/* Guarded: an absent subheading would otherwise render an empty
                <p> and reserve a line of blank space under the title. */}
            {head.subheading && <p className="blog-sub">{head.subheading}</p>}
          </header>

          {posts.length === 0 ? (
            /* Renders before the first post is published. Deliberately a
               composed panel rather than a bare sentence — a lone line of text
               in this much whitespace reads as a broken page, not an empty one. */
            <div className="blog-empty">
              <span className="blog-empty-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4.5h11a2.5 2.5 0 0 1 2.5 2.5v13H6.5A2.5 2.5 0 0 1 4 17.5z" />
                  <path d="M17.5 8.5H20v9a2.5 2.5 0 0 1-2.5 2.5" />
                  <path d="M7.5 9h6M7.5 13h4" />
                </svg>
              </span>
              <h2 className="blog-empty-title">No articles published yet</h2>
              <p className="blog-empty-text">
                We&rsquo;re writing the first ones now. In the meantime, if you have a
                question about tax, compliance, or your books, just ask us directly.
              </p>
              <Link href="/#contact" className="blog-empty-cta">
                Talk to the team
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h13" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <>
              {/* Newest post gets the wide treatment */}
              <Link href={`/blog/${lead.slug}`} className="blog-lead">
                <span className="blog-lead-meta">
                  <span className="blog-tag">{lead.category}</span>
                  <span className="blog-dot" aria-hidden="true" />
                  <time dateTime={lead.date}>{formatDate(lead.date)}</time>
                  <span className="blog-dot" aria-hidden="true" />
                  <span>{lead.readTime}</span>
                </span>
                <h2 className="blog-lead-title">{lead.title}</h2>
                <p className="blog-lead-excerpt">{lead.excerpt}</p>
                <span className="blog-more">
                  Read article
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h13" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>

              {rest.length > 0 && (
                <div className="blog-grid">
                  {rest.map((post) => (
                    <Link href={`/blog/${post.slug}`} className="blog-card" key={post.slug}>
                      <span className="blog-card-meta">
                        <span className="blog-tag">{post.category}</span>
                        <span className="blog-dot" aria-hidden="true" />
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                      </span>
                      <h2 className="blog-card-title">{post.title}</h2>
                      <p className="blog-card-excerpt">{post.excerpt}</p>
                      <span className="blog-card-foot">
                        <span>{post.readTime}</span>
                        <span className="blog-more">
                          Read
                          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12h13" /><path d="m12 5 7 7-7 7" />
                          </svg>
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </section>
    </main>
  );
}
