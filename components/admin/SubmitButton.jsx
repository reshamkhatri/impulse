'use client';

import { useFormStatus } from 'react-dom';

/* Sits inside a <form> and reads that form's pending state, so a slow save
   can't be double-submitted and the editor gets feedback without any of the
   surrounding forms having to track it. */
export default function SubmitButton({
  children = 'Save changes',
  pendingLabel = 'Saving…',
  className = 'adm-btn'
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}
