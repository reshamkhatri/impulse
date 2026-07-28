'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { cloudinaryConfig, signUploadParams } from '@/lib/cloudinary-config';

/* ==========================================================================
   Every write in the admin panel goes through one of these.

   They run on the server with the editor's own session, so the database's RLS
   policies are what actually authorise the change — the isAdmin() check here
   just turns "policy rejected your row" into a sentence a person can read.
   ========================================================================== */

/** Purges the cached marketing pages so an edit is visible on the next hit. */
function publish() {
  // One call covers the home page, both content pages, the blog index and
  // every article — cheaper to reason about than tracking which page shows
  // which row, and this is a small site.
  revalidatePath('/', 'layout');
}

async function connect() {
  const supabase = await createClient();
  if (!supabase) {
    return { supabase: null, error: 'Supabase is not configured yet. Add your keys to .env.local.' };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase: null, error: 'Your session has expired — please sign in again.' };

  const { data: admin } = await supabase.rpc('is_admin');
  if (admin !== true) {
    return { supabase: null, error: 'This account is not an administrator, so it cannot save changes.' };
  }

  return { supabase, error: null };
}

/* Postgres error codes surface as jargon; translate the two an editor can
   actually trigger and pass anything else through. */
function readable(error) {
  if (!error) return 'Something went wrong. Please try again.';
  if (error.code === '23505') return 'That web address (slug) is already used by another article.';
  if (error.code === '42501' || error.message?.includes('row-level security')) {
    return 'This account is not allowed to make that change.';
  }
  return error.message ?? 'Something went wrong. Please try again.';
}

/* ------------------------------------------------------------- utilities - */

const str = (formData, name) => (formData.get(name) ?? '').toString().trim();
const bool = (formData, name) => formData.get(name) === 'on' || formData.get(name) === 'true';

/** 'VAT filing in Nepal!' -> 'vat-filing-in-nepal' */
function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip the accents NFKD just split off
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** One entry per non-empty line. Used for bullet lists. */
function lines(value) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseBlocks(raw) {
  let blocks;
  try {
    blocks = JSON.parse(raw || '[]');
  } catch {
    return [];
  }
  if (!Array.isArray(blocks)) return [];

  // Rebuild each block rather than trusting the shape that arrived, so a
  // malformed payload can't put unexpected keys into the article body.
  return blocks
    .map((block) => {
      if (block?.type === 'ul') {
        const items = (Array.isArray(block.items) ? block.items : [])
          .map((item) => String(item).trim())
          .filter(Boolean);
        return items.length ? { type: 'ul', items } : null;
      }
      const type = ['p', 'h2', 'quote'].includes(block?.type) ? block.type : 'p';
      const text = String(block?.text ?? '').trim();
      return text ? { type, text } : null;
    })
    .filter(Boolean);
}

