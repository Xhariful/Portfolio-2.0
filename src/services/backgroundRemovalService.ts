export interface RemoveBackgroundResponse {
  success: boolean;
  image?: string; // Base64 data URL (e.g. data:image/png;base64,...)
  originalSize?: number;
  processedSize?: number;
  error?: string;
}

const DIRECT_REMOVE_BG_KEY = 'Pi85bEV6S535Njz51tyNcFtf';

/**
 * Service to call the background remover.
 * First tries the backend proxy (/api/remove-background).
 * If the proxy is unavailable (e.g. during dev preview reload or container restart),
 * it seamlessly falls back to direct API execution so the user never gets an error!
 */
export async function removeBackground(file: File): Promise<RemoveBackgroundResponse> {
  const formData = new FormData();
  formData.append('image_file', file);

  try {
    // 1. Try server proxy endpoint
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
        // Not valid JSON (e.g. gateway timeout or proxy error)
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

    // If server returned an explicit error message, check if we should fallback
    if (data?.error && !data.error.includes('Internal server error') && !data.error.includes('HTML')) {
      console.warn('[backgroundRemovalService] Server returned error, attempting direct client fallback:', data.error);
    }
  } catch (proxyErr) {
    console.warn('[backgroundRemovalService] Server proxy network failure, switching to direct client fallback:', proxyErr);
  }

  // 2. Seamless Client-Side Direct Fallback using remove.bg
  try {
    console.log('[backgroundRemovalService] Running client-side direct remove.bg processing...');
    const directForm = new FormData();
    directForm.append('image_file', file);
    directForm.append('size', 'auto');

    const directRes = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': DIRECT_REMOVE_BG_KEY,
      },
      body: directForm,
    });

    if (directRes.ok) {
      const blob = await directRes.blob();
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      return {
        success: true,
        image: base64Data,
        originalSize: file.size,
        processedSize: blob.size,
      };
    }

    // If auto failed (e.g. credit limit), try preview size for free calls
    const errText = await directRes.text();
    if (directRes.status === 402 || errText.toLowerCase().includes('credit')) {
      const previewForm = new FormData();
      previewForm.append('image_file', file);
      previewForm.append('size', 'preview');

      const previewRes = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': DIRECT_REMOVE_BG_KEY,
        },
        body: previewForm,
      });

      if (previewRes.ok) {
        const pBlob = await previewRes.blob();
        const pBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(pBlob);
        });

        return {
          success: true,
          image: pBase64,
          originalSize: file.size,
          processedSize: pBlob.size,
        };
      }
    }

    let parsedDirectError = 'Failed to remove background from image';
    try {
      const parsed = JSON.parse(errText);
      if (parsed.errors && parsed.errors[0]?.title) {
        parsedDirectError = parsed.errors[0].title;
      }
    } catch {
      if (errText && errText.length < 120) parsedDirectError = errText;
    }

    return {
      success: false,
      error: parsedDirectError,
    };
  } catch (clientErr: any) {
    console.error('[backgroundRemovalService] Client direct call error:', clientErr);
    return {
      success: false,
      error:
        clientErr?.message ||
        'Could not process background removal. Please check your internet connection.',
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
