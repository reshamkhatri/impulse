import '../globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import SiteMotion from '@/components/SiteMotion';
import BodyClass from '@/components/BodyClass';
import PopupModal from '@/components/site/PopupModal';
import { getSection } from '@/lib/content';

/* Everything the public site wears. Importing globals.css here rather than in
   the root layout keeps the 5,000-line marketing stylesheet off /admin, which
   has its own. */
export default async function SiteLayout({ children }) {
  const popup = await getSection('site.popup');

  return (
    <>
      <BodyClass />
      <Navbar />

      {/* Smooth-scroll structure (required by GSAP ScrollSmoother). The header
          and chatbot sit outside it deliberately — both are fixed and must not
          be transformed along with the scrolling content. */}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          {children}
          <Footer />
        </div>
      </div>

      <PopupModal popup={popup} />
      <Chatbot />
      <SiteMotion />
    </>
  );
}
