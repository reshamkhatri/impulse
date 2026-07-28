import { cache } from 'react';
import { publicClient } from '@/lib/supabase/public';
import {
  FALLBACK_SECTIONS,
  FALLBACK_CARDS,
  FALLBACK_CEO,
  FALLBACK_BOARD
} from '@/lib/fallback';

/* ==========================================================================
   Read side of the CMS.

   Every public page goes through here. Each reader asks Supabase once, and
   returns the wording in lib/fallback.js if the database is unconfigured or
   unreachable — a page never renders a blank heading because of an outage.

   cache() dedupes within a single render, so a layout and a page asking for
   the same section is still one query.
   ========================================================================== */

/* ---------------------------------------------------------------- sections */

export const getSections = cache(async () => {
  const supabase = publicClient();
  if (!supabase) return FALLBACK_SECTIONS;

  const { data, error } = await supabase
    .from('site_sections')
    .select('key, eyebrow, heading, heading_alt, subheading, body');

  if (error || !data?.length) return FALLBACK_SECTIONS;

  const byKey = {};
  for (const row of data) byKey[row.key] = row;
  return { ...FALLBACK_SECTIONS, ...byKey };
});

/* One titled band. Always returns an object, so `section.heading` is safe even
   for a key that was deleted from the table. */
export async function getSection(key) {
  const sections = await getSections();
  return sections[key] ?? FALLBACK_SECTIONS[key] ?? {};
}

/** Splits a `body` field into paragraphs on blank lines. */
export function paragraphs(text) {
  if (!text) return [];
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/* ------------------------------------------------------------------- cards */

export const getCards = cache(async (section) => {
  const supabase = publicClient();
  if (!supabase) return FALLBACK_CARDS[section] ?? [];

  const { data, error } = await supabase
    .from('content_cards')
    .select('id, title, description, bullets, icon, image_url, cta_label, cta_href, featured, sort_order')
    .eq('section', section)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error || !data?.length) return FALLBACK_CARDS[section] ?? [];

  return data.map((card) => ({
    ...card,
    bullets: Array.isArray(card.bullets) ? card.bullets : []
  }));
});

/* -------------------------------------------------------------------- team */

export const getBoard = cache(async () => {
  const supabase = publicClient();
  if (!supabase) return FALLBACK_BOARD;

  const { data, error } = await supabase
    .from('team_members')
    .select('id, name, role, bio, photo_url, linkedin_url, email')
    .eq('kind', 'board')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error || !data?.length) return FALLBACK_BOARD;
  return data;
});

export const getCeo = cache(async () => {
  const supabase = publicClient();
  if (!supabase) return FALLBACK_CEO;

  const { data, error } = await supabase
    .from('team_members')
    .select('id, name, role, bio, quote, photo_url, linkedin_url, email')
    .eq('kind', 'ceo')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) return FALLBACK_CEO;
  return data;
});

/* ------------------------------------------------------------------- posts */

/* The database column names are snake_case; the article components have always
   spoken camelCase. Normalising here keeps that seam in one place. */
function toPost(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? '',
    category: row.category ?? 'General',
    author: row.author ?? 'Impulse Team',
    readTime: row.read_time ?? '',
    date: row.published_at,
    coverImage: row.cover_image ?? null,
    body: Array.isArray(row.body) ? row.body : []
  };
}

const POST_COLUMNS =
  'id, slug, title, excerpt, category, author, read_time, published_at, cover_image, body';

/** Published posts, newest first. Empty array when nothing is published yet. */
export const getAllPosts = cache(async () => {
  const supabase = publicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('posts')
    .select(POST_COLUMNS)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error || !data) return [];
  return data.map(toPost);
});

export const getPost = cache(async (slug) => {
  const supabase = publicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('posts')
    .select(POST_COLUMNS)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !data) return null;
  return toPost(data);
});

/** '2026-07-18' -> '18 July 2026' */
export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
