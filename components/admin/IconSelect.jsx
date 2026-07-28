'use client';

import { useState } from 'react';
import CardIcon, { ICON_KEYS } from '@/components/CardIcon';

const LABELS = {
  pulse: 'Pulse line',
  ledger: 'Ledger',
  calendar: 'Calendar',
  file: 'Document with lines',
  building: 'Building',
  document: 'Folded document',
  chart: 'Rising chart',
  target: 'Arrow and target',
  bullseye: 'Bullseye',
  summit: 'Sun over summits',
  trend: 'Upward trend',
  eye: 'Eye',
  flag: 'Flag',
  dot: 'Plain circle'
};

/* Picks which of the site's drawn glyphs a card uses. The preview updates as
   you change the selection, because the names alone don't tell you much. */
export default function IconSelect({ name = 'icon', defaultValue = 'chart' }) {
  const [value, setValue] = useState(defaultValue || 'chart');

  return (
    <label className="adm-field">
      <span className="adm-label">Icon</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem' }}>
        <span
          aria-hidden="true"
          style={{
            width: '2.3rem', height: '2.3rem', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--line)', borderRadius: '9px',
            background: 'var(--accent-soft)', color: 'var(--accent)'
          }}
        >
          <CardIcon name={value} size={18} strokeWidth={2} />
        </span>

        <select
          className="adm-select"
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          {ICON_KEYS.map((key) => (
            <option key={key} value={key}>{LABELS[key] ?? key}</option>
          ))}
        </select>
      </div>
    </label>
  );
}
