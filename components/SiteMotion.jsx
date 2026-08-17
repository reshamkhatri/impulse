'use client';

/* ==========================================================================
   Impulse — site behavior & motion
   GSAP · ScrollTrigger · ScrollSmoother · ScrollToPlugin
   Motion principles: snappy & precise, power3 easing, 0.8–1.2s durations

   Ported from the old static app.js. The important difference under Next: the
   root layout persists across route changes, so everything below is built
   inside a gsap.context() keyed on the pathname and reverted on the way out.
   Without that, each navigation would stack a second set of ScrollTriggers and
   a second ScrollSmoother on top of the last.
   ========================================================================== */

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* ScrollSmoother is NOT imported here. It only ever runs on pointer devices
   (see the isTouch branch below), so a static import meant every phone paid to
   download and parse a plugin it would never instantiate. It now arrives via a
   dynamic import inside the desktop branch, which Next splits into its own
   chunk. ScrollToPlugin is gone entirely — the one place that needed it was the
   no-smoother anchor path, which now uses native smooth scrolling instead
   (compositor-driven, so it's also smoother on phones than a JS tween). */
gsap.registerPlugin(ScrollTrigger);

/* Layout effect so the "from" states are set before the browser paints —
   with a plain useEffect the page paints fully visible for one frame and then
   snaps to hidden as the intro starts. useEffect on the server to keep React
   from warning during SSR. */
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function SiteMotion() {
  const pathname = usePathname();
  const firstLoad = useRef(true);
  const ctxCleanup = useRef(null);

  useIsoLayoutEffect(() => {
    /* Full motion for all visitors — deliberately NOT reading the OS-level
       prefers-reduced-motion flag: Windows machines with "animation effects"
       turned off report it, which was leaving the whole site static (no smooth
       scroll, no entrance, frozen marquees). Restore the matchMedia check here
       if reduced-motion support is ever wanted again. */
    const prefersReduced = false;

    /* Touch devices scroll natively. ScrollSmoother's smoothTouch replaces the
       phone's compositor-driven scroll with main-thread JS transforms, which is
       what made the site feel laggy and rubber-bandy on mobile — the browser can
       no longer scroll while JS is busy. Phones keep native scroll; ScrollTrigger
       still drives every reveal exactly as before. */
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    const header = document.getElementById('navbar');
    if (!header) return;

    let navLocked = false; // true while the mobile menu is open
    let menuOpen = false;
    let smoother = null;
    let closeMobileMenu = () => {};
    /* Guards the async ScrollSmoother import below: a route change can land
       while its chunk is still in flight, and creating a smoother against a DOM
       that React has already swapped out leaves a stuck scroll position. */
    let cancelled = false;

    const ctx = gsap.context(() => {
      /* ----------------------------------------------------------------
         1. Smooth scrolling (desktop pointers only)
         ---------------------------------------------------------------- */
      if (!prefersReduced && !isTouch) {
        /* Fetched rather than bundled — see the note by the imports. The page is
           still at scroll 0 while the intro plays, and a smoother that takes
           over a page at scroll 0 does so seamlessly, so landing a beat late
           costs nothing visible. Everything below this block is built
           synchronously either way, so no reveal waits on the network. */
        import('gsap/ScrollSmoother').then(({ ScrollSmoother }) => {
          if (cancelled) return;
          gsap.registerPlugin(ScrollSmoother);

          /* ctx.add() rather than a bare create(): gsap.context() only collects
             what the synchronous callback creates, so a smoother built inside
             this promise would escape ctx.revert() and survive the route change
             that was supposed to kill it. */
          ctx.add(() => {
            /* `smooth` is how long the content takes to catch up to where the
               real scroll position already is. At 1.35 the page trailed a wheel
               flick by well over a second, which does not read as smoothness —
               it reads as the page being slow to respond, and it is the one
               scroll behaviour that exists on pointer devices and nowhere else.
               0.9 keeps the glide but puts the content back under the visitor's
               hand. Raise it toward 1.2 for a floatier feel, drop toward 0.6
               for near-native. */
            smoother = ScrollSmoother.create({
              wrapper: '#smooth-wrapper',
              content: '#smooth-content',
              smooth: 0.9,
              effects: true,
              smoothTouch: 0
            });

            // Subtle hero background parallax
            if (document.querySelector('.hero-bg')) {
              smoother.effects('.hero-bg', { speed: 0.85 });
            }
          });
        });
      }

      /* ----------------------------------------------------------------
         2. Navbar — glass background after slight scroll, hide down / show up
         ---------------------------------------------------------------- */
      /* Runs on every scroll frame, so it tracks the two class states itself and
         only touches the DOM when one actually flips. Writing the same class list
         back 60+ times a second is work the compositor doesn't need. */
      let isScrolled = false;
      let isHidden = false;

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate(self) {
          if (navLocked) return;
          const y = self.scroll();

          const scrolled = y > 64;
          if (scrolled !== isScrolled) {
            isScrolled = scrolled;
            header.classList.toggle('header-scrolled', scrolled);
          }

          const hidden = self.direction === 1 && y > 160;
          if (hidden !== isHidden) {
            isHidden = hidden;
            header.classList.toggle('header-hidden', hidden);
          }
        }
      });

      /* Scrollspy — highlight the nav link of the section currently in view */
      const navLinks = gsap.utils.toArray('.nav-link');

      function setActiveLink(active) {
        navLinks.forEach((link) => link.classList.toggle('active', link === active));
      }

      navLinks.forEach((link) => {
        const hash = link.getAttribute('href');
        if (!hash || hash.length < 2 || hash[0] !== '#') return;
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

      /* ----------------------------------------------------------------
         3. Mobile menu
         ---------------------------------------------------------------- */
      const navToggle = document.getElementById('nav-toggle');
      const mobileMenu = document.getElementById('mobile-menu');

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
        isHidden = false; // keeps the scroll handler's cached state honest
        navToggle.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Close menu');
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.documentElement.classList.add('no-scroll');
        if (smoother) smoother.paused(true);
        menuTl.play(0);
      }

      closeMobileMenu = function () {
        if (!menuOpen) return;
        menuOpen = false;
        navLocked = false;
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.documentElement.classList.remove('no-scroll');
        if (smoother) smoother.paused(false);
        menuTl.reverse();
      };

      const onToggleClick = () => (menuOpen ? closeMobileMenu() : openMobileMenu());
      const onKeydown = (event) => { if (event.key === 'Escape') closeMobileMenu(); };
      navToggle.addEventListener('click', onToggleClick);
      window.addEventListener('keydown', onKeydown);

      /* Smooth anchor navigation with fixed-header offset. Only same-page
         hashes — cross-route links are <Link>s and must reach the router. */
      const HEADER_OFFSET = 88;
      const anchors = gsap.utils.toArray('a[href^="#"]');
      const anchorHandlers = [];

      anchors.forEach((anchor) => {
        const handler = (event) => {
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
            /* Native rather than a ScrollToPlugin tween. The browser runs this
               on the compositor, so it keeps gliding while the main thread is
               busy — exactly the condition (hydration, image decode, the
               umbrella build) under which a JS-driven scroll stutters on a
               phone. It also drops the plugin from the bundle entirely. */
            const y = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
            window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
          }
        };
        anchor.addEventListener('click', handler);
        anchorHandlers.push([anchor, handler]);
      });

      /* ----------------------------------------------------------------
         4. Entrance & scroll-triggered reveals
         ---------------------------------------------------------------- */
      const EASE = 'power3.out';

      /* Always open at the top so the entrance is actually seen. Deep links
         (#hash) are left alone. */
      if (firstLoad.current && !window.location.hash) window.scrollTo(0, 0);

      /* Hero entrance timeline — built paused (elements hold their hidden
         "from" states pre-paint) and played once the page is visible, so the
         intro can't finish before the first frame the visitor sees. */
      const heroTl = gsap.timeline({ paused: true, defaults: { ease: EASE } });
      heroTl.from('.nav-container', { y: -22, opacity: 0, duration: 0.8 });

      if (document.querySelector('.hero-title .thin-text')) {
        heroTl
          .from('.hero-title .thin-text', { y: 40, opacity: 0, duration: 0.9 }, '-=0.45')
          .from('.hero-title .bold-text', { y: 40, opacity: 0, duration: 0.9 }, '-=0.75')
          .from('.hero-subheadline', { y: 26, opacity: 0, duration: 0.8 }, '-=0.6');
      }
      if (document.querySelector('.stat-box-glass')) {
        heroTl.from('.stat-box-glass', { y: 28, opacity: 0, duration: 0.8, clearProps: 'transform' }, '-=0.5');
      }
      if (document.querySelector('.hero-bg')) {
        /* Slow settle on the hero image underneath the whole sequence */
        heroTl.fromTo('.hero-bg', { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'power2.out' }, 0);
      }

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
      heroTl.play();

      /* Shared scroll-reveal helper — one pattern, consistent timing */
      const reveal = (targets, trigger, vars = {}) => {
        if (!document.querySelector(trigger)) return;
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

      /* Mission / vision / goal — a choreographed entrance rather than one
         blanket fade: the eyebrow rule draws itself out, the heading lifts,
         the cards float up and come into focus, then each card's accent edge
         wipes across and its icon pops in. Overlapping starts (the negative
         offsets) are what make it read as one continuous move. */
      if (document.querySelector('.section-pillars')) {
        const pillarsTl = gsap.timeline({
          scrollTrigger: { trigger: '.section-pillars', start: 'top 80%', once: true },
          defaults: { ease: 'power3.out' }
        });

        pillarsTl
          .from('.pillars-headline', { y: 28, opacity: 0, duration: 0.85 })
          /* Each rule draws itself left→right, and the column's contents follow
             it up in sequence — the overlapping starts are what make three
             columns read as one continuous move rather than three fades. */
          .from('.pillar-rule', {
            scaleX: 0, transformOrigin: 'left center',
            duration: 0.95, stagger: 0.13
          }, '-=0.45')
          .from('.pillar-icon', {
            y: 18, opacity: 0, duration: 0.75, stagger: 0.13
          }, '-=0.75')
          .from('.pillar-label', { y: 18, opacity: 0, duration: 0.65, stagger: 0.13 }, '-=0.62')
          .from('.pillar-line', { y: 16, opacity: 0, duration: 0.65, stagger: 0.13 }, '-=0.52');
      }

      reveal('.services-header', '.section-services-grid', { y: 30 });
      /* Service cards: a clean one-time load-in that plays through on its own
         (NOT scrubbed to scroll, so it can never freeze half-slid or slide back
         out). Cards rise, fade, and settle up to full size, cascading left→right. */
      if (document.querySelector('.services-grid-wrapper')) {
        gsap.from('.service-grid-card', {
          scrollTrigger: { trigger: '.services-grid-wrapper', start: 'top 82%', once: true },
          y: 52, opacity: 0, scale: 0.94, duration: 0.8, ease: 'power3.out', stagger: 0.12,
          // see note on the plan cards — the leftover inline transform would
          // otherwise outrank .service-grid-card:hover and kill the lift
          clearProps: 'transform'
        });
      }
      /* The three plan cards rise as one row — a stagger here left them visibly
         out of line while it played, which read as a layout bug. clearProps
         drops GSAP's inline transform at the end; without it the leftover
         inline style outranks the CSS :hover rule and the lift never fires. */
      if (document.querySelector('.services-page-card-row')) {
        gsap.from('.services-page-plan-card', {
          scrollTrigger: { trigger: '.services-page-card-row', start: 'top 84%', once: true },
          y: 44, opacity: 0, scale: 0.96, duration: 0.85, ease: 'power3.out',
          clearProps: 'transform'
        });
      }
      if (document.querySelector('.cards-grid')) {
        gsap.from('.feature-card', {
          scrollTrigger: { trigger: '.cards-grid', start: 'top 85%', once: true },
          y: 60,
          x: (i) => (i % 2 === 0 ? -40 : 40), // slide left and right
          opacity: 0, duration: 1.0, ease: 'power3.out', stagger: 0.2
        });
      }

      /* Blog index — heading, then the lead post, then the grid cascades in.
         Built as one timeline so the whole page settles as a single move. */
      /* Blog index — headline, toolbar, featured hero, and cascading cards */
      if (document.querySelector('.blog-index')) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        if (document.querySelector('.blog-headline')) {
          tl.from('.blog-headline', { y: 28, opacity: 0, duration: 0.75 });
        }
        if (document.querySelector('.blog-sub')) {
          tl.from('.blog-sub', { y: 20, opacity: 0, duration: 0.65 }, '-=0.5');
        }
        if (document.querySelector('.blog-toolbar')) {
          tl.from('.blog-toolbar', { y: 16, opacity: 0, duration: 0.6 }, '-=0.45');
        }
        if (document.querySelector('.blog-hero-card')) {
          tl.from('.blog-hero-card', { y: 36, opacity: 0, duration: 0.85, clearProps: 'transform' }, '-=0.4');
        }
        if (document.querySelectorAll('.blog-grid .blog-card').length) {
          tl.from('.blog-grid .blog-card', {
            y: 32, opacity: 0, duration: 0.75, stagger: 0.1, clearProps: 'transform'
          }, '-=0.5');
        }
        if (document.querySelector('.blog-promo-card')) {
          tl.from('.blog-promo-card', { y: 28, opacity: 0, duration: 0.75, clearProps: 'transform' }, '-=0.4');
        }
      }

      /* Article — back button, meta, title, standfirst, hero cover, and body */
      if (document.querySelector('.article')) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        if (document.querySelector('.article-back')) {
          tl.from('.article-back', { x: -14, opacity: 0, duration: 0.55 });
        }
        if (document.querySelector('.article-meta-top')) {
          tl.from('.article-meta-top', { y: 16, opacity: 0, duration: 0.55 }, '-=0.35');
        }
        if (document.querySelector('.article-title')) {
          tl.from('.article-title', { y: 28, opacity: 0, duration: 0.8 }, '-=0.4');
        }
        if (document.querySelector('.article-standfirst')) {
          tl.from('.article-standfirst', { y: 20, opacity: 0, duration: 0.65 }, '-=0.55');
        }
        if (document.querySelector('.article-author-row')) {
          tl.from('.article-author-row', { y: 16, opacity: 0, duration: 0.55 }, '-=0.45');
        }
        if (document.querySelector('.article-cover')) {
          tl.from('.article-cover', { y: 32, opacity: 0, duration: 0.8, clearProps: 'transform' }, '-=0.45');
        }
        if (document.querySelector('.article-body')) {
          tl.from('.article-body', { y: 36, opacity: 0, duration: 0.85, clearProps: 'transform' }, '-=0.5');
        }

        reveal('.article-cta', '.article-cta', { y: 30 });
        reveal('.article-more', '.article-more', { y: 30 });
      }

      reveal('.team-header', '.section-team', { y: 30 });
      if (document.querySelector('.team-grid')) {
        gsap.from('.team-member', {
          scrollTrigger: { trigger: '.team-grid', start: 'top 85%', once: true },
          y: 50, opacity: 0, duration: 1.0, ease: 'power3.out', stagger: 0.15
        });
      }

      reveal('.testimonials-header-container', '.section-testimonials', { y: 30 });
      reveal('.testimonials-marquee-wrapper', '.testimonials-marquee-wrapper', { y: 34 });

      /* Continuous scroll-linked depth and parallax. */
      const scrollMotion = gsap.matchMedia();

      scrollMotion.add('(min-width: 769px)', () => {
        if (document.querySelector('.hero')) {
          gsap.timeline({
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.1 }
          })
            .to('.hero-content', { yPercent: -18, opacity: 0.35, ease: 'none' }, 0)
            /* fromTo + immediateRender:false: the intro sets .stat-box-glass to
               opacity 0 pre-paint, so a plain .to() would capture 0 as its scrub
               start and leave the box invisible back at the top. Pin the start to 1. */
            .fromTo('.stat-box-glass',
              { yPercent: 0, opacity: 1 },
              { yPercent: -25, opacity: 0.35, ease: 'none', immediateRender: false }, 0)
            .to('.hero-bg', { scale: 1.07, ease: 'none' }, 0);
        }

        gsap.utils.toArray('.service-grid-card img').forEach((image) => {
          gsap.fromTo(image,
            { yPercent: -5, scale: 1.05 },
            {
              yPercent: 5, scale: 1.05, ease: 'none',
              scrollTrigger: {
                trigger: image.closest('.service-grid-card'),
                start: 'top bottom', end: 'bottom top', scrub: 1
              }
            }
          );
        });
      });

      /* No mobile hero parallax. It was the only scroll-linked transform still
         running while a phone scrolls the very first screen — the moment the
         main thread is already busiest with hydration and image decode — and it
         bought 7% of drift on an image that is mostly off-screen by then. The
         hero keeps its scale-settle entrance (heroTl above), which plays on its
         own clock and stops. Desktop parallax is untouched. */

      /* The redesigned CTA opens in layered phases as it enters the viewport.

         Desktop scrubs it to the scroll position. Phones play it once on entry
         instead: a scrubbed timeline recomputes and writes five elements' worth
         of transforms on every scroll frame, and it does that inside the same
         frame the phone is trying to carry a fling. Played once, the identical
         choreography runs on its own clock and then stops touching the DOM
         forever, which is the single biggest source of scroll jank removed. */
      if (document.querySelector('.footer-cta-card')) {
        scrollMotion.add('(min-width: 769px)', () => {
          gsap.timeline({
            scrollTrigger: { trigger: '.footer-cta-card', start: 'top 94%', end: 'top 48%', scrub: 0.9 }
          })
            .from('.footer-cta-card', { y: 65, scale: 0.965, opacity: 0, ease: 'none' }, 0)
            .from('.footer-cta-copy', { x: -55, opacity: 0, ease: 'none' }, 0.08)
            .from('.footer-cta-services span', { y: 18, opacity: 0, stagger: 0.12, ease: 'none' }, 0.2)
            .from('.footer-cta-action', { x: 75, opacity: 0, ease: 'none' }, 0.14)
            .from('.footer-cta-action > *', { y: 20, opacity: 0, stagger: 0.1, ease: 'none' }, 0.35);
        });

        scrollMotion.add('(max-width: 768px)', () => {
          gsap.timeline({
            scrollTrigger: { trigger: '.footer-cta-card', start: 'top 88%', once: true },
            defaults: { ease: 'power3.out' }
          })
            .from('.footer-cta-card', { y: 42, opacity: 0, duration: 0.7, clearProps: 'transform' })
            .from('.footer-cta-copy', { y: 24, opacity: 0, duration: 0.6 }, '-=0.45')
            .from('.footer-cta-services span', { y: 14, opacity: 0, duration: 0.5, stagger: 0.07 }, '-=0.4')
            .from('.footer-cta-action > *', { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.35');
        });
      }

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

        const row = track.parentElement;

        /* Only animate while the row is on screen — an infinite tween keeps
           ticking (and keeps the compositor busy) no matter where the page is. */
        tween.pause();
        ScrollTrigger.create({
          trigger: row,
          start: 'top bottom',
          end: 'bottom top',
          /* .is-drifting carries the will-change (see globals.css). Promoting
             the layer here rather than in the base rule means these very wide
             tracks only occupy GPU memory while they are on screen and moving,
             instead of from first paint until the visitor leaves. */
          onToggle(self) {
            self.isActive ? tween.play() : tween.pause();
            track.classList.toggle('is-drifting', self.isActive);
          }
        });

        // Ease the row to a stop on hover instead of freezing abruptly.
        // Pointless on touch, where there is no hover state to enter.
        if (isTouch) return;
        row.addEventListener('mouseenter', () => gsap.to(tween, { timeScale: 0, duration: 0.4, overwrite: true }));
        row.addEventListener('mouseleave', () => gsap.to(tween, { timeScale: 1, duration: 0.4, overwrite: true }));
      };

      buildMarquee('.trust-ticker-track', -1, 32);
      buildMarquee('.row-left .marquee-track', -1, 60);
      buildMarquee('.row-right .marquee-track', 1, 60);

      /* The rain layer that used to live here is gone: the sunny sky replaced it
         and the stylesheet hides .umbrella-rain outright, so building 26 drop
         elements and 26 infinite tweens for it was work nothing could ever see. */

      /* The drifting cloud bands are CSS animations, paused by default in the
         stylesheet. Run them only while their section is on screen — three
         full-width composited layers are not free to keep drifting off-screen. */
      const umbrellaSection = document.querySelector('.section-umbrella');
      if (umbrellaSection) {
        ScrollTrigger.create({
          trigger: umbrellaSection,
          start: 'top bottom',
          end: 'bottom top',
          onToggle(self) { umbrellaSection.classList.toggle('sky-active', self.isActive); }
        });
      }

      /* Carousel drag-to-scroll (services / about pages) */
      const carousel = document.querySelector('.strategic-carousel');
      if (carousel) {
        let isDown = false, startX = 0, scrollLeft = 0;
        const down = (e) => {
          isDown = true;
          carousel.style.scrollSnapType = 'none'; // disable snap while dragging
          startX = e.pageX - carousel.offsetLeft;
          scrollLeft = carousel.scrollLeft;
        };
        const stop = () => { isDown = false; carousel.style.scrollSnapType = 'x mandatory'; };
        const move = (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - carousel.offsetLeft;
          carousel.scrollLeft = scrollLeft - (x - startX) * 2; // scroll-fast
        };
        carousel.addEventListener('mousedown', down);
        carousel.addEventListener('mouseleave', stop);
        carousel.addEventListener('mouseup', stop);
        carousel.addEventListener('mousemove', move);
      }

      /* Recalculate trigger positions once late images have settled */
      ScrollTrigger.refresh();

      // Listeners added on nodes GSAP doesn't own need explicit teardown.
      ctxCleanup.current = () => {
        navToggle.removeEventListener('click', onToggleClick);
        window.removeEventListener('keydown', onKeydown);
        anchorHandlers.forEach(([el, fn]) => el.removeEventListener('click', fn));
        document.documentElement.classList.remove('no-scroll');
      };
    });

    firstLoad.current = false;

    return () => {
      cancelled = true; // an in-flight ScrollSmoother chunk must not build now
      ctxCleanup.current?.();
      ctxCleanup.current = null;
      ctx.revert(); // kills every tween, ScrollTrigger and the smoother itself
    };
  }, [pathname]);

  return null;
}
