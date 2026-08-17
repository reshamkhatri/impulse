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
    heading: 'Effective, efficient, and economic business support.',
    subheading:
      'Choose the support your business needs today, then grow into deeper compliance, accounting, and advisory care as your work expands.'
  },
  'services.ancillary': {
    heading: 'Ancillary Service',
    subheading: ''
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
  },
  'site.popup': {
    eyebrow: 'Announcement',
    heading: 'Welcome to Impulse Investment & Management',
    subheading: 'enabled',
    heading_alt: 'Explore Services|/#contact|/blog/bootcamp.webp',
    body:
      'We empower businesses across Nepal with company registration, compliance, accurate accounting, and strategic consulting. Schedule your initial advisory session today.'
  }
};

export const FALLBACK_CARDS = {
  /* Kept in step with page_services below, so the homepage teaser and the
     services page advertise the same four lines of work. */
  home_services: [
    {
      id: 'f-hs-1',
      title: 'Company Compliance',
      description: 'Registration, renewals, and corporate documentation handled correctly.',
      icon: 'building',
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
      title: 'Tax & VAT Filing',
      description: "Returns filed on time, in line with Nepal's regulations.",
      icon: 'document',
      image_url: '/card_report.jpg',
      cta_href: '#contact',
      bullets: []
    },
    {
      id: 'f-hs-4',
      title: 'Other Services',
      description: 'Forecasts, planning, reports, and practical business direction.',
      icon: 'chart',
      image_url: '/about_office.jpg',
      cta_href: '#contact',
      bullets: []
    }
  ],

  /* The services page renders the title, bullets, and CTA only — `description`
     is kept because the admin panel and the content_cards table still carry it,
     and the homepage cards do show it. */
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
      title: 'Accounting & Bookkeeping',
      description: 'For clean books and financial statements your team can actually trust.',
      bullets: [
        'Accounting and bookkeeping',
        'Financial statement preparation',
        'Software accounting management'
      ],
      icon: 'ledger',
      cta_label: 'Talk to an accountant',
      cta_href: '#contact',
      featured: true
    },
    {
      id: 'f-ps-3',
      title: 'Tax & VAT Filing',
      description: "For returns filed on time and in line with Nepal's regulations.",
      bullets: ['Tax filing', 'VAT filing'],
      icon: 'document',
      cta_label: 'Get filing help',
      cta_href: '#contact',
      featured: false
    },
    {
      id: 'f-ps-4',
      title: 'Other Services',
      description: 'For decisions that need forecasts, planning, reports, and practical direction.',
      bullets: [
        'Project report',
        'Forecast',
        'Investment planning',
        'Strategy planning',
        'HR policy',
        'Intern report preparation'
      ],
      icon: 'chart',
      cta_label: 'Ask about a service',
      cta_href: '#contact',
      featured: false
    }
  ],

  /* Branches of the diagram at the foot of /services. The image_urls are
     stand-ins borrowed from the home page cards — replace them with dedicated
     photos through the admin panel, which uploads to Cloudinary. */
  ancillary_services: [
    {
      id: 'f-as-1',
      title: 'Event Management',
      description: '',
      icon: 'calendar',
      image_url: '/card_team.jpg',
      bullets: []
    },
    {
      id: 'f-as-2',
      title: 'Training and Seminar',
      description: '',
      icon: 'flag',
      image_url: '/about_office.jpg',
      bullets: []
    },
    {
      id: 'f-as-3',
      title: 'Research and Development',
      description: '',
      icon: 'trend',
      image_url: '/card_report.jpg',
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
    name: 'Utsav Dhakal',
    role: 'Director',
    bio: '',
    photo_url: 'https://i.pravatar.cc/500?img=33',
    linkedin_url: '#'
  },
  {
    id: 'f-bod-2',
    kind: 'board',
    name: 'Sanju Regmi',
    role: 'Director',
    bio: '',
    photo_url: 'https://i.pravatar.cc/500?img=45',
    linkedin_url: '#'
  },
  {
    id: 'f-bod-3',
    kind: 'board',
    name: 'Bina Gadtaula',
    role: 'Director',
    bio: '',
    photo_url: 'https://i.pravatar.cc/500?img=15',
    linkedin_url: '#'
  }
];

/* The four articles carried over from the previous impulsenepal.com site,
   newest first. Kept in DB row shape — snake_case, `body` as blocks — so
   lib/content.js can hand them to the same normaliser it uses for real rows.

   Mirrored by supabase/seed-legacy-posts.sql. Once that has been run against
   the database, the database copy is what the site serves and these are only
   the outage/no-keys backstop. */
