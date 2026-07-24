/* ==========================================================================
   Impulse — site behavior & motion
   GSAP 3.13 · ScrollTrigger · ScrollSmoother · ScrollToPlugin
   Motion principles: snappy & precise, power3 easing, 0.8–1.2s durations
   ========================================================================== */

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

/* Full motion for all visitors — deliberately NOT reading the OS-level
   prefers-reduced-motion flag: Windows machines with "animation effects"
   turned off report it, which was leaving the whole site static (no smooth
   scroll, no entrance, frozen marquees). Restore the matchMedia check here
   if reduced-motion support is ever wanted again. */
const prefersReduced = false;
const header = document.getElementById('navbar');

/* --------------------------------------------------------------------------
   1. Smooth scrolling (disabled when the user prefers reduced motion)
   -------------------------------------------------------------------------- */
let smoother = null;

if (!prefersReduced) {
  smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.35,
    effects: true,
    smoothTouch: 0.14
  });

  // Subtle hero background parallax
  smoother.effects('.hero-bg', { speed: 0.85 });
}

/* --------------------------------------------------------------------------
   2. Navbar — glass background after slight scroll, hide down / show up
   -------------------------------------------------------------------------- */
let navLocked = false; // true while the mobile menu is open

ScrollTrigger.create({
  start: 0,
  end: 'max',
  onUpdate(self) {
    if (navLocked) return;
    const y = self.scroll();
    header.classList.toggle('header-scrolled', y > 64);
    if (self.direction === 1 && y > 160) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }
  }
});

/* Scrollspy — highlight the nav link of the section currently in view */
const navLinks = gsap.utils.toArray('.nav-link');

function setActiveLink(active) {
  navLinks.forEach(link => link.classList.toggle('active', link === active));
}

navLinks.forEach(link => {
  const hash = link.getAttribute('href');
  if (!hash || hash.length < 2) return;
  const section = document.querySelector(hash);
  if (!section) return;
  ScrollTrigger.create({
    trigger: section,
    start: 'top 45%',
    end: 'bottom 45%',
    onToggle(self) {
      if (self.isActive) setActiveLink(link);
    }
  });
});

/* Smooth anchor navigation with fixed-header offset */
const HEADER_OFFSET = 88;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (event) => {
    const hash = anchor.getAttribute('href');
    if (hash === '#') {
      event.preventDefault(); // placeholder links shouldn't jump the page
      return;
    }
    const target = document.querySelector(hash);
    if (!target) return;
    event.preventDefault();
    closeMobileMenu();
    if (smoother) {
      const y = Math.max(0, smoother.offset(target, `top ${HEADER_OFFSET}px`));
      gsap.to(smoother, { scrollTop: y, duration: 1.05, ease: 'power3.inOut', overwrite: 'auto' });
    } else {
      target.scrollIntoView({ block: 'start' });
    }
  });
});

/* --------------------------------------------------------------------------
   3. Mobile menu
   -------------------------------------------------------------------------- */
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

/* immediateRender: false — otherwise the paused timeline hides the links at
   page load, and the reduced-motion path (which never plays it) would leave
   the menu permanently empty */
const menuTl = gsap.timeline({ paused: true })
  .set(mobileMenu, { display: 'flex' })
  .fromTo(mobileMenu,
    { opacity: 0 },
    { opacity: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }
  )
  .fromTo('.mobile-link, .mobile-menu-cta',
    { y: 26, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.55, stagger: 0.06, ease: 'power3.out', immediateRender: false },
    '-=0.05'
  );
menuTl.eventCallback('onReverseComplete', () => gsap.set(mobileMenu, { display: 'none' }));

function openMobileMenu() {
  menuOpen = true;
  navLocked = true;
  header.classList.remove('header-hidden');
  navToggle.classList.add('is-open');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Close menu');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.documentElement.classList.add('no-scroll');
  if (smoother) smoother.paused(true);
  if (prefersReduced) {
    gsap.set(mobileMenu, { display: 'flex', opacity: 1 });
    gsap.set('.mobile-link, .mobile-menu-cta', { clearProps: 'all' });
  } else {
    menuTl.play(0);
  }
}

function closeMobileMenu() {
  if (!menuOpen) return;
  menuOpen = false;
  navLocked = false;
  navToggle.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open menu');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.documentElement.classList.remove('no-scroll');
  if (smoother) smoother.paused(false);
  if (prefersReduced) {
    gsap.set(mobileMenu, { display: 'none' });
  } else {
    menuTl.reverse();
  }
}

navToggle.addEventListener('click', () => (menuOpen ? closeMobileMenu() : openMobileMenu()));
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMobileMenu();
});

