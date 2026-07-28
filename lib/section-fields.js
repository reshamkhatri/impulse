/* Which boxes the admin panel shows for each titled band.

   The database row has five text columns, but no band on the site uses all
   five — the home hero has two heading lines and no eyebrow, the About intro
   has an eyebrow and prose but no subheading. Listing the fields each one
   actually renders keeps the editing screen honest: every box you see is a box
   that changes something.

   A key with no entry here falls back to showing everything, so adding a row
   to site_sections still gives you somewhere to type. */

const HEADING = { name: 'heading', label: 'Heading' };
const SUBHEADING = { name: 'subheading', label: 'Subheading', type: 'textarea' };
const EYEBROW = { name: 'eyebrow', label: 'Small label above the heading' };

export const SECTION_FIELDS = {
  'home.hero': [
    { name: 'heading', label: 'First line (light type)' },
    { name: 'heading_alt', label: 'Second line (bold type)' },
    { name: 'subheading', label: 'Supporting line', type: 'textarea' }
  ],
  'home.umbrella': [
    { name: 'heading', label: 'First line' },
    { name: 'heading_alt', label: 'Second line (blue)' }
  ],
  'home.pillars': [HEADING],
  'home.services': [HEADING],
  'home.trust': [{ name: 'heading', label: 'Line above the logo strip' }],
  'home.testimonials': [HEADING, SUBHEADING],

  'services.hero': [HEADING, SUBHEADING],
  'services.support': [EYEBROW, HEADING, SUBHEADING],

  'about.hero': [HEADING, SUBHEADING],
  'about.intro': [
    EYEBROW,
    HEADING,
    { name: 'body', label: 'Paragraphs', type: 'textarea', rows: 8, hint: 'Leave a blank line between paragraphs.' }
  ],
  'about.mvg': [EYEBROW, HEADING],
  'about.ceo': [EYEBROW, HEADING],
  'about.bod': [EYEBROW, HEADING, SUBHEADING],

  'blog.index': [HEADING, SUBHEADING],
  'blog.cta': [HEADING, SUBHEADING]
};

export const DEFAULT_SECTION_FIELDS = [
  EYEBROW,
  HEADING,
  { name: 'heading_alt', label: 'Second heading line' },
  SUBHEADING,
  { name: 'body', label: 'Paragraphs', type: 'textarea', rows: 6 }
];

export function fieldsFor(key) {
  return SECTION_FIELDS[key] ?? DEFAULT_SECTION_FIELDS;
}
