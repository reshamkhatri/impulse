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
      return <h2>{block.text}</h2>;
    case 'ul':
      return (
        <ul>
          {(block.items ?? []).map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    case 'quote':
      return <blockquote>{block.text}</blockquote>;
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
  const others = all.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <main>
      <article className="article">
        <div className="article-container">

          <Link href="/blog" className="article-back">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H6" /><path d="m12 19-7-7 7-7" />
            </svg>
            All articles
          </Link>

          <header className="article-head">
            <span className="article-meta">
              <span className="blog-tag">{post.category}</span>
              <span className="blog-dot" aria-hidden="true" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="blog-dot" aria-hidden="true" />
              <span>{post.readTime}</span>
            </span>
            <h1 className="article-title">{post.title}</h1>
            <p className="article-standfirst">{post.excerpt}</p>
            <span className="article-author">By {post.author}</span>
          </header>

          {post.coverImage && (
            <figure className="article-cover">
              {/* 'limit' rather than 'fill': a cover is whatever shape it was
                  shot in, and cropping one to a fixed box tends to behead
                  people. */}
              <img
                src={cloudinaryImage(post.coverImage, { width: 1000, crop: 'limit' })}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </figure>
          )}

          <div className="article-body">
            {post.body.map((block, i) => <Block block={block} key={i} />)}
          </div>

          <aside className="article-cta">
            <h2>{cta.heading}</h2>
            <p>{cta.subheading}</p>
            <Link href="/#contact" className="btn-pill-white">
              <span>Book a free consultation</span>
              <span className="btn-arrow-icon" aria-hidden="true">&rarr;</span>
            </Link>
          </aside>

          {others.length > 0 && (
            <section className="article-more" aria-labelledby="more-heading">
              <h2 className="article-more-heading" id="more-heading">Keep reading</h2>
              <div className="article-more-grid">
                {others.map((p) => (
                  <Link href={`/blog/${p.slug}`} className="blog-card" key={p.slug}>
                    <span className="blog-card-meta">
                      <span className="blog-tag">{p.category}</span>
                      <span className="blog-dot" aria-hidden="true" />
                      <time dateTime={p.date}>{formatDate(p.date)}</time>
                    </span>
                    <h3 className="blog-card-title">{p.title}</h3>
                    <p className="blog-card-excerpt">{p.excerpt}</p>
                    <span className="blog-card-foot">
                      <span>{p.readTime}</span>
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
            </section>
          )}

        </div>
      </article>
    </main>
  );
}