/* --------------------------------------------------------------------------
   4. Entrance & scroll-triggered reveals
   -------------------------------------------------------------------------- */
if (!prefersReduced) {
  const EASE = 'power3.out';

  /* Always open at the top so the entrance is actually seen — browsers
     otherwise restore the previous scroll position on reload and the
     intro plays off-screen. Deep links (#hash) are left alone. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);

  /* Hero entrance timeline — built paused (elements hold their hidden
     "from" states pre-paint) and played once the page is visible, so the
     intro can't finish before the first frame the visitor sees. */
  const heroTl = gsap.timeline({ paused: true, defaults: { ease: EASE } });
  heroTl
    .from('.nav-container', { y: -22, opacity: 0, duration: 0.8 })
    .from('.hero-title .thin-text', { y: 40, opacity: 0, duration: 0.9 }, '-=0.45')
    .from('.hero-title .bold-text', { y: 40, opacity: 0, duration: 0.9 }, '-=0.75')
    .from('.hero-subheadline', { y: 26, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.stat-box-glass', { y: 28, opacity: 0, duration: 0.8, clearProps: 'transform' }, '-=0.5')
    /* Slow settle on the hero image underneath the whole sequence */
    .fromTo('.hero-bg', { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'power2.out' }, 0);

  /* "50+" stat counter */
  const statNumber = document.querySelector('.stat-number');
  if (statNumber) {
    const counter = { value: 0 };
    heroTl.to(counter, {
      value: 50,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate() { statNumber.textContent = Math.round(counter.value) + '+'; }
    }, '-=0.7');
  }

  const startHero = () => {
    if (heroTl.progress() === 0 && !heroTl.isActive()) heroTl.play();
  };
  if (document.readyState === 'complete') {
    startHero();
  } else {
    window.addEventListener('load', startHero, { once: true });
    setTimeout(startHero, 2500); // safety net if a resource stalls the load event
  }

  /* Shared scroll-reveal helper — one pattern, consistent timing */
  const reveal = (targets, trigger, vars = {}) => {
    gsap.from(targets, {
      scrollTrigger: {
        trigger,
        start: 'top 85%', // Trigger slightly earlier
        once: true // Play animation once instead of scrubbing
      },
      y: 50,
      opacity: 0,
      duration: 1.0,
      ease: EASE,
      ...vars
    });
  };

  reveal('.services-header', '.section-services-grid', { y: 30 });
  /* Service cards: a clean one-time load-in that plays through on its own
     (NOT scrubbed to scroll, so it can never freeze half-slid or slide back
     out). Cards rise, fade, and settle up to full size, cascading left→right.
     gsap.from keeps the hidden state and the reveal tied to one ScrollTrigger. */
  if (document.querySelector('.services-grid-wrapper')) {
    gsap.from('.service-grid-card', {
      scrollTrigger: { trigger: '.services-grid-wrapper', start: 'top 82%', once: true },
      y: 52,
      opacity: 0,
      scale: 0.94,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12,
    });
  }
  if (document.querySelector('.services-page-card-row')) {
    gsap.from('.services-page-plan-card', {
      scrollTrigger: { trigger: '.services-page-card-row', start: 'top 84%', once: true },
      y: 44,
      opacity: 0,
      scale: 0.96,
      duration: 0.75,
      ease: 'power3.out',
      stagger: 0.1,
    });
  }
  gsap.from('.feature-card', {
    scrollTrigger: { trigger: '.cards-grid', start: 'top 85%', once: true },
    y: 60,
    x: (i) => i % 2 === 0 ? -40 : 40, // slide left and right
    opacity: 0,
    duration: 1.0,
    ease: 'power3.out',
    stagger: 0.2,
  });
  
  reveal('.team-header', '.section-team', { y: 30 });
  gsap.from('.team-member', {
    scrollTrigger: { trigger: '.team-grid', start: 'top 85%', once: true },
    y: 50,
    opacity: 0,
    duration: 1.0,
    ease: 'power3.out',
    stagger: 0.15,
  });

  reveal('.testimonials-header-container', '.section-testimonials', { y: 30 });
  reveal('.testimonials-marquee-wrapper', '.testimonials-marquee-wrapper', { y: 34 });
  /* Continuous scroll-linked depth and parallax. */
  const scrollMotion = gsap.matchMedia();

  scrollMotion.add('(min-width: 769px)', () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.1
      }
    })
      .to('.hero-content', { yPercent: -18, opacity: 0.35, ease: 'none' }, 0)
      /* fromTo + immediateRender:false: the intro sets .stat-box-glass to
         opacity 0 pre-paint, so a plain .to() would capture 0 as its scrub
         start and leave the box invisible back at the top. Pin the start to 1. */
      .fromTo('.stat-box-glass',
        { yPercent: 0, opacity: 1 },
        { yPercent: -25, opacity: 0.35, ease: 'none', immediateRender: false }, 0)
      .to('.hero-bg', { scale: 1.07, ease: 'none' }, 0);

    gsap.utils.toArray('.service-grid-card img').forEach(image => {
      gsap.fromTo(image,
        { yPercent: -5, scale: 1.05 },
        {
          yPercent: 5,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: {
            trigger: image.closest('.service-grid-card'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        }
      );
    });

  });

  scrollMotion.add('(max-width: 768px)', () => {
    gsap.to('.hero-bg', {
      yPercent: 7,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8
      }
    });
  });

  /* The redesigned CTA opens in layered phases as it enters the viewport. */
  gsap.timeline({
    scrollTrigger: {
      trigger: '.footer-cta-card',
      start: 'top 94%',
      end: 'top 48%',
      scrub: 0.9
    }
  })
    .from('.footer-cta-card', { y: 65, scale: 0.965, opacity: 0, ease: 'none' }, 0)
    .from('.footer-cta-copy', { x: -55, opacity: 0, ease: 'none' }, 0.08)
    .from('.footer-cta-services span', { y: 18, opacity: 0, stagger: 0.12, ease: 'none' }, 0.2)
    .from('.footer-cta-action', { x: 75, opacity: 0, ease: 'none' }, 0.14)
    .from('.footer-cta-action > *', { y: 20, opacity: 0, stagger: 0.1, ease: 'none' }, 0.35);

  reveal('.footer-columns-grid > .footer-col', '.footer-columns-grid', { y: 34, stagger: 0.12 });
  reveal('.footer-bottom-bar', '.footer-bottom-bar', { y: 24 });

  /* Marquees — GSAP-driven instead of CSS keyframes so they tick in the same
     rAF as ScrollSmoother (CSS animations jitter inside the smoothed content).
     Tracks hold two identical sets; xPercent -50 = exactly one set = seamless.
     direction 1 scrolls left-to-right, -1 right-to-left. */
  const buildMarquee = (selector, direction, duration) => {
    const track = document.querySelector(selector);
    if (!track) return;
    const tween = direction === 1
      ? gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, ease: 'none', duration, repeat: -1 })
      : gsap.to(track, { xPercent: -50, ease: 'none', duration, repeat: -1 });
    // Ease the row to a stop on hover instead of freezing abruptly
    const row = track.parentElement;
    row.addEventListener('mouseenter', () => gsap.to(tween, { timeScale: 0, duration: 0.4, overwrite: true }));
    row.addEventListener('mouseleave', () => gsap.to(tween, { timeScale: 1, duration: 0.4, overwrite: true }));
  };

  buildMarquee('.trust-ticker-track', -1, 32);
  buildMarquee('.row-left .marquee-track', -1, 60);
  buildMarquee('.row-right .marquee-track', 1, 60);

  /* NOTE: the 3D umbrella pin/scrub animation lives in the inline script at
     the bottom of index.html — do not duplicate it here. Pinning the same
     section from two places double-wraps it in spacers and breaks the page. */

  /* Rain for the umbrella section — light streaks the umbrella "shields" the
     service items from. Runs only while the section is on screen. */
  const rainLayer = document.querySelector('.umbrella-rain');
  if (rainLayer) {
    const dropTweens = [];
    const dropCount = window.innerWidth < 768 ? 14 : 26;
    for (let i = 0; i < dropCount; i++) {
      const drop = document.createElement('span');
      drop.className = 'rain-drop';
      const height = gsap.utils.random(22, 44);
      drop.style.height = height + 'px';
      drop.style.left = gsap.utils.random(1, 99) + '%';
      drop.style.opacity = gsap.utils.random(0.35, 0.8);
      rainLayer.appendChild(drop);
      dropTweens.push(gsap.fromTo(drop,
        { y: -height },
        {
          y: () => rainLayer.clientHeight + height,
          duration: gsap.utils.random(1.8, 3.2),
          delay: gsap.utils.random(0, 3),
          repeat: -1,
          ease: 'none',
          paused: true
        }
      ));
    }
    ScrollTrigger.create({
      trigger: '.section-umbrella',
      start: 'top bottom',
      end: 'bottom top',
      onToggle(self) { dropTweens.forEach(t => (self.isActive ? t.play() : t.pause())); }
    });
  }

  /* Umbrella scene — the outline draws itself in, arrows shoot out of the
     canopy, and the four service labels float up at the arrow tips, then
     keep gently bobbing. */
}

/* Recalculate trigger positions once all images have loaded */
window.addEventListener('load', () => ScrollTrigger.refresh());
