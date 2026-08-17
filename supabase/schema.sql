-- ============================================================================
--  Impulse — database schema
--  ---------------------------------------------------------------------------
--  Run this ONCE in the Supabase SQL editor (Dashboard -> SQL Editor -> New
--  query -> paste -> Run). It creates every table the site reads from, locks
--  them down with row level security, and seeds them with the copy that is
--  currently on the site, so nothing looks empty on the first load.
--
--  Safe to re-run: every statement is idempotent and the seed rows are guarded,
--  so running it twice will not duplicate content or overwrite edits you have
--  already made in the admin panel.
--
--  This is the only SQL file you need. Images are not stored here — they live
--  in Cloudinary, and these tables only hold the resulting URL.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------

-- Keeps updated_at honest without the application having to remember.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Who is allowed to edit
-- ---------------------------------------------------------------------------
-- Every write policy below is gated on is_admin(). Being merely logged in is
-- not enough — the account has to be listed here. The first account ever
-- created claims the role automatically (see claim_first_admin), so you never
-- have to paste a user id anywhere; every account created afterwards is a
-- read-only nobody until you add it to this table by hand.

create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.claim_first_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only ever fires for the very first user in the project.
  if not exists (select 1 from public.admins) then
    insert into public.admins (user_id, email) values (new.id, new.email);
  end if;
  return new;
end;
$$;

-- Named for this project rather than the usual `on_auth_user_created`, so
-- re-running this file can't drop a trigger some other tutorial installed.
drop trigger if exists impulse_claim_first_admin on auth.users;
create trigger impulse_claim_first_admin
  after insert on auth.users
  for each row execute function public.claim_first_admin();

drop policy if exists "admins readable by admins" on public.admins;
create policy "admins readable by admins"
  on public.admins for select
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Blog posts / articles
-- ---------------------------------------------------------------------------
-- `body` is an array of typed blocks rather than raw HTML:
--   {"type":"p","text":"..."}          paragraph
--   {"type":"h2","text":"..."}         section heading
--   {"type":"ul","items":["...","..."]} bullet list
--   {"type":"quote","text":"..."}      pull quote
-- Nothing here is injected into the DOM as markup, so a stray angle bracket in
-- the admin panel can never break the article layout.

create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  excerpt      text not null default '',
  category     text not null default 'General',
  author       text not null default 'Impulse Team',
  read_time    text not null default '4 min read',
  published_at date not null default current_date,
  status       text not null default 'published' check (status in ('draft', 'published')),
  cover_image  text,
  body         jsonb not null default '[]'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists posts_published_idx
  on public.posts (status, published_at desc);

drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

alter table public.posts enable row level security;

drop policy if exists "posts are publicly readable when published" on public.posts;
create policy "posts are publicly readable when published"
  on public.posts for select
  using (status = 'published' or public.is_admin());

drop policy if exists "posts are writable by admins" on public.posts;
create policy "posts are writable by admins"
  on public.posts for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Page headings & subheadings
-- ---------------------------------------------------------------------------
-- One row per titled band on the site. `key` is what the page asks for and
-- never changes; everything else is yours to edit.
--   eyebrow      small label above the heading ("Who we are")
--   heading      the main heading
--   heading_alt  optional second line, styled differently by the page
--   subheading   the supporting line underneath
--   body         longer prose; blank line separates paragraphs

create table if not exists public.site_sections (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,
  page        text not null,
  label       text not null,
  hint        text,
  eyebrow     text,
  heading     text,
  heading_alt text,
  subheading  text,
  body        text,
  sort_order  int not null default 0,
  updated_at  timestamptz not null default now()
);

drop trigger if exists site_sections_touch on public.site_sections;
create trigger site_sections_touch before update on public.site_sections
  for each row execute function public.touch_updated_at();

alter table public.site_sections enable row level security;

