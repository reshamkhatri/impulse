import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPost, getSection, formatDate } from '@/lib/content';
import { cloudinaryImage } from '@/lib/cloudinary';

export const revalidate = 300;

/* Prerenders a page per published post at build time. Posts written later are
   rendered on first request and then cached — the admin panel revalidates this
   route on save, so an edit is live immediately. */
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Article not found' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      images: post.coverImage ? [post.coverImage] : undefined
    }
  };
}

function Block({ block }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="art-heading">{block.text}</h2>;
    case 'image':
      return (
        <figure className="art-figure">
          <img
            src={cloudinaryImage(block.url, { width: 1200, crop: 'limit' })}
            alt={block.caption || 'Article photo'}
            loading="lazy"
            decoding="async"
          />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    case 'callout':
      return (
        <aside className="art-callout">
          <div className="art-callout-accent" aria-hidden="true" />
          <div className="art-callout-body">
            {block.title && <h3>{block.title}</h3>}
            <p>{block.text}</p>
          </div>
        </aside>
      );
    case 'ul':
      return (
        <ul className="art-list">
          {(block.items ?? []).map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    case 'quote':
      return (
        <blockquote className="art-quote">
          <p>&ldquo;{block.text}&rdquo;</p>
        </blockquote>
      );
    case 'p':
    default:
      return <p>{block.text}</p>;
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const [post, cta] = await Promise.all([getPost(slug), getSection('blog.cta')]);
  if (!post) notFound();

  const all = await getAllPosts();
  const others = all.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className="art-page">
      {/* Full-width hero image */}
      {post.coverImage && (
        <div className="art-hero">
          <img
            src={cloudinaryImage(post.coverImage, { width: 1600, crop: 'limit' })}
            alt={post.title}
            loading="eager"
            decoding="async"
            className="art-hero-img"
          />
          <div className="art-hero-overlay" aria-hidden="true" />

          {/* Back link inside hero */}
          <Link href="/blog" className="art-back">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H6" /><path d="m12 19-7-7 7-7" />
            </svg>
            All Articles
          </Link>
        </div>
      )}

      {/* If no cover image, simple back nav */}
      {!post.coverImage && (
        <div className="art-back-bar">
          <Link href="/blog" className="art-back art-back--plain">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H6" /><path d="m12 19-7-7 7-7" />
            </svg>
            All Articles
          </Link>
        </div>
      )}

      <article className="art-content">
        {/* Title block */}
        <header className="art-header">
          <div className="art-meta-row">
            <span className="art-cat">{post.category}</span>
            <span className="art-sep" aria-hidden="true" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="art-sep" aria-hidden="true" />
            <span>{post.readTime}</span>
          </div>

          <h1 className="art-title">{post.title}</h1>
          <p className="art-excerpt">{post.excerpt}</p>

          <div className="art-byline">
            <img
              src="/avatar_one.jpg"
              alt={post.author}
              className="art-byline-img"
              width="40"
              height="40"
            />
            <div>
              <span className="art-byline-name">{post.author}</span>
              <span className="art-byline-role">Management & Compliance Team</span>
            </div>
          </div>
        </header>

        {/* Article prose */}
        <div className="art-prose">
          {post.body.map((block, i) => <Block block={block} key={i} />)}
        </div>

        {/* Author sign-off */}
        <footer className="art-signoff">
          <img src="/avatar_one.jpg" alt={post.author} width="52" height="52" />
          <div>
            <h4>Written by {post.author}</h4>
            <p>
              Specialists at Impulse Investment &amp; Management Pvt. Ltd. delivering strategic corporate consulting, tax advisory, and accounting clarity for businesses in Nepal.
            </p>
          </div>
        </footer>
      </article>

      {/* Related articles */}
      {others.length > 0 && (
        <section className="art-related" aria-labelledby="related-heading">
          <div className="art-related-inner">
            <div className="art-related-top">
              <h2 id="related-heading">Continue Reading</h2>
              <Link href="/blog" className="art-related-link">View all &rarr;</Link>
            </div>

            <div className="art-related-grid">
              {others.map((p) => (
                <Link href={`/blog/${p.slug}`} className="art-related-card" key={p.slug}>
                  {p.coverImage && (
                    <div className="art-related-thumb">
                      <img
                        src={cloudinaryImage(p.coverImage, { width: 480, height: 300, crop: 'fill' })}
                        alt={p.title}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}
                  <div className="art-related-info">
                    <span className="art-related-cat">{p.category}</span>
                    <h3>{p.title}</h3>
                    <span className="art-related-read">
                      Read article
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h13" /><path d="m12 5 7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
