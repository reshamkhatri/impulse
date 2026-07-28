import { getSection, getCards, getCeo, getBoard, paragraphs } from '@/lib/content';
import { cloudinaryImage } from '@/lib/cloudinary';
import CardIcon from '@/components/CardIcon';

export const revalidate = 300;

export const metadata = {
  title: 'About Us',
  description:
    'Meet the Impulse Investment and Management team — corporate consulting, accounting, audits, and VAT filings for businesses across Nepal.'
};

export default async function AboutPage() {
  const [hero, intro, mvgSection, mvgCards, ceoSection, ceo, bodSection, board] =
    await Promise.all([
      getSection('about.hero'),
      getSection('about.intro'),
      getSection('about.mvg'),
      getCards('mvg'),
      getSection('about.ceo'),
      getCeo(),
      getSection('about.bod'),
      getBoard()
    ]);

  return (
    <main>
        <section className="hero" id="top" style={{ minHeight: '400px', height: '50vh' }}>
          <div className="hero-bg-wrap">
            <img src="/newhero.webp" alt="" className="hero-bg" aria-hidden="true" width="1672" height="941" decoding="async" fetchPriority="high" />
          </div>
          <div className="hero-scrim" aria-hidden="true"></div>
          <div className="hero-container" style={{ justifyContent: 'flex-end', paddingBottom: '4rem' }}>
            <div className="hero-content" style={{ maxWidth: '100%' }}>
              <h1 className="hero-title" style={{ marginBottom: '0.5rem' }}>
                <span className="bold-text">{hero.heading}</span>
              </h1>
              <p className="hero-subheadline">{hero.subheading}</p>
            </div>
          </div>
        </section>

        {/* Who we are */}
        <section className="about-intro">
          <div className="about-intro-inner">
            <div className="about-intro-copy">
              <span className="about-tag">{intro.eyebrow}</span>
              <h2 className="about-intro-title">{intro.heading}</h2>
              {paragraphs(intro.body).map((text, i) => <p key={i}>{text}</p>)}
              <div className="about-intro-stats">
                <div><strong>50+</strong><span>Businesses served</span></div>
                <div><strong>4</strong><span>Core services</span></div>
                <div><strong>100%</strong><span>Compliance focus</span></div>
              </div>
            </div>
            <div className="about-intro-media">
              <img src="/about_office.jpg" alt="The Impulse team at work" width="640" height="480" loading="lazy" decoding="async" />
            </div>
          </div>
        </section>

        {/* Mission / Vision / Goal */}
        <section className="mvg">
          <div className="about-section-head">
            <span className="about-tag">{mvgSection.eyebrow}</span>
            <h2>{mvgSection.heading}</h2>
          </div>
          <div className="mvg-grid">
            {mvgCards.map((card) => (
              <article className={`mvg-card${card.featured ? ' mvg-card--accent' : ''}`} key={card.id}>
                <div className="mvg-icon"><CardIcon name={card.icon} size={26} strokeWidth={2} /></div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CEO */}
        {ceo && (
          <section className="ceo">
            <div className="ceo-inner">
              <div className="ceo-media">
                <img
                  src={cloudinaryImage(ceo.photo_url, { width: 700, height: 875 })}
                  alt={`${ceo.name}, ${ceo.role}`}
                  width="700" height="875" loading="lazy" decoding="async"
                />
                <span className="ceo-badge">{ceo.role}</span>
              </div>
              <div className="ceo-body">
                <span className="about-tag">{ceoSection.eyebrow}</span>
                <h2>{ceoSection.heading}</h2>
                {ceo.quote && <p className="ceo-quote">&ldquo;{ceo.quote}&rdquo;</p>}
                {paragraphs(ceo.bio).map((text, i) => <p key={i}>{text}</p>)}
                <div className="ceo-sign">
                  <strong>{ceo.name}</strong>
                  <span>{ceo.role}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Board of Directors */}
        {board.length > 0 && (
          <section className="bod">
            <div className="about-section-head">
              <span className="about-tag">{bodSection.eyebrow}</span>
              <h2>{bodSection.heading}</h2>
              <p>{bodSection.subheading}</p>
            </div>
            {/* Names only — no portraits, roles, bios or social links. The
                columns still hold that data, so the admin panel keeps it and it
                can be surfaced again without a migration. */}
            <div className="bod-grid">
              {board.map((member) => (
                <article className="bod-card" key={member.id}>
                  <span className="bod-name">{member.name}</span>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
  );
}
