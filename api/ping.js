export const config = { runtime: 'edge' };

// Chhota empty response: latency naapne ke liye
export default function handler() {
  return new Response(null, {
    status: 204,
    headers: { 'Cache-Control': 'no-store' },
  });
}
