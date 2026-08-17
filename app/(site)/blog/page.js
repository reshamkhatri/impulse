import { getAllPosts, getSection } from '@/lib/content';
import BlogListing from '@/components/site/BlogListing';

export const revalidate = 300;

export async function generateMetadata() {
  const head = await getSection('blog.index');
  return {
    title: 'Blogs & Articles | Impulse Investment & Management',
    description:
      head.subheading ||
      'Practical guidance on tax, VAT, company compliance, accounting, and business advisory for growing businesses in Nepal.'
  };
}

export default async function BlogIndex() {
  const [posts, head] = await Promise.all([getAllPosts(), getSection('blog.index')]);

  return (
    <main>
      <section className="blog-index" aria-labelledby="blog-heading">
        <BlogListing posts={posts} head={head} />
      </section>
    </main>
  );
}
