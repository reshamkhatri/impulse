/* The icon set the admin panel can choose from.

   Cards store an icon *key*, never markup — so nothing an editor types can end
   up as SVG in the page, and an unrecognised key degrades to a neutral glyph
   instead of a blank space. The drawings are the ones already in use on the
   site; size and stroke weight stay with the caller because the same icon is
   drawn at 17px in a service card and 30px in the mission band. */

const PATHS = {
  // Home page services
  pulse: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  ledger: (
    <>
      <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M2 15h10" />
      <path d="M2 18h10" />
      <path d="M2 21h10" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </>
  ),

  // Services page plans
  building: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-8h6v8" />
    </>
  ),
  document: (
    <>
      <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v18z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="m7 15 4-4 3 3 5-7" />
    </>
  ),

  // Mission / vision / goal
  target: (
    <>
      <circle cx="10.4" cy="13.6" r="7.2" />
      <circle cx="10.4" cy="13.6" r="3.2" />
      <circle cx="10.4" cy="13.6" r="0.7" fill="currentColor" stroke="none" />
      <path d="M15.8 8.2 19.8 4.2" />
      <path d="M15.2 4.2h4.6v4.6" />
    </>
  ),
  bullseye: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  summit: (
    <>
      <circle cx="17.1" cy="7" r="2.4" />
      <path d="M3 19.4l5.3-7 3.3 4.1 2.7-3.2 5.7 6.1z" />
      <path d="M2.6 19.4h18.8" />
    </>
  ),
  trend: (
    <>
      <path d="M3.2 17.2l5.6-5.6 3.3 3.3 8.7-8.7" />
      <path d="M15.2 6.2h5.6v5.6" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  flag: (
    <>
      <path d="M4 22V4" />
      <path d="M4 5h13l-2 4 2 4H4" />
    </>
  ),

  // Shown when a card's icon key doesn't match anything above
  dot: <circle cx="12" cy="12" r="7" />
};

/** Every key an editor can pick, in the order the admin panel lists them. */
export const ICON_KEYS = Object.keys(PATHS);

export default function CardIcon({ name, size = 20, strokeWidth = 2 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] ?? PATHS.dot}
    </svg>
  );
}
