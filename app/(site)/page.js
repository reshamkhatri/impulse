import Umbrella3D from '@/components/Umbrella3D';
import MissionBand from '@/components/MissionBand';
import CardIcon from '@/components/CardIcon';
import { getSection, getCards } from '@/lib/content';
import { cloudinaryImage } from '@/lib/cloudinary';

export const revalidate = 300;

export default async function Home() {
  const [hero, umbrella, servicesHead, trust, testimonials, services] = await Promise.all([
    getSection('home.hero'),
    getSection('home.umbrella'),
    getSection('home.services'),
    getSection('home.trust'),
    getSection('home.testimonials'),
    getCards('home_services')
  ]);

  return (
    <main>
        <section className="hero" id="top">
          {/* Parallax background layer */}
          <div className="hero-bg-wrap">
            <img src="/newhero.webp" alt="" className="hero-bg" aria-hidden="true" width="1672" height="941" decoding="async" fetchPriority="high" />
          </div>
          {/* Legibility scrim overlay */}
          <div className="hero-scrim" aria-hidden="true"></div>

          <div className="hero-container">

            {/* Text overlay and Call to Actions */}
            <div className="hero-content">
              <h1 className="hero-title">
                <span className="thin-text">
                  {hero.heading}
                </span>
                <span className="bold-text">{hero.heading_alt}</span>
              </h1>

              <p className="hero-subheadline">{hero.subheading}</p>

            </div>

            {/* Glassmorphic Stat Box (50+ businesses helped) */}
            <div className="stat-box-glass">
              <div className="stat-header">
                <span className="stat-number">50+</span>
                <span className="stat-label">businesses helped<br />in Nepal</span>
              </div>
              <div className="stat-avatars">
                <img src="/avatar_one.jpg" alt="Client Avatar 1" width="128" height="128" decoding="async" loading="lazy" />
                <img src="/avatar_two.jpg" alt="Client Avatar 2" width="128" height="128" decoding="async" loading="lazy" />
                <img src="/avatar_three.jpg" alt="Client Avatar 3" width="128" height="128" decoding="async" loading="lazy" />
              </div>
            </div>


          </div>
        </section>

        {/* Four-piece Corporate Umbrella Assembly */}
        <section className="section-umbrella" aria-labelledby="umbrella-heading">
          <div className="umbrella-sky" aria-hidden="true">
            <div className="cloud-band cloud-band-far"></div>
            <div className="cloud-band cloud-band-mid"></div>
            <div className="cloud-band cloud-band-near"></div>
          </div>
          <div className="umbrella-pin-content">
            <div className="umbrella-section-copy">
              <h2 className="umbrella-assembly-title" id="umbrella-heading">{umbrella.heading}<br /><span>{umbrella.heading_alt}</span></h2>
            </div>

            <div className="umbrella-scene">
              <Umbrella3D />
            </div>
          </div>
        </section>

        {/* Mission / vision / goal, one line each */}
        <MissionBand />

        {/* 2. Re-designed Services Section */}
        <section className="section-services-grid" id="services">
          <div className="services-container">

            <div className="services-header">
              <h2 className="services-headline">{servicesHead.heading}</h2>
            </div>

            <div className="services-grid-wrapper">
              {services.map((service) => (
                <div className="service-grid-card" key={service.id}>
                  <div className="sg-card-top">
                    <div className="sg-card-text">
                      <h3 className="sg-title">{service.title}</h3>
                      <p className="sg-desc">{service.description}</p>
                    </div>
                    <a
                      href={service.cta_href || '#contact'}
                      className="sg-arrow-link"
                      aria-label={`Learn more about ${service.title}`}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                    </a>
                  </div>
                  <div className="sg-card-image-box">
                    <img
                      src={cloudinaryImage(service.image_url, { width: 640, height: 640 })}
                      alt={service.title}
                      width="640" height="640" decoding="async" loading="lazy"
                    />
                    <div className="sg-icon-bubble">
                      <CardIcon name={service.icon} size={18} strokeWidth={2} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

    {/* Trust Bar / Logo Ticker */}
        <section className="trust-bar">
          <p className="trust-bar-headline">{trust.heading}</p>
          <div className="trust-ticker-wrapper">
            <div className="trust-ticker-track">
              {/* Set 1 */}
              <span className="trust-logo-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                Constellation School
              </span>
              <span className="trust-logo-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                Civil Verse Construction
              </span>
              <span className="trust-logo-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                Audio Visual Arts
              </span>
              <span className="trust-logo-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>
                NepaCraft Pvt. Ltd
              </span>
              <span className="trust-logo-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                Himalayan Traders
              </span>
              <span className="trust-logo-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                Summit Finance
              </span>
              <span className="trust-logo-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                KTM Ventures
              </span>
              <span className="trust-logo-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Lumbini Group
              </span>
              {/* Set 2 (duplicate for seamless loop) */}
              <span className="trust-logo-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                Constellation School
              </span>
              <span className="trust-logo-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                Civil Verse Construction
              </span>
              <span className="trust-logo-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                Audio Visual Arts
              </span>
              <span className="trust-logo-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>
                NepaCraft Pvt. Ltd
              </span>
              <span className="trust-logo-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                Himalayan Traders
              </span>
              <span className="trust-logo-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                Summit Finance
              </span>
              <span className="trust-logo-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                KTM Ventures
              </span>
              <span className="trust-logo-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Lumbini Group
              </span>
            </div>
          </div>
        </section>





        {/* Client Testimonials Section (Dual-Row Infinite Scrolling Marquee) */}
        <section className="section-testimonials" id="testimonials">
          <div className="testimonials-header-container">
            <h2 className="testimonials-main-title">{testimonials.heading}</h2>
            <p className="testimonials-subtitle">{testimonials.subheading}</p>
          </div>

          <div className="testimonials-marquee-wrapper">
            {/* Row 1: Scrolling Right to Left */}
            <div className="marquee-row row-left">
              <div className="marquee-track">
                {/* Card 1 */}
                <div className="testimonial-pastel-card card-coral">
                  <p className="testimonial-pastel-quote">"Constellation School highly recommends Impulse Investment and Management Private Limited for their exceptional accounting and bookkeeping services. Their professional and efficient approach has greatly benefited our school, ensuring accurate financial management."</p>
                  <div className="testimonial-pastel-author">
                    <img src="/avatar_one.jpg" alt="Constellation School Representative" className="pastel-author-img" width="128" height="128" decoding="async" loading="lazy" />
                    <div className="pastel-author-info">
                      <h3 className="pastel-author-name">Constellation School</h3>
                      <span className="pastel-author-desc">Education Sector, Nepal</span>
                    </div>
                  </div>
                </div>
                {/* Card 2 */}
                <div className="testimonial-pastel-card card-orange">
                  <p className="testimonial-pastel-quote">"Civil Verse Construction is extremely pleased with the exceptional accounting and bookkeeping, financial forecasting, legal, and business consulting services provided by Impulse. Their expertise and professionalism have been invaluable to our growth."</p>
                  <div className="testimonial-pastel-author">
                    <img src="/avatar_two.jpg" alt="Civil Verse Construction Representative" className="pastel-author-img" width="128" height="128" decoding="async" loading="lazy" />
                    <div className="pastel-author-info">
                      <h3 className="pastel-author-name">Civil Verse Construction</h3>
                      <span className="pastel-author-desc">Infrastructure, Lalitpur</span>
                    </div>
                  </div>
                </div>
                {/* Card 3 */}
                <div className="testimonial-pastel-card card-yellow">
                  <p className="testimonial-pastel-quote">"Aavas Media is extremely satisfied with Impulse's accounting and bookkeeping services, as well as their legal and business consulting expertise. Their professional and knowledgeable team has been instrumental in ensuring our financial stability."</p>
                  <div className="testimonial-pastel-author">
                    <img src="/avatar_three.jpg" alt="Audio Visual Arts Representative" className="pastel-author-img" width="128" height="128" decoding="async" loading="lazy" />
                    <div className="pastel-author-info">
                      <h3 className="pastel-author-name">Audio Visual Arts</h3>
                      <span className="pastel-author-desc">Aavas Media, Kathmandu</span>
                    </div>
                  </div>
                </div>
                {/* Card 4 */}
                <div className="testimonial-pastel-card card-blue">
                  <p className="testimonial-pastel-quote">"The Rotary Club of Kathmandu North recommends Impulse Investment for legal consulting services. Their expertise, professionalism, and invaluable guidance have been instrumental in ensuring the club's compliance with regulations."</p>
                  <div className="testimonial-pastel-author">
                    <img src="/avatar_four.jpg" alt="Rotary Club Representative" className="pastel-author-img" width="128" height="128" decoding="async" loading="lazy" />
                    <div className="pastel-author-info">
                      <h3 className="pastel-author-name">Rotary Club KTM North</h3>
                      <span className="pastel-author-desc">Non-Profit Organization</span>
                    </div>
                  </div>
                </div>

                {/* Duplicate Set 1 for infinite scroll */}
                <div className="testimonial-pastel-card card-coral">
                  <p className="testimonial-pastel-quote">"Constellation School highly recommends Impulse Investment and Management Private Limited for their exceptional accounting and bookkeeping services. Their professional and efficient approach has greatly benefited our school, ensuring accurate financial management."</p>
                  <div className="testimonial-pastel-author">
                    <img src="/avatar_one.jpg" alt="Constellation School Representative" className="pastel-author-img" width="128" height="128" decoding="async" loading="lazy" />
                    <div className="pastel-author-info">
                      <h3 className="pastel-author-name">Constellation School</h3>
                      <span className="pastel-author-desc">Education Sector, Nepal</span>
                    </div>
                  </div>
                </div>
                <div className="testimonial-pastel-card card-orange">
                  <p className="testimonial-pastel-quote">"Civil Verse Construction is extremely pleased with the exceptional accounting and bookkeeping, financial forecasting, legal, and business consulting services provided by Impulse. Their expertise and professionalism have been invaluable to our growth."</p>
                  <div className="testimonial-pastel-author">
                    <img src="/avatar_two.jpg" alt="Civil Verse Construction Representative" className="pastel-author-img" width="128" height="128" decoding="async" loading="lazy" />
                    <div className="pastel-author-info">
                      <h3 className="pastel-author-name">Civil Verse Construction</h3>
                      <span className="pastel-author-desc">Infrastructure, Lalitpur</span>
                    </div>
                  </div>
                </div>
                <div className="testimonial-pastel-card card-yellow">
                  <p className="testimonial-pastel-quote">"Aavas Media is extremely satisfied with Impulse's accounting and bookkeeping services, as well as their legal and business consulting expertise. Their professional and knowledgeable team has been instrumental in ensuring our financial stability."</p>
                  <div className="testimonial-pastel-author">
                    <img src="/avatar_three.jpg" alt="Audio Visual Arts Representative" className="pastel-author-img" width="128" height="128" decoding="async" loading="lazy" />
                    <div className="pastel-author-info">
                      <h3 className="pastel-author-name">Audio Visual Arts</h3>
                      <span className="pastel-author-desc">Aavas Media, Kathmandu</span>
                    </div>
                  </div>
                </div>
                <div className="testimonial-pastel-card card-blue">
                  <p className="testimonial-pastel-quote">"The Rotary Club of Kathmandu North recommends Impulse Investment for legal consulting services. Their expertise, professionalism, and invaluable guidance have been instrumental in ensuring the club's compliance with regulations."</p>
                  <div className="testimonial-pastel-author">
                    <img src="/avatar_four.jpg" alt="Rotary Club Representative" className="pastel-author-img" width="128" height="128" decoding="async" loading="lazy" />
                    <div className="pastel-author-info">
                      <h3 className="pastel-author-name">Rotary Club KTM North</h3>
                      <span className="pastel-author-desc">Non-Profit Organization</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Scrolling Left to Right - Real Google Reviews */}
            <div className="marquee-row row-right">
              <div className="marquee-track">
                {/* Reusable gold star shape for the Google review ratings */}
                <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true"><symbol id="gr-star-shape" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></symbol></svg>
                <div className="google-review-card">
                  <div className="gr-header">
                    <div className="gr-avatar-circle" style={{ backgroundColor: '#1a73e8' }}>b</div>
                    <div className="gr-author-info">
                      <h3 className="gr-name">bggroupcompany</h3>
                      <span className="gr-subtitle">1 review</span>
                    </div>
                    <div className="gr-options"><svg viewBox="0 0 24 24" width="20" height="20" fill="#5f6368"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></div>
                  </div>
                  <div className="gr-rating">
                    <div className="gr-stars">
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                    </div>
                    <span className="gr-time">2 weeks ago</span>
                  </div>
                  <p className="gr-text">"I had best experience with this company. Impulse Investment and Management guided me through the entire company registration process without any stress."</p>
                </div>
                <div className="google-review-card">
                  <div className="gr-header">
                    <div className="gr-avatar-circle" style={{ backgroundColor: '#d93025' }}>K</div>
                    <div className="gr-author-info">
                      <h3 className="gr-name">Khusi Kendra</h3>
                      <span className="gr-subtitle">1 review</span>
                    </div>
                    <div className="gr-options"><svg viewBox="0 0 24 24" width="20" height="20" fill="#5f6368"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></div>
                  </div>
                  <div className="gr-rating">
                    <div className="gr-stars">
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                    </div>
                    <span className="gr-time">11 months ago</span>
                  </div>
                  <p className="gr-text">"Thank you for helping me in registering my company. Affordable cost and great service, especially very nice way of follow up and sending reminders."</p>
                </div>
                <div className="google-review-card">
                  <div className="gr-header">
                    <div className="gr-avatar-circle" style={{ backgroundColor: '#188038' }}>S</div>
                    <div className="gr-author-info">
                      <h3 className="gr-name">Sagoon Lamichhane</h3>
                      <span className="gr-subtitle">1 review</span>
                    </div>
                    <div className="gr-options"><svg viewBox="0 0 24 24" width="20" height="20" fill="#5f6368"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></div>
                  </div>
                  <div className="gr-rating">
                    <div className="gr-stars">
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                    </div>
                    <span className="gr-time">a year ago</span>
                  </div>
                  <p className="gr-text">"This company helped me a lot with my business. They gave me good advise and support. I am very happy with their service 😍"</p>
                </div>
                <div className="google-review-card">
                  <div className="gr-header">
                    <div className="gr-avatar-circle" style={{ backgroundColor: '#a142f4' }}>M</div>
                    <div className="gr-author-info">
                      <h3 className="gr-name">Mahaprashad Pathak</h3>
                      <span className="gr-subtitle">1 review</span>
                    </div>
                    <div className="gr-options"><svg viewBox="0 0 24 24" width="20" height="20" fill="#5f6368"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></div>
                  </div>
                  <div className="gr-rating">
                    <div className="gr-stars">
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star gr-star-empty" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                    </div>
                    <span className="gr-time">a year ago</span>
                  </div>
                  <p className="gr-text">"If you're starting a new business, I really suggest this company. They explain everything clearly and help you plan well."</p>
                </div>
                <div className="google-review-card">
                  <div className="gr-header">
                    <div className="gr-avatar-circle" style={{ backgroundColor: '#f29900' }}>N</div>
                    <div className="gr-author-info">
                      <h3 className="gr-name">Niruta Baram</h3>
                      <span className="gr-subtitle">2 reviews</span>
                    </div>
                    <div className="gr-options"><svg viewBox="0 0 24 24" width="20" height="20" fill="#5f6368"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></div>
                  </div>
                  <div className="gr-rating">
                    <div className="gr-stars">
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star gr-star-empty" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                    </div>
                    <span className="gr-time">a year ago</span>
                  </div>
                  <p className="gr-text">"This company help students with motivation and training. It's great to see a company helping young people."</p>
                </div>
                <div className="google-review-card">
                  <div className="gr-header">
                    <div className="gr-avatar-circle" style={{ backgroundColor: '#009688' }}>K</div>
                    <div className="gr-author-info">
                      <h3 className="gr-name">Keshab Ghimire</h3>
                      <span className="gr-subtitle">Local Guide · 26 reviews</span>
                    </div>
                    <div className="gr-options"><svg viewBox="0 0 24 24" width="20" height="20" fill="#5f6368"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></div>
                  </div>
                  <div className="gr-rating">
                    <div className="gr-stars">
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                    </div>
                    <span className="gr-time">a year ago</span>
                  </div>
                  <p className="gr-text">"100% Secure for investment and other activities."</p>
                </div>

                {/* Duplicate set for seamless -50% loop */}
                <div className="google-review-card">
                  <div className="gr-header">
                    <div className="gr-avatar-circle" style={{ backgroundColor: '#1a73e8' }}>b</div>
                    <div className="gr-author-info">
                      <h3 className="gr-name">bggroupcompany</h3>
                      <span className="gr-subtitle">1 review</span>
                    </div>
                    <div className="gr-options"><svg viewBox="0 0 24 24" width="20" height="20" fill="#5f6368"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></div>
                  </div>
                  <div className="gr-rating">
                    <div className="gr-stars">
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                    </div>
                    <span className="gr-time">2 weeks ago</span>
                  </div>
                  <p className="gr-text">"I had best experience with this company. Impulse Investment and Management guided me through the entire company registration process without any stress."</p>
                </div>
                <div className="google-review-card">
                  <div className="gr-header">
                    <div className="gr-avatar-circle" style={{ backgroundColor: '#d93025' }}>K</div>
                    <div className="gr-author-info">
                      <h3 className="gr-name">Khusi Kendra</h3>
                      <span className="gr-subtitle">1 review</span>
                    </div>
                    <div className="gr-options"><svg viewBox="0 0 24 24" width="20" height="20" fill="#5f6368"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></div>
                  </div>
                  <div className="gr-rating">
                    <div className="gr-stars">
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                    </div>
                    <span className="gr-time">11 months ago</span>
                  </div>
                  <p className="gr-text">"Thank you for helping me in registering my company. Affordable cost and great service, especially very nice way of follow up and sending reminders."</p>
                </div>
                <div className="google-review-card">
                  <div className="gr-header">
                    <div className="gr-avatar-circle" style={{ backgroundColor: '#188038' }}>S</div>
                    <div className="gr-author-info">
                      <h3 className="gr-name">Sagoon Lamichhane</h3>
                      <span className="gr-subtitle">1 review</span>
                    </div>
                    <div className="gr-options"><svg viewBox="0 0 24 24" width="20" height="20" fill="#5f6368"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></div>
                  </div>
                  <div className="gr-rating">
                    <div className="gr-stars">
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                    </div>
                    <span className="gr-time">a year ago</span>
                  </div>
                  <p className="gr-text">"This company helped me a lot with my business. They gave me good advise and support. I am very happy with their service 😍"</p>
                </div>
                <div className="google-review-card">
                  <div className="gr-header">
                    <div className="gr-avatar-circle" style={{ backgroundColor: '#a142f4' }}>M</div>
                    <div className="gr-author-info">
                      <h3 className="gr-name">Mahaprashad Pathak</h3>
                      <span className="gr-subtitle">1 review</span>
                    </div>
                    <div className="gr-options"><svg viewBox="0 0 24 24" width="20" height="20" fill="#5f6368"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></div>
                  </div>
                  <div className="gr-rating">
                    <div className="gr-stars">
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star gr-star-empty" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                    </div>
                    <span className="gr-time">a year ago</span>
                  </div>
                  <p className="gr-text">"If you're starting a new business, I really suggest this company. They explain everything clearly and help you plan well."</p>
                </div>
                <div className="google-review-card">
                  <div className="gr-header">
                    <div className="gr-avatar-circle" style={{ backgroundColor: '#f29900' }}>N</div>
                    <div className="gr-author-info">
                      <h3 className="gr-name">Niruta Baram</h3>
                      <span className="gr-subtitle">2 reviews</span>
                    </div>
                    <div className="gr-options"><svg viewBox="0 0 24 24" width="20" height="20" fill="#5f6368"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></div>
                  </div>
                  <div className="gr-rating">
                    <div className="gr-stars">
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star gr-star-empty" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                    </div>
                    <span className="gr-time">a year ago</span>
                  </div>
                  <p className="gr-text">"This company help students with motivation and training. It's great to see a company helping young people."</p>
                </div>
                <div className="google-review-card">
                  <div className="gr-header">
                    <div className="gr-avatar-circle" style={{ backgroundColor: '#009688' }}>K</div>
                    <div className="gr-author-info">
                      <h3 className="gr-name">Keshab Ghimire</h3>
                      <span className="gr-subtitle">Local Guide · 26 reviews</span>
                    </div>
                    <div className="gr-options"><svg viewBox="0 0 24 24" width="20" height="20" fill="#5f6368"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></div>
                  </div>
                  <div className="gr-rating">
                    <div className="gr-stars">
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                      <svg className="gr-star" width="16" height="16" viewBox="0 0 24 24"><use href="#gr-star-shape"></use></svg>
                    </div>
                    <span className="gr-time">a year ago</span>
                  </div>
                  <p className="gr-text">"100% Secure for investment and other activities."</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
  );
}
