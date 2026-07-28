import { listMembers, listSectionsByPage } from '@/lib/admin-data';
import { createMember } from '@/app/admin/actions';
import MemberEditor from '@/components/admin/MemberEditor';
import SectionEditor from '@/components/admin/SectionEditor';
import SubmitButton from '@/components/admin/SubmitButton';

export const metadata = { title: 'Board & CEO' };

export default async function TeamPage() {
  const [ceos, board, pages] = await Promise.all([
    listMembers('ceo'),
    listMembers('board'),
    listSectionsByPage()
  ]);

  const aboutSections = pages.find((group) => group.page === 'About')?.sections ?? [];
  const ceoHeading = aboutSections.find((section) => section.key === 'about.ceo');
  const bodHeading = aboutSections.find((section) => section.key === 'about.bod');

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Board &amp; CEO</h1>
          <p>
            The people shown on <code className="adm-code">/about-us</code>. Names, roles,
            photographs and biographies — and the order the directors appear in.
          </p>
        </div>
      </div>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <div>
            <h2>Chief executive</h2>
            <p>The large leadership block, with the quote and the signature.</p>
          </div>
          {ceos.length === 0 && (
            <form action={createMember}>
              <input type="hidden" name="kind" value="ceo" />
              <SubmitButton className="adm-btn adm-btn--sm">Add the CEO</SubmitButton>
            </form>
          )}
        </div>

        <div className="adm-panel-body">
          {ceoHeading && <SectionEditor section={ceoHeading} />}

          {ceos.length === 0 ? (
            <p className="adm-empty">No CEO entry — the whole block is hidden on the page.</p>
          ) : (
            ceos.map((member, index) => (
              <MemberEditor key={member.id} member={member} kind="ceo" position={index} total={ceos.length} />
            ))
          )}
        </div>
      </section>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <div>
            <h2>Board of directors</h2>
            <p>Shown as cards, in the order below.</p>
          </div>
          <form action={createMember}>
            <input type="hidden" name="kind" value="board" />
            <SubmitButton className="adm-btn adm-btn--sm">Add a director</SubmitButton>
          </form>
        </div>

        <div className="adm-panel-body">
          {bodHeading && <SectionEditor section={bodHeading} />}

          {board.length === 0 ? (
            <p className="adm-empty">No directors yet — the board section is hidden on the page.</p>
          ) : (
            board.map((member, index) => (
              <MemberEditor key={member.id} member={member} kind="board" position={index} total={board.length} />
            ))
          )}
        </div>
      </section>
    </>
  );
}
