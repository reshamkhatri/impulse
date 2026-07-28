/* Compact mission / vision / goal band, sitting between the umbrella scene and
   the services grid. The full versions of this copy live on /about-us — this is
   the one-line summary, so the home page states what the firm is for without
   turning into a second About page.

   No cards and no chips: three left-aligned columns under a hairline rule.
   Everything is brand blue — one accent colour, nothing else. Glyphs follow the
   logo's own motif (precision, horizon, upward trend) rather than stock shapes,
   drawn at 30px with a light stroke so they read as line art, not iconography. */

const ICON = {
  width: 30,
  height: 30,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

const PILLARS = [
  {
    label: 'Our Mission',
    line: 'To deliver quality work that exceeds expectations and moves every client forward.',
    /* Arrow aimed at a bullseye. The shaft stops short of the rings — drawn
       through them it reads as a "no entry" slash at small sizes. */
    icon: (
      <svg {...ICON}>
        <circle cx="10.4" cy="13.6" r="7.2" />
        <circle cx="10.4" cy="13.6" r="3.2" />
        <circle cx="10.4" cy="13.6" r="0.7" fill="currentColor" stroke="none" />
        <path d="M15.8 8.2 19.8 4.2" />
        <path d="M15.2 4.2h4.6v4.6" />
      </svg>
    )
  },
  {
    label: 'Our Vision',
    line: 'To be Nepal’s most trusted name in consulting, accounting, and compliance.',
    // Sun over summits — the horizon you're steering toward, echoing the logo
    icon: (
      <svg {...ICON}>
        <circle cx="17.1" cy="7" r="2.4" />
        <path d="M3 19.4l5.3-7 3.3 4.1 2.7-3.2 5.7 6.1z" />
        <path d="M2.6 19.4h18.8" />
      </svg>
    )
  },
  {
    label: 'Our Goal',
    line: 'To turn clear numbers into confident decisions for every business we serve.',
    // Rising trend line — lifted straight from the logo's upward arrow
    icon: (
      <svg {...ICON}>
        <path d="M3.2 17.2l5.6-5.6 3.3 3.3 8.7-8.7" />
        <path d="M15.2 6.2h5.6v5.6" />
      </svg>
    )
  }
];

export default function MissionBand() {
  return (
    <section className="section-pillars" aria-labelledby="pillars-heading">
      <div className="pillars-container">
        <h2 className="pillars-headline" id="pillars-heading">
          Mission, vision &amp; goal
        </h2>

        <div className="pillars-grid">
          {PILLARS.map(({ label, line, icon }) => (
            <article className="pillar" key={label}>
              {/* a real element, not a ::before, so the rule can draw itself in */}
              <span className="pillar-rule" aria-hidden="true" />
              <span className="pillar-icon" aria-hidden="true">{icon}</span>
              <h3 className="pillar-label">{label}</h3>
              <p className="pillar-line">{line}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
