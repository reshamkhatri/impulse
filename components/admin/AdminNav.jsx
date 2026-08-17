'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ICONS = {
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>,
  posts: <><path d="M4 4h11l5 5v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" /><path d="M14 4v6h6" /><path d="M8 14h7" /><path d="M8 17h5" /></>,
  services: <><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 5-7" /></>,
  team: <><path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" /><circle cx="9" cy="7" r="3.5" /><path d="M22 20v-1.5a4 4 0 0 0-3-3.85" /><path d="M15.5 3.6a4 4 0 0 1 0 7" /></>,
  content: <><path d="M4 5h16" /><path d="M4 10h11" /><path d="M4 15h16" /><path d="M4 20h9" /></>,
  popup: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
  site: <><circle cx="12" cy="12" r="9" /><path d="M3.2 9h17.6M3.2 15h17.6" /><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z" /></>
};

function NavIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

const LINKS = [
  { href: '/admin', icon: 'dashboard', label: 'Dashboard', exact: true },
  { href: '/admin/popup', icon: 'popup', label: 'Welcome Popup' },
  { href: '/admin/posts', icon: 'posts', label: 'Blogs & articles' },
  { href: '/admin/services', icon: 'services', label: 'Services' },
  { href: '/admin/team', icon: 'team', label: 'Board & CEO' },
  { href: '/admin/content', icon: 'content', label: 'Page headings' }
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="adm-nav">
      <span className="adm-nav-label">Manage</span>

      {LINKS.map(({ href, icon, label, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link key={href} href={href} className={active ? 'is-active' : undefined}>
            <NavIcon name={icon} />
            {label}
          </Link>
        );
      })}

      <span className="adm-nav-label">Website</span>
      <a href="/" target="_blank" rel="noopener noreferrer">
        <NavIcon name="site" />
        View live site
      </a>
    </nav>
  );
}
