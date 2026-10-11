export const config = { runtime: 'edge' };

const MAX_BYTES = 50 * 1024 * 1024; // ek request mein max 50 MB
const CHUNK = 64 * 1024;

export default function handler(req) {
  const url = new URL(req.url);
  let bytes = parseInt(url.searchParams.get('bytes') || '0', 10);
  if (!Number.isFinite(bytes) || bytes < 0) bytes = 0;
  bytes = Math.min(bytes, MAX_BYTES);

  // Random data taaki compression se speed galat na aaye
  const pool = [];
  for (let i = 0; i < 4; i++) {
    const c = new Uint8Array(CHUNK);
    crypto.getRandomValues(c);
    pool.push(c);
  }

  let sent = 0;
  let k = 0;
  const body = new ReadableStream({
    pull(controller) {
      if (sent >= bytes) {
        controller.close();
        return;
      }
      for (let i = 0; i < 16 && sent < bytes; i++) {
        const n = Math.min(CHUNK, bytes - sent);
        controller.enqueue(pool[k++ % pool.length].slice(0, n));
        sent += n;
      }
    },
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(bytes),
      'Content-Encoding': 'identity',
      'Cache-Control': 'no-store',
    },
  });
}
