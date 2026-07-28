/* ==========================================================================
   Blog & article content
   --------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU EDIT TO PUBLISH A POST.

   Add a new object to the top of the POSTS array below. Nothing else needs to
   change — the index page, the article page, the URL, and the sitemap-ready
   metadata are all generated from this list.

   Fields:
     slug     the URL, e.g. 'vat-filing-deadlines' -> /blog/vat-filing-deadlines
              lowercase, words separated by hyphens, no spaces
     title    headline shown on the card and at the top of the article
     excerpt  1–2 sentence summary shown on the listing card
     category short label, e.g. 'Tax', 'Compliance', 'Accounting', 'Advisory'
     date     'YYYY-MM-DD' — controls the displayed date and the sort order
     author   name shown under the title
     readTime e.g. '4 min read'
     body     the article itself: an array of blocks (see below)

   Body blocks — each block is { type, ... }:
     { type: 'p',     text: '...' }                 a paragraph
     { type: 'h2',    text: '...' }                 a section heading
     { type: 'ul',    items: ['...', '...'] }       a bullet list
     { type: 'quote', text: '...' }                 a pull quote

   Keeping content as data (rather than raw HTML) means a typo can never break
   the page layout, and nothing here is injected into the DOM as markup.
   ========================================================================== */

export const POSTS = [
  {
    slug: 'vat-filing-in-nepal-what-every-business-should-know',
    title: 'VAT filing in Nepal: what every business should know',
    excerpt:
      'Registration thresholds, filing cycles, and the small mistakes that most often turn into penalties — explained without the jargon.',
    category: 'Tax',
    date: '2026-07-18',
    author: 'Impulse Team',
    readTime: '5 min read',
    body: [
      { type: 'p', text: 'Value Added Tax is where most growing businesses in Nepal first meet the tax system properly, and it is also where avoidable penalties tend to accumulate. The rules themselves are not complicated. Staying on top of the cycle is the hard part.' },
      { type: 'h2', text: 'When registration becomes mandatory' },
      { type: 'p', text: 'Registration is driven by your turnover and, for some categories of business, by the nature of the goods or services you supply rather than the amount you sell. If you are approaching the threshold, it is far cheaper to register early than to be assessed retrospectively.' },
      { type: 'h2', text: 'The filing cycle' },
      { type: 'p', text: 'Once registered, returns are due on a fixed cycle whether or not you traded in the period. A nil return still has to be filed. Missing one is the single most common reason a business ends up paying a penalty on an otherwise clean record.' },
      { type: 'ul', items: [
        'File on the due date even when there is nothing to report',
        'Keep purchase invoices that support every credit you claim',
        'Reconcile your VAT ledger to your books before you submit, not after',
        'Keep registration details current — an address change left unreported causes problems later'
      ] },
      { type: 'quote', text: 'Almost every penalty we see could have been avoided by filing an empty return on time.' },
      { type: 'h2', text: 'Claiming input credit correctly' },
      { type: 'p', text: 'Input credit is only as good as the documentation behind it. A claim without a valid supporting invoice will not survive review, and reversing it later is more disruptive than never claiming it. Where a purchase is partly for business and partly not, apportion it honestly and record the basis.' },
      { type: 'h2', text: 'Where to get help' },
      { type: 'p', text: 'If your filings are behind, the position is almost always recoverable — but it gets more expensive the longer it waits. We handle registration, periodic returns, and bringing overdue filings back into order.' }
    ]
  },
  {
    slug: 'registering-a-company-in-nepal-a-practical-walkthrough',
    title: 'Registering a company in Nepal: a practical walkthrough',
    excerpt:
      'From choosing a structure to your first compliance obligations — the sequence of steps, and what actually holds people up.',
    category: 'Compliance',
    date: '2026-07-04',
    author: 'Impulse Team',
    readTime: '6 min read',
    body: [
      { type: 'p', text: 'Registering a company is mostly a sequencing problem. Each step depends on the one before it, and the delays people run into are usually caused by starting a step before its prerequisite is genuinely finished.' },
      { type: 'h2', text: 'Choose the structure first' },
      { type: 'p', text: 'Your structure determines your reporting burden for the entire life of the business, so it deserves more than a few minutes. A private limited company suits most businesses that intend to grow, take on partners, or raise money later.' },
      { type: 'h2', text: 'Name approval' },
      { type: 'p', text: 'Have two or three names ready. Approval is not guaranteed, and holding a single preferred name while it is rejected twice is the most common source of early delay.' },
      { type: 'h2', text: 'Documentation' },
      { type: 'ul', items: [
        'Memorandum and articles of association',
        'Identity documents for every shareholder and director',
        'Proof of the registered office address',
        'Shareholding structure, agreed in writing before you file'
      ] },
      { type: 'p', text: 'Agreeing the shareholding in writing before filing sounds obvious. It is also the thing most often left informal, and the most expensive to unpick afterwards.' },
      { type: 'h2', text: 'After incorporation' },
      { type: 'p', text: 'Registration is the beginning of your obligations, not the end. Tax registration, bookkeeping from day one, and annual renewals all start immediately. Businesses that set up their books properly in the first month rarely have a difficult first audit.' }
    ]
  },
  {
    slug: 'five-bookkeeping-habits-that-make-tax-season-painless',
    title: 'Five bookkeeping habits that make tax season painless',
    excerpt:
      'Year-end is only stressful when the year was. Small, consistent habits that turn filing into a formality instead of a scramble.',
    category: 'Accounting',
    date: '2026-06-21',
    author: 'Impulse Team',
    readTime: '4 min read',
    body: [
      { type: 'p', text: 'Nobody enjoys year-end. But the businesses that find it painless are not the ones with the simplest finances — they are the ones whose records were already in order when the period closed.' },
      { type: 'h2', text: 'Reconcile every month, not every year' },
      { type: 'p', text: 'A month of unexplained differences takes an afternoon to resolve. Twelve months of them takes a week, and by then nobody remembers what the transactions were for.' },
      { type: 'h2', text: 'Keep business and personal genuinely separate' },
      { type: 'p', text: 'One account for the business, one for you. Mixed accounts are the single biggest driver of bookkeeping cost, because every line has to be classified by hand and half of them need a conversation.' },
      { type: 'h2', text: 'Capture documents when they happen' },
      { type: 'ul', items: [
        'Photograph receipts at the point of spending',
        'File supplier invoices the day they arrive',
        'Record what an unusual payment was for while you still remember',
        'Store contracts where your accountant can actually reach them'
      ] },
      { type: 'quote', text: 'A receipt is worth what it cost you. A receipt nobody can find is worth nothing.' },
      { type: 'h2', text: 'Review the numbers you actually act on' },
      { type: 'p', text: 'Accounts prepared once a year and read by nobody are a compliance exercise. A short monthly review of cash, receivables, and margin turns the same data into something you can make decisions with.' },
      { type: 'h2', text: 'Ask before, not after' },
      { type: 'p', text: 'A five-minute question before an unusual transaction is cheaper than restructuring it afterwards. That is what your accountant is for.' }
    ]
  }
];

/** Newest first — the listing and the article pages both rely on this order. */
export function getAllPosts() {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug) {
  return POSTS.find((p) => p.slug === slug) || null;
}

/** '2026-07-18' -> '18 July 2026' */
export function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
