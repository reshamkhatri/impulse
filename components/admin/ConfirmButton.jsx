'use client';

import { useFormStatus } from 'react-dom';

/* Submit button that asks first. Used for the deletes, which are the only
   actions in the panel that can't be undone by editing something back. */
export default function ConfirmButton({
  children,
  message = 'Delete this permanently?',
  className = 'adm-btn adm-btn--danger adm-btn--sm'
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {pending ? 'Working…' : children}
    </button>
  );
}
