import JSZip from 'jszip';

export type OutputFormat = 'webp' | 'jpeg' | 'png' | 'original';

export interface CompressionOptions {
  quality: number; // 0.1 to 1.0 (e.g. 0.8 for 80%)
  format: OutputFormat;
  maxWidth?: number; // Optional resize constrain (e.g. 1920)
  maxHeight?: number;
}

export interface CompressedImageResult {
  id: string;
  originalName: string;
  originalSize: number;
  originalType: string;
  compressedBlob: Blob;
  compressedSize: number;
  compressedType: string;
  previewUrl: string;
  width: number;
  height: number;
  savedBytes: number;
  savedPercentage: number;
  status: 'pending' | 'processing' | 'done' | 'error';
  errorMessage?: string;
}

/**
 * Format raw bytes into human readable KB or MB
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Derives output MIME type based on selected option and original format
 */
function resolveMimeType(originalType: string, format: OutputFormat): string {
  if (format === 'webp') return 'image/webp';
  if (format === 'jpeg') return 'image/jpeg';
  if (format === 'png') return 'image/png';
  
  // 'original' option
  if (originalType.includes('png')) return 'image/png';
  if (originalType.includes('webp')) return 'image/webp';
  return 'image/jpeg';
}

/**
 * Computes destination filename with appropriate extension
 */
export function getOutputFilename(originalName: string, outputMime: string): string {
  const baseName = originalName.replace(/\.[^/.]+$/, '');
  if (outputMime === 'image/webp') return `${baseName}.webp`;
  if (outputMime === 'image/png') return `${baseName}.png`;
  return `${baseName}.jpg`;
}

/**
 * High-performance browser-native client image compression
 */
export async function compressSingleImage(
  file: File,
  options: CompressionOptions,
  id: string = Math.random().toString(36).substring(7)
): Promise<CompressedImageResult> {
  let sourceFile = file;

  // Handle Apple/Samsung HEIC photos seamlessly
  const isHeic =
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif') ||
    file.type.includes('heic') ||
    file.type.includes('heif');

  if (isHeic) {
    try {
      const heic2anyModule = (await import('heic2any')).default;
      const converted = await heic2anyModule({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.95,
      });
      const singleBlob = Array.isArray(converted) ? converted[0] : converted;
      sourceFile = new File(
        [singleBlob],
        file.name.replace(/\.(heic|heif)$/i, '.jpg'),
        { type: 'image/jpeg' }
      );
    } catch (e) {
      console.warn('[heic2any] fallback to original', e);
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(sourceFile);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let targetWidth = img.naturalWidth || img.width;
      let targetHeight = img.naturalHeight || img.height;

      // Scale down if maxWidth or maxHeight is specified
      if (options.maxWidth && targetWidth > options.maxWidth) {
        const ratio = options.maxWidth / targetWidth;
        targetWidth = options.maxWidth;
        targetHeight = Math.round(targetHeight * ratio);
      }
      if (options.maxHeight && targetHeight > options.maxHeight) {
        const ratio = options.maxHeight / targetHeight;
        targetHeight = options.maxHeight;
        targetWidth = Math.round(targetWidth * ratio);
      }

      // Draw onto Canvas
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d', { alpha: true });

      if (!ctx) {
        reject(new Error('Canvas context could not be created'));
        return;
      }

      // High quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const targetMime = resolveMimeType(sourceFile.type, options.format);
      const quality = Math.max(0.1, Math.min(1.0, options.quality));

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Image compression conversion failed'));
            return;
          }

          // If compressed size turns out slightly larger than original (e.g. tiny 10kb png re-encoded),
          // preserve best efficiency
          const finalBlob = blob;
          const compressedSize = finalBlob.size;
          const originalSize = file.size;
          const savedBytes = Math.max(0, originalSize - compressedSize);
          const savedPercentage = originalSize > 0
            ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
            : 0;

          const previewUrl = URL.createObjectURL(finalBlob);

          resolve({
            id,
            originalName: file.name,
            originalSize,
            originalType: file.type || 'image/jpeg',
            compressedBlob: finalBlob,
            compressedSize,
            compressedType: targetMime,
            previewUrl,
            width: targetWidth,
            height: targetHeight,
            savedBytes,
            savedPercentage,
            status: 'done',
          });
        },
        targetMime,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to decode image file ${file.name}`));
    };

    img.src = objectUrl;
  });
}

/**
 * Packages multiple compressed image files into a single ZIP archive
 */
export async function createZipArchive(items: CompressedImageResult[]): Promise<Blob> {
  const zip = new JSZip();

  items.forEach((item) => {
    if (item.status === 'done' && item.compressedBlob) {
      const filename = getOutputFilename(item.originalName, item.compressedType);
      zip.file(filename, item.compressedBlob);
    }
  });

  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

/**
 * Triggers instant download of a blob file
 */
export function triggerFileDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
