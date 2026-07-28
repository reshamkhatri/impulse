'use client';

import { useActionState } from 'react';
import { saveMember, deleteMember, moveMember } from '@/app/admin/actions';
import ImageField from '@/components/admin/ImageField';
import SubmitButton from '@/components/admin/SubmitButton';
import ConfirmButton from '@/components/admin/ConfirmButton';
import StatusNote from '@/components/admin/StatusNote';

/* A person on /about-us. The CEO block shows a pull quote and the board cards
   don't, which is the only difference between the two forms. */

function Arrow({ up }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {up ? <path d="m6 15 6-6 6 6" /> : <path d="m6 9 6 6 6-6" />}
    </svg>
  );
}

export default function MemberEditor({ member, kind, position, total }) {
  const [state, action] = useActionState(saveMember, {});
  const isCeo = kind === 'ceo';

  return (
    <div className="adm-item">
      <div className="adm-item-head">
        <h3>{member.name || 'Unnamed'}</h3>

        <div className="adm-list-actions">
          {!member.is_active && <span className="adm-pill adm-pill--draft">Hidden</span>}

          {!isCeo && (
            <>
              <form action={moveMember}>
                <input type="hidden" name="id" value={member.id} />
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="direction" value="up" />
                <button type="submit" className="adm-icon-btn" disabled={position === 0} aria-label="Move up">
                  <Arrow up />
                </button>
              </form>

              <form action={moveMember}>
                <input type="hidden" name="id" value={member.id} />
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="direction" value="down" />
                <button type="submit" className="adm-icon-btn" disabled={position === total - 1} aria-label="Move down">
                  <Arrow />
                </button>
              </form>
            </>
          )}

          <form action={deleteMember}>
            <input type="hidden" name="id" value={member.id} />
            <ConfirmButton message={`Remove ${member.name} from the website?`}>Delete</ConfirmButton>
          </form>
        </div>
      </div>

      <form action={action}>
        <input type="hidden" name="id" value={member.id} />

        <div className="adm-row">
          <label className="adm-field">
            <span className="adm-label">Name</span>
            <input className="adm-input" name="name" defaultValue={member.name} required />
          </label>

          <label className="adm-field">
            <span className="adm-label">Role</span>
            <input className="adm-input" name="role" defaultValue={member.role}
              placeholder={isCeo ? 'Chief Executive Officer' : 'Director'} />
          </label>
        </div>

        {isCeo ? (
          <label className="adm-field">
            <span className="adm-label">Pull quote</span>
            <textarea className="adm-textarea" name="quote" rows={2} defaultValue={member.quote ?? ''}
              placeholder="A sentence in their voice. Quotation marks are added for you." />
          </label>
        ) : (
          <input type="hidden" name="quote" value={member.quote ?? ''} />
        )}

        <label className="adm-field">
          <span className="adm-label">Biography</span>
          <textarea
            className="adm-textarea"
            name="bio"
            rows={isCeo ? 7 : 5}
            defaultValue={member.bio ?? ''}
            placeholder="Their background, experience, and what they bring to Impulse."
          />
          <span className="adm-hint">
            Leave a blank line between paragraphs.
            {!isCeo && ' A director with no biography keeps the shorter name-and-role card.'}
          </span>
        </label>

        <ImageField
          name="photo_url"
          label="Photograph"
          folder="team"
          defaultValue={member.photo_url ?? ''}
          hint="A square photograph works best — it is cropped to a square on the page."
        />

        <div className="adm-row">
          <label className="adm-field">
            <span className="adm-label">LinkedIn (optional)</span>
            <input className="adm-input" name="linkedin_url" defaultValue={member.linkedin_url ?? ''}
              placeholder="https://linkedin.com/in/…" />
          </label>

          <label className="adm-field">
            <span className="adm-label">Email (optional)</span>
            <input className="adm-input" type="email" name="email" defaultValue={member.email ?? ''} />
          </label>
        </div>

        <label className="adm-check">
          <input type="checkbox" name="is_active" defaultChecked={member.is_active} />
          Show on the website
        </label>

        <div className="adm-actions">
          <SubmitButton className="adm-btn adm-btn--sm">Save</SubmitButton>
          <StatusNote state={state} />
        </div>
      </form>
    </div>
  );
}
