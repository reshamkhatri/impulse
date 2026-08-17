-- Articles carried over from the previous impulsenepal.com (WordPress) site.
--
-- Run once in the Supabase SQL editor, after schema.sql. Safe to re-run: the
-- slugs are unique and existing rows are left alone, so an edit made in the
-- admin panel is never overwritten by running this again.
--
-- Mirrored by FALLBACK_POSTS in lib/fallback.js, which is what the site serves
-- until this has been run.
--
-- Cover images live in public/blog/ in the repository, not in Cloudinary — the
-- originals came off the old site rather than through the upload panel.

insert into public.posts (slug, title, excerpt, category, author, read_time, published_at, status, cover_image, body) values
  ('20-hour-entrepreneurship-bootcamp-empowering-minds-for-success',
   $q$20-Hour Entrepreneurship Bootcamp: Empowering Minds for Success$q$,
   $q$Twenty-four aspiring entrepreneurs, twenty hours, and facilitators drawn from Nepal Stock Exchange, Khalti, and FNCCI — inside our intensive bootcamp at Kathmandu Technical School.$q$,
   'Training', 'Impulse Team', '2 min read', '2024-01-09', 'published', '/blog/bootcamp.webp',
   $j$[
     {"type":"p","text":"Are you ready to embark on an exhilarating journey towards becoming a successful entrepreneur? Look no further than Impulse Investment and Management Private Limited’s exclusive 20-Hour Entrepreneurship Bootcamp! Designed to equip aspiring entrepreneurs with valuable skills and knowledge, this event is a game-changer in the world of business."},
     {"type":"p","text":"Organized by Impulse Investment and Management Private Limited, this intensive bootcamp was held at the prestigious Kathmandu Technical School. The venue provided a conducive environment for learning, collaboration, and inspiration."},
     {"type":"p","text":"With a total of 24 participants, this bootcamp brought together a diverse group of aspiring entrepreneurs eager to take their ideas to the next level. The discussions covered a wide range of topics crucial for entrepreneurial success, including personality development, communication and networking, stock market insights, branding and marketing strategies, human resources management, and the nuances of startup ideas and business plans."},
     {"type":"p","text":"The highlight of the bootcamp was the exceptional expertise of the class facilitators. Renowned experts such as Mr. Chandra Saud, the former CEO of Nepal Stock Exchange, shared their extensive knowledge and insights on the stock market. Mrs. Bhuvi Bista, the former HR head of Khalti, provided invaluable guidance on human resources management. Educator Mr. Santosh Dhungana imparted his profound knowledge on the essential aspects of effective communication and networking. Additionally, former VJ Mr. Saurav Sharma shared his expertise on branding and marketing, while FNCCI member Mr. Manoj Poudel offered insightful tips on business planning."},
     {"type":"p","text":"At the end of this transformative bootcamp, participants were awarded certificates of completion, highlighting their dedication and commitment to personal and professional growth. These certificates not only serve as a testament to their achievements but also as a valuable addition to their entrepreneurial portfolios."},
     {"type":"p","text":"Impulse Investment and Management Private Limited’s 20-Hour Entrepreneurship Bootcamp provided participants with the essential tools, knowledge, and confidence needed to succeed in the dynamic world of entrepreneurship. Whether you have a business idea waiting to be realized or are eager to enhance your entrepreneurial skills, this bootcamp is a stepping stone towards your goals. Join us in our next session, and unlock the entrepreneur within you!"}
   ]$j$::jsonb),

  ('the-future-of-students-in-jumla',
   $q$The future of Students in Jumla$q$,
   $q$Over 200 students across schools in Jumla joined our Personality Development Program, led by CEO Achal Acharya — career counselling, future prospects, and the scope ahead in Nepal.$q$,
   'Community', 'Impulse Team', '2 min read', '2024-01-09', 'published', null,
   $j$[
     {"type":"p","text":"Impulse Investment and Management Private Limited, a renowned name in the field of training and consulting, recently conducted an impactful Personality Development Program in Jumla. Led by the dynamic CEO, Mr. Achal Acharya, a seasoned management practitioner, the program aimed to empower and guide the youth towards a brighter future."},
     {"type":"p","text":"With the participation of over 200 students from various schools in Jumla, this program proved to be a game-changer for the aspiring individuals. The sessions covered a wide range of discussion topics, including career counseling, future prospects, scope in Nepal, and other crucial aspects relevant to the youths of today."},
     {"type":"p","text":"One of the highlights of the program was the emphasis on education in Kathmandu. Mr. Acharya shed light on the benefits and challenges of pursuing education and career opportunities in the capital city. The students gained valuable insights into the possibilities and potential challenges they might face, helping them make informed decisions."},
     {"type":"p","text":"The sessions took place in different schools across Jumla, ensuring maximum convenience and accessibility for the participants. The interactive and engaging nature of the program created a conducive learning environment, allowing the students to actively participate and extract the most from each session."},
     {"type":"p","text":"Impulse Investment and Management Private Limited’s commitment to enhancing the personal and professional growth of individuals was evident throughout the program. The well-structured sessions, combined with Mr. Acharya’s expertise and experience, provided a unique learning experience for the students."},
     {"type":"p","text":"Overall, the Personality Development Program in Jumla proved to be a tremendous success. The students who attended not only gained valuable knowledge and insights but also developed essential life skills and self-confidence. Impulse Investment and Management Private Limited’s dedication to empowering the youth is commendable, and their efforts are sure to make a lasting impact on the lives of the participants."},
     {"type":"p","text":"In conclusion, the Personality Development Program at Jumla, conducted by Impulse Investment and Management Private Limited, proved to be a transformative experience for over 200 students. It provided them with the necessary tools and guidance to navigate their path towards success in education and future career prospects. Such initiatives contribute significantly to the overall development of individuals and society as a whole."}
   ]$j$::jsonb),

  ('entrepreneurship-and-start-up-mela',
   $q$Entrepreneurship and Start-up Mela$q$,
   $q$Over 300 attendees, stalls run by our own trainees, and guests from the International Labour Organization, AYON, and FNCCI — a look back at our Start-up and Entrepreneurship Bootcamp.$q$,
   'Events', 'Impulse Team', '2 min read', '2024-01-08', 'published', '/blog/mela.webp',
   $j$[
     {"type":"p","text":"Impulse Investment and Management Private Limited recently organized a highly successful Start-up and Entrepreneurship Bootcamp, garnering immense support from renowned organizations such as the International Labour Organization and the Association of Youth Organization Nepal. The event witnessed an impressive turnout, with over 300 aspiring entrepreneurs and individuals interested in start-ups attending. The bootcamp provided a platform for attendees to gain valuable insights and practical knowledge about various aspects of entrepreneurship."},
     {"type":"p","text":"The event featured different stalls set up by the trainees, showcasing their innovative business ideas and products. These stalls served as a valuable opportunity for the participants to network and receive feedback from industry experts. Notably, the bootcamp also attracted esteemed guests including representatives from the Federation of Nepalese Chambers of Commerce and Industry (FNCCI), local ward offices, and other corporate personnel. Their presence further accentuated the significance of this event in the entrepreneurial ecosystem."},
     {"type":"p","text":"What made the event even more remarkable was its engagement with the education sector. School and college students were encouraged to visit the bootcamp, providing them with exposure to the world of start-ups and entrepreneurship. This initiative aimed to foster an entrepreneurial mindset among the youth, igniting their passion for innovation and enterprise. Overall, the Start-up and Entrepreneurship Bootcamp organized by Impulse Investment and Management Private Limited emerged as a resounding success, inspiring and empowering a new wave of entrepreneurial talent in the region."}
   ]$j$::jsonb),

  ('unleashing-potential-personality-development-program-in-dhangadi',
   $q$Unleashing Potential: Personality Development Program in Dhangadi$q$,
   $q$Over 300 students across schools in Dhangadi took part in sessions on career counselling, future prospects, and the growth opportunities Nepal presents.$q$,
   'Community', 'Impulse Team', '3 min read', '2024-01-08', 'published', '/blog/dhangadi.webp',
   $j$[
     {"type":"p","text":"Have you ever wondered how to unlock your true potential and excel in your personal and professional life? Look no further than the Personality Development Program conducted by Impulse Investment and Management Private Limited. This life-changing program offers valuable insights and guidance to empower the youth of Dhangadi."},
     {"type":"p","text":"Led by the visionary CEO of Impulse, Mr. Achal Acharya, this training session brings the expertise of a seasoned management practitioner. With his wealth of knowledge and experience, Mr. Acharya is dedicated to nurturing talent and creating leaders of tomorrow."},
     {"type":"p","text":"The impact of this program is undeniable, with over 300 students benefiting from the session. Held across various schools in Dhangadi, the program reaches out to young individuals seeking guidance and direction for their future."},
     {"type":"p","text":"The personality development program covers a range of crucial topics, including career counseling, future prospects, and the scope for growth in Nepal. Mr. Acharya and his team provide invaluable insights on various aspects that are essential for the holistic development of youths."},
     {"type":"p","text":"The program focuses on equipping participants with the necessary skills, knowledge, and mindset to overcome challenges and seize opportunities. Through interactive sessions, students get to explore their interests, understand their strengths, and identify potential career paths. Additionally, they are guided on setting realistic goals and formulating actionable plans to achieve them."},
     {"type":"p","text":"One of the distinguishing factors of this program is its emphasis on the unique opportunities and challenges that Nepal presents. By providing a deep understanding of the local landscape, students gain insight into the potential industries and emerging sectors where they can make a difference."},
     {"type":"p","text":"Upon completion of the program, participants walk away with renewed confidence, a sense of direction, and a clear vision of their future. They are able to navigate the competitive world with a better understanding of their skills and interests."},
     {"type":"p","text":"The Personality Development Program conducted by Impulse Investment and Management Private Limited has become a beacon of hope for the youth in Dhangadi. It is a transformative experience that ignites passion, sparks ambition, and equips individuals with the necessary tools to carve their own path towards success."},
     {"type":"p","text":"Impulse Investment and Management Private Limited’s commitment to nurturing talent and fostering personal growth makes this program an invaluable opportunity for aspiring individuals. Through this initiative, they are empowering the youth of Dhangadi to fulfill their potential and become the leaders of tomorrow."},
     {"type":"p","text":"Join the Personality Development Program and embark on a journey of self-discovery, self-improvement, and personal success. Don’t miss out on this incredible opportunity to unlock your true potential in the vibrant city of Dhangadi!"}
   ]$j$::jsonb)
on conflict (slug) do nothing;
