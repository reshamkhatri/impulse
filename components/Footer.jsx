import Link from 'next/link';

/* The government and regulator portals clients get pointed at most often.
   Labels are shortened to the names people use, because the footer column is
   too narrow for the full official titles. */
const QUICK_LINKS = [
  { label: 'Inland Revenue (IRD)', href: 'https://ird.gov.np/' },
  { label: 'Company Registrar', href: 'https://camis.ocr.gov.np/login' },
  { label: 'Ministry of Finance', href: 'https://mof.gov.np/' },
  { label: 'Nepal Rastra Bank', href: 'https://www.nrb.org.np/' },
  { label: 'Ministry of Labour', href: 'https://www.moless.gov.np/' }
];

/* Shared site footer. Lives inside #smooth-content (see app/layout.js) because
   ScrollSmoother has to own everything that scrolls. */
export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="section-container">

        {/* Branded consultation CTA */}
        <div className="footer-cta-card">
          <div className="footer-cta-copy">
            <span className="footer-cta-kicker"><i></i> Ready to move forward?</span>
            <h2 className="footer-cta-title">Clear numbers. Smarter decisions. <span>Stronger growth.</span></h2>
            <p className="footer-cta-desc">Bring your accounting, tax compliance, and business strategy under one experienced team in Nepal.</p>
            <div className="footer-cta-services" aria-label="Consultation services">
              <span>Business consulting</span>
              <span>Accounting</span>
              <span>Tax &amp; VAT</span>
            </div>
          </div>

          <div className="footer-cta-action">
            <span className="footer-cta-action-label">Your next step</span>
            <h3>Start with a free consultation.</h3>
            <p>Tell us where your business is today and where you want it to go.</p>
            <a href="mailto:info@impulsenepal.com?subject=Free%20Consultation%20Request" className="btn-pill-white">
              <span>Book a consultation</span>
              <span className="btn-arrow-icon" aria-hidden="true">&rarr;</span>
            </a>
            <span className="footer-cta-note">Usually replies within one business day.</span>
          </div>
        </div>

        {/* Main Footer Columns Grid */}
        <div className="footer-columns-grid">
          {/* Col 1: Branding */}
          <div className="footer-col brand-col">
            <img src="/logo.webp" alt="Impulse Logo" className="footer-logo" width="430" height="85" decoding="async" loading="lazy" />
            <p className="footer-brand-text">Nepali corporate consulting, accounting, audits, and VAT filings tailored for strategic growth.</p>
            <div className="footer-social-row">
              {/* Inline SVG social icons representing the mockup style (f, in, ig, tg) */}
              <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"></path>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"></path>
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Company Links */}
          <div className="footer-col links-col">
            <h3 className="footer-col-header">Company</h3>
            <nav className="footer-links-nav">
              <Link href="/">Home</Link>
              <Link href="/about-us">About Us</Link>
              <Link href="/services">Services</Link>
              <Link href="/blog">Blogs &amp; Articles</Link>
              <a href="#contact">Contact</a>
            </nav>
          </div>

          {/* Col 3: Product/Services Links */}
          <div className="footer-col links-col">
            <h3 className="footer-col-header">Services</h3>
            <nav className="footer-links-nav">
              <Link href="/services">Company Compliance</Link>
              <Link href="/services">Accounting &amp; Bookkeeping</Link>
              <Link href="/services">Tax &amp; VAT Filing</Link>
              <Link href="/services">Other Services</Link>
            </nav>
          </div>

          {/* Col 4: the government portals clients are most often sent to.
              All external, so they open in a new tab and carry noreferrer. */}
          <div className="footer-col links-col">
            <h3 className="footer-col-header">Quick Links</h3>
            <nav className="footer-links-nav">
              {QUICK_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

        </div>

        {/* Floating Capsule Bottom Footer Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copy-text">
            &copy; 2026 Impulse. All rights reserved.
          </div>
          <nav className="footer-bottom-nav">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Security</a>
            <a href="#">Cookie Policy</a>
          </nav>
        </div>

      </div>
    </footer>
  );
}
