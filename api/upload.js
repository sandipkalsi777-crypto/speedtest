export const config = { runtime: 'edge' };

// Upload data receive karke discard kar deta hai, sirf bytes gin-ta hai
export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  let received = 0;
  if (req.body) {
    const reader = req.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.length;
    }
  }
  return new Response(JSON.stringify({ received }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
