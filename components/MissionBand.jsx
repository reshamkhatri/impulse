import { getSection, getCards } from '@/lib/content';
import CardIcon from '@/components/CardIcon';

/* Compact mission / vision / goal band, sitting between the umbrella scene and
   the services grid. The full versions of this copy live on /about-us — this is
   the one-line summary, so the home page states what the firm is for without
   turning into a second About page.

   No cards and no chips: three left-aligned columns under a hairline rule.
   Everything is brand blue — one accent colour, nothing else. Glyphs follow the
   logo's own motif (precision, horizon, upward trend) rather than stock shapes,
   drawn at 30px with a light stroke so they read as line art, not iconography.

   Copy comes from the `pillars` cards in the admin panel. */

export default async function MissionBand() {
  const [section, pillars] = await Promise.all([
    getSection('home.pillars'),
    getCards('pillars')
  ]);

  if (!pillars.length) return null;

  return (
    <section className="section-pillars" aria-labelledby="pillars-heading">
      <div className="pillars-container">
        <h2 className="pillars-headline" id="pillars-heading">
          {section.heading}
        </h2>

        <div className="pillars-grid">
          {pillars.map((pillar) => (
            <article className="pillar" key={pillar.id}>
              {/* a real element, not a ::before, so the rule can draw itself in */}
              <span className="pillar-rule" aria-hidden="true" />
              <span className="pillar-icon" aria-hidden="true">
                <CardIcon name={pillar.icon} size={30} strokeWidth={1.7} />
              </span>
              <h3 className="pillar-label">{pillar.title}</h3>
              <p className="pillar-line">{pillar.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
