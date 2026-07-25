import './globals.css';
import { Inter, Montserrat } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import SiteMotion from '@/components/SiteMotion';
import BodyClass from '@/components/BodyClass';

/* next/font self-hosts these at build time and inlines the @font-face rules, so
   there's no render-blocking round trip to fonts.googleapis.com and no layout
   shift while they swap in. The variable ranges match what globals.css asks for
   (weights 300–900 across both families). */
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap'
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap'
});

export const metadata = {
  metadataBase: new URL('https://impulsenepal.com'),
  title: {
    default: 'Impulse - Investment & Management | Business Consulting in Nepal',
    template: '%s | Impulse'
  },
  description:
    'Impulse Investment and Management Pvt. Ltd. - business consulting, accounting & bookkeeping, VAT filing, and tax compliance services for growing businesses in Nepal.',
  icons: { icon: '/logo.webp' }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body>
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

        <Chatbot />
        <SiteMotion />
      </body>
    </html>
  );
}
