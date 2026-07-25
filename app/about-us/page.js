export const metadata = {
  title: 'About Us',
  description:
    'Meet the Impulse Investment and Management team — corporate consulting, accounting, audits, and VAT filings for businesses across Nepal.'
};

export default function AboutPage() {
  return (
    <main>
        <section className="hero" id="top" style={{ minHeight: '400px', height: '50vh' }}>
          <div className="hero-bg-wrap">
            <img src="/newhero.webp" alt="" className="hero-bg" aria-hidden="true" width="1672" height="941" decoding="async" fetchPriority="high" />
          </div>
          <div className="hero-scrim" aria-hidden="true"></div>
          <div className="hero-container" style={{ justifyContent: 'flex-end', paddingBottom: '4rem' }}>
            <div className="hero-content" style={{ maxWidth: '100%' }}>
              <h1 className="hero-title" style={{ marginBottom: '0.5rem' }}>
                <span className="bold-text">About Us</span>
              </h1>
              <p className="hero-subheadline">We’re a Trusted and Professional Management Company</p>
            </div>
          </div>
        </section>

        {/* Who we are */}
        <section className="about-intro">
          <div className="about-intro-inner">
            <div className="about-intro-copy">
              <span className="about-tag">Who we are</span>
              <h2 className="about-intro-title">A trusted management &amp; consulting partner for Nepal&rsquo;s businesses</h2>
              <p>Impulse Investment and Management Pvt. Ltd. helps growing businesses, entrepreneurs, and corporate leaders navigate financial complexity with clarity. From business consulting to accounting, taxation, and VAT filing, we bring everything you need under one experienced team.</p>
              <p>We believe good numbers lead to good decisions. Our focus is simple &mdash; deliver efficient, effective, and economically viable solutions that fuel your growth while keeping you fully compliant.</p>
              <div className="about-intro-stats">
                <div><strong>50+</strong><span>Businesses served</span></div>
                <div><strong>4</strong><span>Core services</span></div>
                <div><strong>100%</strong><span>Compliance focus</span></div>
              </div>
            </div>
            <div className="about-intro-media">
              <img src="/about_office.jpg" alt="The Impulse team at work" width="640" height="480" loading="lazy" decoding="async" />
            </div>
          </div>
        </section>

        {/* Mission / Vision / Goal */}
        <section className="mvg">
          <div className="about-section-head">
            <span className="about-tag">What drives us</span>
            <h2>Our mission, vision &amp; goal</h2>
          </div>
          <div className="mvg-grid">
            <article className="mvg-card">
              <div className="mvg-icon"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" /></svg></div>
              <h3>Our Mission</h3>
              <p>To provide top-notch, quality services that exceed customer expectations &mdash; delivering efficient, effective, and economically viable solutions that contribute to our clients&rsquo; success and growth.</p>
              <ul className="mvg-list">
                <li><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Empower financial growth</li>
                <li><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Provide expert guidance</li>
                <li><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Enhance community well-being</li>
              </ul>
            </article>
            <article className="mvg-card mvg-card--accent">
              <div className="mvg-icon"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg></div>
              <h3>Our Vision</h3>
              <p>To be recognized as a leading provider of quality services, ensuring the utmost customer satisfaction through efficiency, effectiveness, and economic viability.</p>
              <ul className="mvg-list">
                <li><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Leadership in financial solutions</li>
                <li><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Client-centric excellence</li>
                <li><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Lasting, positive impact</li>
              </ul>
            </article>
            <article className="mvg-card">
              <div className="mvg-icon"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V4" /><path d="M4 5h13l-2 4 2 4H4" /></svg></div>
              <h3>Our Goal</h3>
              <p>To consistently deliver exceptional service and exceed client expectations through innovative solutions that optimize efficiency, effectiveness, and economic viability.</p>
              <ul className="mvg-list">
                <li><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Educational initiatives</li>
                <li><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Innovation &amp; adaptability</li>
                <li><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Sustainable growth</li>
              </ul>
            </article>
          </div>
        </section>

        {/* CEO */}
        <section className="ceo">
          <div className="ceo-inner">
            <div className="ceo-media">
              <img src="https://i.pravatar.cc/700?img=13" alt="Achal Acharya, Chief Executive Officer" width="700" height="875" loading="lazy" decoding="async" />
              <span className="ceo-badge">Chief Executive Officer</span>
            </div>
            <div className="ceo-body">
              <span className="about-tag">Leadership</span>
              <h2>Meet our CEO</h2>
              <p className="ceo-quote">&ldquo;Every business deserves a partner that treats its numbers &mdash; and its ambitions &mdash; as seriously as they do.&rdquo;</p>
              <p>Achal Acharya leads Impulse with a commitment to clarity, integrity, and results. Under his leadership, the firm has grown into a trusted name for consulting, accounting, and tax compliance across Nepal &mdash; helping 50+ businesses make smarter decisions with confidence.</p>
              <p>His approach blends deep financial expertise with a genuine understanding of what growing businesses need to move forward.</p>
              <div className="ceo-sign">
                <strong>Achal Acharya</strong>
                <span>Chief Executive Officer</span>
              </div>
            </div>
          </div>
        </section>

        {/* Board of Directors */}
        <section className="bod">
          <div className="about-section-head">
            <span className="about-tag">Governance</span>
            <h2>Board of Directors</h2>
            <p>The leadership team guiding Impulse&rsquo;s strategy, integrity, and long-term growth.</p>
          </div>
          <div className="bod-grid">
            <article className="bod-card">
              <div className="bod-photo"><img src="https://i.pravatar.cc/500?img=33" alt="Board director" width="500" height="500" loading="lazy" decoding="async" /></div>
              <div className="bod-info">
                <span className="bod-name">Board Member One</span>
                <span className="bod-role">Director</span>
                <div className="bod-socials"><a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg></a></div>
              </div>
            </article>
            <article className="bod-card">
              <div className="bod-photo"><img src="https://i.pravatar.cc/500?img=45" alt="Board director" width="500" height="500" loading="lazy" decoding="async" /></div>
              <div className="bod-info">
                <span className="bod-name">Board Member Two</span>
                <span className="bod-role">Director</span>
                <div className="bod-socials"><a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg></a></div>
              </div>
            </article>
            <article className="bod-card">
              <div className="bod-photo"><img src="https://i.pravatar.cc/500?img=15" alt="Board director" width="500" height="500" loading="lazy" decoding="async" /></div>
              <div className="bod-info">
                <span className="bod-name">Board Member Three</span>
                <span className="bod-role">Director</span>
                <div className="bod-socials"><a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg></a></div>
              </div>
            </article>
          </div>
        </section>
      </main>
  );
}
