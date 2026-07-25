'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* One nav for the whole site. The old static pages each hand-maintained their
   own copy, which had drifted — about-us.html pointed its logo at "#top" and
   linked Testimonials to a section that only exists on the home page. Links are
   derived from the current route here so they can't fall out of sync again.

   Hash-only hrefs are deliberate: app.js intercepts `a[href^="#"]` to run the
   smooth-scroll, so in-page anchors must stay bare hashes. Cross-page targets
   go through <Link> for a client-side route change. */
export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  // On the home page these are in-page anchors; elsewhere they're a route hop.
  const testimonials = isHome ? '#testimonials' : '/#testimonials';
  const home = isHome ? '#top' : '/';

  const navLink = (active) => `nav-link${active ? ' active' : ''}`;

  return (
    <>
      {/* Glassmorphic Navigation Header */}
      <header className="header" id="navbar">
        <div className="nav-container">

          {/* Brand Logo */}
          {isHome ? (
            <a href="#top" className="logo">
              <img src="/logo.webp" alt="Impulse Logo" className="logo-img" width="430" height="85" decoding="async" />
            </a>
          ) : (
            <Link href="/" className="logo">
              <img src="/logo.webp" alt="Impulse Logo" className="logo-img" width="430" height="85" decoding="async" />
            </Link>
          )}

          {/* Navigation Links */}
          <nav className="nav-menu">
            {isHome
              ? <a href="#top" className={navLink(true)}>Home</a>
              : <Link href="/" className={navLink(false)}>Home</Link>}
            <Link href="/about-us" className={navLink(pathname === '/about-us')}>About Us</Link>
            <Link href="/services" className={navLink(pathname === '/services')}>Services</Link>
            {isHome
              ? <a href="#testimonials" className={navLink(false)}>Testimonials</a>
              : <Link href={testimonials} className={navLink(false)}>Testimonials</Link>}
          </nav>

          {/* Actions Block */}
          <div className="nav-actions">
            <a href="#contact" className="contact-btn">Contact Us</a>
            {/* Hamburger toggle (mobile / tablet) */}
            <button className="nav-toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
              <span className="nav-toggle-line"></span>
              <span className="nav-toggle-line"></span>
            </button>
          </div>

        </div>
      </header>

      {/* Full-screen Mobile Menu Overlay */}
      <div className="mobile-menu" id="mobile-menu" aria-hidden="true">
        <nav className="mobile-menu-nav">
          {isHome
            ? <a href="#top" className="mobile-link">Home</a>
            : <Link href={home} className="mobile-link">Home</Link>}
          <Link href="/about-us" className="mobile-link">About Us</Link>
          <Link href="/services" className="mobile-link">Services</Link>
          {isHome
            ? <a href="#testimonials" className="mobile-link">Testimonials</a>
            : <Link href={testimonials} className="mobile-link">Testimonials</Link>}
          <a href="#contact" className="mobile-link">Contact</a>
        </nav>
        <a href="#contact" className="contact-btn mobile-menu-cta">Get A Free Consultation</a>
      </div>
    </>
  );
}
