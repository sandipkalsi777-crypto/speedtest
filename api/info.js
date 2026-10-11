export const config = { runtime: 'edge' };

// User ka IP aur Vercel ka kaun sa server use ho raha hai
export default function handler(req) {
  const h = req.headers;
  const ip = (h.get('x-forwarded-for') || h.get('x-real-ip') || '').split(',')[0].trim();
  const region = (h.get('x-vercel-id') || '').split('::')[0];
  let city = h.get('x-vercel-ip-city') || '';
  try { city = decodeURIComponent(city); } catch (e) {}
  const country = h.get('x-vercel-ip-country') || '';
  return new Response(JSON.stringify({ ip, region, city, country }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
