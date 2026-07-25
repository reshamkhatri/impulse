'use client';

import { useEffect, useRef } from 'react';

/* Mounts the WebGL umbrella into its canvas host and tears it down on unmount.
   The scene module itself is only imported once this runs, so `three` never
   reaches the server bundle or the initial client chunk. */
export default function Umbrella3D() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let dispose = null;
    let cancelled = false;

    import('@/lib/umbrella').then(({ initUmbrella }) => {
      if (cancelled) return;
      dispose = initUmbrella(host);
    });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <div
      className="umbrella-canvas"
      ref={hostRef}
      role="img"
      aria-label="Four canopy pieces assembling into a realistic rotating blue-and-white striped umbrella with a chrome frame and wooden handle."
    >
      <span className="three-loading">Building your umbrella</span>
    </div>
  );
}