drop policy if exists "sections are publicly readable" on public.site_sections;
create policy "sections are publicly readable"
  on public.site_sections for select using (true);

drop policy if exists "sections are writable by admins" on public.site_sections;
create policy "sections are writable by admins"
  on public.site_sections for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Cards (services, process steps, mission/vision/goal)
-- ---------------------------------------------------------------------------
-- All the repeating cards on the site share one shape, so they share one
-- table. `section` decides where a card appears:
--   home_services      the four service cards on the home page
--   page_services      the plan cards on /services
--   ancillary_services the branches of the diagram at the foot of /services
--   pillars            the mission / vision / goal one-liners on the home page
--   mvg                the mission / vision / goal cards on /about-us
-- `icon` is a key, not markup — the page maps it to a hand-drawn SVG. See
-- components/CardIcon.jsx for the list of available keys.

create table if not exists public.content_cards (
  id          uuid primary key default gen_random_uuid(),
  section     text not null check (section in ('home_services', 'page_services', 'ancillary_services', 'pillars', 'mvg')),
  title       text not null,
  description text not null default '',
  bullets     jsonb not null default '[]'::jsonb,
  icon        text not null default 'chart',
  image_url   text,
  cta_label   text,
  cta_href    text default '#contact',
  featured    boolean not null default false,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  updated_at  timestamptz not null default now()
);

create index if not exists content_cards_section_idx
  on public.content_cards (section, sort_order);

drop trigger if exists content_cards_touch on public.content_cards;
create trigger content_cards_touch before update on public.content_cards
  for each row execute function public.touch_updated_at();

alter table public.content_cards enable row level security;

drop policy if exists "cards are publicly readable" on public.content_cards;
create policy "cards are publicly readable"
  on public.content_cards for select
  using (is_active or public.is_admin());

drop policy if exists "cards are writable by admins" on public.content_cards;
create policy "cards are writable by admins"
  on public.content_cards for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- People — CEO and board of directors
-- ---------------------------------------------------------------------------
-- `bio` is plain text; a blank line starts a new paragraph on /about-us.

create table if not exists public.team_members (
  id            uuid primary key default gen_random_uuid(),
  kind          text not null default 'board' check (kind in ('ceo', 'board')),
  name          text not null,
  role          text not null default 'Director',
  bio           text not null default '',
  quote         text,
  photo_url     text,
  linkedin_url  text,
  email         text,
  sort_order    int not null default 0,
  is_active     boolean not null default true,
  updated_at    timestamptz not null default now()
);

create index if not exists team_members_kind_idx
  on public.team_members (kind, sort_order);

drop trigger if exists team_members_touch on public.team_members;
create trigger team_members_touch before update on public.team_members
  for each row execute function public.touch_updated_at();

alter table public.team_members enable row level security;

drop policy if exists "team is publicly readable" on public.team_members;
create policy "team is publicly readable"
  on public.team_members for select
  using (is_active or public.is_admin());

drop policy if exists "team is writable by admins" on public.team_members;
create policy "team is writable by admins"
  on public.team_members for all
  using (public.is_admin())
  with check (public.is_admin());


-- ============================================================================
--  Seed — the copy that is on the site today
-- ============================================================================

