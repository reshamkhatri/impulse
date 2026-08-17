'use client';

import { useState } from 'react';
import Link from 'next/link';

const FAQ_DATA = [
  {
    id: 1,
    q: 'What services does Impulse Nepal provide?',
    a: 'Impulse Nepal provides a range of business support services, including company registration and compliance, accounting and bookkeeping, TAX & VAT filing, business consulting, and professional training and seminars.',
  },
  {
    id: 2,
    q: 'Can you help me register a new company in Nepal?',
    a: 'Yes. We assist entrepreneurs throughout the company registration process, including documentation, application procedures, registration, and other related compliance requirements, making the process simple and hassle-free.',
  },
  {
    id: 3,
    q: 'Do you provide accounting and bookkeeping services?',
    a: 'Yes. We provide professional accounting and bookkeeping support to help businesses maintain accurate financial records, monitor transactions, and meet their financial reporting and compliance requirements.',
  },
  {
    id: 4,
    q: 'Can you handle my TAX and VAT filing?',
    a: 'Yes. We provide TAX and VAT-related services, including preparation and filing of returns and assistance with applicable tax and VAT compliance requirements.',
  },
  {
    id: 5,
    q: 'Do you provide business consulting for existing businesses?',
    a: 'Yes. We provide practical business consulting services to help businesses improve their operations, financial management, compliance, planning, and overall business performance.',
  },
  {
    id: 6,
    q: 'How can I get started with Impulse Nepal?',
    a: 'Getting started is simple. Contact us through our website, phone, or email and share your business requirements with us. Our team will understand your needs and guide you toward the appropriate solution.',
  },
];

export default function FaqAccordion() {
  const [openId, setOpenId] = useState(1); // Default first item open

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="faq-section" id="faq" aria-labelledby="faq-main-heading">
      <div className="faq-wrapper">
        
        {/* Left / Top Info Column */}
        <div className="faq-sidebar">
          <div className="faq-badge">
            <span className="faq-badge-dot" aria-hidden="true" />
            <span>Got Questions?</span>
          </div>
          <h2 className="faq-title" id="faq-main-heading">
            Frequently Asked <span className="faq-title-highlight">Questions</span>
          </h2>
          <p className="faq-desc">
            Quick, transparent answers to the most common queries from entrepreneurs, growing enterprises, and established institutions in Nepal.
          </p>

          <div className="faq-help-box">
            <h3 className="faq-help-title">Still have questions?</h3>
            <p className="faq-help-text">Can&apos;t find what you are looking for? Speak directly with our advisory team.</p>
            <a href="#contact" className="faq-help-btn">
              <span>Contact Us</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right / Bottom Accordion List */}
        <div className="faq-cards">
          {FAQ_DATA.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`faq-card ${isOpen ? 'is-expanded' : ''}`}
              >
                <button
                  type="button"
                  className="faq-card-header"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  id={`faq-btn-${item.id}`}
                >
                  <span className="faq-card-num">0{item.id}</span>
                  <span className="faq-card-question">{item.q}</span>
                  <span className="faq-toggle-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" className="faq-icon-v" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>

                <div
                  id={`faq-answer-${item.id}`}
                  className="faq-card-body"
                  role="region"
                  aria-labelledby={`faq-btn-${item.id}`}
                  style={{
                    display: isOpen ? 'block' : 'none'
                  }}
                >
                  <div className="faq-card-answer-text">
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