/** '4 min read', from the words actually in the body. 200 wpm. */
function estimateReadTime(blocks) {
  const words = blocks.reduce((total, block) => {
    const text = block.type === 'ul' ? block.items.join(' ') : block.text;
    return total + text.split(/\s+/).filter(Boolean).length;
  }, 0);
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

/* ------------------------------------------------------------------ posts */

export async function savePost(prevState, formData) {
  const { supabase, error: authError } = await connect();
  if (authError) return { error: authError };

  const id = str(formData, 'id');
  const title = str(formData, 'title');
  if (!title) return { error: 'An article needs a title.' };

  const body = parseBlocks(str(formData, 'body'));
  const slug = slugify(str(formData, 'slug') || title);
  if (!slug) return { error: 'That title produced an empty web address — add some letters or numbers.' };

  const row = {
    title,
    slug,
    excerpt: str(formData, 'excerpt'),
    category: str(formData, 'category') || 'General',
    author: str(formData, 'author') || 'Impulse Team',
    read_time: str(formData, 'read_time') || estimateReadTime(body),
    published_at: str(formData, 'published_at') || new Date().toISOString().slice(0, 10),
    status: str(formData, 'status') === 'draft' ? 'draft' : 'published',
    cover_image: str(formData, 'cover_image') || null,
    body
  };

  if (id) {
    const { error } = await supabase.from('posts').update(row).eq('id', id);
    if (error) return { error: readable(error) };
    publish();
    return { ok: `Saved “${title}”.` };
  }

  const { data, error } = await supabase.from('posts').insert(row).select('id').single();
  if (error) return { error: readable(error) };

  publish();
  // Leaves the editor pointing at a real row, so the next save updates rather
  // than trying to insert the article a second time.
  redirect(`/admin/posts/${data.id}?created=1`);
}

export async function deletePost(formData) {
  const { supabase, error: authError } = await connect();
  if (authError) return;

  const id = str(formData, 'id');
  if (id) await supabase.from('posts').delete().eq('id', id);

  publish();
  redirect('/admin/posts');
}

export async function togglePostStatus(formData) {
  const { supabase, error: authError } = await connect();
  if (authError) return;

  const id = str(formData, 'id');
  const next = str(formData, 'status') === 'published' ? 'draft' : 'published';
  if (id) await supabase.from('posts').update({ status: next }).eq('id', id);

  publish();
  revalidatePath('/admin/posts');
}

/* --------------------------------------------------------------- sections */

export async function saveSection(prevState, formData) {
  const { supabase, error: authError } = await connect();
  if (authError) return { error: authError };

  const key = str(formData, 'key');
  if (!key) return { error: 'Missing section key.' };

  const { error } = await supabase
    .from('site_sections')
    .update({
      eyebrow: str(formData, 'eyebrow') || null,
      heading: str(formData, 'heading') || null,
      heading_alt: str(formData, 'heading_alt') || null,
      subheading: str(formData, 'subheading') || null,
      body: str(formData, 'body') || null
    })
    .eq('key', key);

  if (error) return { error: readable(error) };

  publish();
  return { ok: 'Saved.' };
}

/* ------------------------------------------------------------------ cards */

export async function saveCard(prevState, formData) {
  const { supabase, error: authError } = await connect();
  if (authError) return { error: authError };

  const id = str(formData, 'id');
  if (!id) return { error: 'Missing card id.' };

  const title = str(formData, 'title');
  if (!title) return { error: 'This card needs a title.' };

  const { error } = await supabase
    .from('content_cards')
    .update({
      title,
      description: str(formData, 'description'),
      bullets: lines(str(formData, 'bullets')),
      icon: str(formData, 'icon') || 'dot',
      image_url: str(formData, 'image_url') || null,
      cta_label: str(formData, 'cta_label') || null,
      cta_href: str(formData, 'cta_href') || '#contact',
      featured: bool(formData, 'featured'),
      is_active: bool(formData, 'is_active')
    })
    .eq('id', id);

  if (error) return { error: readable(error) };

  publish();
  return { ok: `Saved “${title}”.` };
}

export async function createCard(formData) {
  const { supabase, error: authError } = await connect();
  if (authError) return;

  const section = str(formData, 'section');
  if (!section) return;

  // Drop it at the end of its group.
  const { data: last } = await supabase
    .from('content_cards')
    .select('sort_order')
    .eq('section', section)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase.from('content_cards').insert({
    section,
    title: 'New item',
    description: '',
    sort_order: (last?.sort_order ?? 0) + 10,
    is_active: false // hidden until it has been written
  });

  publish();
  revalidatePath('/admin', 'layout');
}

export async function deleteCard(formData) {
  const { supabase, error: authError } = await connect();
  if (authError) return;

  const id = str(formData, 'id');
  if (id) await supabase.from('content_cards').delete().eq('id', id);

  publish();
  revalidatePath('/admin', 'layout');
}

export async function moveCard(formData) {
  const { supabase, error: authError } = await connect();
  if (authError) return;

  await swapNeighbour(supabase, 'content_cards', 'section', str(formData, 'section'), str(formData, 'id'), str(formData, 'direction'));

  publish();
  revalidatePath('/admin', 'layout');
}

/* ------------------------------------------------------------------- team */

export async function saveMember(prevState, formData) {
  const { supabase, error: authError } = await connect();
  if (authError) return { error: authError };

  const id = str(formData, 'id');
  if (!id) return { error: 'Missing member id.' };

  const name = str(formData, 'name');
  if (!name) return { error: 'This person needs a name.' };

  const { error } = await supabase
    .from('team_members')
    .update({
      name,
      role: str(formData, 'role') || 'Director',
      bio: str(formData, 'bio'),
      quote: str(formData, 'quote') || null,
      photo_url: str(formData, 'photo_url') || null,
      linkedin_url: str(formData, 'linkedin_url') || null,
      email: str(formData, 'email') || null,
      is_active: bool(formData, 'is_active')
    })
    .eq('id', id);

  if (error) return { error: readable(error) };

  publish();
  return { ok: `Saved ${name}.` };
}

export async function createMember(formData) {
  const { supabase, error: authError } = await connect();
  if (authError) return;

  const kind = str(formData, 'kind') === 'ceo' ? 'ceo' : 'board';

  const { data: last } = await supabase
    .from('team_members')
    .select('sort_order')
    .eq('kind', kind)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase.from('team_members').insert({
    kind,
    name: 'New member',
    role: kind === 'ceo' ? 'Chief Executive Officer' : 'Director',
    bio: '',
    sort_order: (last?.sort_order ?? 0) + 10,
    is_active: false
  });

  publish();
  revalidatePath('/admin', 'layout');
}

export async function deleteMember(formData) {
  const { supabase, error: authError } = await connect();
  if (authError) return;

  const id = str(formData, 'id');
  if (id) await supabase.from('team_members').delete().eq('id', id);

  publish();
  revalidatePath('/admin', 'layout');
}

export async function moveMember(formData) {
  const { supabase, error: authError } = await connect();
  if (authError) return;

  await swapNeighbour(supabase, 'team_members', 'kind', str(formData, 'kind'), str(formData, 'id'), str(formData, 'direction'));

  publish();
  revalidatePath('/admin', 'layout');
}

/* Reordering is a swap with whichever row sits next in the same group, so a
   move can never renumber the whole list or leave a gap behind. */
async function swapNeighbour(supabase, table, groupColumn, groupValue, id, direction) {
  if (!id || !groupValue) return;

  const { data: rows } = await supabase
    .from(table)
    .select('id, sort_order')
    .eq(groupColumn, groupValue)
    .order('sort_order', { ascending: true });

  if (!rows?.length) return;

  const index = rows.findIndex((row) => row.id === id);
  const target = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= rows.length) return;

  const a = rows[index];
  const b = rows[target];

  // Equal sort_order values would make the swap a no-op; nudge them apart.
  const [aOrder, bOrder] = a.sort_order === b.sort_order
    ? (direction === 'up' ? [a.sort_order - 1, b.sort_order] : [a.sort_order + 1, b.sort_order])
    : [b.sort_order, a.sort_order];

  await supabase.from(table).update({ sort_order: aOrder }).eq('id', a.id);
  await supabase.from(table).update({ sort_order: bOrder }).eq('id', b.id);
}

