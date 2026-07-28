-- ===========================================================================
-- Services page restructure
-- ===========================================================================
-- schema.sql seeds each block only while its section is still empty, so it
-- cannot carry this change into a database that is already live. Run this once
-- against an existing project; schema.sql alone is enough for a fresh one.
--
-- What it does:
--   * four service cards on /services instead of three
--   * the same four advertised on the home page
--   * the "How it works" band replaced by the ancillary service diagram
--   * new services page headline
--
-- Safe to run more than once.
-- ---------------------------------------------------------------------------

begin;

-- 1. The old step cards go first: they have to be gone before the check
--    constraint stops allowing their section name.
delete from public.content_cards where section = 'support_steps';

-- 2. Widen the allowed sections. The constraint was created inline, so it
--    carries Postgres' generated name.
alter table public.content_cards
  drop constraint if exists content_cards_section_check;

alter table public.content_cards
  add constraint content_cards_section_check
  check (section in ('home_services', 'page_services', 'ancillary_services', 'pillars', 'mvg'));

-- 3. The services page cards. Rebuilt wholesale rather than patched row by
--    row, because the split of "Accounting & Tax" into two cards has no
--    one-to-one mapping onto the old rows.
delete from public.content_cards where section = 'page_services';

insert into public.content_cards
  (section, title, description, bullets, icon, cta_label, cta_href, featured, sort_order) values
  ('page_services', 'Company Compliance',
   'For registration, renewals, changes, and corporate documentation that must be handled correctly.',
   '["Company registration","Company renewal and closure","Share transfer","Address and object changes","Trademark registration","NGO registration and renewal"]'::jsonb,
   'building', 'Start compliance work', '#contact', false, 10),

  ('page_services', 'Accounting & Bookkeeping',
   'For clean books and financial statements your team can actually trust.',
   '["Accounting and bookkeeping","Financial statement preparation","Software accounting management"]'::jsonb,
   'ledger', 'Talk to an accountant', '#contact', true, 20),

  ('page_services', 'Tax & VAT Filing',
   'For returns filed on time and in line with Nepal''s regulations.',
   '["Tax filing","VAT filing"]'::jsonb,
   'document', 'Get filing help', '#contact', false, 30),

  ('page_services', 'Other Services',
   'For decisions that need forecasts, planning, reports, and practical direction.',
   '["Project report","Forecast","Investment planning","Strategy planning","HR policy","Intern report preparation"]'::jsonb,
   'chart', 'Ask about a service', '#contact', false, 40);

-- 4. The branches of the new diagram.
delete from public.content_cards where section = 'ancillary_services';

-- The image_urls are stand-ins reused from the home page cards; swap them for
-- dedicated photos through the admin panel.
insert into public.content_cards (section, title, description, icon, image_url, sort_order) values
  ('ancillary_services', 'Event Management', '', 'calendar', '/card_team.jpg', 10),
  ('ancillary_services', 'Training and Seminar', '', 'flag', '/about_office.jpg', 20),
  ('ancillary_services', 'Research and Development', '', 'trend', '/card_report.jpg', 30);

-- 5. Home page cards, kept in step with the services page. Images are left as
--    they were, so whatever is uploaded stays in place.
update public.content_cards set
  title = 'Company Compliance',
  description = 'Registration, renewals, and corporate documentation handled correctly.',
  icon = 'building'
where section = 'home_services' and sort_order = 10;

update public.content_cards set
  title = 'Tax & VAT Filing',
  description = 'Returns filed on time, in line with Nepal''s regulations.',
  icon = 'document'
where section = 'home_services' and sort_order = 30;

update public.content_cards set
  title = 'Other Services',
  description = 'Forecasts, planning, reports, and practical business direction.',
  icon = 'chart'
where section = 'home_services' and sort_order = 40;

-- 6. Headings. The old "How it works" band is replaced rather than renamed, so
--    its wording does not linger in the admin panel.
update public.site_sections
  set heading = 'Effective, efficient, and economic business support.'
  where key = 'services.hero';

delete from public.site_sections where key = 'services.support';

insert into public.site_sections (key, page, label, eyebrow, heading, subheading, sort_order)
  values ('services.ancillary', 'Services', 'Ancillary service diagram', null, 'Ancillary Service', null, 20)
  on conflict (key) do update
    set page = excluded.page,
        label = excluded.label,
        heading = excluded.heading,
        sort_order = excluded.sort_order;

commit;
