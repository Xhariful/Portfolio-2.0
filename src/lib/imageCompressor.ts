/**
 * Client-side high quality image compressor.
 * Automatically resizes and compresses user-uploaded images (photos, logos, favicons, project covers)
 * into lightweight WebP/JPEG DataURLs (typically 30KB - 150KB) so they instantly and reliably
 * save into Cloud Firestore and localStorage without exceeding document size limits (1MB).
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0 to 1
  mimeType?: 'image/webp' | 'image/jpeg' | 'image/png';
}

export async function compressImageFile(
  file: File,
  options: CompressOptions = {}
): Promise<string> {
  // If SVG or ICO, keep as clean Data URL or text
  if (file.type === 'image/svg+xml' || file.name.endsWith('.svg') || file.name.endsWith('.ico')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  const {
    maxWidth = 1400,
    maxHeight = 1400,
    quality = 0.82,
    mimeType = 'image/webp',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = (err) => reject(err);
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect ratio preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original data url
          resolve(readerEvent.target?.result as string);
          return;
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try webp first, fallback to jpeg if unsupported
        let compressedDataUrl = canvas.toDataURL(mimeType, quality);
        if (!compressedDataUrl.startsWith(`data:${mimeType}`)) {
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(compressedDataUrl);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
