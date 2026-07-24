import sys

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

header_end = content.find('<main>')
footer_start = content.find('</main>') + len('</main>')

header_part = content[:header_end]
footer_part = content[footer_start:]

about_main = '''<main>
    <section class="hero" id="top" style="min-height: 400px; height: 50vh;">
      <div class="hero-bg-wrap">
        <img src="newhero.webp" alt="" class="hero-bg" aria-hidden="true">
      </div>
      <div class="hero-scrim" aria-hidden="true"></div>
      <div class="hero-container" style="justify-content: flex-end; padding-bottom: 4rem;">
        <div class="hero-content" style="max-width: 100%;">
          <h1 class="hero-title" style="margin-bottom: 0.5rem;">
            <span class="bold-text">About Us</span>
          </h1>
          <p class="hero-subheadline">We’re a Trusted and Professional Management Company</p>
        </div>
      </div>
    </section>

    <section class="section-cards">
      <div class="cards-grid">
        <!-- Intro -->
        <div class="feature-card card-white" style="grid-column: 1 / -1; min-height: auto; padding-bottom: 2rem;">
          <h2 style="font-family: var(--font-sans); color: var(--color-brand-blue); font-size: 2rem; margin-bottom: 1.5rem;">Who We Are</h2>
          <p style="font-size: 1.1rem; line-height: 1.7; color: var(--color-text-dark); margin-bottom: 2rem;">
            Impulse Investment and Management Private Limited is an esteemed company specializing in a wide range of services including business consulting, financial forecasting, accounting and bookkeeping, training and seminars, as well as VAT and tax-related works. With an unwavering commitment to excellence, Impulse offers comprehensive and proficient assistance to businesses of all sizes and industries. Their dedicated team combines extensive expertise, innovative strategies, and meticulous attention to detail to deliver tailored solutions to their clients. Whether it's helping businesses make informed decisions, ensuring accurate financial management, or providing ongoing support with tax and VAT compliance, Impulse Investment and Management Private Limited is the trusted partner to navigate the complexities of the business landscape.
          </p>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 2rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-brand-blue)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span style="font-weight: 600;">Best Stock Managment</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-brand-blue)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span style="font-weight: 600;">Trusted &amp; Experience Management</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-brand-blue)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span style="font-weight: 600;">Company Registration</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-brand-blue)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span style="font-weight: 600;">Expertise Advisor</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-brand-blue)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span style="font-weight: 600;">Key Managerial Persons</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-brand-blue)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span style="font-weight: 600;">Friendly Staff</span>
            </div>
          </div>
        </div>

        <!-- Mission -->
        <div class="feature-card card-white">
          <h3 style="font-family: var(--font-sans); color: var(--color-brand-blue); font-size: 1.5rem; margin-bottom: 1rem;">Our Mission</h3>
          <p style="color: var(--color-text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
            To provide top-notch, quality services that exceed customer expectations. We are dedicated to delivering efficient, effective, and economically viable solutions that contribute to the success and growth of our clients.
          </p>
          <ul style="list-style: none; padding: 0;">
            <li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: var(--color-text-dark); font-weight: 500;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--color-brand-orange)" stroke-width="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
              Empower Financial Growth
            </li>
            <li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: var(--color-text-dark); font-weight: 500;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--color-brand-orange)" stroke-width="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
              Provide Expert Guidance
            </li>
            <li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: var(--color-text-dark); font-weight: 500;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--color-brand-orange)" stroke-width="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
              Enhance Community Well-being
            </li>
          </ul>
        </div>

        <!-- Vision -->
        <div class="feature-card card-white">
          <h3 style="font-family: var(--font-sans); color: var(--color-brand-blue); font-size: 1.5rem; margin-bottom: 1rem;">Our Vision</h3>
          <p style="color: var(--color-text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
            To be recognized as a leading provider of quality services, ensuring utmost customer satisfaction. We are committed to achieving this by upholding the principles of efficiency, effectiveness, and economic viability.
          </p>
          <ul style="list-style: none; padding: 0;">
            <li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: var(--color-text-dark); font-weight: 500;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--color-brand-orange)" stroke-width="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
              Leadership in Financial Solutions
            </li>
            <li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: var(--color-text-dark); font-weight: 500;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--color-brand-orange)" stroke-width="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
              Client-Centric Excellence
            </li>
            <li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: var(--color-text-dark); font-weight: 500;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--color-brand-orange)" stroke-width="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
              Global Impact
            </li>
          </ul>
        </div>

        <!-- Goal -->
        <div class="feature-card card-lime">
          <h3 style="font-family: var(--font-sans); color: #ffffff; font-size: 1.5rem; margin-bottom: 1rem;">Our Goal</h3>
          <p style="color: rgba(255,255,255,0.9); line-height: 1.6; margin-bottom: 1.5rem;">
            To consistently deliver exceptional service and exceed client expectations. We strive to achieve this by providing innovative solutions that optimize efficiency, effectiveness, and economic viability for our clients.
          </p>
          <ul style="list-style: none; padding: 0;">
            <li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: #ffffff; font-weight: 500;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill=\"none\" stroke=\"#ffffff\" stroke-width="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
              Educational Initiatives
            </li>
            <li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: #ffffff; font-weight: 500;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ffffff" stroke-width="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
              Innovation and Adaptability
            </li>
            <li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: #ffffff; font-weight: 500;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ffffff" stroke-width="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
              Sustainable Growth
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>'''

header_part = header_part.replace('<title>Impulse - Investment &amp; Management | Business Consulting in Nepal</title>', '<title>About Us - Impulse</title>')
header_part = header_part.replace('<a href="#top" class="nav-link active">Home</a>', '<a href="index.html" class="nav-link">Home</a>\n        <a href="about-us.html" class="nav-link active">About Us</a>')

with open('about-us.html', 'w', encoding='utf-8') as f:
    f.write(header_part + about_main + footer_part)
