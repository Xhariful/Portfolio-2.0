export interface RemoveBackgroundResponse {
  success: boolean;
  image?: string; // Base64 data URL (e.g. data:image/png;base64,...)
  originalSize?: number;
  processedSize?: number;
  error?: string;
}

/**
 * Service to call the background remover proxy endpoint.
 * Note: External services like remove.bg do NOT support CORS for client-side browser fetch.
 * All requests must flow securely through the server proxy (/api/remove-background).
 */
export async function removeBackground(file: File): Promise<RemoveBackgroundResponse> {
  const formData = new FormData();
  formData.append('image_file', file);

  try {
    const response = await fetch('/api/remove-background', {
      method: 'POST',
      body: formData,
    });

    const responseText = await response.text();
    let data: any = null;

    if (responseText && responseText.trim().length > 0) {
      try {
        data = JSON.parse(responseText);
      } catch {
        console.warn('[backgroundRemovalService] Non-JSON server response:', responseText.slice(0, 150));
      }
    }

    if (response.ok && data?.success && data?.image) {
      return {
        success: true,
        image: data.image,
        originalSize: data.originalSize || file.size,
        processedSize: data.processedSize,
      };
    }

    // Return the specific, human-readable error from the server
    const errorMessage =
      data?.error ||
      (response.status !== 200
        ? `Server error (${response.status}). Please try again.`
        : 'Failed to remove background from this image.');

    return {
      success: false,
      error: errorMessage,
    };
  } catch (err: unknown) {
    console.error('[backgroundRemovalService] Network error:', err);
    const msg =
      err instanceof Error
        ? err.message
        : 'Network connection error. Please check your internet connection.';
    return {
      success: false,
      error: msg,
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
