// src/lib/cloudinary.js
//
// Unsigned browser uploads. Unsigned is deliberate: a signed upload needs the
// API secret to build the signature, and anything reachable from this bundle is
// public. The presets (umva_audio / umva_covers) carry the format and size
// restrictions instead.

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const AUDIO_PRESET = process.env.REACT_APP_CLOUDINARY_AUDIO_PRESET;
const COVER_PRESET = process.env.REACT_APP_CLOUDINARY_COVER_PRESET;

// Cloudinary classifies audio under the `video` resource type - there is no
// /audio/upload endpoint. Sending an mp3 to /image/upload fails.
const AUDIO_RESOURCE_TYPE = 'video';
const IMAGE_RESOURCE_TYPE = 'image';

async function upload(file, preset, resourceType) {
  if (!CLOUD_NAME || !preset) {
    throw new Error('Cloudinary is not configured. Check the REACT_APP_CLOUDINARY_* env vars.');
  }

  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', preset);

  let res;
  try {
    res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      { method: 'POST', body: form }
    );
  } catch {
    throw new Error('Upload failed - could not reach Cloudinary.');
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // Surfaces preset misconfiguration clearly, e.g. a format the preset's
    // allowed_formats list rejects.
    throw new Error(data?.error?.message || `Upload failed (${res.status})`);
  }
  return data.secure_url;
}

export const uploadAudio = (file) => upload(file, AUDIO_PRESET, AUDIO_RESOURCE_TYPE);
export const uploadCover = (file) => upload(file, COVER_PRESET, IMAGE_RESOURCE_TYPE);
