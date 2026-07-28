import { notFound } from 'next/navigation';
import { getPostById } from '@/lib/admin-data';
import PostEditor from '@/components/admin/PostEditor';

/* One route for both jobs: /admin/posts/new opens an empty editor, any other
   id opens that article. Keeping them together means the form only exists
   once. */

export async function generateMetadata({ params }) {
  const { id } = await params;
  if (id === 'new') return { title: 'New article' };

  const post = await getPostById(id);
  return { title: post ? `Editing ${post.title}` : 'Article' };
}

export default async function PostEditorPage({ params, searchParams }) {
  const { id } = await params;
  const { created } = await searchParams;

  const isNew = id === 'new';
  const post = isNew ? null : await getPostById(id);

  if (!isNew && !post) notFound();

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>{isNew ? 'New article' : 'Edit article'}</h1>
          <p>
            {isNew
              ? 'Write it here, then publish straight away or keep it as a draft.'
              : 'Changes appear on the website as soon as you save.'}
          </p>
        </div>
      </div>

      {created && (
        <p className="adm-note adm-note--ok" style={{ marginBottom: '1.5rem' }}>
          Article created. It is now saved — further edits update it in place.
        </p>
      )}

      <PostEditor post={post} />
    </>
  );
}
