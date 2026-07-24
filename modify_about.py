import sys
with open('d:/impulse/about-us.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the intro block
intro_start = content.find('        <!-- Intro -->')
mission_start = content.find('        <!-- Mission -->')
if intro_start != -1 and mission_start != -1:
    content = content[:intro_start] + content[mission_start:]

# Inject team block
team_block = """
    <section class="section-team" style="padding: 4rem 1.25rem; max-width: var(--max-width); margin: 0 auto;">
      <div class="team-header" style="text-align: center; margin-bottom: 3rem;">
        <h2 style="font-family: var(--font-sans); color: var(--color-brand-blue); font-size: 2.5rem; margin-bottom: 1rem;">Our Leadership</h2>
        <p style="color: var(--color-text-muted); font-size: 1.1rem;">Guiding Impulse Investment and Management Private Limited</p>
      </div>
      
      <div class="team-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
        <!-- CEO -->
        <div class="team-member" style="background: white; border-radius: 1.5rem; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05); text-align: center; display: flex; flex-direction: column;">
          <div class="member-photo-placeholder" style="background: #e2e8f0; height: 300px; width: 100%; display: flex; align-items: center; justify-content: center; color: #64748b; font-weight: 500;">
            [Photo to be provided]
          </div>
          <div class="member-info" style="padding: 2rem;">
            <h3 style="font-size: 1.5rem; font-family: var(--font-sans); color: var(--color-brand-blue); margin-bottom: 0.25rem;">Achal Acharya</h3>
            <span style="color: var(--color-brand-orange); font-weight: 600; text-transform: uppercase; font-size: 0.875rem; letter-spacing: 1px;">CEO</span>
          </div>
        </div>

        <!-- Board of Directors -->
        <div class="team-member" style="background: white; border-radius: 1.5rem; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05); text-align: center; display: flex; flex-direction: column;">
          <div class="member-photo-placeholder" style="background: #e2e8f0; height: 300px; width: 100%; display: flex; align-items: center; justify-content: center; color: #64748b; font-weight: 500;">
            [Photo to be provided]
          </div>
          <div class="member-info" style="padding: 2rem;">
            <h3 style="font-size: 1.5rem; font-family: var(--font-sans); color: var(--color-brand-blue); margin-bottom: 0.25rem;">Board of Directors</h3>
            <span style="color: var(--color-brand-orange); font-weight: 600; text-transform: uppercase; font-size: 0.875rem; letter-spacing: 1px;">Leadership</span>
          </div>
        </div>
      </div>
    </section>
"""

main_end = content.find('  </main>')
if main_end != -1:
    content = content[:main_end] + team_block + content[main_end:]

with open('d:/impulse/about-us.html', 'w', encoding='utf-8') as f:
    f.write(content)
