import './admin.css';

/* Wraps both the login screen and the panel. The `adm` class carries the
   design tokens admin.css hangs everything off, so it has to sit above both. */

export const metadata = {
  title: {
    default: 'Admin',
    template: '%s · Impulse Admin'
  },
  robots: { index: false, follow: false }
};

export default function AdminRootLayout({ children }) {
  return <div className="adm">{children}</div>;
}
