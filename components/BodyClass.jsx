'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/* The services page carries `light-page` on <body> (it flips the nav links to
   dark type over a pale hero). Only <body> works as the hook because that's
   what globals.css targets, and only the root layout renders <body> — hence
   this small client component rather than a per-route wrapper. */
const LIGHT_ROUTES = new Set(['/services']);

export default function BodyClass() {
  const pathname = usePathname();

  useEffect(() => {
    const light = LIGHT_ROUTES.has(pathname);
    document.body.classList.toggle('light-page', light);
    return () => document.body.classList.remove('light-page');
  }, [pathname]);

  return null;
}
