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
    maxWidth = 1200,
    maxHeight = 1800,
    quality = 0.76,
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
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        let compressedDataUrl = canvas.toDataURL(mimeType, quality);
        if (!compressedDataUrl.startsWith(`data:${mimeType}`)) {
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // If still over 90KB, do a quick secondary pass with reduced dimensions & quality
        if (compressedDataUrl.length > 120000) {
          const smallCanvas = document.createElement('canvas');
          const scale = 0.8;
          smallCanvas.width = Math.round(width * scale);
          smallCanvas.height = Math.round(height * scale);
          const sCtx = smallCanvas.getContext('2d');
          if (sCtx) {
            sCtx.imageSmoothingEnabled = true;
            sCtx.imageSmoothingQuality = 'high';
            sCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
            const secondaryPass = smallCanvas.toDataURL(mimeType, 0.68);
            if (secondaryPass.length < compressedDataUrl.length) {
              compressedDataUrl = secondaryPass;
            }
          }
        }

        resolve(compressedDataUrl);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Optimizes an existing base64 string to keep it under target KB (e.g. 70KB)
 */
export async function optimizeExistingDataUrl(dataUrl: string, maxTargetKb = 80): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image/') || dataUrl.length < maxTargetKb * 1024) {
    return dataUrl;
  }
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const maxDim = 1100;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const result = canvas.toDataURL('image/webp', 0.72);
        resolve(result.length < dataUrl.length ? result : dataUrl);
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    } catch {
      resolve(dataUrl);
    }
  });
}
