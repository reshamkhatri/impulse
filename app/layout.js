import { Inter, Montserrat } from 'next/font/google';

/* Root layout. Deliberately thin: it owns <html>/<body> and the fonts, and
   nothing else. The marketing site's header, footer, smooth-scroll shell and
   stylesheet live in app/(site)/layout.js, and the admin panel brings its own
   chrome — so /admin isn't rendered inside a scroll-jacked page with a
   contact-us button in the corner.

   next/font self-hosts these at build time and inlines the @font-face rules, so
   there's no render-blocking round trip to fonts.googleapis.com and no layout
   shift while they swap in. The variable ranges match what globals.css asks for
   (weights 300–900 across both families).

   Both resolve to variable fonts, so the build emits one file per unicode range
   rather than one per weight: only the two Latin ranges are preloaded (82 kB
   total) and the rest are never fetched for English copy. Listing the weights
   here does not add downloads — measured on a clean build. */
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
      <body>{children}</body>
    </html>
  );
}
