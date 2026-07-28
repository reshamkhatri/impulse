import { getSection, getCards } from '@/lib/content';
import { cloudinaryImage } from '@/lib/cloudinary';
import CardIcon from '@/components/CardIcon';

/* Rebuilt from the database every 5 minutes, and immediately after a save in
   the admin panel (the server action revalidates this path). */
export const revalidate = 300;

export async function generateMetadata() {
  const hero = await getSection('services.hero');
  return {
    title: 'Services',
    description:
      hero.subheading ||
      'Company compliance, accounting & bookkeeping, tax & VAT filing, and advisory services for growing businesses in Nepal.'
  };
}

export default async function ServicesPage() {
  const [hero, ancillary, plans, ancillaryItems] = await Promise.all([
    getSection('services.hero'),
    getSection('services.ancillary'),
    getCards('page_services'),
    getCards('ancillary_services')
  ]);

  return (
    <main>
        <section className="services-page-hero" id="services">
          <div className="section-container services-page-hero-shell">
            <div className="services-page-blue-stage">

              <div className="services-page-hero-copy">
                <h1>{hero.heading}</h1>
                <p>{hero.subheading}</p>
              </div>

              <div className="services-page-card-row" id="service-details">
                {plans.map((plan) => (
                  <article
                    className={`services-page-plan-card${plan.featured ? ' is-featured' : ''}`}
                    key={plan.id}
                  >
                    <span className="services-page-card-icon" aria-hidden="true">
                      <CardIcon name={plan.icon} size={17} strokeWidth={2.2} />
                    </span>
                    <h2>{plan.title}</h2>
                    <ul>
                      {plan.bullets.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    {plan.cta_label && (
                      <a href={plan.cta_href || '#contact'}>{plan.cta_label}</a>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Drawn as a tree: the heading is the parent node and each ancillary
            line of work branches off it. The connectors are CSS borders on the
            branch cells, so adding or removing a card in the admin panel
            redraws the diagram without anyone touching the markup. */}
        <section className="services-page-ancillary" aria-labelledby="services-ancillary-heading">
          <div className="section-container ancillary-tree">
            <h2 className="ancillary-root" id="services-ancillary-heading">
              {ancillary.heading}
            </h2>
            {ancillary.subheading && <p className="ancillary-intro">{ancillary.subheading}</p>}

            <ul className="ancillary-branches">
              {ancillaryItems.map((item) => (
                <li className="ancillary-branch" key={item.id}>
                  {/* The image is optional: a card with none falls back to the
                      icon-and-title node, so the diagram never breaks while an
                      image is still being sourced. */}
                  <article className={`ancillary-node${item.image_url ? ' has-media' : ''}`}>
                    {item.image_url && (
                      <span className="ancillary-node-media">
                        <img
                          src={cloudinaryImage(item.image_url, { width: 520, height: 340 })}
                          alt={item.title}
                          width="520" height="340" decoding="async" loading="lazy"
                        />
                      </span>
                    )}
                    <span className="ancillary-node-icon" aria-hidden="true">
                      <CardIcon name={item.icon} size={17} strokeWidth={2.2} />
                    </span>
                    <h3>{item.title}</h3>
                    {item.description && <p>{item.description}</p>}
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
  );
}
