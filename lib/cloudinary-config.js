import { createHash } from 'node:crypto';

/* Server-side Cloudinary credentials and upload signing.

   NEVER import this from a client component — it reads the API secret. The
   browser gets a short-lived signature from the signUpload server action
   instead, and never sees the secret itself. Because of that, none of these
   variables need the NEXT_PUBLIC_ prefix.

   Two ways to configure, whichever is less typing:

     CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
                                     — the single line Cloudinary shows you
   or the three parts separately:
     CLOUDINARY_CLOUD_NAME=
     CLOUDINARY_API_KEY=
     CLOUDINARY_API_SECRET=
*/

function fromConnectionString(value) {
  try {
    const url = new URL(value);
    return {
      cloudName: url.hostname,
      apiKey: decodeURIComponent(url.username),
      apiSecret: decodeURIComponent(url.password)
    };
  } catch {
    return null;
  }
}

export function cloudinaryConfig() {
  const connection = process.env.CLOUDINARY_URL;
  const parsed = connection ? fromConnectionString(connection) : null;

  const cloudName = parsed?.cloudName || process.env.CLOUDINARY_CLOUD_NAME || '';
  const apiKey = parsed?.apiKey || process.env.CLOUDINARY_API_KEY || '';
  const apiSecret = parsed?.apiSecret || process.env.CLOUDINARY_API_SECRET || '';

  return { cloudName, apiKey, apiSecret, configured: Boolean(cloudName && apiKey && apiSecret) };
}

/*
 * Cloudinary's signed upload scheme: sort the parameters being signed by name,
 * join them as `key=value` pairs with `&`, append the API secret, and SHA-1 the
 * result. `file` and `api_key` are sent with the upload but deliberately not
 * signed.
 *
 * The signature covers the folder as well as the timestamp, so a signature
 * handed to the browser can't be replayed to write somewhere else in the
 * account. Cloudinary rejects timestamps older than an hour.
 */
export function signUploadParams(params, apiSecret) {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  return createHash('sha1').update(toSign + apiSecret).digest('hex');
}
