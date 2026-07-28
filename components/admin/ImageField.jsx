'use client';

import { useRef, useState } from 'react';
import { signUpload } from '@/app/admin/actions';
import { cloudinaryImage } from '@/lib/cloudinary';

/* An image slot: upload a picture to Cloudinary, or paste a link to one hosted
   anywhere else.

   The file goes from the browser straight to Cloudinary — it never travels
   through this server — using a signature the signUpload action issues only to
   a signed-in admin. What gets saved is the plain delivery URL; the sizing and
   format transformations are added when a page renders it.

   Uploading is a convenience, not a requirement. With Cloudinary unconfigured
   the upload button reports why and the URL box still works, so no image field
   is ever blocked. */

const MAX_BYTES = 10 * 1024 * 1024;

export default function ImageField({
  name,
  label = 'Image',
  defaultValue = '',
  folder = 'general',
  hint = 'Upload a picture, or paste a link. Square images work best for people.'
}) {
  const [url, setUrl] = useState(defaultValue ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');

    if (file.size > MAX_BYTES) {
      setError('That image is larger than 10 MB. Please use a smaller one.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    setBusy(true);

    try {
      const signed = await signUpload(folder);
      if (signed.error) throw new Error(signed.error);

      const form = new FormData();
      form.append('file', file);
      form.append('api_key', signed.apiKey);
      form.append('timestamp', signed.timestamp);
      form.append('signature', signed.signature);
      form.append('folder', signed.folder);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`,
        { method: 'POST', body: form }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result?.error?.message ?? 'Cloudinary rejected the upload.');

      setUrl(result.secure_url);
    } catch (caught) {
      setError(caught.message ?? 'Upload failed. Paste an image link instead.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="adm-field">
      <span className="adm-label">{label}</span>

      <div className="adm-image">
        <div className="adm-image-preview">
          {/* Cloudinary serves the thumbnail at thumbnail size; a pasted link
              is shown as-is and scaled by CSS. */}
          {url ? <img src={cloudinaryImage(url, { width: 168, height: 168 })} alt="" /> : <span>No image</span>}
        </div>

        <div className="adm-image-fields">
          <input
            className="adm-input"
            type="url"
            name={name}
            value={url}
            placeholder="https://…"
            onChange={(e) => setUrl(e.target.value)}
          />

          {/* Remove sits outside the label — nested in it, clicking it would
              also reopen the file picker. */}
          <div className="adm-file">
            <label className="adm-btn adm-btn--ghost adm-btn--sm" style={{ cursor: busy ? 'progress' : 'pointer' }}>
              <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} disabled={busy} />
              {busy ? 'Uploading…' : 'Upload a file'}
            </label>

            {url && !busy && (
              <button
                type="button"
                className="adm-btn adm-btn--ghost adm-btn--sm"
                onClick={() => setUrl('')}
              >
                Remove
              </button>
            )}
          </div>

          {error
            ? <p className="adm-note adm-note--bad" style={{ marginTop: '.6rem' }}>{error}</p>
            : <p className="adm-hint">{hint}</p>}
        </div>
      </div>
    </div>
  );
}
