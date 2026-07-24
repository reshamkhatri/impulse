/* ==========================================================================
   Impulse — FAQ chatbot widget (self-contained, no backend, no dependencies)
   Edit the FAQ array below to change the questions & answers — that's the
   entire knowledge base. Answers may contain simple HTML (<strong>, <a>).
   ========================================================================== */
(function () {
  const root = document.getElementById('chatbot');
  if (!root) return;
  const launcher = document.getElementById('chatbot-launcher');
  const closeBtn = document.getElementById('chatbot-close');
  const body = document.getElementById('chatbot-body');
  const suggWrap = document.getElementById('chatbot-suggestions');
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-text');

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

  let opened = false, welcomed = false;

  const esc = s => { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; };

  function bubble(html, who) {
    const el = document.createElement('div');
    el.className = 'cb-msg cb-' + who;
    el.innerHTML = html;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  }

  function botSay(html) {
    const el = bubble('<span class="cb-typing"><span></span><span></span><span></span></span>', 'bot');
    setTimeout(() => { el.innerHTML = html; body.scrollTop = body.scrollHeight; }, 500);
  }

  function ask(item) { bubble(esc(item.q), 'user'); botSay(item.a); }

  function findAnswer(text) {
    const t = text.toLowerCase();
    let best = null, score = 0;
    FAQ.forEach(item => {
      let s = 0;
      item.k.forEach(kw => { if (t.indexOf(kw) !== -1) s += kw.split(' ').length; });
      if (s > score) { score = s; best = item; }
    });
    return (best && score > 0)
      ? best.a
      : 'Good question! I&rsquo;m not sure about that specific one — the quickest way is to <a href="#contact">get a free consultation</a> and our team will help you directly.';
  }

  FAQ.forEach(item => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'cb-chip';
    chip.textContent = item.q;
    chip.addEventListener('click', () => ask(item));
    suggWrap.appendChild(chip);
  });

  function welcome() {
    if (welcomed) return; welcomed = true;
    botSay('👋 Hi! I&rsquo;m the Impulse assistant. Ask me anything about our services, or pick a question below to get started.');
  }

  function open() {
    opened = true;
    root.classList.add('cb-open', 'cb-seen');
    launcher.setAttribute('aria-expanded', 'true');
    welcome();
    setTimeout(() => { if (input) input.focus(); }, 300);
  }
  function close() {
    opened = false;
    root.classList.remove('cb-open');
    launcher.setAttribute('aria-expanded', 'false');
  }

  launcher.addEventListener('click', () => (opened ? close() : open()));
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && opened) close(); });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    bubble(esc(text), 'user');
    input.value = '';
    botSay(findAnswer(text));
  });

  /* In-chat "#" links (e.g. Contact): close the chat and reuse the site's own
     smooth-scroll, which is already wired onto the nav's contact button. */
  body.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    const hash = a.getAttribute('href');
    close();
    setTimeout(() => {
      const navLink = document.querySelector('.nav-actions a.contact-btn[href="' + hash + '"], .nav-menu a[href="' + hash + '"]');
      if (navLink) navLink.click();
      else { const target = document.querySelector(hash); if (target) target.scrollIntoView({ block: 'start' }); }
    }, 280);
  });
})();
