'use client';

import { useActionState } from 'react';
import { saveSection } from '@/app/admin/actions';
import { fieldsFor } from '@/lib/section-fields';
import SubmitButton from '@/components/admin/SubmitButton';
import StatusNote from '@/components/admin/StatusNote';

/* The headings and subheadings of one band on the site.

   `key` identifies which band and is never editable — the page asks for it by
   name. Fields not listed for this key are sent back unchanged as hidden
   inputs, so saving here can't blank a column the form didn't show. */

export default function SectionEditor({ section, showLabel = true }) {
  const [state, action] = useActionState(saveSection, {});

  const fields = fieldsFor(section.key);
  const shown = new Set(fields.map((field) => field.name));
  const hidden = ['eyebrow', 'heading', 'heading_alt', 'subheading', 'body'].filter(
    (column) => !shown.has(column)
  );

  return (
    <div className="adm-item">
      {showLabel && (
        <div className="adm-item-head">
          <h3>{section.label}</h3>
          <span className="adm-item-key">{section.key}</span>
        </div>
      )}

      <form action={action}>
        <input type="hidden" name="key" value={section.key} />
        {hidden.map((column) => (
          <input key={column} type="hidden" name={column} value={section[column] ?? ''} />
        ))}

        {section.hint && <p className="adm-hint" style={{ marginBottom: '.9rem' }}>{section.hint}</p>}

        {fields.map((field) => (
          <label className="adm-field" key={field.name}>
            <span className="adm-label">{field.label}</span>
            {field.type === 'textarea' ? (
              <textarea
                className="adm-textarea"
                name={field.name}
                rows={field.rows ?? 3}
                defaultValue={section[field.name] ?? ''}
              />
            ) : (
              <input
                className="adm-input"
                name={field.name}
                defaultValue={section[field.name] ?? ''}
              />
            )}
            {field.hint && <span className="adm-hint">{field.hint}</span>}
          </label>
        ))}

        <div className="adm-actions">
          <SubmitButton className="adm-btn adm-btn--sm">Save</SubmitButton>
          <StatusNote state={state} />
        </div>
      </form>
    </div>
  );
}