-- Headings and subheadings -----------------------------------------------------
insert into public.site_sections (key, page, label, hint, eyebrow, heading, heading_alt, subheading, body, sort_order) values
  ('home.hero', 'Home', 'Hero', 'The first line is light, the second is bold.', null,
   $q$Find A$q$, $q$Business Consultant$q$,
   $q$Strategic consulting, accurate accounting, and stress-free tax compliance trusted by 50+ growing businesses across Nepal.$q$, null, 10),

  ('home.umbrella', 'Home', 'Umbrella scene', 'Second line is highlighted in blue.', null,
   $q$Four strengths.$q$, $q$One protective umbrella.$q$, null, null, 20),

  ('home.pillars', 'Home', 'Mission / vision / goal band', null, null,
   $q$Mission, vision & goal$q$, null, null, null, 30),

  ('home.services', 'Home', 'Services grid', null, null,
   $q$Tailored Services to Grow & Protect Your Business$q$, null, null, null, 40),

  ('home.trust', 'Home', 'Trust bar', null, null,
   $q$Trusted by 100+ Companies, Professionals & Growing Teams$q$, null, null, null, 50),

  ('home.testimonials', 'Home', 'Testimonials', null, null,
   $q$What people are saying?$q$, null,
   $q$Don't just take our word for it - see what our partners have to say about their experience!$q$, null, 60),

  ('services.hero', 'Services', 'Hero', null, null,
   $q$Effective, efficient, and economic business support.$q$, null,
   $q$Choose the support your business needs today, then grow into deeper compliance, accounting, and advisory care as your work expands.$q$, null, 10),

  ('services.ancillary', 'Services', 'Ancillary service diagram', null, null,
   $q$Ancillary Service$q$, null, null, null, 20),

  ('about.hero', 'About', 'Hero', null, null,
   $q$About Us$q$, null,
   $q$We're a Trusted and Professional Management Company$q$, null, 10),

  ('about.intro', 'About', 'Who we are', 'Leave a blank line between paragraphs in the body.',
   $q$Who we are$q$,
   $q$A trusted management & consulting partner for Nepal's businesses$q$, null, null,
   $q$Impulse Investment and Management Pvt. Ltd. helps growing businesses, entrepreneurs, and corporate leaders navigate financial complexity with clarity. From business consulting to accounting, taxation, and VAT filing, we bring everything you need under one experienced team.

We believe good numbers lead to good decisions. Our focus is simple — deliver efficient, effective, and economically viable solutions that fuel your growth while keeping you fully compliant.$q$, 20),

  ('about.mvg', 'About', 'Mission, vision & goal', null,
   $q$What drives us$q$, $q$Our mission, vision & goal$q$, null, null, null, 30),

  ('about.ceo', 'About', 'CEO', null,
   $q$Leadership$q$, $q$Meet our CEO$q$, null, null, null, 40),

  ('about.bod', 'About', 'Board of Directors', null,
   $q$Governance$q$, $q$Board of Directors$q$, null,
   $q$The leadership team guiding Impulse's strategy, integrity, and long-term growth.$q$, null, 50),

  ('blog.index', 'Blog', 'Listing page', null, null,
   $q$Blogs & Articles$q$, null,
   $q$Practical guidance on tax, compliance, accounting, and running a business in Nepal — written by the team that does this work every day.$q$, null, 10),

  ('blog.cta', 'Blog', 'Article call to action', 'Shown at the foot of every article.', null,
   $q$Need help with this?$q$, null,
   $q$Talk to the team that handles compliance, accounting, and tax for 50+ businesses across Nepal.$q$, null, 20),

  ('site.popup', 'Popup', 'Welcome announcement popup', 'Shown to first-time visitors.', $q$Announcement$q$,
    $q$Welcome to Impulse Investment & Management$q$, $q$Explore Services|/#contact|/blog/bootcamp.webp$q$,
    $q$enabled$q$,
    $q$We empower businesses across Nepal with company registration, compliance, accurate accounting, and strategic consulting. Schedule your initial advisory session today.$q$, 10)
on conflict (key) do nothing;

-- Cards. These tables have no natural unique key — a board can legitimately
-- hold two people with the same name — so each block seeds only while its
-- section is still untouched. That keeps re-runs from duplicating rows without
-- imposing a uniqueness rule the admin panel would then have to fight.
do $seed$
begin

if not exists (select 1 from public.content_cards where section = 'home_services') then
  insert into public.content_cards (section, title, description, icon, image_url, cta_href, sort_order) values
    ('home_services', $q$Company Compliance$q$, $q$Registration, renewals, and corporate documentation handled correctly.$q$, 'building', '/card_team.jpg', '#contact', 10),
    ('home_services', $q$Accounting & Bookkeeping$q$, $q$Minimize liabilities and maximize accuracy.$q$, 'ledger', '/heroimage.webp', '#contact', 20),
    ('home_services', $q$Tax & VAT Filing$q$, $q$Returns filed on time, in line with Nepal's regulations.$q$, 'document', '/card_report.jpg', '#contact', 30),
    ('home_services', $q$Other Services$q$, $q$Forecasts, planning, reports, and practical business direction.$q$, 'chart', '/about_office.jpg', '#contact', 40);
end if;

if not exists (select 1 from public.content_cards where section = 'page_services') then
  insert into public.content_cards (section, title, description, bullets, icon, cta_label, cta_href, featured, sort_order) values
    ('page_services', $q$Company Compliance$q$,
     $q$For registration, renewals, changes, and corporate documentation that must be handled correctly.$q$,
     $j$["Company registration","Company renewal and closure","Share transfer","Address and object changes","Trademark registration","NGO registration and renewal"]$j$::jsonb,
     'building', $q$Start compliance work$q$, '#contact', false, 10),

    ('page_services', $q$Accounting & Bookkeeping$q$,
     $q$For clean books and financial statements your team can actually trust.$q$,
     $j$["Accounting and bookkeeping","Financial statement preparation","Software accounting management"]$j$::jsonb,
     'ledger', $q$Talk to an accountant$q$, '#contact', true, 20),

    ('page_services', $q$Tax & VAT Filing$q$,
     $q$For returns filed on time and in line with Nepal's regulations.$q$,
     $j$["Tax filing","VAT filing"]$j$::jsonb,
     'document', $q$Get filing help$q$, '#contact', false, 30),

    ('page_services', $q$Other Services$q$,
     $q$For decisions that need forecasts, planning, reports, and practical direction.$q$,
     $j$["Project report","Forecast","Investment planning","Strategy planning","HR policy","Intern report preparation"]$j$::jsonb,
     'chart', $q$Ask about a service$q$, '#contact', false, 40);
end if;

if not exists (select 1 from public.content_cards where section = 'ancillary_services') then
  insert into public.content_cards (section, title, description, icon, image_url, sort_order) values
    ('ancillary_services', $q$Event Management$q$, '', 'calendar', '/card_team.jpg', 10),
    ('ancillary_services', $q$Training and Seminar$q$, '', 'flag', '/about_office.jpg', 20),
    ('ancillary_services', $q$Research and Development$q$, '', 'trend', '/card_report.jpg', 30);
end if;

if not exists (select 1 from public.content_cards where section = 'pillars') then
  insert into public.content_cards (section, title, description, icon, sort_order) values
    ('pillars', $q$Our Mission$q$, $q$To deliver quality work that exceeds expectations and moves every client forward.$q$, 'target', 10),
    ('pillars', $q$Our Vision$q$, $q$To be Nepal's most trusted name in consulting, accounting, and compliance.$q$, 'summit', 20),
    ('pillars', $q$Our Goal$q$, $q$To turn clear numbers into confident decisions for every business we serve.$q$, 'trend', 30);
end if;

if not exists (select 1 from public.content_cards where section = 'mvg') then
  insert into public.content_cards (section, title, description, bullets, icon, featured, sort_order) values
    ('mvg', $q$Our Mission$q$,
     $q$To provide top-notch, quality services that exceed customer expectations — delivering efficient, effective, and economically viable solutions that contribute to our clients' success and growth.$q$,
     $j$["Empower financial growth","Provide expert guidance","Enhance community well-being"]$j$::jsonb,
     'bullseye', false, 10),

    ('mvg', $q$Our Vision$q$,
     $q$To be recognized as a leading provider of quality services, ensuring the utmost customer satisfaction through efficiency, effectiveness, and economic viability.$q$,
     $j$["Leadership in financial solutions","Client-centric excellence","Lasting, positive impact"]$j$::jsonb,
     'eye', true, 20),

    ('mvg', $q$Our Goal$q$,
     $q$To consistently deliver exceptional service and exceed client expectations through innovative solutions that optimize efficiency, effectiveness, and economic viability.$q$,
     $j$["Educational initiatives","Innovation & adaptability","Sustainable growth"]$j$::jsonb,
     'flag', false, 30);
end if;

if not exists (select 1 from public.team_members where kind = 'ceo') then
  insert into public.team_members (kind, name, role, quote, bio, photo_url, sort_order) values
    ('ceo', $q$Achal Acharya$q$, $q$Chief Executive Officer$q$,
     $q$Every business deserves a partner that treats its numbers — and its ambitions — as seriously as they do.$q$,
     $q$Achal Acharya leads Impulse with a commitment to clarity, integrity, and results. Under his leadership, the firm has grown into a trusted name for consulting, accounting, and tax compliance across Nepal — helping 50+ businesses make smarter decisions with confidence.

His approach blends deep financial expertise with a genuine understanding of what growing businesses need to move forward.$q$,
     'https://i.pravatar.cc/700?img=13', 10);
end if;

if not exists (select 1 from public.team_members where kind = 'board') then
  insert into public.team_members (kind, name, role, bio, photo_url, linkedin_url, sort_order) values
    ('board', $q$Utsav Dhakal$q$,   $q$Director$q$, $q$Director at Impulse Investment and Management Pvt. Ltd.$q$, 'https://i.pravatar.cc/500?img=33', '#', 10),
    ('board', $q$Sanju Regmi$q$,   $q$Director$q$, $q$Director at Impulse Investment and Management Pvt. Ltd.$q$, 'https://i.pravatar.cc/500?img=45', '#', 20),
    ('board', $q$Bina Gadtaula$q$, $q$Director$q$, $q$Director at Impulse Investment and Management Pvt. Ltd.$q$, 'https://i.pravatar.cc/500?img=15', '#', 30);
end if;

end
$seed$;

-- Articles ----------------------------------------------------------------------
insert into public.posts (slug, title, excerpt, category, author, read_time, published_at, status, body) values
  ('vat-filing-in-nepal-what-every-business-should-know',
   $q$VAT filing in Nepal: what every business should know$q$,
   $q$Registration thresholds, filing cycles, and the small mistakes that most often turn into penalties — explained without the jargon.$q$,
   'Tax', 'Impulse Team', '5 min read', '2026-07-18', 'published',
   $j$[
     {"type":"p","text":"Value Added Tax is where most growing businesses in Nepal first meet the tax system properly, and it is also where avoidable penalties tend to accumulate. The rules themselves are not complicated. Staying on top of the cycle is the hard part."},
     {"type":"h2","text":"When registration becomes mandatory"},
     {"type":"p","text":"Registration is driven by your turnover and, for some categories of business, by the nature of the goods or services you supply rather than the amount you sell. If you are approaching the threshold, it is far cheaper to register early than to be assessed retrospectively."},
     {"type":"h2","text":"The filing cycle"},
     {"type":"p","text":"Once registered, returns are due on a fixed cycle whether or not you traded in the period. A nil return still has to be filed. Missing one is the single most common reason a business ends up paying a penalty on an otherwise clean record."},
     {"type":"ul","items":["File on the due date even when there is nothing to report","Keep purchase invoices that support every credit you claim","Reconcile your VAT ledger to your books before you submit, not after","Keep registration details current — an address change left unreported causes problems later"]},
     {"type":"quote","text":"Almost every penalty we see could have been avoided by filing an empty return on time."},
     {"type":"h2","text":"Claiming input credit correctly"},
     {"type":"p","text":"Input credit is only as good as the documentation behind it. A claim without a valid supporting invoice will not survive review, and reversing it later is more disruptive than never claiming it. Where a purchase is partly for business and partly not, apportion it honestly and record the basis."},
     {"type":"h2","text":"Where to get help"},
     {"type":"p","text":"If your filings are behind, the position is almost always recoverable — but it gets more expensive the longer it waits. We handle registration, periodic returns, and bringing overdue filings back into order."}
   ]$j$::jsonb),

  ('registering-a-company-in-nepal-a-practical-walkthrough',
   $q$Registering a company in Nepal: a practical walkthrough$q$,
   $q$From choosing a structure to your first compliance obligations — the sequence of steps, and what actually holds people up.$q$,
   'Compliance', 'Impulse Team', '6 min read', '2026-07-04', 'published',
   $j$[
     {"type":"p","text":"Registering a company is mostly a sequencing problem. Each step depends on the one before it, and the delays people run into are usually caused by starting a step before its prerequisite is genuinely finished."},
     {"type":"h2","text":"Choose the structure first"},
     {"type":"p","text":"Your structure determines your reporting burden for the entire life of the business, so it deserves more than a few minutes. A private limited company suits most businesses that intend to grow, take on partners, or raise money later."},
     {"type":"h2","text":"Name approval"},
     {"type":"p","text":"Have two or three names ready. Approval is not guaranteed, and holding a single preferred name while it is rejected twice is the most common source of early delay."},
     {"type":"h2","text":"Documentation"},
     {"type":"ul","items":["Memorandum and articles of association","Identity documents for every shareholder and director","Proof of the registered office address","Shareholding structure, agreed in writing before you file"]},
     {"type":"p","text":"Agreeing the shareholding in writing before filing sounds obvious. It is also the thing most often left informal, and the most expensive to unpick afterwards."},
     {"type":"h2","text":"After incorporation"},
     {"type":"p","text":"Registration is the beginning of your obligations, not the end. Tax registration, bookkeeping from day one, and annual renewals all start immediately. Businesses that set up their books properly in the first month rarely have a difficult first audit."}
   ]$j$::jsonb),

  ('five-bookkeeping-habits-that-make-tax-season-painless',
   $q$Five bookkeeping habits that make tax season painless$q$,
   $q$Year-end is only stressful when the year was. Small, consistent habits that turn filing into a formality instead of a scramble.$q$,
   'Accounting', 'Impulse Team', '4 min read', '2026-06-21', 'published',
   $j$[
     {"type":"p","text":"Nobody enjoys year-end. But the businesses that find it painless are not the ones with the simplest finances — they are the ones whose records were already in order when the period closed."},
     {"type":"h2","text":"Reconcile every month, not every year"},
     {"type":"p","text":"A month of unexplained differences takes an afternoon to resolve. Twelve months of them takes a week, and by then nobody remembers what the transactions were for."},
     {"type":"h2","text":"Keep business and personal genuinely separate"},
     {"type":"p","text":"One account for the business, one for you. Mixed accounts are the single biggest driver of bookkeeping cost, because every line has to be classified by hand and half of them need a conversation."},
     {"type":"h2","text":"Capture documents when they happen"},
     {"type":"ul","items":["Photograph receipts at the point of spending","File supplier invoices the day they arrive","Record what an unusual payment was for while you still remember","Store contracts where your accountant can actually reach them"]},
     {"type":"quote","text":"A receipt is worth what it cost you. A receipt nobody can find is worth nothing."},
     {"type":"h2","text":"Review the numbers you actually act on"},
     {"type":"p","text":"Accounts prepared once a year and read by nobody are a compliance exercise. A short monthly review of cash, receivables, and margin turns the same data into something you can make decisions with."},
     {"type":"h2","text":"Ask before, not after"},
     {"type":"p","text":"A five-minute question before an unusual transaction is cheaper than restructuring it afterwards. That is what your accountant is for."}
   ]$j$::jsonb)
on conflict (slug) do nothing;
