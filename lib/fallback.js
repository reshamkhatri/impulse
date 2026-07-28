/* Last-resort copy, used only when the database can't answer.

   Two situations reach this file: the project has been cloned but the Supabase
   keys haven't been entered yet, and a transient outage while the site is
   live. Either way the pages render their current wording rather than a bank
   of empty headings.

   It mirrors the seed block at the bottom of supabase/schema.sql. Once the
   keys are in, the database is the source of truth and nothing here is read —
   so edit content in the admin panel, not here. */

export const FALLBACK_SECTIONS = {
  'home.hero': {
    heading: 'Find A',
    heading_alt: 'Business Consultant',
    subheading:
      'Strategic consulting, accurate accounting, and stress-free tax compliance trusted by 50+ growing businesses across Nepal.'
  },
  'home.umbrella': { heading: 'Four strengths.', heading_alt: 'One protective umbrella.' },
  'home.pillars': { heading: 'Mission, vision & goal' },
  'home.services': { heading: 'Tailored Services to Grow & Protect Your Business' },
  'home.trust': { heading: 'Trusted by 100+ Companies, Professionals & Growing Teams' },
  'home.testimonials': {
    heading: 'What people are saying?',
    subheading:
      "Don't just take our word for it - see what our partners have to say about their experience!"
  },
  'services.hero': {
    heading: 'Simple, reliable business support.',
    subheading:
      'Choose the support your business needs today, then grow into deeper compliance, accounting, and advisory care as your work expands.'
  },
  'services.support': {
    eyebrow: 'How it feels to work with us',
    heading: 'One calm system for the messy business work.',
    subheading:
      'Impulse keeps the official, financial, and strategic work organized so you are not chasing different people for every small thing.'
  },
  'about.hero': {
    heading: 'About Us',
    subheading: 'We’re a Trusted and Professional Management Company'
  },
  'about.intro': {
    eyebrow: 'Who we are',
    heading: 'A trusted management & consulting partner for Nepal’s businesses',
    body:
      'Impulse Investment and Management Pvt. Ltd. helps growing businesses, entrepreneurs, and corporate leaders navigate financial complexity with clarity. From business consulting to accounting, taxation, and VAT filing, we bring everything you need under one experienced team.\n\nWe believe good numbers lead to good decisions. Our focus is simple — deliver efficient, effective, and economically viable solutions that fuel your growth while keeping you fully compliant.'
  },
  'about.mvg': { eyebrow: 'What drives us', heading: 'Our mission, vision & goal' },
  'about.ceo': { eyebrow: 'Leadership', heading: 'Meet our CEO' },
  'about.bod': {
    eyebrow: 'Governance',
    heading: 'Board of Directors',
    subheading:
      'The leadership team guiding Impulse’s strategy, integrity, and long-term growth.'
  },
  'blog.index': {
    heading: 'Blogs & Articles',
    subheading:
      'Practical guidance on tax, compliance, accounting, and running a business in Nepal — written by the team that does this work every day.'
  },
  'blog.cta': {
    heading: 'Need help with this?',
    subheading:
      'Talk to the team that handles compliance, accounting, and tax for 50+ businesses across Nepal.'
  }
};

