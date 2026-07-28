/* The one-line result of a save. `state` is whatever the server action
   returned: { ok } or { error }. */
export default function StatusNote({ state }) {
  if (!state?.ok && !state?.error) return null;

  return (
    <p
      className={`adm-note ${state.error ? 'adm-note--bad' : 'adm-note--ok'}`}
      role="status"
      aria-live="polite"
    >
      {state.error ?? state.ok}
    </p>
  );
}
