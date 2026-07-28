import { listCards, listSectionsByPage } from '@/lib/admin-data';
import { createCard } from '@/app/admin/actions';
import SectionEditor from '@/components/admin/SectionEditor';
import CardEditor from '@/components/admin/CardEditor';
import SubmitButton from '@/components/admin/SubmitButton';

export const metadata = { title: 'Page headings' };

const PAGE_BLURBS = {
  Home: 'The wording on the front page.',
  Services: 'Also editable from the Services screen.',
  About: 'The About Us page, top to bottom.',
  Blog: 'The listing page and the box at the foot of every article.'
};

export default async function ContentPage() {
  const [pages, pillars, mvg] = await Promise.all([
    listSectionsByPage(),
    listCards('pillars'),
    listCards('mvg')
  ]);

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Page headings</h1>
          <p>
            Every heading and subheading on the website, grouped by the page it appears on.
            The grey code beside each one is its permanent name — it is what the page asks
            for, and it never changes.
          </p>
        </div>
      </div>

      {pages.length === 0 && (
        <section className="adm-panel">
          <p className="adm-empty">
            No sections found. Run <code className="adm-code">supabase/schema.sql</code> in the
            Supabase SQL editor to create and seed them.
          </p>
        </section>
      )}

      {pages.map(({ page, sections }) => (
        <section className="adm-panel" key={page}>
          <div className="adm-panel-head">
            <div>
              <h2>{page}</h2>
              {PAGE_BLURBS[page] && <p>{PAGE_BLURBS[page]}</p>}
            </div>
          </div>
          <div className="adm-panel-body">
            {sections.map((section) => <SectionEditor key={section.key} section={section} />)}
          </div>
        </section>
      ))}

      <section className="adm-panel">
        <div className="adm-panel-head">
          <div>
            <h2>Mission, vision &amp; goal — home page</h2>
            <p>The three one-line statements under the umbrella scene.</p>
          </div>
          <form action={createCard}>
            <input type="hidden" name="section" value="pillars" />
            <SubmitButton className="adm-btn adm-btn--sm">Add one</SubmitButton>
          </form>
        </div>
        <div className="adm-panel-body">
          {pillars.length === 0 ? (
            <p className="adm-empty">Nothing here yet.</p>
          ) : (
            pillars.map((card, position) => (
              <CardEditor
                key={card.id}
                card={card}
                section="pillars"
                show={{ icon: true }}
                position={position}
                total={pillars.length}
                titleLabel="Label"
                descriptionLabel="The one-line statement"
              />
            ))
          )}
        </div>
      </section>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <div>
            <h2>Mission, vision &amp; goal — about page</h2>
            <p>The three full cards, each with its own short list.</p>
          </div>
          <form action={createCard}>
            <input type="hidden" name="section" value="mvg" />
            <SubmitButton className="adm-btn adm-btn--sm">Add one</SubmitButton>
          </form>
        </div>
        <div className="adm-panel-body">
          {mvg.length === 0 ? (
            <p className="adm-empty">Nothing here yet.</p>
          ) : (
            mvg.map((card, position) => (
              <CardEditor
                key={card.id}
                card={card}
                section="mvg"
                show={{ bullets: true, icon: true, featured: true }}
                position={position}
                total={mvg.length}
                bulletsLabel="Short list"
                featuredLabel="Use the blue card treatment"
              />
            ))
          )}
        </div>
      </section>
    </>
  );
}