export const FALLBACK_CARDS = {
  home_services: [
    {
      id: 'f-hs-1',
      title: 'Business Consulting',
      description: 'Clear direction aligned with long-term goals and realities.',
      icon: 'pulse',
      image_url: '/card_team.jpg',
      cta_href: '#contact',
      bullets: []
    },
    {
      id: 'f-hs-2',
      title: 'Accounting & Bookkeeping',
      description: 'Minimize liabilities and maximize accuracy.',
      icon: 'ledger',
      image_url: '/heroimage.webp',
      cta_href: '#contact',
      bullets: []
    },
    {
      id: 'f-hs-3',
      title: 'Taxation',
      description: 'Prepare for the future with total confidence.',
      icon: 'calendar',
      image_url: '/card_report.jpg',
      cta_href: '#contact',
      bullets: []
    },
    {
      id: 'f-hs-4',
      title: 'VAT Filing',
      description: "Ensuring full compliance with Nepal's regulations.",
      icon: 'file',
      image_url: '/about_office.jpg',
      cta_href: '#contact',
      bullets: []
    }
  ],

  page_services: [
    {
      id: 'f-ps-1',
      title: 'Company Compliance',
      description:
        'For registration, renewals, changes, and corporate documentation that must be handled correctly.',
      bullets: [
        'Company registration',
        'Company renewal and closure',
        'Share transfer',
        'Address and object changes',
        'Trademark registration',
        'NGO registration and renewal'
      ],
      icon: 'building',
      cta_label: 'Start compliance work',
      cta_href: '#contact',
      featured: false
    },
    {
      id: 'f-ps-2',
      title: 'Accounting & Tax',
      description:
        'For clean books, tax readiness, VAT filing, and financial statements your team can actually trust.',
      bullets: [
        'Tax filing',
        'VAT filing',
        'Financial statement preparation',
        'Accounting and bookkeeping',
        'Software accounting management',
        'Intern report preparation'
      ],
      icon: 'document',
      cta_label: 'Talk to an accountant',
      cta_href: '#contact',
      featured: true
    },
    {
      id: 'f-ps-3',
      title: 'Finance Advisory',
      description: 'For decisions that need forecasts, planning, reports, and practical business direction.',
      bullets: [
        'Project report',
        'Forecast',
        'Investment planning',
        'Strategy planning',
        'HR policy'
      ],
      icon: 'chart',
      cta_label: 'Plan with Impulse',
      cta_href: '#contact',
      featured: false
    }
  ],

  support_steps: [
    {
      id: 'f-ss-1',
      title: 'We understand the situation',
      description: 'We look at your company stage, records, filings, and immediate priorities.',
      bullets: []
    },
    {
      id: 'f-ss-2',
      title: 'We organize the work',
      description: 'Documents, accounts, filings, and reports are arranged in the right order.',
      bullets: []
    },
    {
      id: 'f-ss-3',
      title: 'You move with clarity',
      description: 'You get completed work, clean handoff, and simple next-step guidance.',
      bullets: []
    }
  ],

  pillars: [
    {
      id: 'f-pl-1',
      title: 'Our Mission',
      description: 'To deliver quality work that exceeds expectations and moves every client forward.',
      icon: 'target',
      bullets: []
    },
    {
      id: 'f-pl-2',
      title: 'Our Vision',
      description: 'To be Nepal’s most trusted name in consulting, accounting, and compliance.',
      icon: 'summit',
      bullets: []
    },
    {
      id: 'f-pl-3',
      title: 'Our Goal',
      description: 'To turn clear numbers into confident decisions for every business we serve.',
      icon: 'trend',
      bullets: []
    }
  ],

  mvg: [
    {
      id: 'f-mvg-1',
      title: 'Our Mission',
      description:
        'To provide top-notch, quality services that exceed customer expectations — delivering efficient, effective, and economically viable solutions that contribute to our clients’ success and growth.',
      bullets: ['Empower financial growth', 'Provide expert guidance', 'Enhance community well-being'],
      icon: 'bullseye',
      featured: false
    },
    {
      id: 'f-mvg-2',
      title: 'Our Vision',
      description:
        'To be recognized as a leading provider of quality services, ensuring the utmost customer satisfaction through efficiency, effectiveness, and economic viability.',
      bullets: ['Leadership in financial solutions', 'Client-centric excellence', 'Lasting, positive impact'],
      icon: 'eye',
      featured: true
    },
    {
      id: 'f-mvg-3',
      title: 'Our Goal',
      description:
        'To consistently deliver exceptional service and exceed client expectations through innovative solutions that optimize efficiency, effectiveness, and economic viability.',
      bullets: ['Educational initiatives', 'Innovation & adaptability', 'Sustainable growth'],
      icon: 'flag',
      featured: false
    }
  ]
};

export const FALLBACK_CEO = {
  id: 'f-ceo',
  kind: 'ceo',
  name: 'Achal Acharya',
  role: 'Chief Executive Officer',
  quote:
    'Every business deserves a partner that treats its numbers — and its ambitions — as seriously as they do.',
  bio:
    'Achal Acharya leads Impulse with a commitment to clarity, integrity, and results. Under his leadership, the firm has grown into a trusted name for consulting, accounting, and tax compliance across Nepal — helping 50+ businesses make smarter decisions with confidence.\n\nHis approach blends deep financial expertise with a genuine understanding of what growing businesses need to move forward.',
  photo_url: 'https://i.pravatar.cc/700?img=13'
};

export const FALLBACK_BOARD = [
  {
    id: 'f-bod-1',
    kind: 'board',
    name: 'Board Member One',
    role: 'Director',
    bio: '',
    photo_url: 'https://i.pravatar.cc/500?img=33',
    linkedin_url: '#'
  },
  {
    id: 'f-bod-2',
    kind: 'board',
    name: 'Board Member Two',
    role: 'Director',
    bio: '',
    photo_url: 'https://i.pravatar.cc/500?img=45',
    linkedin_url: '#'
  },
  {
    id: 'f-bod-3',
    kind: 'board',
    name: 'Board Member Three',
    role: 'Director',
    bio: '',
    photo_url: 'https://i.pravatar.cc/500?img=15',
    linkedin_url: '#'
  }
];