export const FALLBACK_POSTS = [
  {
    id: 'f-post-1',
    slug: '20-hour-entrepreneurship-bootcamp-empowering-minds-for-success',
    title: '20-Hour Entrepreneurship Bootcamp: Empowering Minds for Success',
    excerpt:
      'Twenty-four aspiring entrepreneurs, twenty hours, and facilitators drawn from Nepal Stock Exchange, Khalti, and FNCCI — inside our intensive bootcamp at Kathmandu Technical School.',
    category: 'Training',
    author: 'Impulse Team',
    read_time: '2 min read',
    published_at: '2024-01-09',
    cover_image: '/blog/bootcamp.webp',
    body: [
      {
        type: 'p',
        text: 'Are you ready to embark on an exhilarating journey towards becoming a successful entrepreneur? Look no further than Impulse Investment and Management Private Limited’s exclusive 20-Hour Entrepreneurship Bootcamp! Designed to equip aspiring entrepreneurs with valuable skills and knowledge, this event is a game-changer in the world of business.'
      },
      {
        type: 'image',
        url: '/blog/training-session.jpg',
        caption: 'Facilitators and participants during an intensive hands-on session at Kathmandu Technical School'
      },
      {
        type: 'h2',
        text: 'A Conducive Environment for Innovation & Growth'
      },
      {
        type: 'p',
        text: 'Organized by Impulse Investment and Management Private Limited, this intensive bootcamp was held at the prestigious Kathmandu Technical School. The venue provided a conducive environment for learning, collaboration, and inspiration.'
      },
      {
        type: 'p',
        text: 'With a total of 24 participants, this bootcamp brought together a diverse group of aspiring entrepreneurs eager to take their ideas to the next level. The discussions covered a wide range of topics crucial for entrepreneurial success, including personality development, communication and networking, stock market insights, branding and marketing strategies, human resources management, and the nuances of startup ideas and business plans.'
      },
      {
        type: 'h2',
        text: 'Renowned Facilitators and Real-World Insights'
      },
      {
        type: 'p',
        text: 'The highlight of the bootcamp was the exceptional expertise of the class facilitators. Renowned experts such as Mr. Chandra Saud, the former CEO of Nepal Stock Exchange, shared their extensive knowledge and insights on the stock market. Mrs. Bhuvi Bista, the former HR head of Khalti, provided invaluable guidance on human resources management. Educator Mr. Santosh Dhungana imparted his profound knowledge on the essential aspects of effective communication and networking. Additionally, former VJ Mr. Saurav Sharma shared his expertise on branding and marketing, while FNCCI member Mr. Manoj Poudel offered insightful tips on business planning.'
      },
      {
        type: 'quote',
        text: 'Entrepreneurship is not just about launching a venture; it is about building the financial clarity and strategic resilience to navigate uncertainty.'
      },
      {
        type: 'p',
        text: 'At the end of this transformative bootcamp, participants were awarded certificates of completion, highlighting their dedication and commitment to personal and professional growth. These certificates not only serve as a testament to their achievements but also as a valuable addition to their entrepreneurial portfolios.'
      },
      {
        type: 'p',
        text: 'Impulse Investment and Management Private Limited’s 20-Hour Entrepreneurship Bootcamp provided participants with the essential tools, knowledge, and confidence needed to succeed in the dynamic world of entrepreneurship. Whether you have a business idea waiting to be realized or are eager to enhance your entrepreneurial skills, this bootcamp is a stepping stone towards your goals. Join us in our next session, and unlock the entrepreneur within you!'
      }
    ]
  },
  {
    id: 'f-post-2',
    slug: 'the-future-of-students-in-jumla',
    title: 'The future of Students in Jumla',
    excerpt:
      'Over 200 students across schools in Jumla joined our Personality Development Program, led by CEO Achal Acharya — career counselling, future prospects, and the scope ahead in Nepal.',
    category: 'Community',
    author: 'Impulse Team',
    read_time: '2 min read',
    published_at: '2024-01-09',
    cover_image: '/blog/jumla.png',
    body: [
      {
        type: 'p',
        text: 'Impulse Investment and Management Private Limited, a renowned name in the field of training and consulting, recently conducted an impactful Personality Development Program in Jumla. Led by the dynamic CEO, Mr. Achal Acharya, a seasoned management practitioner, the program aimed to empower and guide the youth towards a brighter future.'
      },
      {
        type: 'image',
        url: '/blog/consulting-group.jpg',
        caption: 'CEO Achal Acharya delivering career guidance to students across Jumla schools'
      },
      {
        type: 'h2',
        text: 'Bridging the Opportunity Gap for Regional Youths'
      },
      {
        type: 'p',
        text: 'With the participation of over 200 students from various schools in Jumla, this program proved to be a game-changer for the aspiring individuals. The sessions covered a wide range of discussion topics, including career counseling, future prospects, scope in Nepal, and other crucial aspects relevant to the youths of today.'
      },
      {
        type: 'p',
        text: 'One of the highlights of the program was the emphasis on education in Kathmandu. Mr. Acharya shed light on the benefits and challenges of pursuing education and career opportunities in the capital city. The students gained valuable insights into the possibilities and potential challenges they might face, helping them make informed decisions.'
      },
      {
        type: 'quote',
        text: 'Every student in Nepal deserves access to clear guidance that connects their natural talent with viable economic opportunities.'
      },
      {
        type: 'p',
        text: 'The sessions took place in different schools across Jumla, ensuring maximum convenience and accessibility for the participants. The interactive and engaging nature of the program created a conducive learning environment, allowing the students to actively participate and extract the most from each session.'
      },
      {
        type: 'p',
        text: 'Overall, the Personality Development Program in Jumla proved to be a tremendous success. The students who attended not only gained valuable knowledge and insights but also developed essential life skills and self-confidence. Impulse Investment and Management Private Limited’s dedication to empowering the youth is commendable, and their efforts are sure to make a lasting impact on the lives of the participants.'
      }
    ]
  },
  {
    id: 'f-post-3',
    slug: 'entrepreneurship-and-start-up-mela',
    title: 'Entrepreneurship and Start-up Mela',
    excerpt:
      'Over 300 attendees, stalls run by our own trainees, and guests from the International Labour Organization, AYON, and FNCCI — a look back at our Start-up and Entrepreneurship Bootcamp.',
    category: 'Events',
    author: 'Impulse Team',
    read_time: '2 min read',
    published_at: '2024-01-08',
    cover_image: '/blog/mela.webp',
    body: [
      {
        type: 'p',
        text: 'Impulse Investment and Management Private Limited recently organized a highly successful Start-up and Entrepreneurship Bootcamp, garnering immense support from renowned organizations such as the International Labour Organization and the Association of Youth Organization Nepal. The event witnessed an impressive turnout, with over 300 aspiring entrepreneurs and individuals interested in start-ups attending.'
      },
      {
        type: 'image',
        url: '/blog/bootcamp.webp',
        caption: 'Trainee entrepreneurs demonstrating prototype products and business models to industry guests'
      },
      {
        type: 'h2',
        text: 'Showcasing Innovative Business Concepts'
      },
      {
        type: 'p',
        text: 'The event featured different stalls set up by the trainees, showcasing their innovative business ideas and products. These stalls served as a valuable opportunity for the participants to network and receive feedback from industry experts. Notably, the bootcamp also attracted esteemed guests including representatives from the Federation of Nepalese Chambers of Commerce and Industry (FNCCI), local ward offices, and other corporate personnel.'
      },
      {
        type: 'p',
        text: 'What made the event even more remarkable was its engagement with the education sector. School and college students were encouraged to visit the bootcamp, providing them with exposure to the world of start-ups and entrepreneurship. This initiative aimed to foster an entrepreneurial mindset among the youth, igniting their passion for innovation and enterprise.'
      }
    ]
  },
  {
    id: 'f-post-4',
    slug: 'unleashing-potential-personality-development-program-in-dhangadi',
    title: 'Unleashing Potential: Personality Development Program in Dhangadi',
    excerpt:
      'Over 300 students across schools in Dhangadi took part in sessions on career counselling, future prospects, and the growth opportunities Nepal presents.',
    category: 'Community',
    author: 'Impulse Team',
    read_time: '3 min read',
    published_at: '2024-01-08',
    cover_image: '/blog/dhangadi.webp',
    body: [
      {
        type: 'p',
        text: 'Have you ever wondered how to unlock your true potential and excel in your personal and professional life? Look no further than the Personality Development Program conducted by Impulse Investment and Management Private Limited. This life-changing program offers valuable insights and guidance to empower the youth of Dhangadi.'
      },
      {
        type: 'image',
        url: '/blog/training-session.jpg',
        caption: 'Interactive workshop on goal setting and personal mastery conducted in Dhangadi'
      },
      {
        type: 'h2',
        text: 'Visionary Leadership & Experiential Learning'
      },
      {
        type: 'p',
        text: 'Led by the visionary CEO of Impulse, Mr. Achal Acharya, this training session brings the expertise of a seasoned management practitioner. With his wealth of knowledge and experience, Mr. Acharya is dedicated to nurturing talent and creating leaders of tomorrow.'
      },
      {
        type: 'p',
        text: 'The impact of this program is undeniable, with over 300 students benefiting from the session. Held across various schools in Dhangadi, the program reaches out to young individuals seeking guidance and direction for their future.'
      },
      {
        type: 'quote',
        text: 'Confidence is built when preparation meets clear perspective on what the market needs.'
      },
      {
        type: 'p',
        text: 'The program focuses on equipping participants with the necessary skills, knowledge, and mindset to overcome challenges and seize opportunities. Through interactive sessions, students get to explore their interests, understand their strengths, and identify potential career paths.'
      }
    ]
  }
];
