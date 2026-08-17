'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function PopupModal({ popup }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);

  // Parse configuration
  const isEnabled = popup?.subheading !== 'disabled' && Boolean(popup?.heading?.trim());
  const badge = popup?.eyebrow || 'Announcement';
  const title = popup?.heading || '';
  const description = popup?.body || '';

  // heading_alt format: "CTA Label|CTA Link|Image URL"
  const rawAlt = popup?.heading_alt || '';
  const parts = rawAlt.split('|');
  const ctaLabel = parts[0]?.trim() || 'Get in Touch';
  const ctaHref = parts[1]?.trim() || '#contact';
  const imageUrl = parts[2]?.trim() || '';

  const handleClose = useCallback(() => {
    setIsOpen(false);
    try {
      sessionStorage.setItem('impulse_welcome_popup_seen', 'true');
    } catch {
      // Ignore in private browsing / restricted cookies
    }
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    try {
      const alreadySeen = sessionStorage.getItem('impulse_welcome_popup_seen');
      if (alreadySeen) return;
    } catch {
      // Ignore
    }

    setHasRendered(true);

    // Smooth delay before showing popup so user experiences the initial page load first
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isEnabled]);

  // Handle ESC key press
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, handleClose]);

  if (!hasRendered || !isEnabled) return null;

  return (
    <div
      className={`popup-overlay ${isOpen ? 'is-visible' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-popup-title"
    >
      <div className="popup-card">
        {/* Close Button */}
        <button
          type="button"
          className="popup-close-btn"
          onClick={handleClose}
          aria-label="Close announcement"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Optional Media Header */}
        {imageUrl && (
          <div className="popup-media">
            <img src={imageUrl} alt="" loading="lazy" />
          </div>
        )}

        {/* Content Body */}
        <div className="popup-content">
          {badge && (
            <div className="popup-badge">
              <span className="popup-badge-dot" aria-hidden="true" />
              <span>{badge}</span>
            </div>
          )}

          <h2 className="popup-title" id="welcome-popup-title">
            {title}
          </h2>

          {description && (
            <p className="popup-desc">
              {description}
            </p>
          )}

          <div className="popup-actions">
            <Link
              href={ctaHref}
              className="popup-cta-btn"
              onClick={handleClose}
            >
              <span>{ctaLabel}</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>

            <button
              type="button"
              className="popup-dismiss-btn"
              onClick={handleClose}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
