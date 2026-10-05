// server.ts
import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { removeBackground as imglyRemoveBackground } from "@imgly/background-removal-node";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT || 3e3;
var REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY || "Pi85bEV6S535Njz51tyNcFtf";
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024
    // 15MB
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files (JPG, PNG, WebP) are allowed"));
    }
    cb(null, true);
  }
});
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Shariful Tools - remove.bg Background Remover API",
    provider: "remove.bg",
    apiKeyConfigured: Boolean(REMOVE_BG_API_KEY)
  });
});
app.post(
  "/api/remove-background",
  upload.single("image_file"),
  async (req, res) => {
    try {
      let imageBuffer = null;
      let mimeType = "image/png";
      let originalFilename = "image.png";
      if (req.file) {
        imageBuffer = req.file.buffer;
        mimeType = req.file.mimetype || "image/png";
        originalFilename = req.file.originalname || "upload.png";
      } else if (req.body?.image_base64) {
        const rawBase64 = req.body.image_base64;
        const matches = rawBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          imageBuffer = Buffer.from(matches[2], "base64");
        } else {
          imageBuffer = Buffer.from(rawBase64, "base64");
        }
      }
      if (!imageBuffer || imageBuffer.length === 0) {
        res.status(400).json({
          success: false,
          error: "No image provided. Please upload an image file."
        });
        return;
      }
      let outputBuffer = null;
      if (REMOVE_BG_API_KEY) {
        try {
          const formData = new FormData();
          formData.append(
            "image_file",
            new Blob([imageBuffer], { type: mimeType }),
            originalFilename
          );
          formData.append("size", "auto");
          const removeBgResponse = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
              "X-Api-Key": REMOVE_BG_API_KEY
            },
            body: formData
          });
          if (removeBgResponse.ok) {
            const arrayBuffer = await removeBgResponse.arrayBuffer();
            outputBuffer = Buffer.from(arrayBuffer);
          } else {
            const errText = await removeBgResponse.text();
            console.warn("[remove.bg API response non-200, fallback to neural engine]", removeBgResponse.status, errText);
          }
        } catch (rbErr) {
          console.warn("[remove.bg API error, fallback to neural engine]", rbErr);
        }
      }
      if (!outputBuffer) {
        const inputBlob = new Blob([imageBuffer], { type: mimeType });
        const resultBlob = await imglyRemoveBackground(inputBlob);
        const arrayBuf = await resultBlob.arrayBuffer();
        outputBuffer = Buffer.from(arrayBuf);
      }
      const outputBase64 = `data:image/png;base64,${outputBuffer.toString("base64")}`;
      const wantsBinary = req.query.format === "binary" || req.headers.accept === "image/png" || req.headers.accept === "application/octet-stream";
      if (wantsBinary) {
        res.setHeader("Content-Type", "image/png");
        res.setHeader("Content-Disposition", 'attachment; filename="transparent-output.png"');
        res.send(outputBuffer);
      } else {
        res.json({
          success: true,
          image: outputBase64,
          originalSize: imageBuffer.length,
          processedSize: outputBuffer.length,
          mimeType: "image/png",
          watermark: false
        });
      }
    } catch (err) {
      console.error("[Server Error /api/remove-background]", err);
      const errMsg = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        success: false,
        error: errMsg || "Internal server error while processing image"
      });
    }
  }
);
async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, () => {
    console.log(`[Full-Stack Server] running on http://localhost:${PORT}`);
  });
}
startServer();
