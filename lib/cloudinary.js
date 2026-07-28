/* Cloudinary delivery URLs.

   Pure string work, no credentials — safe to import from client components as
   well as pages. Uploading lives in lib/cloudinary-config.js, which reads the
   API secret and must stay server-side.

   Storing the plain `secure_url` and adding transformations at render time
   means one uploaded file serves every size the site needs: the same board
   photograph is delivered at 500px on the about page and 168px in the admin
   panel's preview, and switches to WebP or AVIF on its own where the browser
   supports it. */

const CLOUDINARY_HOST = 'res.cloudinary.com';

/** True for a URL this module can actually transform. */
export function isCloudinaryUrl(url) {
  return typeof url === 'string' && url.includes(CLOUDINARY_HOST) && url.includes('/upload/');
}

/**
 * Adds delivery transformations to a Cloudinary URL.
 *
 * Anything else — a pasted link to an image hosted elsewhere, an empty field —
 * is returned untouched, so every image field keeps working whether or not it
 * was filled in by uploading.
 *
 * crop: 'fill' crops to the exact box (photographs), 'limit' shrinks to fit
 * without cropping and never enlarges (article covers, logos).
 */
export function cloudinaryImage(url, { width, height, crop = 'fill' } = {}) {
  if (!isCloudinaryUrl(url)) return url;

  // Already transformed — leave it alone rather than stacking a second set.
  if (/\/upload\/[^/]*(?:f_auto|q_auto|w_\d)/.test(url)) return url;

  const transforms = ['f_auto', 'q_auto'];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) {
    transforms.push(`c_${crop}`);
    // Faces are what these boxes usually hold; keep them in frame when cropping.
    if (crop === 'fill') transforms.push('g_auto');
  }

  return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
}
