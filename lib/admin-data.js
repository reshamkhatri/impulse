import { createClient } from '@/lib/supabase/server';

/* Reads for the admin panel.

   Separate from lib/content.js because the panel needs what the public pages
   deliberately don't get: drafts, hidden cards, retired board members. These
   go through the cookie-bound client, so RLS returns those extra rows only
   because the reader is an admin. */

export async function listPosts() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('posts')
    .select('id, slug, title, excerpt, category, status, published_at, read_time, updated_at')
    .order('published_at', { ascending: false });

  return data ?? [];
}

export async function getPostById(id) {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data } = await supabase.from('posts').select('*').eq('id', id).maybeSingle();
  return data ?? null;
}

export async function listCards(section) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('content_cards')
    .select('*')
    .eq('section', section)
    .order('sort_order', { ascending: true });

  return (data ?? []).map((card) => ({
    ...card,
    bullets: Array.isArray(card.bullets) ? card.bullets : []
  }));
}

export async function listMembers(kind) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('team_members')
    .select('*')
    .eq('kind', kind)
    .order('sort_order', { ascending: true });

  return data ?? [];
}

/** Every editable band, grouped by the page it appears on. */
export async function listSectionsByPage() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('site_sections')
    .select('*')
    .order('page', { ascending: true })
    .order('sort_order', { ascending: true });

  const groups = new Map();
  for (const section of data ?? []) {
    if (!groups.has(section.page)) groups.set(section.page, []);
    groups.get(section.page).push(section);
  }

  return [...groups.entries()].map(([page, sections]) => ({ page, sections }));
}

/** Counts for the dashboard, in one round trip each (head-only, no rows). */
export async function getCounts() {
  const supabase = await createClient();
  if (!supabase) return { published: 0, drafts: 0, board: 0, services: 0 };

  const count = async (table, filters) => {
    let query = supabase.from(table).select('id', { count: 'exact', head: true });
    for (const [column, value] of Object.entries(filters)) query = query.eq(column, value);
    const { count: total } = await query;
    return total ?? 0;
  };

  const [published, drafts, board, services] = await Promise.all([
    count('posts', { status: 'published' }),
    count('posts', { status: 'draft' }),
    count('team_members', { kind: 'board', is_active: true }),
    count('content_cards', { section: 'page_services', is_active: true })
  ]);

  return { published, drafts, board, services };
}
