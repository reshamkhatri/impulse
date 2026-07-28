import { getSection, getCards } from '@/lib/content';
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
      'Business consulting, accounting & bookkeeping, VAT filing, and taxation advisory for growing businesses in Nepal.'
  };
}

export default async function ServicesPage() {
  const [hero, support, plans, steps] = await Promise.all([
    getSection('services.hero'),
    getSection('services.support'),
    getCards('page_services'),
    getCards('support_steps')
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
                    <p>{plan.description}</p>
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

        <section className="services-page-support" aria-labelledby="services-support-heading">
          <div className="section-container services-page-support-grid">
            <div className="services-page-support-copy">
              <span className="services-page-kicker"><i></i> {support.eyebrow}</span>
              <h2 id="services-support-heading">{support.heading}</h2>
              <p>{support.subheading}</p>
            </div>
            <div className="services-page-support-steps">
              {steps.map((step, i) => (
                <article key={step.id}>
                  {/* Numbering is positional, so reordering the steps in the
                      admin panel renumbers them without anyone editing text. */}
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
  );
}
