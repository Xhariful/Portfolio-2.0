import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const REMOVE_BG_API_KEY =
  process.env.REMOVE_BG_API_KEY || 'Pi85bEV6S535Njz51tyNcFtf';

// CORS Middleware to allow requests from any origin / preview iframe
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Api-Key'
  );
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

// Setup multer memory storage with 15MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
  },
  fileFilter: (_req, file, cb) => {
    const isAccepted =
      file.mimetype.startsWith('image/') ||
      /\.(jpe?g|png|webp|heic|heif|gif|bmp)$/i.test(file.originalname);
    if (!isAccepted) {
      return cb(new Error('Only image files (JPG, PNG, WebP, HEIC) are allowed'));
    }
    cb(null, true);
  },
});

// JSON and form body parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Shariful Tools - remove.bg Background Remover API',
    provider: 'remove.bg',
    apiKeyConfigured: Boolean(REMOVE_BG_API_KEY),
  });
});

// Remove Background Proxy Endpoint (Powered by remove.bg)
app.post(
  '/api/remove-background',
  (req: Request, res: Response, next: NextFunction) => {
    upload.single('image_file')(req, res, (err) => {
      if (err) {
        console.warn('[Multer Upload Error]', err);
        res.status(400).json({
          success: false,
          error:
            err.message ||
            'Image upload failed. Please ensure file is a JPG, PNG, or WebP under 15MB.',
        });
        return;
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    try {
      let imageBuffer: Buffer | null = null;
      let mimeType = 'image/png';
      let originalFilename = 'image.png';

      // 1. Check if multipart file uploaded via multer
      if (req.file) {
        imageBuffer = req.file.buffer;
        mimeType = req.file.mimetype || 'image/png';
        originalFilename = req.file.originalname || 'upload.png';
      } else if (req.body?.image_base64) {
        // 2. Check if base64 string provided in JSON
        const rawBase64 = req.body.image_base64 as string;
        const matches = rawBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          imageBuffer = Buffer.from(matches[2], 'base64');
        } else {
          imageBuffer = Buffer.from(rawBase64, 'base64');
        }
      }

      if (!imageBuffer || imageBuffer.length === 0) {
        res.status(400).json({
          success: false,
          error: 'No image provided. Please upload an image file.',
        });
        return;
      }

      // Normalize HEIC, HEIF, or unusual mobile camera formats with Sharp
      try {
        const metadata = await sharp(imageBuffer).metadata();
        const isHeic =
          metadata.format === 'heif' ||
          mimeType.includes('heic') ||
          mimeType.includes('heif') ||
          originalFilename.toLowerCase().endsWith('.heic') ||
          originalFilename.toLowerCase().endsWith('.heif');

        if (isHeic || (metadata.format && metadata.format !== 'png' && metadata.format !== 'jpeg')) {
          console.log(`[Server Sharp] Converting ${metadata.format || mimeType} to standard JPEG for remove.bg...`);
          imageBuffer = await sharp(imageBuffer).jpeg({ quality: 95 }).toBuffer();
          mimeType = 'image/jpeg';
          originalFilename = originalFilename.replace(/\.(heic|heif)$/i, '.jpg');
        }
      } catch (sharpErr) {
        console.warn('[Sharp normalization check]', sharpErr);
      }

      let outputBuffer: Buffer | null = null;

      // 1. Call official remove.bg API
      if (REMOVE_BG_API_KEY) {
        try {
          const formData = new FormData();
          formData.append(
            'image_file',
            new Blob([imageBuffer], { type: mimeType }),
            originalFilename
          );
          formData.append('size', 'auto');

          // AbortController with 25s timeout to prevent proxy hangs
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 25000);

          const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
              'X-Api-Key': REMOVE_BG_API_KEY,
            },
            body: formData,
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (removeBgResponse.ok) {
            const arrayBuffer = await removeBgResponse.arrayBuffer();
            outputBuffer = Buffer.from(arrayBuffer);
          } else {
            const errText = await removeBgResponse.text();
            console.warn('[remove.bg API response non-200]', removeBgResponse.status, errText);

            let parsedError = '';
            try {
              const errJson = JSON.parse(errText);
              if (errJson.errors && errJson.errors[0]?.title) {
                parsedError = errJson.errors[0].title;
              }
            } catch {
              parsedError = errText;
            }

            // If 402 (insufficient credits for full size), automatically retry with free preview size
            if (removeBgResponse.status === 402 || parsedError.toLowerCase().includes('credit')) {
              console.log('[remove.bg] Retrying with size=preview for free calls...');
              const retryForm = new FormData();
              retryForm.append(
                'image_file',
                new Blob([imageBuffer], { type: mimeType }),
                originalFilename
              );
              retryForm.append('size', 'preview');

              const retryRes = await fetch('https://api.remove.bg/v1.0/removebg', {
                method: 'POST',
                headers: {
                  'X-Api-Key': REMOVE_BG_API_KEY,
                },
                body: retryForm,
              });

              if (retryRes.ok) {
                const ab = await retryRes.arrayBuffer();
                outputBuffer = Buffer.from(ab);
              }
            }

            if (!outputBuffer && parsedError) {
              res.status(removeBgResponse.status).json({
                success: false,
                error: parsedError || 'Failed to remove background from this image.',
              });
              return;
            }
          }
        } catch (rbErr: any) {
          console.warn('[remove.bg error]', rbErr);
          res.status(500).json({
            success: false,
            error:
              rbErr?.name === 'AbortError'
                ? 'Processing timed out. Please try a slightly smaller image.'
                : rbErr?.message || 'Error communicating with background removal service.',
          });
          return;
        }
      }

      if (!outputBuffer) {
        res.status(500).json({
          success: false,
          error: 'Could not process image background. Please try another image.',
        });
        return;
      }

      const outputBase64 = `data:image/png;base64,${outputBuffer.toString('base64')}`;

      // Check client requested format
      const wantsBinary =
        req.query.format === 'binary' ||
        req.headers.accept === 'image/png' ||
        req.headers.accept === 'application/octet-stream';

      if (wantsBinary) {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename="transparent-output.png"'
        );
        res.send(outputBuffer);
      } else {
        res.json({
          success: true,
          image: outputBase64,
          originalSize: imageBuffer.length,
          processedSize: outputBuffer.length,
          mimeType: 'image/png',
          watermark: false,
        });
      }
    } catch (err: unknown) {
      console.error('[Server Error /api/remove-background]', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        success: false,
        error: errMsg || 'Internal server error while processing image',
      });
    }
  }
);

// Global Error Handler Middleware: Guarantees JSON response
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Global Server Error]', err);
  res.status(500).json({
    success: false,
    error: err?.message || 'An unexpected server error occurred.',
  });
});

// Mount Vite or serve static dist
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[Full-Stack Server] running on http://${HOST}:${PORT}`);
  });
}

startServer();
