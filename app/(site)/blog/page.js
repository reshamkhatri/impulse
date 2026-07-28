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
            <p className="blog-sub">{head.subheading}</p>
          </header>

          {posts.length === 0 ? (
            /* Renders before the first post is published, instead of a bare page */
            <p className="blog-empty">No articles published yet — check back shortly.</p>
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
