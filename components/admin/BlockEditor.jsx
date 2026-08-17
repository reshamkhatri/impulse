'use client';

import { useState } from 'react';

/* The body of an article, edited as the blocks the page actually renders
   rather than as a wall of HTML.

   Storing structure instead of markup is what keeps the article layout safe:
   nothing typed here can close a tag, inject a script, or break the page — the
   worst case is a paragraph that reads oddly. The whole array is serialised
   into one hidden field, which is what the server action parses.

   Types match the renderer in app/(site)/blog/[slug]/page.js:
     p      paragraph
     h2     section heading
     ul     bullet list (one item per line)
     quote  pull quote */

const TYPES = [
  { value: 'p', label: 'Paragraph' },
  { value: 'h2', label: 'Heading' },
  { value: 'image', label: 'In-Article Photo' },
  { value: 'callout', label: 'Key Takeaway Box' },
  { value: 'ul', label: 'Bullet list' },
  { value: 'quote', label: 'Pull quote' }
];

const PLACEHOLDERS = {
  p: 'Write the paragraph…',
  h2: 'Section heading',
  image: 'Image URL or path (e.g. /blog/training.jpg)\nCaption (optional on second line)',
  callout: 'Callout Title (line 1)\nKey insight or explanation (subsequent lines)',
  ul: 'One bullet per line',
  quote: 'A sentence worth pulling out'
};

const blank = (type) => {
  if (type === 'ul') return { type, items: [] };
  if (type === 'image') return { type, url: '', caption: '' };
  if (type === 'callout') return { type, title: '', text: '' };
  return { type, text: '' };
};

/** A block's editable text */
const toText = (block) => {
  if (block.type === 'ul') return (block.items ?? []).join('\n');
  if (block.type === 'image') return [block.url ?? '', block.caption ?? ''].filter(Boolean).join('\n');
  if (block.type === 'callout') return [block.title ?? '', block.text ?? ''].filter(Boolean).join('\n');
  return block.text ?? '';
};

function fromText(type, text) {
  if (type === 'ul') {
    return { type, items: text.split('\n').map((line) => line.trim()).filter(Boolean) };
  }
  if (type === 'image') {
    const lines = text.split('\n');
    const url = lines[0]?.trim() ?? '';
    const caption = lines.slice(1).join('\n').trim();
    return { type, url, caption };
  }
  if (type === 'callout') {
    const lines = text.split('\n');
    const title = lines[0]?.trim() ?? '';
    const bodyText = lines.slice(1).join('\n').trim();
    return { type, title, text: bodyText || title };
  }
  return { type, text };
}

function Chevron({ up }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {up ? <path d="m6 15 6-6 6 6" /> : <path d="m6 9 6 6 6-6" />}
    </svg>
  );
}

export default function BlockEditor({ name = 'body', initialBlocks = [] }) {
  const [blocks, setBlocks] = useState(() =>
    initialBlocks.length ? initialBlocks : [blank('p')]
  );

  // Editing keeps the raw text so a half-typed list doesn't lose its empty
  // lines; only the serialised value is normalised.
  const [drafts, setDrafts] = useState(() =>
    (initialBlocks.length ? initialBlocks : [blank('p')]).map(toText)
  );

  function update(index, nextType, nextText) {
    setDrafts((current) => current.map((text, i) => (i === index ? nextText : text)));
    setBlocks((current) => current.map((block, i) => (i === index ? fromText(nextType, nextText) : block)));
  }

  function changeType(index, type) {
    update(index, type, drafts[index]);
  }

  function add(type) {
    setBlocks((current) => [...current, blank(type)]);
    setDrafts((current) => [...current, '']);
  }

  function remove(index) {
    setBlocks((current) => current.filter((_, i) => i !== index));
    setDrafts((current) => current.filter((_, i) => i !== index));
  }

  function move(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;

    const swap = (list) => {
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    };

    setBlocks(swap);
    setDrafts(swap);
  }

  return (
    <div className="adm-field">
      <span className="adm-label">Article body</span>

      <div className="adm-blocks">
        {blocks.map((block, index) => (
          <div className="adm-block" key={index}>
            <div className="adm-block-bar">
              <select
                className="adm-select"
                value={block.type}
                onChange={(e) => changeType(index, e.target.value)}
                aria-label={`Block ${index + 1} type`}
              >
                {TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>

              <span className="adm-block-spacer" />

              <button type="button" className="adm-icon-btn" onClick={() => move(index, -1)}
                disabled={index === 0} aria-label="Move up">
                <Chevron up />
              </button>
              <button type="button" className="adm-icon-btn" onClick={() => move(index, 1)}
                disabled={index === blocks.length - 1} aria-label="Move down">
                <Chevron />
              </button>
              <button type="button" className="adm-icon-btn adm-icon-btn--danger"
                onClick={() => remove(index)} disabled={blocks.length === 1} aria-label="Delete block">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
                  strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 5l14 14M19 5 5 19" />
                </svg>
              </button>
            </div>

            <textarea
              className="adm-textarea"
              value={drafts[index]}
              placeholder={PLACEHOLDERS[block.type]}
              rows={block.type === 'h2' ? 1 : 4}
              onChange={(e) => update(index, block.type, e.target.value)}
              aria-label={`Block ${index + 1} content`}
            />
          </div>
        ))}
      </div>

      <div className="adm-block-add">
        {TYPES.map((type) => (
          <button key={type.value} type="button" className="adm-btn adm-btn--ghost adm-btn--sm"
            onClick={() => add(type.value)}>
            + {type.label}
          </button>
        ))}
      </div>

      <p className="adm-hint">
        Empty blocks are dropped when you save. Bullet lists take one item per line.
      </p>

      <input type="hidden" name={name} value={JSON.stringify(blocks)} />
    </div>
  );
}
