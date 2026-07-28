'use client';

import { useActionState } from 'react';
import { saveCard, deleteCard, moveCard } from '@/app/admin/actions';
import ImageField from '@/components/admin/ImageField';
import IconSelect from '@/components/admin/IconSelect';
import SubmitButton from '@/components/admin/SubmitButton';
import ConfirmButton from '@/components/admin/ConfirmButton';
import StatusNote from '@/components/admin/StatusNote';

/* One editable card — a service, a process step, a mission statement.

   `show` says which fields this group of cards actually uses; the rest are
   still submitted as hidden inputs carrying their current values, so saving a
   card whose form has no bullet box doesn't quietly empty its bullets. */

function Arrow({ up }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {up ? <path d="m6 15 6-6 6 6" /> : <path d="m6 9 6 6 6-6" />}
    </svg>
  );
}

export default function CardEditor({
  card,
  section,
  show = {},
  titleLabel = 'Title',
  descriptionLabel = 'Description',
  bulletsLabel = 'What it covers',
  featuredLabel = 'Highlight this card',
  position,
  total
}) {
  const [state, action] = useActionState(saveCard, {});
  const bulletText = (card.bullets ?? []).join('\n');

  return (
    <div className="adm-item">
      <div className="adm-item-head">
        <h3>{card.title || 'Untitled'}</h3>

        <div className="adm-list-actions">
          {!card.is_active && <span className="adm-pill adm-pill--draft">Hidden</span>}

          {/* Sibling forms, not nested ones — a form inside a form is invalid
              and the browser drops the inner one. */}
          <form action={moveCard}>
            <input type="hidden" name="id" value={card.id} />
            <input type="hidden" name="section" value={section} />
            <input type="hidden" name="direction" value="up" />
            <button type="submit" className="adm-icon-btn" disabled={position === 0} aria-label="Move up">
              <Arrow up />
            </button>
          </form>

          <form action={moveCard}>
            <input type="hidden" name="id" value={card.id} />
            <input type="hidden" name="section" value={section} />
            <input type="hidden" name="direction" value="down" />
            <button type="submit" className="adm-icon-btn" disabled={position === total - 1} aria-label="Move down">
              <Arrow />
            </button>
          </form>

          <form action={deleteCard}>
            <input type="hidden" name="id" value={card.id} />
            <ConfirmButton message={`Delete “${card.title}”?`}>Delete</ConfirmButton>
          </form>
        </div>
      </div>

      <form action={action}>
        <input type="hidden" name="id" value={card.id} />

        <label className="adm-field">
          <span className="adm-label">{titleLabel}</span>
          <input className="adm-input" name="title" defaultValue={card.title} required />
        </label>

        <label className="adm-field">
          <span className="adm-label">{descriptionLabel}</span>
          <textarea className="adm-textarea" name="description" rows={2} defaultValue={card.description} />
        </label>

        {show.bullets ? (
          <label className="adm-field">
            <span className="adm-label">{bulletsLabel}</span>
            <textarea className="adm-textarea" name="bullets" rows={6} defaultValue={bulletText} />
            <span className="adm-hint">One item per line.</span>
          </label>
        ) : (
          <input type="hidden" name="bullets" value={bulletText} />
        )}

        {show.icon
          ? <IconSelect defaultValue={card.icon} />
          : <input type="hidden" name="icon" value={card.icon ?? 'dot'} />}

        {show.image
          ? <ImageField name="image_url" label="Card image" folder="services" defaultValue={card.image_url ?? ''} />
          : <input type="hidden" name="image_url" value={card.image_url ?? ''} />}

        {show.cta ? (
          <div className="adm-row">
            <label className="adm-field">
              <span className="adm-label">Button text</span>
              <input className="adm-input" name="cta_label" defaultValue={card.cta_label ?? ''}
                placeholder="Talk to an accountant" />
              <span className="adm-hint">Leave empty to hide the button.</span>
            </label>
            <label className="adm-field">
              <span className="adm-label">Button link</span>
              <input className="adm-input" name="cta_href" defaultValue={card.cta_href ?? '#contact'} />
            </label>
          </div>
        ) : (
          <>
            <input type="hidden" name="cta_label" value={card.cta_label ?? ''} />
            <input type="hidden" name="cta_href" value={card.cta_href ?? '#contact'} />
          </>
        )}

        <div className="adm-row">
          {show.featured ? (
            <label className="adm-check">
              <input type="checkbox" name="featured" defaultChecked={card.featured} />
              {featuredLabel}
            </label>
          ) : (
            <input type="hidden" name="featured" value={card.featured ? 'true' : 'false'} />
          )}

          <label className="adm-check">
            <input type="checkbox" name="is_active" defaultChecked={card.is_active} />
            Show on the website
          </label>
        </div>

        <div className="adm-actions">
          <SubmitButton className="adm-btn adm-btn--sm">Save</SubmitButton>
          <StatusNote state={state} />
        </div>
      </form>
    </div>
  );
}
