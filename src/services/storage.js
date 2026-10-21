import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { storage } from '../firebase';

// Allowed MIME types and extensions for letter attachments
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/octet-stream' // fallback for some word files
];

export const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

/**
 * Validates file type and size before uploading
 */
export function validateAttachmentFile(file) {
  if (!file) {
    throw new Error('Berkas tidak ditemukan.');
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`Ukuran berkas (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimal 25 MB.`);
  }

  // Check extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
  if (!hasValidExtension) {
    throw new Error(`Format berkas tidak didukung. Format yang diizinkan: PDF, DOC, DOCX, JPG, JPEG, PNG.`);
  }

  return true;
}

/**
 * Format bytes into human readable format
 */
export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Uploads attachment to Firebase Storage with progress tracking
 * @param {File} file
 * @param {string} letterId
 * @param {Function} onProgress (optional callback for upload percentage)
 * @returns {Promise<Object>} Attachment metadata
 */
export function uploadAttachment(file, letterId = 'temp', onProgress = null) {
  return new Promise((resolve, reject) => {
    try {
      validateAttachmentFile(file);

      // Clean file name to prevent encoding issues
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `letters/${letterId}/${timestamp}_${sanitizedName}`;
      const storageRef = ref(storage, storagePath);

      const metadata = {
        contentType: file.type || 'application/octet-stream',
        customMetadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString()
        }
      };

      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(Math.round(progress));
          }
        },
        (error) => {
          console.error('[Storage Upload Error]', error);
          reject(new Error(`Gagal mengunggah berkas: ${error.message}`));
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              name: file.name,
              storagePath,
              url: downloadUrl,
              size: file.size,
              sizeFormatted: formatBytes(file.size),
              type: file.type || 'application/octet-stream',
              uploadedAt: new Date().toISOString()
            });
          } catch (urlErr) {
            reject(new Error(`Gagal memperoleh tautan unduh: ${urlErr.message}`));
          }
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Deletes attachment from Firebase Storage
 */
export async function deleteAttachment(storagePath) {
  if (!storagePath) return;
  try {
    const fileRef = ref(storage, storagePath);
    await deleteObject(fileRef);
  } catch (err) {
    // If file doesn't exist or already removed, log warning but don't crash
    console.warn('[Storage Delete Warning]', err.message);
  }
}