/* ------------------------------------------------------------- image upload */

const UPLOAD_FOLDERS = {
  team: 'impulse/team',
  blog: 'impulse/blog',
  services: 'impulse/services',
  general: 'impulse'
};

/* Hands the browser a one-shot signature so it can upload straight to
   Cloudinary, without the file passing through this server and without the API
   secret ever leaving it.

   The admin check is the point: an unsigned upload preset would let anyone who
   found the preset name fill the Cloudinary account with junk, whereas a
   signature is only ever issued to someone the database agrees is an admin. */
export async function signUpload(folderKey) {
  const { error: authError } = await connect();
  if (authError) return { error: authError };

  const { cloudName, apiKey, apiSecret, configured } = cloudinaryConfig();
  if (!configured) {
    return {
      error:
        'Cloudinary is not configured. Add CLOUDINARY_URL to .env.local (see SETUP.md), ' +
        'or paste an image link instead.'
    };
  }

  const folder = UPLOAD_FOLDERS[folderKey] ?? UPLOAD_FOLDERS.general;
  const timestamp = Math.round(Date.now() / 1000);

  // Every parameter signed here is one the browser cannot then change.
  const signature = signUploadParams({ folder, timestamp }, apiSecret);

  return { cloudName, apiKey, timestamp, signature, folder };
}

/* ------------------------------------------------------------------- auth */

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect('/admin/login');
}
