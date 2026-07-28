export const metadata = {
  title: 'Services',
  description:
    'Business consulting, accounting & bookkeeping, VAT filing, and taxation advisory for growing businesses in Nepal.'
};

export default function ServicesPage() {
  return (
    <main>
        <section className="services-page-hero" id="services">
          <div className="section-container services-page-hero-shell">
            <div className="services-page-blue-stage">

              <div className="services-page-hero-copy">
                <h1>Simple, reliable business support.</h1>
                <p>Choose the support your business needs today, then grow into deeper compliance, accounting, and advisory care as your work expands.</p>
              </div>

              <div className="services-page-card-row" id="service-details">
                <article className="services-page-plan-card">
                  <span className="services-page-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M5 21V7l7-4 7 4v14"></path><path d="M9 21v-8h6v8"></path></svg>
                  </span>
                  <h2>Company Compliance</h2>
                  <p>For registration, renewals, changes, and corporate documentation that must be handled correctly.</p>
                  <ul>
                    <li>Company registration</li>
                    <li>Company renewal and closure</li>
                    <li>Share transfer</li>
                    <li>Address and object changes</li>
                    <li>Trademark registration</li>
                    <li>NGO registration and renewal</li>
                  </ul>
                  <a href="#contact">Start compliance work</a>
                </article>

                <article className="services-page-plan-card is-featured">
                  <span className="services-page-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v18z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path><path d="M8 17h6"></path></svg>
                  </span>
                  <h2>Accounting &amp; Tax</h2>
                  <p>For clean books, tax readiness, VAT filing, and financial statements your team can actually trust.</p>
                  <ul>
                    <li>Tax filing</li>
                    <li>VAT filing</li>
                    <li>Financial statement preparation</li>
                    <li>Accounting and bookkeeping</li>
                    <li>Software accounting management</li>
                    <li>Intern report preparation</li>
                  </ul>
                  <a href="#contact">Talk to an accountant</a>
                </article>

                <article className="services-page-plan-card">
                  <span className="services-page-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="m7 15 4-4 3 3 5-7"></path></svg>
                  </span>
                  <h2>Finance Advisory</h2>
                  <p>For decisions that need forecasts, planning, reports, and practical business direction.</p>
                  <ul>
                    <li>Project report</li>
                    <li>Forecast</li>
                    <li>Investment planning</li>
                    <li>Strategy planning</li>
                    <li>HR policy</li>
                  </ul>
                  <a href="#contact">Plan with Impulse</a>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="services-page-support" aria-labelledby="services-support-heading">
          <div className="section-container services-page-support-grid">
            <div className="services-page-support-copy">
              <span className="services-page-kicker"><i></i> How it feels to work with us</span>
              <h2 id="services-support-heading">One calm system for the messy business work.</h2>
              <p>Impulse keeps the official, financial, and strategic work organized so you are not chasing different people for every small thing.</p>
            </div>
            <div className="services-page-support-steps">
              <article>
                <span>01</span>
                <h3>We understand the situation</h3>
                <p>We look at your company stage, records, filings, and immediate priorities.</p>
              </article>
              <article>
                <span>02</span>
                <h3>We organize the work</h3>
                <p>Documents, accounts, filings, and reports are arranged in the right order.</p>
              </article>
              <article>
                <span>03</span>
                <h3>You move with clarity</h3>
                <p>You get completed work, clean handoff, and simple next-step guidance.</p>
              </article>
            </div>
          </div>
        </section>
      </main>
  );
}
