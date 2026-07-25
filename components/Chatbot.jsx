'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/* ==========================================================================
   Impulse — FAQ chatbot widget (self-contained, no backend)
   Edit the FAQ array below to change the questions & answers — that's the
   entire knowledge base. Answers may contain simple HTML (<strong>, <a>).
   ========================================================================== */

const FAQ = [
  {
    q: 'What services do you offer?',
    a: 'We offer four core services for growing businesses in Nepal: <strong>business consulting</strong>, <strong>accounting &amp; bookkeeping</strong>, <strong>taxation</strong>, and <strong>VAT filing</strong> — everything you need to stay compliant and grow with confidence.',
    k: ['service', 'offer', 'provide', 'what do you do', 'help with', 'do you do']
  },
  {
    q: 'How do I get started?',
    a: 'Getting started is simple: tap <a href="#contact">Get a Free Consultation</a> or message us in the Contact section below. We&rsquo;ll set up a free consultation, understand your goals, and propose a plan tailored to your business.',
    k: ['start', 'get started', 'begin', 'procedure', 'process', 'how do i', 'onboard', 'sign up', 'first step', 'steps']
  },
  {
    q: 'How does VAT filing work?',
    a: 'We handle the entire VAT process — registration, preparing and submitting your periodic returns, and keeping you compliant with Nepal&rsquo;s IRD rules. You share your records; we take care of the filing and the deadlines.',
    k: ['vat', 'filing', 'file', 'return', 'ird', 'registration']
  },
  {
    q: 'Can you help with taxation?',
    a: 'Yes. We handle tax planning, preparation, and filing so you meet every deadline and stay fully compliant with Nepali tax law — with no stress at year-end.',
    k: ['tax', 'taxation', 'compliance', 'comply', 'deadline', 'income tax']
  },
  {
    q: 'Do you work with small businesses?',
    a: 'Absolutely — we work with 50+ growing businesses, entrepreneurs, and corporate leaders across Nepal, from early-stage startups to established companies.',
    k: ['small', 'business', 'startup', 'who do you', 'clients', 'entrepreneur', 'company']
  },
  {
    q: 'How can I contact you?',
    a: 'The fastest way is to <a href="#contact">get a free consultation</a>, or use the Contact section at the bottom of the page. We&rsquo;ll get back to you quickly.',
    k: ['contact', 'reach', 'email', 'phone', 'call', 'talk', 'get in touch', 'where', 'location', 'address']
  }
];

const FALLBACK =
  'Good question! I&rsquo;m not sure about that specific one — the quickest way is to <a href="#contact">get a free consultation</a> and our team will help you directly.';

function findAnswer(text) {
  const t = text.toLowerCase();
  let best = null;
  let score = 0;
  FAQ.forEach((item) => {
    let s = 0;
    item.k.forEach((kw) => { if (t.indexOf(kw) !== -1) s += kw.split(' ').length; });
    if (s > score) { score = s; best = item; }
  });
  return best && score > 0 ? best.a : FALLBACK;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(false);   // permanently stops the launcher pulse
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');

  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const welcomed = useRef(false);
  const timers = useRef([]);
  const nextId = useRef(0);

  // Every message starts as a typing bubble and swaps to its answer, matching
  // the original widget's 500ms beat.
  const botSay = useCallback((html) => {
    const id = nextId.current++;
    setMessages((m) => [...m, { id, who: 'bot', html, typing: true }]);
    const t = setTimeout(() => {
      setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, typing: false } : msg)));
    }, 500);
    timers.current.push(t);
  }, []);

  const say = useCallback((text) => {
    setMessages((m) => [...m, { id: nextId.current++, who: 'user', text }]);
  }, []);

  const ask = useCallback((item) => { say(item.q); botSay(item.a); }, [say, botSay]);

  const openChat = useCallback(() => {
    setOpen(true);
    setSeen(true);
    if (!welcomed.current) {
      welcomed.current = true;
      botSay('👋 Hi! I&rsquo;m the Impulse assistant. Ask me anything about our services, or pick a question below to get started.');
    }
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    timers.current.push(t);
  }, [botSay]);

  const closeChat = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Clear any in-flight typing timers if the widget unmounts mid-answer.
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Keep the transcript pinned to the newest message.
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages]);

  const onSubmit = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    say(text);
    setDraft('');
    botSay(findAnswer(text));
  };

  /* In-chat "#" links (e.g. Contact): close the chat and reuse the site's own
     smooth-scroll, which is already wired onto the nav's contact button. */
  const onBodyClick = (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    const hash = a.getAttribute('href');
    closeChat();
    const t = setTimeout(() => {
      const navLink = document.querySelector(
        `.nav-actions a.contact-btn[href="${hash}"], .nav-menu a[href="${hash}"]`
      );
      if (navLink) navLink.click();
      else document.querySelector(hash)?.scrollIntoView({ block: 'start' });
    }, 280);
    timers.current.push(t);
  };

  return (
    <div className={`chatbot${open ? ' cb-open' : ''}${seen ? ' cb-seen' : ''}`} id="chatbot">
      <div className="chatbot-panel" id="chatbot-panel" role="dialog" aria-label="Impulse help chat">
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <span className="chatbot-avatar" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="8" width="16" height="12" rx="3" /><path d="M12 8V5" /><circle cx="12" cy="3.6" r="1.4" fill="currentColor" stroke="none" /><path d="M9 14h.01M15 14h.01" /></svg>
            </span>
            <span className="chatbot-heading">
              <strong className="chatbot-title">Impulse Assistant</strong>
              <span className="chatbot-status"><i></i> Typically replies instantly</span>
            </span>
          </div>
          <button className="chatbot-close" id="chatbot-close" type="button" aria-label="Close chat" onClick={closeChat}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div className="chatbot-body" id="chatbot-body" ref={bodyRef} onClick={onBodyClick}>
          {messages.map((m) =>
            m.who === 'user' ? (
              // Rendered as text, so anything the visitor types is escaped by React.
              <div key={m.id} className="cb-msg cb-user">{m.text}</div>
            ) : m.typing ? (
              <div key={m.id} className="cb-msg cb-bot">
                <span className="cb-typing"><span></span><span></span><span></span></span>
              </div>
            ) : (
              <div key={m.id} className="cb-msg cb-bot" dangerouslySetInnerHTML={{ __html: m.html }} />
            )
          )}
        </div>

        <div className="chatbot-suggestions" id="chatbot-suggestions" aria-label="Frequently asked questions">
          {FAQ.map((item) => (
            <button key={item.q} type="button" className="cb-chip" onClick={() => ask(item)}>
              {item.q}
            </button>
          ))}
        </div>

        <form className="chatbot-input" id="chatbot-form" onSubmit={onSubmit}>
          <input
            type="text"
            id="chatbot-text"
            placeholder="Ask a question&hellip;"
            autoComplete="off"
            aria-label="Type your question"
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="submit" className="chatbot-send" aria-label="Send message">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7z" /></svg>
          </button>
        </form>
      </div>

      <button
        className="chatbot-launcher"
        id="chatbot-launcher"
        type="button"
        aria-label="Open help chat"
        aria-expanded={open}
        aria-controls="chatbot-panel"
        onClick={() => (open ? closeChat() : openChat())}
      >
        <svg className="cb-icon cb-icon-chat" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" /></svg>
        <svg className="cb-icon cb-icon-close" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>
    </div>
  );
}
