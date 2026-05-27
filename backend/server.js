/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import path from 'path';
import {fileURLToPath} from 'url';

const app = express();
app.use(express.json({limit: process?.env?.API_PAYLOAD_MAX_SIZE || "7mb"}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

const PORT = process?.env?.API_BACKEND_PORT || 8080;
const API_BACKEND_HOST = process?.env?.API_BACKEND_HOST || "0.0.0.0";

// --- BYPASS DI LOCALHOST ---
console.log("⚠️ [Local Mode] Menjalankan server dalam mode bypass Google Cloud SDK.");

app.set('trust proxy', 1);

const proxyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    standardHeaders: true, 
    legacyHeaders: false, 
    message: {
      error: 'Too many requests',
      message: 'You have exceed the request limit, please try again later.'
    },
});
app.use('/api-proxy', proxyLimiter);

// --- MODIFIKASI ENDPOINT API PROXY (MOCKING DATA) ---
app.post('/api-proxy', async (req, res) => {
  console.log(`[Node Proxy Mock] Mencegat request AI untuk: ${req.body.originalUrl}`);

  // Cek apakah request meminta streaming data atau JSON biasa
  const originalUrl = req.body.originalUrl || '';
  const isStreaming = originalUrl.includes('streamGenerateContent') || originalUrl.includes('streamQuery');

  if (isStreaming) {
    // Simulasi respons Server-Sent Events (SSE) streaming untuk frontend
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    const mockResponseText = "Halo! Fitur AI saat ini berjalan dalam mode Simulasi Lokal (Offline) karena Google Cloud Billing nonaktif.";
    
    // Pecah string teks untuk mensimulasikan chunk data AI yang masuk bertahap
    const words = mockResponseText.split(' ');
    let currentText = "";

    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? "" : " ") + words[i];
      
      // Struktur JSON tiruan agar dikenali transformFn bawaan frontend Anda
      const chunk = {
        candidates: [{
          content: { parts: [{ text: currentText }] }
        }]
      };
      
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      // Beri jeda waktu 80ms seolah-olah AI sedang berpikir/mengetik
      await new Promise(resolve => setTimeout(resolve, 80));
    }
    
    res.end();
  } else {
    // Respons JSON Biasa non-streaming
    res.status(200).json({
      candidates: [{
        content: {
          parts: [{ text: "Ini adalah balasan simulasi dari backend lokal (Offline Mode)." }]
        }
      }]
    });
  }
});

const server = app.listen(PORT, API_BACKEND_HOST, () => {
  console.log(`Vertex AI Backend listening at http://localhost:${PORT}`);
});

// Serve index.html untuk semua route lain
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});
