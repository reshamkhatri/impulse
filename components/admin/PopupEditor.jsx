'use client';

import { useActionState, useState } from 'react';
import { saveSection } from '@/app/admin/actions';
import ImageField from '@/components/admin/ImageField';
import SubmitButton from '@/components/admin/SubmitButton';
import StatusNote from '@/components/admin/StatusNote';

export default function PopupEditor({ section }) {
  const [state, formAction] = useActionState(saveSection, null);

  // Parse existing heading_alt: "cta_label|cta_href|image_url"
  const rawAlt = section?.heading_alt || '';
  const parts = rawAlt.split('|');
  const initCtaLabel = parts[0]?.trim() || 'Book Consultation';
  const initCtaHref = parts[1]?.trim() || '/#contact';
  const initImageUrl = parts[2]?.trim() || '';

  const [isEnabled, setIsEnabled] = useState(section?.subheading !== 'disabled');
  const [eyebrow, setEyebrow] = useState(section?.eyebrow || 'Announcement');
  const [heading, setHeading] = useState(section?.heading || '');
  const [body, setBody] = useState(section?.body || '');
  const [ctaLabel, setCtaLabel] = useState(initCtaLabel);
  const [ctaHref, setCtaHref] = useState(initCtaHref);
  const [imageUrl, setImageUrl] = useState(initImageUrl);

  // Combined heading_alt for form submission
  const combinedHeadingAlt = `${ctaLabel.trim()}|${ctaHref.trim()}|${imageUrl.trim()}`;

  return (
    <div className="adm-popup-mgr">
      <form action={formAction} className="adm-form">
        <input type="hidden" name="key" value="site.popup" />
        <input type="hidden" name="subheading" value={isEnabled ? 'enabled' : 'disabled'} />
        <input type="hidden" name="heading_alt" value={combinedHeadingAlt} />

        <div className="adm-toggle-row">
          <div>
            <label className="adm-toggle-label">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="adm-checkbox"
              />
              <span className="adm-toggle-text">
                <strong>Popup status:</strong> {isEnabled ? <span style={{ color: '#00875a' }}>Active (Visible to new visitors)</span> : <span style={{ color: '#de350b' }}>Disabled (Hidden)</span>}
              </span>
            </label>
            <p className="adm-hint">
              When active, first-time visitors will see this announcement modal once during their session.
            </p>
          </div>
        </div>

        <div className="adm-grid-2">
          <div className="adm-field">
            <label className="adm-label" htmlFor="popup-eyebrow">
              Badge / Category Tag
            </label>
            <input
              id="popup-eyebrow"
              className="adm-input"
              type="text"
              name="eyebrow"
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              placeholder="e.g. Special Offer, Notice, Upcoming Bootcamp"
            />
            <p className="adm-hint">Small tag displayed at the top of the popup.</p>
          </div>

          <div className="adm-field">
            <label className="adm-label" htmlFor="popup-heading">
              Headline / Title
            </label>
            <input
              id="popup-heading"
              className="adm-input"
              type="text"
              name="heading"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="e.g. Accelerate Your Business With Impulse"
              required={isEnabled}
            />
            <p className="adm-hint">The main bold title of the announcement.</p>
          </div>
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="popup-body">
            Description / Message
          </label>
          <textarea
            id="popup-body"
            className="adm-input adm-textarea"
            name="body"
            rows="4"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your announcement details, special offer terms, or advisory pitch here..."
          />
          <p className="adm-hint">The body paragraph explaining the announcement.</p>
        </div>

        <div className="adm-grid-2">
          <div className="adm-field">
            <label className="adm-label" htmlFor="popup-cta-label">
              Button Label
            </label>
            <input
              id="popup-cta-label"
              className="adm-input"
              type="text"
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              placeholder="e.g. Claim Free Consultation, Read Article"
            />
          </div>

          <div className="adm-field">
            <label className="adm-label" htmlFor="popup-cta-href">
              Button Link (URL or Section)
            </label>
            <input
              id="popup-cta-href"
              className="adm-input"
              type="text"
              value={ctaHref}
              onChange={(e) => setCtaHref(e.target.value)}
              placeholder="e.g. /#contact, /services, /blog/post-slug"
            />
          </div>
        </div>

        <ImageField
          name="popup_image"
          label="Optional Banner Image"
          defaultValue={imageUrl}
          folder="popups"
          hint="Upload an image or paste a photo link. Appears at the top of the popup."
        />

        <div className="adm-actions-bar">
          <SubmitButton className="adm-btn adm-btn--primary">Save Popup Settings</SubmitButton>
          <StatusNote state={state} />
        </div>
      </form>

      {/* Live Preview Panel */}
      <div className="adm-preview-box">
        <h3 className="adm-preview-title">Live Preview</h3>
        <p className="adm-hint" style={{ marginBottom: '1.25rem' }}>
          This is exactly how the popup will appear to visitors when they land on the website.
        </p>

        <div className="adm-preview-stage">
          <div className={`popup-card ${!isEnabled ? 'is-preview-disabled' : ''}`}>
            {imageUrl && (
              <div className="popup-media">
                <img src={imageUrl} alt="" />
              </div>
            )}
            <div className="popup-content">
              {eyebrow && (
                <div className="popup-badge">
                  <span className="popup-badge-dot" aria-hidden="true" />
                  <span>{eyebrow}</span>
                </div>
              )}
              <h2 className="popup-title">{heading || 'Your Popup Headline Here'}</h2>
              <p className="popup-desc">
                {body || 'Your announcement message will appear here for visitors when they browse your site.'}
              </p>
              <div className="popup-actions">
                <span className="popup-cta-btn" style={{ pointerEvents: 'none' }}>
                  <span>{ctaLabel || 'Action Button'}</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
                <span className="popup-dismiss-btn" style={{ pointerEvents: 'none' }}>
                  Dismiss
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
