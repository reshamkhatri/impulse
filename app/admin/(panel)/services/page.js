import { listCards, listSectionsByPage } from '@/lib/admin-data';
import { createCard } from '@/app/admin/actions';
import CardEditor from '@/components/admin/CardEditor';
import SectionEditor from '@/components/admin/SectionEditor';
import SubmitButton from '@/components/admin/SubmitButton';

export const metadata = { title: 'Services' };

/* Which fields each group of cards actually renders on the public site.
   Anything left out is preserved rather than shown — see CardEditor. */
const GROUPS = [
  {
    section: 'page_services',
    title: 'Service cards on /services',
    blurb: 'The plan cards, with the list of what each one covers. Descriptions are not shown on this page.',
    addLabel: 'Add a service',
    show: { bullets: true, icon: true, cta: true, featured: true },
    featuredLabel: 'Make this the highlighted card'
  },
  {
    section: 'home_services',
    title: 'Service cards on the home page',
    blurb: 'The four picture cards. Short descriptions read best here.',
    addLabel: 'Add a card',
    show: { icon: true, image: true, cta: true },
    descriptionLabel: 'One-line description'
  },
  {
    section: 'ancillary_services',
    title: 'Ancillary services',
    blurb: 'The branches of the diagram at the foot of /services. The diagram redraws itself around however many you add.',
    addLabel: 'Add an ancillary service',
    show: { icon: true, image: true },
    titleLabel: 'Service name',
    descriptionLabel: 'Optional one-line description'
  }
];

export default async function ServicesAdminPage() {
  const [pages, ...groupCards] = await Promise.all([
    listSectionsByPage(),
    ...GROUPS.map((group) => listCards(group.section))
  ]);

  const serviceSections = pages.find((group) => group.page === 'Services')?.sections ?? [];
  const homeServicesHeading = pages
    .find((group) => group.page === 'Home')
    ?.sections.find((section) => section.key === 'home.services');

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Services</h1>
          <p>
            The headings on <code className="adm-code">/services</code>, the service cards
            themselves, and the cards shown on the home page.
          </p>
        </div>
      </div>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <div>
            <h2>Headings on the services page</h2>
            <p>The words above and around the cards.</p>
          </div>
        </div>
        <div className="adm-panel-body">
          {serviceSections.length === 0 ? (
            <p className="adm-empty">No sections found — has supabase/schema.sql been run?</p>
          ) : (
            serviceSections.map((section) => <SectionEditor key={section.key} section={section} />)
          )}
        </div>
      </section>

      {GROUPS.map((group, index) => {
        const cards = groupCards[index];

        return (
          <section className="adm-panel" key={group.section}>
            <div className="adm-panel-head">
              <div>
                <h2>{group.title}</h2>
                <p>{group.blurb}</p>
              </div>
              <form action={createCard}>
                <input type="hidden" name="section" value={group.section} />
                <SubmitButton className="adm-btn adm-btn--sm">{group.addLabel}</SubmitButton>
              </form>
            </div>

            <div className="adm-panel-body">
              {/* The home cards sit under their own headline, so it belongs
                  with them rather than on the page-headings screen. */}
              {group.section === 'home_services' && homeServicesHeading && (
                <SectionEditor section={homeServicesHeading} />
              )}

              {cards.length === 0 ? (
                <p className="adm-empty">Nothing here yet.</p>
              ) : (
                cards.map((card, position) => (
                  <CardEditor
                    key={card.id}
                    card={card}
                    section={group.section}
                    show={group.show}
                    position={position}
                    total={cards.length}
                    titleLabel={group.titleLabel}
                    descriptionLabel={group.descriptionLabel}
                    featuredLabel={group.featuredLabel}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
