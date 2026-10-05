export interface RemoveBackgroundResponse {
  success: boolean;
  image?: string; // Base64 data URL (e.g. data:image/png;base64,...)
  originalSize?: number;
  processedSize?: number;
  error?: string;
}

/**
 * Service to call the backend /api/remove-background proxy
 * Keeps Photoroom API credentials completely secure on the server.
 */
export async function removeBackground(file: File): Promise<RemoveBackgroundResponse> {
  const formData = new FormData();
  formData.append('image_file', file);

  try {
    const response = await fetch('/api/remove-background', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to remove background. Please try another image.');
    }

    return {
      success: true,
      image: data.image,
      originalSize: data.originalSize || file.size,
      processedSize: data.processedSize,
    };
  } catch (err: unknown) {
    console.error('[backgroundRemovalService] Error:', err);
    const message = err instanceof Error ? err.message : 'Network error or server unavailable';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Utility helper to convert a DataURL image into WebP format via HTML5 Canvas
 */
export async function convertDataUrlToWebp(dataUrl: string, quality = 0.9): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const webpUrl = canvas.toDataURL('image/webp', quality);
      resolve(webpUrl);
    };
    img.onerror = (e) => reject(e);
    img.src = dataUrl;
  });
}

/**
 * Triggers instant browser file download
 */
export function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
