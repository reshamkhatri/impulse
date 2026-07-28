'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { savePost, deletePost } from '@/app/admin/actions';
import BlockEditor from '@/components/admin/BlockEditor';
import ImageField from '@/components/admin/ImageField';
import SubmitButton from '@/components/admin/SubmitButton';
import ConfirmButton from '@/components/admin/ConfirmButton';
import StatusNote from '@/components/admin/StatusNote';

const CATEGORIES = ['Tax', 'Compliance', 'Accounting', 'Advisory', 'Business', 'General'];

/** Mirrors slugify() in the server action, so the preview matches what saves. */
function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export default function PostEditor({ post }) {
  const isNew = !post?.id;
  const [state, action] = useActionState(savePost, {});

  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  // A slug the author has typed is theirs; otherwise it tracks the title.
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));

  const effectiveSlug = slugTouched ? slug : slugify(title);

  return (
    <>
      <form action={action}>
        {!isNew && <input type="hidden" name="id" value={post.id} />}

        <section className="adm-panel">
          <div className="adm-panel-head">
            <h2>The article</h2>
          </div>

          <div className="adm-panel-body">
            <label className="adm-field">
              <span className="adm-label">Title</span>
              <input
                className="adm-input"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VAT filing in Nepal: what every business should know"
              />
            </label>

            <label className="adm-field">
              <span className="adm-label">Web address</span>
              <input
                className="adm-input"
                name="slug"
                value={effectiveSlug}
                onChange={(e) => { setSlugTouched(true); setSlug(e.target.value); }}
                placeholder="vat-filing-in-nepal"
              />
              <span className="adm-hint">
                The article will live at <code className="adm-code">/blog/{effectiveSlug || '…'}</code>.
                {!isNew && ' Changing this breaks any link already shared.'}
              </span>
            </label>

            <label className="adm-field">
              <span className="adm-label">Summary</span>
              <textarea
                className="adm-textarea"
                name="excerpt"
                rows={3}
                defaultValue={post?.excerpt ?? ''}
                placeholder="One or two sentences. Shown on the listing card and in search results."
              />
            </label>

            <BlockEditor initialBlocks={post?.body ?? []} />
          </div>
        </section>

        <section className="adm-panel">
          <div className="adm-panel-head">
            <h2>Details</h2>
          </div>

          <div className="adm-panel-body">
            <div className="adm-row">
              <label className="adm-field">
                <span className="adm-label">Category</span>
                <input
                  className="adm-input"
                  name="category"
                  list="post-categories"
                  defaultValue={post?.category ?? 'General'}
                />
                <datalist id="post-categories">
                  {CATEGORIES.map((category) => <option key={category} value={category} />)}
                </datalist>
              </label>

              <label className="adm-field">
                <span className="adm-label">Author</span>
                <input className="adm-input" name="author" defaultValue={post?.author ?? 'Impulse Team'} />
              </label>
            </div>

            <div className="adm-row">
              <label className="adm-field">
                <span className="adm-label">Date</span>
                <input
                  className="adm-input"
                  type="date"
                  name="published_at"
                  defaultValue={post?.published_at ?? new Date().toISOString().slice(0, 10)}
                />
                <span className="adm-hint">Controls the order articles are listed in.</span>
              </label>

              <label className="adm-field">
                <span className="adm-label">Reading time</span>
                <input
                  className="adm-input"
                  name="read_time"
                  defaultValue={post?.read_time ?? ''}
                  placeholder="Leave blank to calculate"
                />
                <span className="adm-hint">Worked out from the body if you leave it empty.</span>
              </label>

              <label className="adm-field">
                <span className="adm-label">Status</span>
                <select className="adm-select" name="status" defaultValue={post?.status ?? 'published'}>
                  <option value="published">Published — visible on the site</option>
                  <option value="draft">Draft — only visible here</option>
                </select>
              </label>
            </div>

            <ImageField
              name="cover_image"
              label="Cover image (optional)"
              folder="blog"
              defaultValue={post?.cover_image ?? ''}
              hint="Shown at the top of the article and when the link is shared."
            />
          </div>
        </section>

        <div className="adm-actions">
          <SubmitButton>{isNew ? 'Create article' : 'Save changes'}</SubmitButton>
          <Link href="/admin/posts" className="adm-btn adm-btn--ghost">Back to all articles</Link>
          <StatusNote state={state} />
        </div>
      </form>

      {/* Its own form — nesting it in the one above would submit both. */}
      {!isNew && (
        <form action={deletePost} className="adm-actions" style={{ marginTop: '2.5rem' }}>
          <input type="hidden" name="id" value={post.id} />
          <ConfirmButton message={`Delete “${post.title}” permanently? This cannot be undone.`}>
            Delete this article
          </ConfirmButton>
        </form>
      )}
    </>
  );
}
