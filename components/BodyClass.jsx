'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/* Routes whose first screen is pale need `light-page` on <body>, which flips
   the nav links and burger from white to dark type. Without it the header is
   white-on-white and effectively invisible. Only <body> works as the hook
   because that's what globals.css targets, and only the root layout renders
   <body> — hence this small client component rather than a per-route wrapper.

   Prefixes, so every article under /blog/... is covered too. */
const LIGHT_ROUTES = ['/services', '/blog'];

export default function BodyClass() {
  const pathname = usePathname();

  useEffect(() => {
    const light = LIGHT_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + '/')
    );
    document.body.classList.toggle('light-page', light);
    return () => document.body.classList.remove('light-page');
  }, [pathname]);

  return null;
}
