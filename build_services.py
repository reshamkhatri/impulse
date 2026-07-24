import re

def update_links(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace links to #services with services.html
    content = content.replace('href="#services"', 'href="services.html"')
    content = content.replace('href="index.html#services"', 'href="services.html"')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_links('index.html')
try:
    update_links('about-us.html')
except FileNotFoundError:
    pass

# Create services.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract header, nav, and footer
header_match = re.search(r'(<html.*?</header>)', html, re.DOTALL)
footer_match = re.search(r'(<footer.*?</html\s*>)', html, re.DOTALL)

if header_match and footer_match:
    header = header_match.group(1)
    footer = footer_match.group(1)
    
    # Let's adjust the title in the header
    header = header.replace('<title>Impulse Investment and Management Pvt. Ltd.</title>', '<title>Services - Impulse Investment and Management Pvt. Ltd.</title>')
    
    # Make the services link active
    header = header.replace('<a href="#top" class="nav-link active">Home</a>', '<a href="index.html" class="nav-link">Home</a>')
    header = header.replace('<a href="services.html" class="nav-link">Services</a>', '<a href="services.html" class="nav-link active">Services</a>')

    services_content = """
  <main>
    <section class="section-services-grid page-header-spacing" id="services" style="padding-top: 150px;">
      <div class="services-container">
        <div class="services-header">
          <h1 class="services-headline">Our Services</h1>
          <p style="text-align: center; color: var(--color-text-muted); max-width: 600px; margin: 0 auto 3rem;">We provide a wide range of services to help you grow and protect your business.</p>
        </div>
        
        <div class="services-grid-wrapper">
          
          <!-- Card 1 -->
          <div class="service-grid-card list-style-card">
            <div class="sg-card-top">
              <div class="sg-card-text">
                <div class="sg-card-header-flex">
                  <div class="sg-icon-bubble list-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                  </div>
                  <h3 class="sg-title">Company Related<br>Compliance</h3>
                </div>
                <ul class="sg-service-list">
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Company Registration</li>
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Company Renewal</li>
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Company Closure</li>
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Share Transfer</li>
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Change in Address</li>
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Change in Object</li>
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Trademark Registration</li>
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>NGO Registration</li>
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>NGO Renewal</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="service-grid-card list-style-card">
            <div class="sg-card-top">
              <div class="sg-card-text">
                <div class="sg-card-header-flex">
                  <div class="sg-icon-bubble list-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M2 15h10"></path><path d="M2 18h10"></path><path d="M2 21h10"></path></svg>
                  </div>
                  <h3 class="sg-title">Accounting, Finance<br>& Book Keeping</h3>
                </div>
                <ul class="sg-service-list">
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>TAX Filing</li>
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>VAT Filing</li>
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Preparation of Financial Statement</li>
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Accounting & Book Keeping</li>
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Software A/Cing Mgmt</li>
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Intern Report Preparation</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="service-grid-card list-style-card">
            <div class="sg-card-top">
              <div class="sg-card-text">
                <div class="sg-card-header-flex">
                  <div class="sg-icon-bubble list-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                  <h3 class="sg-title">Finance Related<br>Advisory</h3>
                </div>
                <ul class="sg-service-list">
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Project Report</li>
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Forecast</li>
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Investment Planning</li>
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Strategy Planning</li>
                  <li><svg class="check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>HR Policy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
"""
    
    with open('services.html', 'w', encoding='utf-8') as f:
        f.write(header + services_content + footer)
    print("Created services.html")
else:
    print("Could not parse index.html header/footer")
